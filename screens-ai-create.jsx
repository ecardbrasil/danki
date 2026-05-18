// =========================================================================
// SCREEN: AI CARD CREATION
// =========================================================================

const GROQ_API_KEY = "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";
console.log("[Danki] screens-ai-create.jsx loaded — key prefix:", GROQ_API_KEY.slice(0, 12), "len:", GROQ_API_KEY.length);

// ── Model configuration (Groq free-tier limits, May 2025) ──────────────────
// fast : llama-3.1-8b-instant  — 6K TPM, 14.4K RPD  → bulk chunk extraction
// smart: llama-4-scout-17b    — 30K TPM,  1K RPD  → single calls + compilation
const GROQ_MODELS = {
  fast: {
    id: "llama-3.1-8b-instant",
    maxTokens: 2000,  // 10K chars input (~2500 tok) + 2000 output = ~4500 total < 6K TPM ✓
    tpm: 6000,
    label: "Llama 8B",
  },
  smart: {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    maxTokens: 8000,  // 25K chars input (~6250 tok) + 8000 output = ~14250 total < 30K TPM ✓
    tpm: 30000,
    label: "Llama Scout",
  },
};

// Texts ≤ this threshold go to "smart" in a single call (no chunking)
const GROQ_SINGLE_THRESHOLD = 25000;
// Max chars per chunk sent to "fast" model
const GROQ_CHUNK_SIZE = 10000;
// Fallback retry wait when no x-ratelimit-reset-tokens header is present
const GROQ_RETRY_DELAY = 20000;
const GROQ_MAX_RETRIES = 3;

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Parse Groq's x-ratelimit-reset-tokens header ("7.66s", "1m30.5s") → ms
const parseResetMs = (resetStr) => {
  if (!resetStr) return 0;
  let ms = 0;
  const minMatch = resetStr.match(/(\d+)m/);
  const secMatch = resetStr.match(/([\d.]+)s/);
  if (minMatch) ms += parseInt(minMatch[1]) * 60000;
  if (secMatch) ms += parseFloat(secMatch[1]) * 1000;
  return ms;
};

// Robustly extract a cards array from any Groq response content
const parseCardsFromRaw = (raw) => {
  if (!raw) return [];
  // Try bare JSON array first (legacy / non-json_object mode)
  const arrMatch = raw.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    try { return JSON.parse(arrMatch[0]); } catch (_) {}
  }
  // Try JSON object with a "cards" key
  try {
    const obj = JSON.parse(raw);
    if (Array.isArray(obj)) return obj;
    if (obj.cards && Array.isArray(obj.cards)) return obj.cards;
  } catch (_) {}
  return [];
};

// Split text at paragraph boundaries, respecting GROQ_CHUNK_SIZE
const splitIntoChunks = (text, maxChars = GROQ_CHUNK_SIZE) => {
  const paragraphs = text.split('\n');
  const chunks = [];
  let current = '';
  for (const p of paragraphs) {
    if (current.length + p.length < maxChars) {
      current += p + '\n';
    } else {
      if (current.trim()) chunks.push(current.trim());
      current = p + '\n';
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
};

// Build the flashcard generation prompt for a text chunk
const buildChunkPrompt = (chunk, count, style, language, isMultipleChoice, isPartial) => {
  const styleInstructions = {
    "Q&A clássico": "Crie perguntas diretas com respostas objetivas.",
    "Cloze (lacuna)": "Crie frases com uma palavra ou conceito-chave substituído por '___'. A resposta é a palavra removida.",
    "Definição": "Crie flashcards no formato 'Termo: Definição'.",
    "Pergunta inversa": "Dê a resposta/conceito na frente e peça que o aluno identifique o termo/pergunta.",
    "Múltipla escolha": `Crie perguntas de múltipla escolha com exatamente 3 alternativas.
Cada card deve ter os campos extras: "options" (array com 3 strings no formato ["a) ...", "b) ...", "c) ..."]), "answer" (a letra correta: "a", "b" ou "c"), e "type": "multiple_choice".
O campo "a" deve conter uma explicação curta do por que a resposta correta está certa.`,
  };

  return `Você é um especialista em educação e criação de flashcards para memorização espaçada (SRS).

Analise o texto abaixo e gere ${isPartial ? `até ${count} flashcards com os conceitos mais importantes` : `exatamente ${count} flashcards`} em ${language}.
Estilo: ${styleInstructions[style] || styleInstructions["Q&A clássico"]}

Retorne APENAS um JSON válido com a chave "cards", neste formato:
{ "cards": [
  {${isMultipleChoice ? `
    "q": "pergunta de múltipla escolha",
    "options": ["a) alternativa 1", "b) alternativa 2", "c) alternativa 3"],
    "answer": "a",
    "a": "explicação da resposta correta",
    "tag": "categoria do conceito (1-2 palavras)",
    "diff": número de 1 a 5 indicando dificuldade estimada,
    "type": "multiple_choice"` : `
    "q": "pergunta ou frente do card",
    "a": "resposta ou verso do card",
    "tag": "categoria do conceito (1-2 palavras)",
    "diff": número de 1 a 5 indicando dificuldade estimada`}
  }
] }

Texto para analisar:
${chunk}`;
};

// ── Core API function ──────────────────────────────────────────────────────
// Sends one request to Groq, handles 429/413/errors, reads rate-limit headers.
// Returns { cards, remainingTokens, resetStr } so callers can pace themselves.
const callGroq = async (prompt, modelKey, signal) => {
  const cfg = GROQ_MODELS[modelKey] || GROQ_MODELS.fast;
  let retries = 0;

  while (retries < GROQ_MAX_RETRIES) {
    if (signal?.aborted) throw new DOMException("Cancelado pelo usuário.", "AbortError");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: cfg.id,
        messages: [{ role: "user", content: prompt }],
        max_tokens: cfg.maxTokens,
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
    });

    // Read rate-limit headers before consuming the body
    const remainingTokens = parseInt(response.headers.get("x-ratelimit-remaining-tokens") || cfg.tpm);
    const resetStr = response.headers.get("x-ratelimit-reset-tokens") || "";

    if (response.status === 429) {
      retries++;
      if (retries >= GROQ_MAX_RETRIES) {
        throw new Error("Limite de uso da IA atingido. Aguarde alguns segundos e tente novamente.");
      }
      // Use the exact reset time from the header — no guessing
      const waitMs = parseResetMs(resetStr) || GROQ_RETRY_DELAY;
      await delay(waitMs + 500); // +500ms safety buffer
      continue;
    }

    if (response.status === 413) {
      throw new Error("Texto muito longo para o plano atual da IA. Tente com um trecho menor.");
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Erro na API Groq (${response.status})`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";
    const cards = parseCardsFromRaw(raw);
    return { cards, remainingTokens, resetStr };
  }

  return { cards: [], remainingTokens: 0, resetStr: "" };
};

// ── Main generation orchestrator ───────────────────────────────────────────
// Routing logic:
//   text ≤ 25K chars → single "smart" call (Llama Scout, 30K TPM)
//   text >  25K chars → chunk with "fast" (Llama 8B, 6K TPM) + compile with "smart"
const generateFlashcardsWithGroq = async (text, count, style, language, onProgress, signal) => {
  const isMultipleChoice = style === "Múltipla escolha";

  // ── SHORT PATH: one smart call ────────────────────────────────────────────
  if (text.length <= GROQ_SINGLE_THRESHOLD) {
    if (onProgress) onProgress({ current: 1, total: 1, phase: "generating", model: "smart" });
    const prompt = buildChunkPrompt(text, count, style, language, isMultipleChoice, false);
    const { cards } = await callGroq(prompt, "smart", signal);
    if (onProgress) onProgress({ current: 1, total: 1, partialCards: cards, phase: "done", model: "smart" });
    return cards;
  }

  // ── LONG PATH: chunk extraction + compilation ─────────────────────────────
  const chunks = splitIntoChunks(text);
  const totalSteps = chunks.length + 1; // last step = compilation
  const allRawCards = [];

  for (let i = 0; i < chunks.length; i++) {
    if (signal?.aborted) break;

    if (onProgress) onProgress({ current: i + 1, total: totalSteps, phase: "chunks", model: "fast" });

    // Generate 50% more cards than needed so compilation has good material to pick from
    const cardsPerChunk = Math.max(3, Math.min(Math.ceil(count * 1.5 / chunks.length), 10));
    const prompt = buildChunkPrompt(chunks[i], cardsPerChunk, style, language, isMultipleChoice, true);
    const { cards, remainingTokens, resetStr } = await callGroq(prompt, "fast", signal);

    allRawCards.push(...cards);
    if (onProgress) onProgress({ current: i + 1, total: totalSteps, partialCards: allRawCards, phase: "chunks", model: "fast" });

    if (i < chunks.length - 1 && !signal?.aborted) {
      // Adaptive pacing: if the token bucket is nearly empty, wait for the exact
      // reset time from the response header instead of a fixed sleep
      if (remainingTokens < 3000) {
        const waitMs = parseResetMs(resetStr) || GROQ_RETRY_DELAY;
        await delay(waitMs + 500);
      } else {
        await delay(800); // minimal polite delay when tokens are plentiful
      }
    }
  }

  if (signal?.aborted || allRawCards.length === 0) return allRawCards;

  // ── COMPILATION: deduplicate + improve using smart model ─────────────────
  if (onProgress) onProgress({ current: totalSteps, total: totalSteps, partialCards: allRawCards, phase: "compiling", model: "smart" });

  const compilationPrompt = `Você é um especialista em educação e criação de flashcards para memorização espaçada (SRS).

Abaixo estão flashcards brutos extraídos de diferentes partes de um texto. Sua tarefa:
1. Elimine duplicatas (cards que cobrem o mesmo conceito)
2. Melhore a clareza e objetividade dos cards restantes
3. Selecione os ${count} cards mais relevantes, variados e pedagogicamente ricos
4. Preserve todos os campos originais${isMultipleChoice ? " (q, options, answer, a, tag, diff, type)" : " (q, a, tag, diff)"}
5. Retorne em ${language}

Retorne APENAS um JSON válido com a chave "cards":
{ "cards": [...] }

Cards brutos para revisar:
${JSON.stringify({ cards: allRawCards })}`;

  try {
    const { cards: compiled } = await callGroq(compilationPrompt, "smart", signal);
    // Sanity check: if compilation returned too few cards, fall back to raw
    return compiled.length >= Math.min(3, count) ? compiled : allRawCards.slice(0, count);
  } catch (e) {
    if (e.name === "AbortError") throw e;
    // Compilation failed — return best raw cards trimmed to requested count
    return allRawCards.slice(0, count);
  }
};

// ── URL / YouTube generation ───────────────────────────────────────────────
const extractVideoId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
};

const fetchUrlContent = async (url) => {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const res = await fetch(jinaUrl, { headers: { "Accept": "text/plain" } });
  if (!res.ok) throw new Error(`Não foi possível acessar a URL (status ${res.status}). Tente outra URL.`);
  const text = await res.text();
  if (!text || text.trim().length < 80) throw new Error("Conteúdo extraído vazio ou insuficiente. Tente outra URL.");
  return text;
};

const generateFlashcardsFromUrl = async (content, count, style, language, meta, onProgress, signal) => {
  const isYoutube = meta?.isYoutube;

  const extraFieldsDesc = isYoutube
    ? `"timestamp": número inteiro em segundos (posição estimada no vídeo — use 0 se incerto, nunca null),
    "videoId": "${meta.videoId}",`
    : `"source_url": "${meta?.url || ""}",`;

  const prompt = `Você é um especialista em criação de flashcards para memorização espaçada (SRS).

Analise o conteúdo abaixo e gere exatamente ${count} flashcards em ${language}.
${isYoutube
  ? `O conteúdo é a transcrição de um vídeo do YouTube (ID: ${meta.videoId}). Para cada card, estime o "timestamp" em segundos onde o conceito aparece na transcrição (proporcional à posição do texto). Nunca deixe o timestamp null — use 0 se incerto.`
  : `O conteúdo foi extraído da URL: ${meta?.url || ""}. Inclua o campo source_url com a URL original.`}

Retorne APENAS um JSON válido com a chave "cards":
{ "cards": [
  {
    "q": "pergunta ou frente do card",
    "a": "resposta ou verso do card",
    ${extraFieldsDesc}
    "tag": "categoria (1-2 palavras)",
    "diff": número de 1 a 5
  }
] }

Conteúdo:
${content.slice(0, 22000)}`;

  if (onProgress) onProgress({ current: 1, total: 1, phase: "generating", model: "smart" });
  const { cards } = await callGroq(prompt, "smart", signal);
  if (onProgress) onProgress({ current: 1, total: 1, partialCards: cards, phase: "done", model: "smart" });
  return cards;
};

// ── PDF text extraction ────────────────────────────────────────────────────
const extractTextFromPdf = async (file) => {
  const pdfjsLib = window.pdfjsLib;
  if (!pdfjsLib) throw new Error("PDF.js ainda não carregou. Recarregue a página.");

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageTexts = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    pageTexts.push(pageText);
  }

  return pageTexts.join("\n\n");
};

// ── Main component ─────────────────────────────────────────────────────────
const AICreateScreen = ({ onSave }) => {
  const [source, setSource] = React.useState("texto");
  const [text, setText] = React.useState("");
  const [pdfFile, setPdfFile] = React.useState(null);
  const [pdfText, setPdfText] = React.useState("");
  const [pdfLoading, setPdfLoading] = React.useState(false);
  const [pdfError, setPdfError] = React.useState(null);
  const [count, setCount] = React.useState(8);
  const [style, setStyle] = React.useState("Q&A clássico");
  const [language, setLanguage] = React.useState("Português");
  const [decks, setDecks] = React.useState([]);
  const [deckId, setDeckId] = React.useState("");
  const [generating, setGenerating] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);
  const [generatedCards, setGeneratedCards] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const [relatedCards, setRelatedCards] = React.useState([]);
  const [linkUrl, setLinkUrl] = React.useState("");
  const [linkContent, setLinkContent] = React.useState("");
  const [linkLoading, setLinkLoading] = React.useState(false);
  const [linkError, setLinkError] = React.useState(null);
  const [linkMeta, setLinkMeta] = React.useState(null);
  const [chunkProgress, setChunkProgress] = React.useState(null);
  const [partialError, setPartialError] = React.useState(false);
  const fileInputRef = React.useRef(null);
  const abortControllerRef = React.useRef(null);

  React.useEffect(() => {
    fetchDecksSimple()
      .then(d => {
        setDecks(d);
        if (d.length > 0) setDeckId(d[0].id);
      })
      .catch(() => {});
  }, []);

  // Warn before navigating away during generation
  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (generating) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [generating]);

  const cancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handlePdfFile = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setPdfError("Selecione um arquivo PDF válido.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setPdfError("Arquivo muito grande. Limite: 50MB.");
      return;
    }
    setPdfFile(file);
    setPdfError(null);
    setPdfLoading(true);
    setPdfText("");
    try {
      const extracted = await extractTextFromPdf(file);
      if (!extracted.trim()) throw new Error("Não foi possível extrair texto deste PDF. Ele pode ser baseado em imagens (use OCR).");
      setPdfText(extracted);
    } catch (e) {
      setPdfError(e.message);
      setPdfFile(null);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handlePdfFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handlePdfFile(file);
  };

  const handleExtractUrl = async () => {
    const url = linkUrl.trim();
    if (!url) return;
    setLinkLoading(true);
    setLinkError(null);
    setLinkContent("");
    setLinkMeta(null);
    try {
      const videoId = extractVideoId(url);
      const markdown = await fetchUrlContent(url);
      setLinkContent(markdown);
      setLinkMeta({ isYoutube: !!videoId, videoId, url });
    } catch (e) {
      setLinkError(e.message);
    } finally {
      setLinkLoading(false);
    }
  };

  const buildRelatedSuggestions = (cards, allDecks, currentDeckId) => {
    const otherDecks = allDecks.filter(d => d.id !== currentDeckId);
    if (otherDecks.length === 0) return [];

    const tags = [...new Set(cards.map(c => c.tag).filter(Boolean))];
    const suggestions = [];

    for (const deck of otherDecks) {
      for (const tag of tags) {
        if (
          deck.title?.toLowerCase().includes(tag.toLowerCase()) ||
          deck.category?.toLowerCase().includes(tag.toLowerCase()) ||
          deck.description?.toLowerCase().includes(tag.toLowerCase())
        ) {
          suggestions.push({ from: deck.title, deck_id: deck.id, tag });
          break;
        }
      }
      if (suggestions.length >= 4) break;
    }

    return suggestions;
  };

  const generate = async () => {
    let content = null;
    let urlMeta = null;

    if (source === "texto") {
      content = text;
    } else if (source === "pdf") {
      content = pdfText;
    } else if (source === "link") {
      content = linkContent;
      urlMeta = linkMeta;
      if (!content || !content.trim()) {
        setError("Extraia o conteúdo da URL primeiro clicando em \"Extrair\".");
        return;
      }
    }

    if (!content || !content.trim()) {
      if (source === "pdf" && !pdfFile) {
        setError("Faça o upload de um PDF para gerar os flashcards.");
      } else if (source === "pdf" && pdfLoading) {
        setError("Aguarde o PDF terminar de carregar.");
      } else {
        setError("Cole um texto para gerar os flashcards.");
      }
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setGenerating(true);
    setGenerated(false);
    setError(null);
    setPartialError(false);
    setChunkProgress(null);
    setGeneratedCards([]);

    // Local vars track latest state reliably inside catch (no stale closure)
    let latestCards = [];
    let lastChunk = null;

    try {
      const onProgress = (p) => {
        lastChunk = p;
        setChunkProgress(p);
        if (p.partialCards) {
          latestCards = p.partialCards;
          setGeneratedCards([...p.partialCards]);
        }
      };

      const cards = source === "link"
        ? await generateFlashcardsFromUrl(content, count, style, language, urlMeta, onProgress, controller.signal)
        : await generateFlashcardsWithGroq(content, count, style, language, onProgress, controller.signal);

      if (!controller.signal.aborted) {
        latestCards = cards;
        setGeneratedCards(cards);
        setGenerated(true);
        const allDecks = decks.length > 0 ? decks : await fetchDecksSimple().catch(() => []);
        setRelatedCards(buildRelatedSuggestions(cards, allDecks, deckId));
      } else {
        setGenerated(latestCards.length > 0);
      }
    } catch (e) {
      if (e.name === "AbortError") {
        setGenerated(latestCards.length > 0);
      } else {
        const hasPartial = latestCards.length > 0;
        setPartialError(hasPartial);
        setError(hasPartial
          ? `Erro na parte ${lastChunk?.current ?? "?"} — ${latestCards.length} cards gerados até aqui. Você pode salvá-los mesmo assim.`
          : e.message);
        setGenerated(hasPartial);
      }
    } finally {
      setGenerating(false);
      setChunkProgress(null);
      abortControllerRef.current = null;
    }
  };

  const saveCards = async () => {
    if (!deckId) { setError("Selecione um deck antes de adicionar os cards."); return; }
    if (generatedCards.length === 0) { setError("Gere os cards primeiro."); return; }
    setSaving(true);
    setError(null);
    try {
      for (const c of generatedCards) {
        const back = c.videoId != null
          ? `__YT__${JSON.stringify({ videoId: c.videoId, timestamp: c.timestamp || 0, text: c.a || "" })}`
          : c.type === "multiple_choice"
            ? `${(c.options || []).join("\n")}\n\nResposta correta: ${(c.answer || "").toUpperCase()}) ${c.a || ""}`
            : (c.a || "");
        await createCard({
          deck_id: deckId,
          type: "basic",
          front: c.q,
          back,
          tags: c.tag ? [c.tag] : [],
        });
      }
      onSave();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const removeCard = (index) => {
    setGeneratedCards(prev => prev.filter((_, j) => j !== index));
  };

  // ── Derived labels for UI ────────────────────────────────────────────────
  const modelLabel = (() => {
    if (!generating) return "Danki Reason · pt-br";
    if (chunkProgress?.phase === "compiling") return "Llama Scout · compilando";
    if (chunkProgress?.model === "fast") return "Llama 8B · extração";
    return "Llama Scout · analisando";
  })();

  const chunkCount = chunkProgress ? chunkProgress.total - 1 : 0; // total - 1 excludes compilation step
  const buttonLabel = (() => {
    if (!generating) return "Gerar cards";
    if (chunkProgress?.phase === "compiling") return "Compilando…";
    if (chunkProgress && chunkProgress.total > 1) return `Parte ${chunkProgress.current} de ${chunkCount}…`;
    return "Analisando…";
  })();

  const previewLabel = (() => {
    if (generated) return `${generatedCards.length} cards gerados`;
    if (!generating) return "aguardando";
    if (chunkProgress?.phase === "compiling") return "Compilando e refinando…";
    if (chunkProgress && chunkProgress.total > 1) return `Analisando parte ${chunkProgress.current} de ${chunkCount}…`;
    return "analisando…";
  })();

  const progressPct = chunkProgress
    ? Math.round((chunkProgress.current / chunkProgress.total) * 100)
    : 0;

  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Criar com <em>IA</em></h1>
          <div className="screen-sub">
            Cole um texto, link ou faça upload. A IA extrai conceitos-chave e gera flashcards otimizados para SRS.
          </div>
        </div>
        <div style={{display:"flex", gap:10, alignItems:"center"}}>
          <button className="btn ghost">Salvar rascunho</button>
          <button
            className="btn primary"
            onClick={saveCards}
            disabled={saving || generatedCards.length === 0}
          >
            <Icon name="check" size={14}/>
            {saving ? "Salvando…" : `Adicionar ${generatedCards.length} cards ao deck`}
          </button>
        </div>
      </div>

      <div className="ai-grid">
        {/* Input panel */}
        <div className="ai-input">
          <div className="ai-toolbar">
            <div className="ai-source">
              {["texto","pdf","link","áudio","imagem"].map(s => (
                <button key={s} className={source===s?"active":""} onClick={() => !generating && setSource(s)} disabled={generating}>
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
            <div style={{marginLeft:"auto", display:"flex", gap:8, alignItems:"center", fontSize:12, color:"var(--text-mute)"}}>
              <Icon name="bolt" size={13} style={{color:"var(--violet)"}}/>
              Modelo: <strong style={{color:"var(--text-soft)"}}>{modelLabel}</strong>
            </div>
          </div>

          {source === "texto" ? (
            <textarea className="ai-textarea" value={text} onChange={e => setText(e.target.value)}
                      placeholder="Cole um texto, artigo ou suas anotações…"/>
          ) : source === "pdf" ? (
            <div style={{padding:"22px", display:"flex", flexDirection:"column", gap:14}}>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !pdfLoading && fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? "var(--violet)" : pdfFile ? "var(--accent)" : "var(--border-strong)"}`,
                  borderRadius: 14,
                  padding: "48px 22px",
                  textAlign: "center",
                  cursor: pdfLoading ? "not-allowed" : "pointer",
                  transition: "border-color .18s, background .18s",
                  background: dragOver ? "color-mix(in srgb, var(--violet) 6%, transparent)" : "transparent",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  style={{display:"none"}}
                  onChange={handleFileInput}
                />
                {pdfLoading ? (
                  <>
                    <div style={{width:56, height:56, borderRadius:14, background:"var(--surface-2)", display:"grid", placeItems:"center", margin:"0 auto 14px", color:"var(--violet)"}}>
                      <Icon name="bolt" size={26}/>
                    </div>
                    <div style={{fontFamily:"var(--serif)", fontSize:20}}>Extraindo texto…</div>
                    <div style={{color:"var(--text-mute)", marginTop:6, fontSize:13}}>Analisando {pdfFile?.name}</div>
                    <div style={{marginTop:16, height:4, borderRadius:2, background:"var(--surface-2)", overflow:"hidden"}}>
                      <div style={{height:"100%", width:"60%", background:"var(--violet)", borderRadius:2, animation:"shimmer 1.4s infinite"}}/>
                    </div>
                  </>
                ) : pdfFile && pdfText ? (
                  <>
                    <div style={{width:56, height:56, borderRadius:14, background:"color-mix(in srgb, var(--accent) 12%, transparent)", display:"grid", placeItems:"center", margin:"0 auto 14px", color:"var(--accent)"}}>
                      <Icon name="check" size={26}/>
                    </div>
                    <div style={{fontFamily:"var(--serif)", fontSize:20}}>{pdfFile.name}</div>
                    <div style={{color:"var(--text-mute)", marginTop:6, fontSize:13}}>
                      {pdfText.length.toLocaleString("pt-BR")} caracteres extraídos · clique para trocar
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{width:56, height:56, borderRadius:14, background:"var(--surface-2)", display:"grid", placeItems:"center", margin:"0 auto 14px", color:"var(--text-mute)"}}>
                      <Icon name="upload" size={26}/>
                    </div>
                    <div style={{fontFamily:"var(--serif)", fontSize:20}}>Arraste um PDF aqui</div>
                    <div style={{color:"var(--text-mute)", marginTop:6, fontSize:13}}>ou clique para escolher · até 50MB</div>
                    <button className="btn" style={{marginTop:16}} onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                      Escolher arquivo
                    </button>
                  </>
                )}
              </div>

              {pdfError && (
                <div style={{background:"var(--surface-2)", border:"1px solid #f87171", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#f87171", display:"flex", gap:8, alignItems:"center"}}>
                  <Icon name="bolt" size={13}/> {pdfError}
                </div>
              )}

              {pdfText && (
                <div style={{background:"var(--surface-2)", borderRadius:10, padding:"12px 14px", fontSize:12, color:"var(--text-mute)", maxHeight:120, overflow:"hidden", position:"relative"}}>
                  <div style={{fontFamily:"var(--mono)", lineHeight:1.6, whiteSpace:"pre-wrap"}}>{pdfText.slice(0, 400)}{pdfText.length > 400 ? "…" : ""}</div>
                  <div style={{position:"absolute", bottom:0, left:0, right:0, height:40, background:"linear-gradient(transparent, var(--surface-2))"}}/>
                </div>
              )}
            </div>
          ) : source === "link" ? (
            <div style={{padding:"22px", display:"flex", flexDirection:"column", gap:14}}>
              <div className="editor-field">
                <div className="editor-field-label">URL <em>artigo, Wikipedia, vídeo do YouTube</em></div>
                <div style={{display:"flex", gap:8}}>
                  <input
                    className="editor-input"
                    style={{flex:1}}
                    placeholder="https://..."
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !linkLoading && linkUrl.trim() && handleExtractUrl()}
                  />
                  <button
                    className="btn primary"
                    onClick={handleExtractUrl}
                    disabled={linkLoading || !linkUrl.trim()}
                  >
                    {linkLoading ? "Extraindo…" : "Extrair"}
                  </button>
                </div>
              </div>

              {linkLoading && (
                <div style={{background:"var(--surface-2)", borderRadius:10, padding:"12px 14px", fontSize:13, color:"var(--text-mute)", display:"flex", gap:8, alignItems:"center"}}>
                  <Icon name="bolt" size={13} style={{color:"var(--violet)"}}/> Buscando conteúdo via Jina.ai…
                  <div style={{marginLeft:"auto", height:3, width:80, borderRadius:2, background:"var(--surface-2)", overflow:"hidden"}}>
                    <div style={{height:"100%", width:"60%", background:"var(--violet)", borderRadius:2, animation:"shimmer 1.4s infinite"}}/>
                  </div>
                </div>
              )}

              {linkError && (
                <div style={{background:"var(--surface-2)", border:"1px solid #f87171", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#f87171", display:"flex", gap:8, alignItems:"center"}}>
                  <Icon name="bolt" size={13}/> {linkError}
                </div>
              )}

              {linkContent && linkMeta && (
                <div style={{background:"var(--surface-2)", borderRadius:10, padding:"12px 14px", display:"flex", flexDirection:"column", gap:8}}>
                  {linkMeta.isYoutube && (
                    <div style={{display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--rose)", fontWeight:500}}>
                      <Icon name="play" size={12}/> YouTube · ID: {linkMeta.videoId} · timestamps incluídos nos cards
                    </div>
                  )}
                  <div style={{fontFamily:"var(--mono)", fontSize:11.5, color:"var(--text-mute)", whiteSpace:"pre-wrap", maxHeight:110, overflow:"hidden", lineHeight:1.5}}>
                    {linkContent.slice(0, 500)}{linkContent.length > 500 ? "…" : ""}
                  </div>
                  <div style={{position:"relative", height:30, marginTop:-10, background:"linear-gradient(transparent, var(--surface-2))"}}/>
                  <div style={{fontSize:12, color:"var(--accent)"}}>
                    <Icon name="check" size={12}/> {linkContent.length.toLocaleString("pt-BR")} caracteres extraídos
                  </div>
                </div>
              )}

              {!linkContent && !linkLoading && !linkError && (
                <div style={{display:"flex", gap:8, fontSize:12, color:"var(--text-mute)"}}>
                  <Icon name="link" size={13}/> Conteúdo extraído via <strong>Jina.ai Reader</strong> — funciona com YouTube, Wikipedia, artigos e mais
                </div>
              )}
            </div>
          ) : source === "áudio" ? (
            <div style={{padding:"22px"}}>
              <div className="editor-field">
                <div className="editor-field-label">Transcrição <em>auto via Whisper</em></div>
                <div style={{padding:"30px 20px", border:"1px dashed var(--border-strong)", borderRadius:10, textAlign:"center", color:"var(--text-mute)"}}>
                  <Icon name="audio" size={22}/>
                  <div style={{marginTop:8}}>Arraste um áudio ou clique para gravar</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{padding:"22px"}}>
              <div style={{padding:"30px 20px", border:"1px dashed var(--border-strong)", borderRadius:10, textAlign:"center", color:"var(--text-mute)"}}>
                <Icon name="image" size={22}/>
                <div style={{marginTop:8}}>Foto da página do livro / slide</div>
                <div style={{fontSize:11.5, marginTop:4}}>OCR aplicado automaticamente</div>
              </div>
            </div>
          )}

          <div className="ai-options">
            <span style={{fontSize:12, color:"var(--text-mute)", padding:"6px 0"}}>Estilo:</span>
            {["Q&A clássico","Cloze (lacuna)","Definição","Pergunta inversa","Múltipla escolha"].map(s => (
              <button key={s} className={`ai-chip ${style===s?"active":""}`} onClick={() => !generating && setStyle(s)} disabled={generating}>{s}</button>
            ))}
          </div>
          <div className="ai-options" style={{borderTop:"none", paddingTop:0}}>
            <span style={{fontSize:12, color:"var(--text-mute)", padding:"6px 0"}}>Idioma:</span>
            {["Português","Inglês","Japonês"].map(s => (
              <button key={s} className={`ai-chip ${language===s?"active":""}`} onClick={() => !generating && setLanguage(s)} disabled={generating}>{s}</button>
            ))}
          </div>

          <div className="ai-foot">
            <span className="hint">
              {source === "pdf"
                ? pdfText
                  ? `${pdfText.length.toLocaleString("pt-BR")} caracteres extraídos · ~${Math.ceil(pdfText.length/250)} conceitos detectados`
                  : "Nenhum PDF carregado"
                : source === "link"
                  ? linkContent
                    ? `${linkContent.length.toLocaleString("pt-BR")} caracteres extraídos de URL${linkMeta?.isYoutube ? " (YouTube)" : ""}`
                    : "Nenhuma URL carregada"
                  : `${text.length} caracteres · ~${Math.ceil(text.length/250)} conceitos detectados`}
            </span>
            <div style={{display:"flex", alignItems:"center", gap:8, marginLeft:"auto"}}>
              <span style={{fontSize:12, color:"var(--text-mute)"}}>Gerar</span>
              <div className="segmented">
                {[5,8,12,20].map(n => (
                  <button key={n} className={count===n?"active":""} onClick={() => setCount(n)}>{n}</button>
                ))}
              </div>
              <span style={{fontSize:12, color:"var(--text-mute)"}}>cards em</span>
              {decks.length === 0 ? (
                <span style={{fontSize:12, color:"var(--text-mute)", fontStyle:"italic"}}>Carregando decks…</span>
              ) : (
                <select
                  className="btn"
                  style={{
                    padding: "5px 10px",
                    maxWidth: "250px",         // Ajuste este valor conforme o espaço do seu layout
                    textOverflow: "ellipsis",  // Adiciona os '...' no final
                    overflow: "hidden",        // Esconde o que passar do maxWidth
                    whiteSpace: "nowrap"       // Impede a quebra de linha
                  }}
                  value={deckId}
                  onChange={e => setDeckId(e.target.value)}
                >
                  {decks.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.title}{d.category ? ` — ${d.category}` : ""}
                    </option>
                  ))}
                </select>
              )}
              {generating ? (
                <button className="btn ghost" onClick={cancelGeneration} style={{color:"var(--rose)"}}>
                  Cancelar
                </button>
              ) : null}
              <button className="btn primary" onClick={generate} disabled={generating}>
                <Icon name="sparkle" size={13}/>
                {buttonLabel}
              </button>
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div className="ai-preview-panel">
          <h4>
            <Icon name="sparkle" size={14} className="sparkle"/>
            Preview · {previewLabel}
          </h4>

          {/* Progress bar — violet during chunk extraction, accent during compilation */}
          {generating && chunkProgress && chunkProgress.total > 1 && (
            <div style={{height:3, borderRadius:2, background:"var(--surface-2)", overflow:"hidden", marginBottom:10}}>
              <div style={{
                height:"100%",
                width:`${progressPct}%`,
                background: chunkProgress.phase === "compiling" ? "var(--accent)" : "var(--violet)",
                borderRadius:2,
                transition:"width .4s ease, background .3s ease",
              }}/>
            </div>
          )}

          {error && (
            <div style={{background:"var(--surface-2)", border:`1px solid ${partialError ? "var(--rose)" : "#f87171"}`, borderRadius:8, padding:"10px 14px", fontSize:13, color: partialError ? "var(--rose)" : "#f87171", marginBottom:10}}>
              {partialError ? "⚡ " : "⚠️ "}{error}
            </div>
          )}

          {/* Status line during generation */}
          {generating && chunkProgress?.phase === "compiling" && (
            <div style={{fontSize:11.5, color:"var(--accent)", marginBottom:8, textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center", gap:5}}>
              <Icon name="sparkle" size={11}/> Refinando {generatedCards.length} cards com Llama Scout…
            </div>
          )}
          {generating && chunkProgress?.phase === "chunks" && generatedCards.length > 0 && (
            <div style={{fontSize:11.5, color:"var(--text-mute)", marginBottom:8, textAlign:"center"}}>
              {generatedCards.length} card{generatedCards.length !== 1 ? "s" : ""} extraído{generatedCards.length !== 1 ? "s" : ""} até agora…
            </div>
          )}

          {/* Shimmer skeletons while waiting for first cards */}
          {generating && generatedCards.length === 0 && (
            <>
              {[1,2,3].map(i => (
                <div className="preview-card" key={i}>
                  <div className="shimmer long"/>
                  <div className="shimmer short"/>
                  <div className="shimmer" style={{width:"70%", marginTop:10}}/>
                </div>
              ))}
            </>
          )}

          {generated && !generating && (
            <div>
              {generatedCards.map((c, i) => (
                <div className="preview-card" key={i} style={{position:"relative", animationDelay:`${i*0.06}s`}}>
                  <button
                    onClick={() => removeCard(i)}
                    title="Remover card"
                    style={{
                      position:"absolute", top:8, right:8,
                      background:"none", border:"none", cursor:"pointer",
                      color:"var(--text-mute)", fontSize:18, lineHeight:1,
                      padding:"0 4px", opacity:0.7,
                    }}
                  >×</button>
                  <div className="q" style={{paddingRight:20}}>{c.q}</div>
                  {c.videoId != null && (
                    <div style={{marginTop:8, borderRadius:8, overflow:"hidden", position:"relative", paddingTop:"56.25%"}}>
                      <iframe
                        style={{position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none"}}
                        src={`https://www.youtube.com/embed/${c.videoId}?start=${c.timestamp || 0}&rel=0`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {c.type === "multiple_choice" ? (
                    <div style={{display:"flex", flexDirection:"column", gap:4, marginTop:8}}>
                      {(c.options || []).map((opt, oi) => {
                        const letter = opt.charAt(0).toLowerCase();
                        const isCorrect = letter === (c.answer || "").toLowerCase();
                        return (
                          <div key={oi} style={{
                            fontSize:13, padding:"5px 10px", borderRadius:6,
                            background: isCorrect ? "color-mix(in srgb, var(--accent) 14%, transparent)" : "var(--surface-2)",
                            color: isCorrect ? "var(--accent)" : "var(--text-soft)",
                            border: isCorrect ? "1px solid var(--accent)" : "1px solid transparent",
                            fontWeight: isCorrect ? 500 : 400,
                          }}>
                            {opt}
                          </div>
                        );
                      })}
                      {c.a && (
                        <div style={{fontSize:11.5, color:"var(--text-mute)", marginTop:4, fontStyle:"italic"}}>
                          {c.a}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="a">{c.a}</div>
                  )}
                  <div className="meta">
                    <span>{c.tag}</span>
                    <span style={{display:"flex", alignItems:"center", gap:6}}>
                      <span className="diff">
                        {[1,2,3,4,5].map(n => <i key={n} className={n<=c.diff ? "on":""}/>)}
                      </span>
                      {c.diff}/5
                    </span>
                  </div>
                </div>
              ))}
              <button
                className="btn ghost"
                style={{width:"100%", justifyContent:"center", marginTop:8, fontSize:12}}
                onClick={generate}
                disabled={generating}
              >
                <Icon name="plus" size={12}/> Gerar mais {count} variações
              </button>
            </div>
          )}

          {!generated && !generating && (
            <div style={{color:"var(--text-mute)", fontSize:13, padding:"20px 0", textAlign:"center"}}>
              Cole conteúdo e clique em <strong style={{color:"var(--text-soft)"}}>Gerar cards</strong> para começar.
            </div>
          )}
        </div>
      </div>

      {/* Cards relacionados — só exibe se houver sugestões reais */}
      {relatedCards.length > 0 && (
        <div className="panel" style={{marginTop: 22}}>
          <div className="panel-head">
            <div className="panel-title">
              <Icon name="sparkle" size={14} style={{color:"var(--violet)", marginRight:6, verticalAlign:"-2px"}}/>
              Decks relacionados · baseado no conteúdo gerado
            </div>
            <button className="btn ghost" style={{fontSize:12}}>Ver tudo <Icon name="chevron" size={12}/></button>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:12}} className="stagger">
            {relatedCards.map((r, i) => (
              <div key={i} style={{
                border:"1px solid var(--border)", background:"var(--bg-elev)",
                borderRadius:12, padding:14, position:"relative"
              }}>
                <div style={{fontFamily:"var(--mono)", fontSize:10, color:"var(--violet)", letterSpacing:".08em", textTransform:"uppercase"}}>{r.from}</div>
                <div style={{fontFamily:"var(--serif)", fontSize:15, marginTop:6, lineHeight:1.3}}>
                  Deck relacionado à tag <em>{r.tag}</em>
                </div>
                <div style={{fontSize:11.5, color:"var(--text-mute)", marginTop:8, display:"flex", justifyContent:"flex-end"}}>
                  <span
                    style={{color:"var(--accent)", cursor:"pointer"}}
                    onClick={() => setDeckId(r.deck_id)}
                  >
                    Selecionar deck
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { AICreateScreen });
