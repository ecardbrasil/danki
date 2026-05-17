// =========================================================================
// SCREEN: AI CHAT (com IA sobre conteúdo do deck)
// =========================================================================
const GENERIC_INITIAL_MSG = {
  role: "ai",
  text: "Olá! Sou sua IA de estudos. Selecione um deck acima e me diga o que quer revisar hoje.",
  suggestions: ["O que posso estudar hoje?", "Quais são meus pontos fracos?", "Gerar novos cards", "Resumir um tópico"],
};

const AIChatScreen = () => {
  const [messages, setMessages] = React.useState([GENERIC_INITIAL_MSG]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const [decks, setDecks] = React.useState([]);
  const [selectedDeckId, setSelectedDeckId] = React.useState("");
  const [deckStats, setDeckStats] = React.useState(null);
  const bodyRef = React.useRef(null);

  React.useEffect(() => {
    fetchDecksSimple().then(list => {
      setDecks(list);
      if (list.length > 0) setSelectedDeckId(list[0].id);
    }).catch(() => {});
  }, []);

  React.useEffect(() => {
    if (!selectedDeckId) { setDeckStats(null); return; }
    fetchDeckStats(selectedDeckId).then(setDeckStats).catch(() => setDeckStats(null));
  }, [selectedDeckId]);

  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  const selectedDeck = decks.find(d => d.id === selectedDeckId);

  const send = (text) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setMessages(m => [...m, { role: "user", text: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, {
        role: "ai",
        text: "Entendido! Esta funcionalidade de IA estará disponível em breve. Por enquanto, use os botões de sugestão para explorar o que posso fazer.",
        suggestions: ["Quais cards devo revisar?", "Gerar novos cards", "Explicar um conceito", "Quiz rápido"]
      }]);
    }, 1200);
  };

  const handleNewConversation = () => {
    setMessages([GENERIC_INITIAL_MSG]);
    setInput("");
  };

  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Conversar com <em>IA</em></h1>
          <div className="screen-sub">A IA tem contexto completo do seu deck e histórico de revisões</div>
        </div>
        <div style={{display:"flex", gap:10, alignItems:"center"}}>
          <span style={{fontSize:12, color:"var(--text-mute)"}}>Contexto:</span>
          <select
            className="btn"
            style={{padding:"6px 10px"}}
            value={selectedDeckId}
            onChange={e => setSelectedDeckId(e.target.value)}
          >
            {decks.length === 0 && <option value="">Nenhum deck</option>}
            {decks.map(d => (
              <option key={d.id} value={d.id}>{d.title}</option>
            ))}
            {decks.length > 0 && <option value="">Todos os decks</option>}
          </select>
          <button className="btn ghost" onClick={handleNewConversation}>
            <Icon name="refresh" size={13}/> Nova conversa
          </button>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 320px", gap: 22, alignItems:"start"}}>
        {/* CHAT */}
        <div className="chat-panel">
          <div className="chat-head">
            <div className="ai-avatar">
              <Icon name="sparkle" size={14}/>
            </div>
            <div>
              <div style={{fontSize:13.5, fontWeight:500}}>Danki AI</div>
              <div style={{fontSize:11, color:"var(--text-mute)", fontFamily:"var(--mono)"}}>
                {selectedDeck ? `contextualizada · ${selectedDeck.title}` : "selecione um deck"}
              </div>
            </div>
            <div style={{marginLeft:"auto", display:"flex", gap:6}}>
              <button className="icon-btn" title="Configurações">
                <Icon name="settings" size={13}/>
              </button>
            </div>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {messages.map((m, i) => (
              m.role === "user" ? (
                <div className="msg user" key={i}>{m.text}</div>
              ) : (
                <div className="msg ai" key={i}>
                  <div dangerouslySetInnerHTML={{__html: renderMd(m.text)}}/>
                  {m.suggestions && (
                    <div className="hint">
                      {m.suggestions.map((s, j) => (
                        <button key={j} onClick={() => send(s)}>{s}</button>
                      ))}
                    </div>
                  )}
                </div>
              )
            ))}
            {typing && (
              <div className="typing">
                <i/><i/><i/>
              </div>
            )}
          </div>

          <div className="chat-foot">
            <button className="icon-btn" title="Anexar">
              <Icon name="plus" size={14}/>
            </button>
            <input
              className="chat-input"
              placeholder="Pergunte algo sobre seu deck…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") send(); }}
            />
            <button className="btn primary" onClick={() => send()} disabled={!input.trim()}>
              <Icon name="send" size={14}/>
            </button>
          </div>
        </div>

        {/* Context Sidebar */}
        <div style={{display:"flex", flexDirection:"column", gap:18}}>
          <div className="panel">
            <div className="panel-title" style={{fontSize:13, marginBottom: 14}}>
              {selectedDeck ? `Sobre: ${selectedDeck.title}` : "Selecione um deck"}
            </div>
            <SrsRow label="Cards totais" value={deckStats ? String(deckStats.total) : "—"} />
            <SrsRow label="Maestria" value={deckStats ? `${deckStats.mastery || 0}%` : "—"} />
            <SrsRow label="Para revisar" value={deckStats ? String(deckStats.due) : "—"} />
            <SrsRow label="Novos" value={deckStats ? String(deckStats.newCards) : "—"} />
          </div>

          <div className="panel">
            <div className="panel-title" style={{fontSize:13, marginBottom: 12}}>
              <Icon name="bolt" size={13} style={{color:"var(--accent)", marginRight:6, verticalAlign:"-2px"}}/>
              A IA pode te ajudar com
            </div>
            {[
              ["Resumir um capítulo","do material do deck"],
              ["Gerar novos cards","a partir da conversa"],
              ["Explicar como se eu tivesse 10 anos","analogias simples"],
              ["Quiz interativo","sem usar SRS"],
              ["Mapas mentais","conexões entre tópicos"],
            ].map(([a,b], i) => (
              <button key={i} className="activity-row" style={{
                width:"100%", textAlign:"left", border:"none", background:"transparent",
                cursor:"pointer", color:"inherit", padding: "8px 0"
              }} onClick={() => send(a)}>
                <div className="ic violet"><Icon name="sparkle" size={12}/></div>
                <div className="label">
                  {a}
                  <small>{b}</small>
                </div>
                <Icon name="chevron" size={12} style={{color:"var(--text-mute)"}}/>
              </button>
            ))}
          </div>

          <div className="panel" style={{background:"var(--bg-elev)"}}>
            <div style={{display:"flex", gap:8, alignItems:"flex-start"}}>
              <div style={{width:6, height:6, borderRadius:50, background:"var(--accent)", marginTop:7, boxShadow:"0 0 8px var(--accent)"}}/>
              <div style={{fontSize:12, color:"var(--text-soft)"}}>
                Suas conversas são privadas e usadas só para te ajudar a estudar.
                Nunca treinam modelos públicos.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tiny markdown renderer (bold + bullets + line breaks)
function renderMd(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^•\s(.*)$/gm, '<div style="display:flex;gap:8px;margin:2px 0"><span style="color:var(--accent)">●</span><span>$1</span></div>')
    .replace(/\n/g, '<br/>');
}

Object.assign(window, { AIChatScreen });
