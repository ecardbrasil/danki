// =========================================================================
// SCREEN: EDITOR (manual card editor)
// =========================================================================
const EditorScreen = ({ initialDeckId, onBack }) => {
  const [type, setType]   = React.useState("basic");
  const [front, setFront] = React.useState("");
  const [back, setBack]   = React.useState("");
  const [tagInput, setTagInput] = React.useState("");
  const [tags, setTags]   = React.useState([]);
  const [deckId, setDeckId] = React.useState(initialDeckId || "");
  const [decks, setDecks]   = React.useState([]);
  const [saving, setSaving] = React.useState(false);
  const [error, setError]   = React.useState("");
  const [success, setSuccess] = React.useState("");

  React.useEffect(() => {
    fetchDecksSimple()
      .then(d => {
        setDecks(d);
        if (!initialDeckId && d.length > 0) setDeckId(d[0].id);
      })
      .catch(() => {});
  }, []);

  const resetForm = () => {
    setFront("");
    setBack("");
    setTags([]);
    setTagInput("");
    setError("");
  };

  const save = async (andAnother = false) => {
    if (!front.trim() || !back.trim()) {
      setError("Preencha a frente e o verso do card.");
      return;
    }
    if (!deckId) {
      setError("Selecione um deck.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await createCard({ deck_id: deckId, type, front: front.trim(), back: back.trim(), tags });
      if (andAnother) {
        resetForm();
        setSuccess("Card salvo! Crie outro.");
      } else {
        setSuccess("Card salvo com sucesso!");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === " ") && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim().toLowerCase();
      if (!tags.includes(t)) setTags([...tags, t]);
      setTagInput("");
    }
  };

  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Editor de <em>card</em></h1>
          <div className="screen-sub">Criação manual de flashcard</div>
        </div>
        <div style={{display:"flex", gap:10}}>
          {onBack && <button className="btn ghost" onClick={onBack}>← Decks</button>}
          <button className="btn ghost" onClick={resetForm} disabled={saving}>Descartar</button>
          <button className="btn" onClick={() => save(true)} disabled={saving}>
            <Icon name="plus" size={13}/> {saving ? "Salvando…" : "Salvar e criar outro"}
          </button>
          <button className="btn primary" onClick={() => save(false)} disabled={saving}>
            <Icon name="check" size={14}/> {saving ? "Salvando…" : "Salvar card"}
          </button>
        </div>
      </div>

      {error   && <div style={{background:"color-mix(in oklch, var(--rose) 12%, transparent)", border:"1px solid color-mix(in oklch, var(--rose) 30%, transparent)", borderRadius:10, padding:"10px 16px", marginBottom:16, fontSize:13, color:"var(--rose-text)"}}>{error}</div>}
      {success && <div style={{background:"color-mix(in oklch, var(--green) 12%, transparent)", border:"1px solid color-mix(in oklch, var(--green) 30%, transparent)", borderRadius:10, padding:"10px 16px", marginBottom:16, fontSize:13, color:"var(--green-text)"}}>{success}</div>}

      <div className="editor-grid">
        <div>
          {/* Deck selector */}
          <div className="panel" style={{padding:18, marginBottom:18}}>
            <div className="editor-field-label" style={{marginBottom:8}}>Deck de destino</div>
            {decks.length === 0 ? (
              <div style={{fontSize:13, color:"var(--text-mute)"}}>Nenhum deck encontrado. Crie um deck primeiro.</div>
            ) : (
              <select
                value={deckId}
                onChange={e => setDeckId(e.target.value)}
                style={{
                  width:"100%", padding:"10px 12px", borderRadius:8,
                  background:"var(--bg-elev)", border:"1px solid var(--border)",
                  color:"var(--text)", fontFamily:"inherit", fontSize:14,
                }}
              >
                {decks.map(d => (
                  <option key={d.id} value={d.id}>{d.title}{d.category ? ` — ${d.category}` : ""}</option>
                ))}
              </select>
            )}
          </div>

          {/* Type selector */}
          <div className="panel" style={{padding:18, marginBottom:18}}>
            <div className="editor-field-label" style={{marginBottom: 10}}>Tipo de card</div>
            <div style={{display:"flex", gap:10}}>
              {[
                { id:"basic",    label:"Básico",  sub:"frente + verso" },
                { id:"cloze",    label:"Cloze",   sub:"lacuna no texto" },
                { id:"reverse",  label:"Reverso",  sub:"gera 2 cards" },
                { id:"type_in",  label:"Digitar",  sub:"input do usuário" },
              ].map(t => (
                <button key={t.id} onClick={() => setType(t.id)} style={{
                  flex:1, padding:"12px 14px", textAlign:"left", cursor:"pointer",
                  background: type===t.id ? "var(--accent-soft)" : "var(--bg-elev)",
                  border: type===t.id ? "1px solid var(--accent)" : "1px solid var(--border)",
                  borderRadius: 10, color:"var(--text)", fontFamily:"inherit"
                }}>
                  <div style={{fontSize:13, fontWeight:500, color: type===t.id ? "var(--accent)" : "var(--text)"}}>{t.label}</div>
                  <div style={{fontSize:11, color:"var(--text-mute)", marginTop:2}}>{t.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Front field */}
          <div className="panel">
            <div className="editor-field">
              <div className="editor-field-label">
                <span>Frente</span>
                <em>{front.length} caracteres</em>
              </div>
              <div className="editor-toolbar">
                <button title="Negrito"><strong>B</strong></button>
                <button title="Itálico"><em>I</em></button>
                <button title="Sublinhado"><u>U</u></button>
                <div className="sep"/>
                <button title="Cloze"><Icon name="cards" size={13}/></button>
                <button title="Código"><Icon name="code" size={13}/></button>
                <button title="Imagem"><Icon name="image" size={13}/></button>
                <button title="Áudio"><Icon name="audio" size={13}/></button>
                <div className="sep"/>
                <button title="IA: melhorar" style={{color:"var(--violet)"}}>
                  <Icon name="sparkle" size={13}/>
                </button>
              </div>
              <textarea
                className="editor-textarea"
                value={front}
                onChange={e => setFront(e.target.value)}
                placeholder="Digite a pergunta ou conceito…"
              />
            </div>

            <div className="editor-field">
              <div className="editor-field-label">
                <span>Verso · resposta</span>
                <em style={{display:"inline-flex", alignItems:"center", gap:4, color:"var(--violet)"}}>
                  <Icon name="sparkle" size={11}/> sugerir com IA
                </em>
              </div>
              <textarea
                className="editor-textarea"
                style={{minHeight:160}}
                value={back}
                onChange={e => setBack(e.target.value)}
                placeholder="Digite a resposta ou explicação…"
              />
            </div>

            <div className="editor-field">
              <div className="editor-field-label"><span>Notas extras / mnemônicos</span><em>opcional</em></div>
              <textarea className="editor-textarea" style={{minHeight:80}} placeholder="ex: truque para memorizar…"/>
            </div>

            <div className="editor-field">
              <div className="editor-field-label"><span>Tags</span><em>Enter ou espaço para adicionar</em></div>
              <div className="tag-row" style={{flexWrap:"wrap", gap:6}}>
                {tags.map((t, i) => (
                  <span key={i} className="tag">
                    {t}
                    <span style={{cursor:"pointer", color:"var(--text-mute)", marginLeft:4}} onClick={() => setTags(tags.filter((_,j) => j!==i))}>×</span>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="nova tag…"
                  style={{
                    background:"transparent", border:"none", outline:"none",
                    color:"var(--text)", fontFamily:"inherit", fontSize:13,
                    minWidth:90,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right panel: preview + advanced */}
        <div style={{display:"flex", flexDirection:"column", gap:18, position:"sticky", top: 84}}>
          <div className="editor-preview">
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 14}}>
              <div className="panel-title" style={{fontSize:13}}>Preview ao vivo</div>
            </div>
            <div style={{
              minHeight: 200,
              background: "linear-gradient(180deg, var(--bg-elev), var(--surface-2))",
              border:"1px solid var(--border)",
              borderRadius: 14,
              padding: 22,
              display:"flex", flexDirection:"column"
            }}>
              <div style={{fontFamily:"var(--mono)", fontSize:10, color:"var(--text-mute)", letterSpacing:".08em", textTransform:"uppercase"}}>
                {decks.find(d => d.id === deckId)?.title || "—"}
              </div>
              <div style={{
                flex:1, display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"var(--serif)", fontSize: 20, textAlign:"center", letterSpacing:"-.01em",
                padding: "20px 6px", color: front ? "var(--text)" : "var(--text-mute)",
              }}>
                {front || "Frente do card aparece aqui…"}
              </div>
              <div style={{fontFamily:"var(--mono)", fontSize:10, color:"var(--text-mute)", textAlign:"right"}}>
                clique para revelar
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-title" style={{fontSize:13, marginBottom: 12}}>Avançado · SRS</div>
            <SrsRow label="Dificuldade inicial" value="Auto (IA)" hint="ajustada após 3 revisões"/>
            <SrsRow label="Intervalo inicial" value="1d → 3d → 7d"/>
            <SrsRow label="Algoritmo" value="FSRS-5"/>
            <SrsRow label="Retenção alvo" value="92%"/>
          </div>
        </div>
      </div>
    </div>
  );
};

const SrsRow = ({ label, value, hint }) => (
  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px dashed var(--border)", fontSize:13}}>
    <div>
      <div style={{color:"var(--text)"}}>{label}</div>
      {hint && <div style={{fontSize:11, color:"var(--text-mute)"}}>{hint}</div>}
    </div>
    <div style={{fontFamily:"var(--mono)", fontSize:12, color:"var(--text-soft)"}}>{value}</div>
  </div>
);

Object.assign(window, { EditorScreen, SrsRow });
