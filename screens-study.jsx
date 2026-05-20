// =========================================================================
// SCREEN: STUDY SESSION
// =========================================================================

// ── Audio engine (Web Audio API – sem dependências externas) ─────────────
const AudioEngine = (() => {
  let ctx = null;
  let muted = false;

  const getCtx = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  };

  const playTone = (freq, type, duration, gain, detune = 0) => {
    if (muted) return;
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const g   = ac.createGain();
      osc.connect(g);
      g.connect(ac.destination);
      osc.type      = type;
      osc.frequency.value = freq;
      osc.detune.value    = detune;
      g.gain.setValueAtTime(gain, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + duration);
    } catch (_) {}
  };

  return {
    setMuted: (v) => { muted = v; },
    getMuted: () => muted,
    correct: () => {
      // dois bipes ascendentes – sensação de "certo!"
      playTone(660, "sine", 0.12, 0.18);
      setTimeout(() => playTone(880, "sine", 0.18, 0.18), 90);
    },
    wrong: () => {
      // bipe descendente curto – sensação de "erro"
      playTone(320, "sawtooth", 0.18, 0.14);
      setTimeout(() => playTone(220, "sawtooth", 0.14, 0.10), 100);
    },
    flip: () => {
      playTone(500, "sine", 0.08, 0.08);
    },
  };
})();

// ── Mapeamento de rating → "correto ou errado" para efeito sonoro ─────────
const ratingIsGood = (r) => r === "good" || r === "easy";

// ── Parse card front/back — detect YouTube, Image, and MC sentinels ──────
const parseCardBack = (back = "") => {
  if (back.startsWith("__MC__")) {
    try { return { type: "mc", ...parseMultipleChoice(JSON.parse(back.slice(6))) }; } catch (_) {}
  }
  if (back.startsWith("__YT__")) {
    try { return { type: "youtube", ...JSON.parse(back.slice(6)) }; } catch (_) {}
  }
  if (back.startsWith("__IMG__")) {
    try { return { type: "image", ...JSON.parse(back.slice(7)) }; } catch (_) {}
  }
  return { type: "text", text: back };
};

const parseCardFront = (front = "") => {
  if (front.startsWith("__IMG__")) {
    try { return { type: "image", ...JSON.parse(front.slice(7)) }; } catch (_) {}
  }
  return { type: "text", text: front };
};

// ── Image card component ─────────────────────────────────────────────────
const ImageCard = ({ src, caption, text }) => (
  <div style={{width:"100%", display:"flex", flexDirection:"column", gap:10, alignItems:"center"}}>
    <img
      src={src}
      alt={caption || "imagem do card"}
      style={{maxWidth:"100%", maxHeight:280, borderRadius:10, objectFit:"contain", background:"var(--surface-2)"}}
      onError={e => { e.target.style.display="none"; }}
    />
    {caption && <span style={{fontSize:12, color:"var(--text-mute)", fontStyle:"italic"}}>{caption}</span>}
    {text && <span style={{fontSize:18, color:"var(--text-soft)", lineHeight:1.4, textAlign:"center"}}>{text}</span>}
  </div>
);

// ── Parse multiple choice card ───────────────────────────────────────────
const parseMultipleChoice = (data = {}) => ({
  type: "mc",
  question: data.q || "",
  options: data.o || [],
  correct: data.c || 0,
});

// ── MC options buttons (shown before flip, replace "Revelar resposta") ──
const MCOptionsButtons = ({ mc, onSelect, disabled }) => (
  <div className="mc-options-buttons">
    {mc.options.map((opt, i) => (
      <button key={i} className="mc-opt-btn" onClick={() => onSelect(i)} disabled={disabled}>
        <span className="mc-opt-letter">{String.fromCharCode(65+i)}</span>
        <span className="mc-opt-text">{opt}</span>
      </button>
    ))}
  </div>
);

// ── Multiple choice card component ──────────────────────────────────────
const MultipleChoiceCard = ({ mc, flipped, selectedOption }) => {
  if (!flipped) {
    return (
      <div style={{width:"100%", textAlign:"center"}}>
        <span style={{lineHeight:1.5, color:"var(--text)"}}>{mc.question}</span>
      </div>
    );
  }
  return (
    <div style={{width:"100%", display:"flex", flexDirection:"column", gap:8, fontFamily:"var(--sans)"}}>
      <div style={{fontSize:"clamp(13px, 1.5vw, 17px)", lineHeight:1.5, color:"var(--text)", textAlign:"center", marginBottom:6, fontFamily:"var(--serif)"}}>
        {mc.question}
      </div>
      {mc.options.map((opt, i) => {
        const isCorrect  = i === mc.correct;
        const isSelected = i === selectedOption;
        const isWrong    = isSelected && !isCorrect;
        let bg    = "var(--surface-2)";
        let border = "var(--border)";
        let color = "var(--text)";
        if (isCorrect)      { bg = "oklch(0.84 0.16 142 / 0.15)"; border = "var(--accent)"; color = "var(--accent-text)"; }
        else if (isWrong)   { bg = "oklch(0.74 0.16 25 / 0.15)";  border = "var(--rose)";   color = "var(--rose-text)"; }
        return (
          <div key={i} style={{
            padding:"10px 14px",
            background:bg,
            border:`1px solid ${border}`,
            borderRadius:10,
            fontSize:"clamp(12px, 1.3vw, 15px)",
            color,
            textAlign:"left",
            lineHeight:1.4,
          }}>
            <strong style={{marginRight:8}}>{String.fromCharCode(97+i)})</strong> {opt}
            {isCorrect && <span style={{marginLeft:8}}>✓</span>}
            {isWrong   && <span style={{marginLeft:8}}>✗</span>}
          </div>
        );
      })}
    </div>
  );
};

// ── YouTube embed that mounts after card flip to avoid 3D transform issues
const YoutubeEmbed = ({ videoId, timestamp, text }) => {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShow(true), 320);
    return () => clearTimeout(t);
  }, []);
  const mins = Math.floor(timestamp / 60);
  const secs = String(timestamp % 60).padStart(2, "0");
  return (
    <div style={{width:"100%", display:"flex", flexDirection:"column", gap:10}}>
      {show ? (
        <div style={{borderRadius:10, overflow:"hidden", position:"relative", paddingTop:"56.25%", width:"100%"}}>
          <iframe
            style={{position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none"}}
            src={`https://www.youtube.com/embed/${videoId}?start=${timestamp}&rel=0`}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div style={{borderRadius:10, background:"var(--surface-2)", height:180, display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text-mute)", fontSize:13}}>
          <Icon name="play" size={18}/>&nbsp; Carregando vídeo…
        </div>
      )}
      {text && <span style={{fontSize:18, color:"var(--text-soft)", lineHeight:1.4}}>{text}</span>}
      <span style={{fontSize:12, color:"var(--text-mute)", display:"flex", alignItems:"center", gap:4}}>
        <Icon name="play" size={11}/> a partir de {mins}:{secs}
      </span>
    </div>
  );
};

// ── Componente feedback flash (overlay rápido) ───────────────────────────
const FeedbackFlash = ({ type }) => {
  if (!type) return null;
  const colors = {
    correct: "oklch(0.84 0.16 142 / 0.18)",
    wrong:   "oklch(0.74 0.16 25 / 0.18)",
    hard:    "oklch(0.82 0.14 75 / 0.14)",
  };
  const icons = { correct: "✓", wrong: "✗", hard: "~" };
  const labels = { correct: "Correto!", wrong: "Errei", hard: "Difícil" };
  return (
    <div className="feedback-flash" style={{ background: colors[type] }}>
      <span className="feedback-icon">{icons[type]}</span>
      <span className="feedback-label">{labels[type]}</span>
    </div>
  );
};

// ── Botão Mute ───────────────────────────────────────────────────────────
const MuteButton = ({ muted, onToggle }) => (
  <button
    className="mute-btn icon-btn"
    onClick={onToggle}
    title={muted ? "Ativar sons" : "Silenciar sons"}
    aria-label={muted ? "Ativar sons" : "Silenciar sons"}
  >
    {muted
      ? <Icon name="volume-x" size={14}/>
      : <Icon name="volume"   size={14}/>
    }
  </button>
);

// ── Componente principal ─────────────────────────────────────────────────
const StudyScreen = ({ deckId, onExit, onNav, preloadedCards = null, quickStudyLabel = null }) => {
  const [cards, setCards]         = React.useState([]);
  const [queue, setQueue]         = React.useState([]);
  const [deck, setDeck]           = React.useState(null);
  const [idx, setIdx]             = React.useState(0);
  const [flipped, setFlipped]     = React.useState(false);
  const [history, setHistory]     = React.useState([]);
  const [sessionId, setSessionId] = React.useState(null);
  const [loading, setLoading]     = React.useState(true);
  const [saving, setSaving]       = React.useState(false);
  const [elapsed, setElapsed]     = React.useState(0);
  const [done, setDone]           = React.useState(false);
  const [muted, setMuted]         = React.useState(false);
  const [feedback, setFeedback]   = React.useState(null); // "correct"|"wrong"|"hard"|null
  const [focus, setFocus]         = React.useState(false); // modo sem distrações
  const [selectedOption, setSelectedOption] = React.useState(null); // índice da opção MC clicada

  // Carrega deck + cards devidos
  React.useEffect(() => {
    // Modo rápido: cards já chegam pré-carregados
    if (preloadedCards) {
      setCards(preloadedCards);
      setQueue([...preloadedCards]);
      setLoading(false);
      return;
    }
    if (!deckId) { setLoading(false); return; }
    (async () => {
      try {
        const [deckData, dueCards] = await Promise.all([
          fetchDecksSimple().then(ds => ds.find(d => d.id === deckId) || null),
          fetchDueCards(deckId, 50),
        ]);
        setDeck(deckData);
        setCards(dueCards);
        setQueue(dueCards);
        startSession(deckId).then(s => setSessionId(s.id)).catch(() => {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [deckId]);

  // Timer
  React.useEffect(() => {
    if (loading || done) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [loading, done]);

  // Sincroniza mute com AudioEngine
  React.useEffect(() => { AudioEngine.setMuted(muted); }, [muted]);

  // Bloqueia scroll do body no modo foco
  React.useEffect(() => {
    document.body.style.overflow = focus ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [focus]);

  const fmtTime = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const deckLabel = quickStudyLabel || deck?.title || "Estudo";
  const card      = queue[idx];
  const intervals = card ? previewIntervals(card) : {};
  const total     = queue.length;
  const doneCount = history.length;

  const doFlip = () => {
    AudioEngine.flip();
    setFlipped(f => !f);
  };

  const answer = async (rating) => {
    if (!card || saving || feedback) return;
    // Feedback sonoro e visual
    let fbType;
    if (rating === "again")       { fbType = "wrong";   AudioEngine.wrong(); }
    else if (rating === "hard")   { fbType = "hard";    AudioEngine.wrong(); }
    else                          { fbType = "correct"; AudioEngine.correct(); }
    setFeedback(fbType);

    setSaving(true);
    try {
      await reviewCard(card.id, rating);
      if (sessionId) await recordReview(sessionId, card.id, rating);
    } catch (err) {
      console.error("Erro ao salvar revisão:", err);
    } finally {
      setSaving(false);
    }
    setHistory(h => [...h, { rating, cardId: card.id }]);

    // Mostra feedback por 480ms antes de avançar
    // Capture queue length at call time (queue may grow via repeatCard)
    const queueLenAtAnswer = queue.length;
    setTimeout(() => {
      setFeedback(null);
      setFlipped(false);
      setSelectedOption(null);
      if (idx + 1 >= queueLenAtAnswer) {
        if (sessionId) endSession(sessionId, doneCount + 1).catch(() => {});
        setDone(true);
      } else {
        setIdx(i => i + 1);
      }
    }, 480);
  };

  const repeatCard = () => {
    if (!card || saving || feedback) return;
    // Guard: don't re-queue if the card already appears 2+ more times ahead
    const ahead = queue.slice(idx + 1);
    const alreadyQueued = ahead.filter(c => c.id === card.id).length;
    if (alreadyQueued >= 2) return;
    const insertAt = Math.min(
      queue.length,
      idx + 2 + Math.floor(Math.random() * Math.max(1, queue.length - idx - 2))
    );
    const newQueue = [...queue];
    newQueue.splice(insertAt, 0, card);
    setQueue(newQueue);
    setFlipped(false);
    setSelectedOption(null);
    setIdx(i => i + 1);
  };

  // Atalhos de teclado
  React.useEffect(() => {
    const onKey = (e) => {
      if (loading || done || saving || feedback) return;
      if (!flipped && isMC) {
        if (e.key === "a" || e.key === "A" || e.key === "1") { e.preventDefault(); selectMCOption(0); }
        if (e.key === "b" || e.key === "B" || e.key === "2") { e.preventDefault(); selectMCOption(1); }
        if (e.key === "c" || e.key === "C" || e.key === "3") { e.preventDefault(); selectMCOption(2); }
        if (e.key === "d" || e.key === "D" || e.key === "4") { e.preventDefault(); selectMCOption(3); }
        return;
      }
      if (e.key === " ") { e.preventDefault(); doFlip(); }
      if (!flipped) return;
      if (isMC && selectedOption !== null && selectedOption !== parsedBack.correct) {
        if (e.key === "1") { setSelectedOption(null); answer("again"); }
        if (e.key === "2") { setSelectedOption(null); answer("hard"); }
        return;
      }
      if (!isMC) {
        if (e.key === "1") answer("again");
        if (e.key === "2") answer("hard");
        if (e.key === "3") answer("good");
        if (e.key === "4") answer("easy");
        if (e.key === "r" || e.key === "R") repeatCard();
      }
      if (e.key === "f" || e.key === "F") toggleFocus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, idx, loading, done, saving, feedback, focus, queue, isMC, selectedOption]);

  const toggleFocus = () => setFocus(f => !f);

  // ── Estados especiais ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="screen" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:400 }}>
        <div style={{ color:"var(--text-mute)", fontSize:14 }}>Carregando cards…</div>
      </div>
    );
  }

  if (!preloadedCards && (!deckId || !deck)) {
    return (
      <div className="screen" style={{ textAlign:"center", paddingTop:60 }}>
        <div style={{ fontFamily:"var(--serif)", fontSize:22, marginBottom:12 }}>Nenhum deck selecionado</div>
        <button className="btn primary" onClick={onExit}>Voltar aos decks</button>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="screen" style={{ textAlign:"center", paddingTop:60 }}>
        <div style={{ fontSize:44, marginBottom:16 }}>🎉</div>
        <div style={{ fontFamily:"var(--serif)", fontSize:26, marginBottom:8 }}>Tudo em dia!</div>
        <div style={{ color:"var(--text-mute)", marginBottom:24 }}>
          Não há cards para revisar em <strong>{deckLabel}</strong> agora.
        </div>
        <button className="btn primary" onClick={onExit}>Voltar aos decks</button>
      </div>
    );
  }

  if (done) {
    const counts = { again:0, hard:0, good:0, easy:0 };
    history.forEach(h => counts[h.rating]++);
    return (
      <div className="screen" style={{ textAlign:"center", paddingTop:60 }}>
        <div style={{ fontSize:52, marginBottom:16 }}>✅</div>
        <div style={{ fontFamily:"var(--serif)", fontSize:30, marginBottom:8 }}>Sessão concluída!</div>
        <div style={{ color:"var(--text-mute)", marginBottom:32 }}>
          {history.length} avaliações em {fmtTime(elapsed)}
        </div>
        <div style={{ display:"flex", gap:20, justifyContent:"center", marginBottom:36 }}>
          {[["again","Errei","var(--rose)"],["hard","Difícil","var(--amber)"],["good","Bom","var(--accent)"],["easy","Fácil","var(--sky)"]].map(([k,l,c]) => (
            <div key={k} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"var(--serif)", fontSize:36, color:c }}>{counts[k]}</div>
              <div style={{ fontSize:12, color:"var(--text-mute)", textTransform:"uppercase", letterSpacing:".06em" }}>{l}</div>
            </div>
          ))}
        </div>
        <button className="btn primary" onClick={onExit}>Voltar aos decks</button>
      </div>
    );
  }

  // ── Detecção MC e seleção de alternativa ────────────────────────────
  const parsedBack = card ? parseCardBack(card.back) : null;
  const isMC = parsedBack?.type === "mc";

  const selectMCOption = (index) => {
    if (saving || feedback || flipped) return;
    setSelectedOption(index);
    AudioEngine.flip();
    setFlipped(true);
    const isCorrect = index === parsedBack.correct;
    if (isCorrect) {
      setFeedback("correct");
      AudioEngine.correct();
      const qLen = queue.length;
      setSaving(true);
      reviewCard(card.id, "good")
        .then(() => sessionId && recordReview(sessionId, card.id, "good"))
        .catch(console.error)
        .finally(() => setSaving(false));
      setHistory(h => [...h, { rating: "good", cardId: card.id }]);
      setTimeout(() => {
        setFeedback(null);
        setFlipped(false);
        setSelectedOption(null);
        if (idx + 1 >= qLen) {
          if (sessionId) endSession(sessionId, doneCount + 1).catch(() => {});
          setDone(true);
        } else {
          setIdx(i => i + 1);
        }
      }, 1400);
    }
    // Se errou: apenas faz flip e aguarda o usuário avaliar com "Errei"/"Difícil"
  };

  // ── Conteúdo do stage (shared entre modo normal e modo foco) ─────────
  const stageContent = (
    <>
      <FeedbackFlash type={feedback}/>

      <div className="study-stage">
        {/* Barra de progresso */}
        <div className="study-progress">
          <div className="study-progress-meta">
            <span>card {doneCount + 1} de {total}</span>
            <span style={{display:"flex", gap:16}}>
              <span style={{color:"var(--rose-text)"}}>● {history.filter(h=>h.rating==="again").length} errei</span>
              <span style={{color:"var(--amber-text)"}}>● {history.filter(h=>h.rating==="hard").length} difícil</span>
              <span style={{color:"var(--accent-text)"}}>● {history.filter(h=>h.rating==="good").length} bom</span>
              <span style={{color:"var(--sky)"}}>● {history.filter(h=>h.rating==="easy").length} fácil</span>
            </span>
          </div>
          <div className="study-progress-bar"><i style={{width: `${(doneCount/total)*100}%`}}/></div>
          <div className="study-progress-segments">
            {Array.from({length: Math.min(total, 30)}).map((_, i) => (
              <span key={i} className={`seg ${history[i]?.rating || ""}`} />
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="flashcard-wrap" onClick={() => !flipped && !feedback && !isMC && doFlip()}>
          <div className={`flashcard${flipped ? " flipped" : ""}${focus ? " card-focus" : ""}`} key={idx}>
            {/* FRENTE */}
            <div className="face">
              <div className="face-label">
                <span className="pill">{card.tags?.[0] || card.type}</span>
                <span>{deckLabel}</span>
                <span style={{marginLeft:"auto", display:"inline-flex", alignItems:"center", gap:4}}>
                  <Icon name="refresh" size={12}/> intervalo atual <strong style={{color:"var(--text-soft)"}}>{card.interval_days > 0 ? `${Math.round(card.interval_days)}d` : "novo"}</strong>
                </span>
              </div>
              <div className="face-content scrollable-content">
                {(() => {
                  const parsed = parseCardFront(card.front);
                  if (parsed.type === "image") {
                    return <ImageCard src={parsed.src} caption={parsed.caption} text={parsed.text}/>;
                  }
                  return <span style={{lineHeight:1.5, fontWeight:500}}>{parsed.text}</span>;
                })()}
              </div>
              <div className="face-foot">
                <span>{isMC ? "Selecione uma alternativa abaixo" : <>Clique no card ou <kbd>espaço</kbd> para revelar</>}</span>
                <span>SRS · FSRS</span>
              </div>
            </div>
            {/* VERSO */}
            <div className="face back">
              <div className="face-label">
                <span className="pill">{card.tags?.[0] || card.type}</span>
                <span>{deckLabel}</span>
                <span style={{marginLeft:"auto"}}>resposta</span>
              </div>
              <div className="face-content scrollable-content" style={{flexDirection:"column", gap:8}}>
                {(() => {
                  const parsed = parseCardBack(card.back);
                  if (parsed.type === "mc") {
                    return <MultipleChoiceCard mc={parsed} flipped={flipped} selectedOption={selectedOption}/>;
                  }
                  if (parsed.type === "youtube") {
                    return <YoutubeEmbed videoId={parsed.videoId} timestamp={parsed.timestamp} text={parsed.text}/>;
                  }
                  if (parsed.type === "image") {
                    return <ImageCard src={parsed.src} caption={parsed.caption} text={parsed.text}/>;
                  }
                  return <span style={{lineHeight:1.6}}>{parsed.text}</span>;
                })()}
              </div>
              <div className="face-foot">
                <span>Avalie como foi:</span>
                <span><kbd>1</kbd> errei · <kbd>2</kbd> difícil · <kbd>3</kbd> bom · <kbd>4</kbd> fácil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        {!flipped && !isMC && (
          <button className="reveal-btn" onClick={doFlip} disabled={!!feedback}>
            <Icon name="eye" size={14}/> Revelar resposta
          </button>
        )}
        {!flipped && isMC && (
          <MCOptionsButtons mc={parsedBack} onSelect={selectMCOption} disabled={!!feedback || saving}/>
        )}
        {flipped && isMC && selectedOption !== null && selectedOption !== parsedBack.correct && (
          <div className="study-actions">
            <button className="ans again" onClick={() => { setSelectedOption(null); answer("again"); }} disabled={saving || !!feedback}>
              <span className="key">1</span>
              <span className="lbl">Errei</span>
              <span className="interval">{intervals.again}</span>
            </button>
            <button className="ans hard" onClick={() => { setSelectedOption(null); answer("hard"); }} disabled={saving || !!feedback}>
              <span className="key">2</span>
              <span className="lbl">Difícil</span>
              <span className="interval">{intervals.hard}</span>
            </button>
          </div>
        )}
        {flipped && !isMC && (
          <div className="study-actions">
            <button className="ans again" onClick={() => answer("again")} disabled={saving || !!feedback}>
              <span className="key">1</span>
              <span className="lbl">Errei</span>
              <span className="interval">{intervals.again}</span>
            </button>
            <button className="ans hard" onClick={() => answer("hard")} disabled={saving || !!feedback}>
              <span className="key">2</span>
              <span className="lbl">Difícil</span>
              <span className="interval">{intervals.hard}</span>
            </button>
            <button className="ans good" onClick={() => answer("good")} disabled={saving || !!feedback}>
              <span className="key">3</span>
              <span className="lbl">Bom</span>
              <span className="interval">{intervals.good}</span>
            </button>
            <button className="ans easy" onClick={() => answer("easy")} disabled={saving || !!feedback}>
              <span className="key">4</span>
              <span className="lbl">Fácil</span>
              <span className="interval">{intervals.easy}</span>
            </button>
            <button className="ans" style={{border:"1px solid var(--border-strong)",color:"var(--text-mute)"}} onClick={repeatCard} disabled={saving || !!feedback} title="Repetir este card mais tarde (R)">
              <span className="key">R</span>
              <span className="lbl">Repetir</span>
              <span className="interval">↻</span>
            </button>
          </div>
        )}

        {flipped && !feedback && (!isMC || (selectedOption !== null && selectedOption !== parsedBack.correct)) && (
          <AIHint onOpenChat={() => { if (onNav) onNav("chat"); }} />
        )}
      </div>
    </>
  );

  // ── Sessão ativa ──────────────────────────────────────────────────────
  if (focus) {
    return ReactDOM.createPortal(
      <div className="focus-overlay">
        {/* Topbar do modo foco */}
        <div className="focus-topbar">
          <span style={{fontFamily:"var(--mono)", fontSize:11, color:"var(--text-mute)"}}>
            {deckLabel} · card {doneCount+1}/{total}
          </span>
          <span className="kbd" style={{marginLeft:8}}>
            <Icon name="clock" size={11}/>&nbsp; {fmtTime(elapsed)}
          </span>
          <div style={{marginLeft:"auto", display:"flex", gap:8}}>
            <MuteButton muted={muted} onToggle={() => setMuted(m => !m)}/>
            <button className="icon-btn" onClick={toggleFocus} title="Sair do modo foco (F)" aria-label="Sair do modo foco">
              <Icon name="minimize" size={14}/>
            </button>
            <button className="btn ghost" style={{padding:"4px 10px", fontSize:12}} onClick={async () => {
              setFocus(false);
              if (sessionId) await endSession(sessionId, doneCount).catch(() => {});
              onExit();
            }}>Pausar</button>
          </div>
        </div>
        {stageContent}
      </div>,
      document.body
    );
  }

  return (
    <div className="study-wrap">
      {/* Cabeçalho normal */}
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, padding:"12px 40px 0"}}>
        <div>
          <div style={{fontFamily:"var(--mono)", fontSize:11, color:"var(--text-mute)", letterSpacing:".08em", textTransform:"uppercase"}}>
            Sessão · {deckLabel}
          </div>
          <h1 style={{fontFamily:"var(--serif)", fontSize:32, margin:"6px 0 0", letterSpacing:"-.02em", fontWeight:400}}>
            Revisão <em style={{color:"var(--accent-text)", fontStyle:"italic"}}>diária</em>
          </h1>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <span className="kbd"><Icon name="clock" size={11}/>&nbsp; {fmtTime(elapsed)}</span>
          <MuteButton muted={muted} onToggle={() => setMuted(m => !m)}/>
          <button className="icon-btn" onClick={toggleFocus} title="Modo sem distrações (F)" aria-label="Modo sem distrações">
            <Icon name="maximize" size={14}/>
          </button>
          <button className="btn ghost" onClick={async () => {
            if (sessionId) await endSession(sessionId, doneCount).catch(() => {});
            onExit();
          }}>Pausar sessão</button>
        </div>
      </div>
      {stageContent}
    </div>
  );
};

const AIHint = ({ onOpenChat }) => {
  const [visible, setVisible] = React.useState(true);
  if (!visible) return null;
  return (
    <div style={{
      marginTop: 20,
      width: "100%", maxWidth: 720,
      background: "var(--violet-soft)",
      border: "1px solid color-mix(in oklch, var(--violet) 30%, transparent)",
      borderRadius: 12,
      padding: "12px 16px",
      display: "flex", gap: 12, alignItems:"flex-start",
      animation: "card-in .25s var(--ease-out) both"
    }}>
      <div style={{width:28, height:28, borderRadius:8, background:"var(--violet)", color:"white", display:"grid", placeItems:"center", flexShrink:0}}>
        <Icon name="sparkle" size={14}/>
      </div>
      <div style={{flex:1, fontSize:13, color:"var(--text-soft)"}}>
        <strong style={{color:"var(--text)"}}>Dica da IA:</strong> use a sessão de chat para tirar dúvidas sobre este card com a IA.
        <div style={{marginTop:8, display:"flex", gap:6}}>
          <button className="btn violet" style={{padding:"5px 10px"}} onClick={onOpenChat}>Abrir chat</button>
          <button className="btn ghost" style={{padding:"5px 10px", color:"var(--text-mute)"}} onClick={() => setVisible(false)}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { StudyScreen });
