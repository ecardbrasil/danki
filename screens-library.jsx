// =========================================================================
// SCREEN: BIBLIOTECA DE PROVAS
// Permite visualizar e importar flashcards prontos de provas anteriores.
// =========================================================================

// ── Modal de preview e importação ────────────────────────────────────────

const LibraryImportModal = ({ entry, onClose, onImported }) => {
  const [cardIndex, setCardIndex]   = React.useState(0);
  const [flipped, setFlipped]       = React.useState(false);
  const [folder, setFolder]         = React.useState("");
  const [importing, setImporting]   = React.useState(false);
  const [progress, setProgress]     = React.useState(0);
  const [done, setDone]             = React.useState(false);
  const [error, setError]           = React.useState("");
  const [userDecks, setUserDecks]   = React.useState([]);

  const card = entry.cards[cardIndex];
  const total = entry.cards.length;

  // Carrega pastas do usuário para o seletor
  React.useEffect(() => {
    fetchDecksSimple().then(decks => setUserDecks(decks || []));
  }, []);

  // Coleta pastas únicas dos decks do usuário
  const folders = React.useMemo(() => {
    const seen = new Set([""]); // raiz sempre disponível
    for (const d of userDecks) {
      const fp = d.folder_path || "";
      if (fp) seen.add(fp);
    }
    return Array.from(seen).sort();
  }, [userDecks]);

  const goCard = (dir) => {
    setFlipped(false);
    setCardIndex(i => Math.max(0, Math.min(total - 1, i + dir)));
  };

  const handleImport = async () => {
    setImporting(true);
    setError("");
    setProgress(0);
    try {
      const deck = await createDeck({
        title: entry.title,
        category: entry.subject,
        description: entry.description || "",
        color: entry.color,
        folder_path: folder,
      });

      for (let i = 0; i < entry.cards.length; i++) {
        const c = entry.cards[i];
        await createCard({
          deck_id: deck.id,
          type: "basic",
          front: c.front,
          back: c.back,
          tags: entry.tags || [],
        });
        setProgress(Math.round(((i + 1) / entry.cards.length) * 100));
      }

      setDone(true);
      onImported && onImported(deck);
    } catch (err) {
      setError(err.message || "Erro ao importar.");
      setImporting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,.65)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-elev)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          width: "100%", maxWidth: 580,
          boxShadow: "var(--shadow-lg)",
          animation: "stagger-up .3s var(--ease-out) both",
          overflow: "hidden",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div style={{
          padding: "22px 24px 18px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span className={`lib-exam-badge lib-exam-badge--${entry.exam.toLowerCase()}`}>
                {entry.exam}
              </span>
              <span style={{ color: "var(--text-mute)", fontSize: 12 }}>{entry.year}</span>
            </div>
            <h2 style={{
              margin: 0, fontSize: 18,
              fontFamily: "var(--serif)", fontWeight: 400,
              color: "var(--text)",
            }}>{entry.title}</h2>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-mute)" }}>
              {total} flashcards · {entry.subject}
            </p>
          </div>
          <button className="icon-btn" onClick={onClose} style={{ flexShrink: 0 }}>
            <Icon name="minimize" size={14} />
          </button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {!done ? (
            <>
              {/* Preview do card */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 10,
              }}>
                <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--text-mute)" }}>
                  CARD {cardIndex + 1} / {total}
                </span>
                <button
                  className="btn ghost"
                  style={{ fontSize: 11, padding: "3px 8px" }}
                  onClick={() => setFlipped(f => !f)}
                >
                  {flipped ? "Ver frente" : "Ver verso"}
                </button>
              </div>

              <div
                className="lib-card-preview"
                onClick={() => setFlipped(f => !f)}
                style={{ cursor: "pointer" }}
              >
                <div className={`lib-card-face ${flipped ? "lib-card-face--back" : ""}`}>
                  <div className="lib-card-label">{flipped ? "VERSO" : "FRENTE"}</div>
                  <div className="lib-card-text">
                    {(() => {
                      const raw = flipped ? card.back : card.front;
                      if (raw && raw.startsWith("__IMG__")) {
                        try {
                          const d = JSON.parse(raw.slice(7));
                          return (
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:8}}>
                              <img src={d.src} alt={d.caption||""} style={{maxWidth:"100%", maxHeight:180, borderRadius:8, objectFit:"contain"}} onError={e=>e.target.style.display="none"}/>
                              {d.caption && <span style={{fontSize:11, color:"var(--text-mute)", fontStyle:"italic"}}>{d.caption}</span>}
                              {d.text && <span style={{fontSize:13}}>{d.text}</span>}
                            </div>
                          );
                        } catch(_) {}
                      }
                      return raw;
                    })()}
                  </div>
                </div>
              </div>

              {/* Navegação de cards */}
              <div style={{ display: "flex", gap: 8, marginTop: 10, marginBottom: 20 }}>
                <button
                  className="btn"
                  onClick={() => goCard(-1)}
                  disabled={cardIndex === 0}
                  style={{ flex: 1, fontSize: 12 }}
                >
                  ← Anterior
                </button>
                <button
                  className="btn"
                  onClick={() => goCard(1)}
                  disabled={cardIndex === total - 1}
                  style={{ flex: 1, fontSize: 12 }}
                >
                  Próximo →
                </button>
              </div>

              {/* Seletor de pasta */}
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "14px 16px",
              }}>
                <label style={{
                  display: "block", fontSize: 11, fontWeight: 600,
                  letterSpacing: "0.08em", color: "var(--text-mute)",
                  textTransform: "uppercase", marginBottom: 8,
                }}>
                  Salvar na pasta
                </label>
                <select
                  value={folder}
                  onChange={e => setFolder(e.target.value)}
                  disabled={importing}
                  style={{
                    width: "100%",
                    background: "var(--bg-elev)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    borderRadius: 8,
                    padding: "8px 10px",
                    fontSize: 13,
                    fontFamily: "var(--sans)",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <option value="">— Raiz (sem pasta) —</option>
                  {folders.filter(f => f).map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {error && (
                <div style={{
                  marginTop: 12, padding: "10px 14px",
                  background: "oklch(0.74 0.16 25 / 0.1)",
                  border: "1px solid oklch(0.74 0.16 25 / 0.3)",
                  borderRadius: 8, fontSize: 12, color: "var(--rose)",
                }}>{error}</div>
              )}

              {/* Barra de progresso */}
              {importing && (
                <div style={{ marginTop: 14 }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: 11, color: "var(--text-mute)", marginBottom: 6,
                  }}>
                    <span>Importando cards…</span>
                    <span style={{ fontFamily: "var(--mono)" }}>{progress}%</span>
                  </div>
                  <div style={{
                    height: 4, background: "var(--surface-2)",
                    borderRadius: 4, overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", width: `${progress}%`,
                      background: "var(--accent)",
                      borderRadius: 4,
                      transition: "width .2s var(--ease-out)",
                    }} />
                  </div>
                </div>
              )}

              {/* Botão principal */}
              <button
                className="btn primary"
                onClick={handleImport}
                disabled={importing}
                style={{
                  width: "100%", marginTop: 16,
                  padding: "11px 0", fontSize: 14, fontWeight: 600,
                }}
              >
                {importing
                  ? `Importando… (${progress}%)`
                  : `Importar ${total} flashcards`}
              </button>
            </>
          ) : (
            /* Estado de sucesso */
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "var(--accent-soft)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                <Icon name="check" size={24} style={{ color: "var(--accent)" }} />
              </div>
              <h3 style={{
                margin: "0 0 8px",
                fontFamily: "var(--serif)", fontWeight: 400, fontSize: 22,
              }}>Importado com sucesso!</h3>
              <p style={{ margin: "0 0 24px", color: "var(--text-mute)", fontSize: 13 }}>
                {total} flashcards adicionados ao seu deck "{entry.title}".
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn" style={{ flex: 1 }} onClick={onClose}>
                  Fechar
                </button>
                <button
                  className="btn primary"
                  style={{ flex: 1 }}
                  onClick={() => { onClose(); onImported && onImported(null, true); }}
                >
                  Ver meus decks
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Card de prova na grade ────────────────────────────────────────────────

const LibraryCard = ({ entry, onPreview }) => {
  const colorMap = {
    1: "var(--accent)",
    2: "var(--violet)",
    3: "var(--amber)",
    4: "var(--sky)",
    5: "var(--rose)",
    6: "oklch(0.7 0.14 320)",
  };
  const accentColor = colorMap[entry.color] || colorMap[1];

  return (
    <div className="lib-card" style={{ "--lib-color": accentColor }}>
      <div className="lib-card-top">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className={`lib-exam-badge lib-exam-badge--${entry.exam.toLowerCase()}`}>
            {entry.exam}
          </span>
          <span style={{
            fontSize: 11, fontFamily: "var(--mono)",
            color: "var(--text-mute)",
          }}>{entry.year}</span>
        </div>
      </div>

      <div className="lib-card-body">
        <div style={{
          fontSize: 12, color: "var(--text-mute)", fontWeight: 500,
          letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4,
        }}>{entry.subject}</div>
        <h3 style={{
          margin: "0 0 8px", fontSize: 15,
          fontFamily: "var(--serif)", fontWeight: 400,
          color: "var(--text)", lineHeight: 1.35,
        }}>{entry.title}</h3>
        {entry.description && (
          <p style={{
            margin: "0 0 12px", fontSize: 12, color: "var(--text-mute)",
            lineHeight: 1.5,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{entry.description}</p>
        )}
      </div>

      <div className="lib-card-foot">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="cards" size={13} style={{ color: "var(--text-mute)" }} />
          <span style={{
            fontSize: 12, fontFamily: "var(--mono)", color: "var(--text-mute)",
          }}>{entry.cards.length} cards</span>
        </div>
        <button
          className="btn primary"
          style={{ fontSize: 12, padding: "5px 14px" }}
          onClick={() => onPreview(entry)}
        >
          <Icon name="eye" size={13} />
          Preview
        </button>
      </div>
    </div>
  );
};

// ── Tela principal ────────────────────────────────────────────────────────

const LibraryScreen = ({ onNav }) => {
  const library = window.PUBLIC_LIBRARY || [];

  const [search, setSearch]         = React.useState("");
  const [filterExam, setFilterExam] = React.useState("all");
  const [filterSubject, setFilterSubject] = React.useState("all");
  const [filterYear, setFilterYear] = React.useState("all");
  const [previewEntry, setPreviewEntry] = React.useState(null);

  // Coleta valores únicos para os filtros
  const exams    = React.useMemo(() => [...new Set(library.map(e => e.exam))].sort(), [library]);
  const subjects = React.useMemo(() => [...new Set(library.map(e => e.subject))].sort(), [library]);
  const years    = React.useMemo(() => [...new Set(library.map(e => e.year))].sort((a,b) => b - a), [library]);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return library.filter(e => {
      if (filterExam !== "all" && e.exam !== filterExam) return false;
      if (filterSubject !== "all" && e.subject !== filterSubject) return false;
      if (filterYear !== "all" && String(e.year) !== filterYear) return false;
      if (q && !e.title.toLowerCase().includes(q) && !e.subject.toLowerCase().includes(q) && !e.exam.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [library, search, filterExam, filterSubject, filterYear]);

  const handleImported = (deck, goToDecks) => {
    if (goToDecks) onNav("decks");
  };

  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Biblioteca de Provas</h1>
          <p className="screen-sub">
            Flashcards prontos de provas anteriores — importe em 1 clique para seus decks.
          </p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 14px",
          background: "var(--accent-soft)",
          border: "1px solid oklch(0.84 0.16 142 / 0.25)",
          borderRadius: 10,
          fontSize: 12, color: "var(--accent)",
        }}>
          <Icon name="bolt" size={13} />
          <span><strong>{library.length}</strong> provas disponíveis</span>
        </div>
      </div>

      {/* Barra de busca e filtros */}
      <div style={{
        display: "flex", gap: 10, flexWrap: "wrap",
        marginBottom: 24, alignItems: "center",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 9, padding: "8px 12px",
          flex: "1 1 200px", minWidth: 0,
        }}>
          <Icon name="search" size={14} style={{ color: "var(--text-mute)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar prova, matéria…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: "none", border: "none", outline: "none",
              color: "var(--text)", fontSize: 13, width: "100%",
              fontFamily: "var(--sans)",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-mute)", padding: 0, lineHeight: 1,
              }}
            >×</button>
          )}
        </div>

        {[
          { label: "Prova", value: filterExam, setter: setFilterExam, options: exams, allLabel: "Todas as provas" },
          { label: "Matéria", value: filterSubject, setter: setFilterSubject, options: subjects, allLabel: "Todas as matérias" },
          { label: "Ano", value: filterYear, setter: setFilterYear, options: years.map(String), allLabel: "Todos os anos" },
        ].map(({ label, value, setter, options, allLabel }) => (
          <select
            key={label}
            value={value}
            onChange={e => setter(e.target.value)}
            style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              color: value === "all" ? "var(--text-mute)" : "var(--text)",
              borderRadius: 9, padding: "8px 12px", fontSize: 13,
              fontFamily: "var(--sans)", cursor: "pointer", outline: "none",
              flexShrink: 0,
            }}
          >
            <option value="all">{allLabel}</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* Resultado da busca */}
      {search || filterExam !== "all" || filterSubject !== "all" || filterYear !== "all" ? (
        <div style={{ fontSize: 12, color: "var(--text-mute)", marginBottom: 16 }}>
          {filtered.length === 0
            ? "Nenhuma prova encontrada."
            : `${filtered.length} prova${filtered.length > 1 ? "s" : ""} encontrada${filtered.length > 1 ? "s" : ""}.`}
        </div>
      ) : null}

      {/* Grade de provas */}
      {filtered.length > 0 ? (
        <div className="lib-grid">
          {filtered.map((entry, i) => (
            <div
              key={entry.id}
              style={{ animation: `stagger-up .35s var(--ease-out) ${i * 0.04}s both` }}
            >
              <LibraryCard entry={entry} onPreview={setPreviewEntry} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: "center", padding: "60px 24px",
          background: "var(--bg-elev)", borderRadius: 16,
          border: "1px dashed var(--border)",
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📚</div>
          <h2 style={{
            margin: "0 0 8px", fontFamily: "var(--serif)",
            fontWeight: 400, fontSize: 20,
          }}>Nenhuma prova encontrada</h2>
          <p style={{ margin: 0, color: "var(--text-mute)", fontSize: 13 }}>
            Tente ajustar os filtros ou limpar a busca.
          </p>
          <button
            className="btn"
            style={{ marginTop: 16 }}
            onClick={() => { setSearch(""); setFilterExam("all"); setFilterSubject("all"); setFilterYear("all"); }}
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Modal de preview/importação */}
      {previewEntry && (
        <LibraryImportModal
          entry={previewEntry}
          onClose={() => setPreviewEntry(null)}
          onImported={handleImported}
        />
      )}
    </div>
  );
};

Object.assign(window, { LibraryScreen });
