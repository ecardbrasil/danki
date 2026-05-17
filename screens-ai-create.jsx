// =========================================================================
// SCREEN: AI CARD CREATION
// =========================================================================

const GROQ_API_KEY = "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";
const GROQ_MODEL = "llama-3.3-70b-versatile";
console.log("[Danki] screens-ai-create.jsx loaded — key prefix:", GROQ_API_KEY.slice(0, 12), "len:", GROQ_API_KEY.length);

const generateFlashcardsWithGroq = async (text, count, style, language) => {
  const styleInstructions = {
    "Q&A clássico": "Crie perguntas diretas com respostas objetivas.",
    "Cloze (lacuna)": "Crie frases com uma palavra ou conceito-chave substituído por '___'. A resposta é a palavra removida.",
    "Definição": "Crie flashcards no formato 'Termo: Definição'.",
    "Pergunta inversa": "Dê a resposta/conceito na frente e peça que o aluno identifique o termo/pergunta.",
    "Múltipla escolha": `Crie perguntas de múltipla escolha com exatamente 3 alternativas.
Cada card deve ter os campos extras: "options" (array com 3 strings no formato ["a) ...", "b) ...", "c) ..."]), "answer" (a letra correta: "a", "b" ou "c"), e "type": "multiple_choice".
O campo "a" deve conter uma explicação curta do por que a resposta correta está certa.`,
  };

  const isMultipleChoice = style === "Múltipla escolha";

  const prompt = `Você é um especialista em educação e criação de flashcards para memorização espaçada (SRS).

Analise o texto abaixo e gere exatamente ${count} flashcards em ${language}.
Estilo: ${styleInstructions[style] || styleInstructions["Q&A clássico"]}

Retorne APENAS um JSON válido, sem texto adicional, neste formato:
[
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
]

Texto para analisar:
${text}`;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
        temperature: 0.4,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Erro na API do Groq");
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "";

  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("Resposta inválida da IA — JSON não encontrado");

  return JSON.parse(match[0]);
};

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

const generateFlashcardsFromUrl = async (content, count, style, language, meta) => {
  const isYoutube = meta?.isYoutube;
  const extraFieldsDesc = isYoutube
    ? `"timestamp": <inteiro em segundos, momento aproximado no vídeo onde o conceito aparece — estime pela posição no texto>,\n    "videoId": "${meta.videoId}",`
    : `"source_url": "${meta?.url || ""}",`;

  const prompt = `Você é um especialista em criação de flashcards para memorização espaçada (SRS).

Analise o conteúdo abaixo e gere exatamente ${count} flashcards em ${language}.
${isYoutube
  ? `O conteúdo é a transcrição de um vídeo do YouTube (ID: ${meta.videoId}). Para cada card, estime o "timestamp" em segundos onde o conceito aparece na transcrição (proporcional à posição do texto). Nunca deixe o timestamp null — use 0 se incerto.`
  : `O conteúdo foi extraído da URL: ${meta?.url || ""}. Inclua o campo source_url com a URL original.`}

Retorne APENAS um JSON válido, sem texto adicional:
[
  {
    "q": "pergunta ou frente do card",
    "a": "resposta ou verso do card",
    ${extraFieldsDesc}
    "tag": "categoria (1-2 palavras)",
    "diff": número de 1 a 5
  }
]

Conteúdo:
${content.slice(0, 14000)}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4096,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Erro na API do Groq");
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "";
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("Resposta inválida da IA — JSON não encontrado");
  return JSON.parse(match[0]);
};

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
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    fetchDecksSimple()
      .then(d => {
        setDecks(d);
        if (d.length > 0) setDeckId(d[0].id);
      })
      .catch(() => {});
  }, []);

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

    setGenerating(true);
    setGenerated(false);
    setError(null);
    try {
      const cards = source === "link"
        ? await generateFlashcardsFromUrl(content, count, style, language, urlMeta)
        : await generateFlashcardsWithGroq(content, count, style, language);
      setGeneratedCards(cards);
      setGenerated(true);

      const allDecks = decks.length > 0 ? decks : await fetchDecksSimple().catch(() => []);
      setRelatedCards(buildRelatedSuggestions(cards, allDecks, deckId));
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
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
                <button key={s} className={source===s?"active":""} onClick={() => setSource(s)}>
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
            <div style={{marginLeft:"auto", display:"flex", gap:8, alignItems:"center", fontSize:12, color:"var(--text-mute)"}}>
              <Icon name="bolt" size={13} style={{color:"var(--violet)"}}/>
              Modelo: <strong style={{color:"var(--text-soft)"}}>Danki Reason · pt-br</strong>
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
              <button key={s} className={`ai-chip ${style===s?"active":""}`} onClick={() => setStyle(s)}>{s}</button>
            ))}
          </div>
          <div className="ai-options" style={{borderTop:"none", paddingTop:0}}>
            <span style={{fontSize:12, color:"var(--text-mute)", padding:"6px 0"}}>Idioma:</span>
            {["Português","Inglês","Japonês"].map(s => (
              <button key={s} className={`ai-chip ${language===s?"active":""}`} onClick={() => setLanguage(s)}>{s}</button>
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
                  style={{padding:"5px 10px"}}
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
              <button className="btn primary" onClick={generate} disabled={generating}>
                <Icon name="sparkle" size={13}/> {generating ? "Gerando…" : "Gerar cards"}
              </button>
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div className="ai-preview-panel">
          <h4>
            <Icon name="sparkle" size={14} className="sparkle"/>
            Preview · {generated ? `${generatedCards.length} cards gerados` : generating ? "gerando…" : "aguardando"}
          </h4>
          {error && (
            <div style={{background:"var(--surface-2)", border:"1px solid #f87171", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#f87171", marginBottom:10}}>
              ⚠️ {error}
            </div>
          )}

          {generating && (
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
