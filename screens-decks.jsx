// =========================================================================
// SCREEN: DECKS — com sistema de pastas
// =========================================================================

// ── Utilitários de pasta ──────────────────────────────────────────────────

// Normaliza folder_path de um deck (trata null/undefined como raiz)
function deckFolderPath(deck) {
  return deck.folder_path || "";
}

// Retorna os nomes de subpastas diretas dentro de `currentPath`
function getSubfolders(decks, currentPath) {
  const prefix = currentPath ? currentPath + "/" : "";
  const seen = new Set();
  for (const d of decks) {
    const fp = deckFolderPath(d);
    if (!fp.startsWith(prefix)) continue;
    const rest = fp.slice(prefix.length);
    if (!rest) continue;
    const next = rest.split("/")[0];
    if (next) seen.add(next);
  }
  return Array.from(seen).sort();
}

// Retorna decks diretamente na pasta `currentPath` (não em subpastas)
function getDecksInFolder(decks, currentPath) {
  return decks.filter(d => deckFolderPath(d) === currentPath);
}

// Conta total de decks (recursivo) dentro de uma pasta
function countDecksInFolder(decks, folderPath) {
  const prefix = folderPath ? folderPath + "/" : "";
  return decks.filter(d => {
    const fp = deckFolderPath(d);
    return fp === folderPath || fp.startsWith(prefix);
  }).length;
}

// Constrói breadcrumb a partir de um path
function buildBreadcrumb(path) {
  if (!path) return [];
  return path.split("/");
}

// ── Modal: Novo deck ──────────────────────────────────────────────────────
const NewDeckModal = ({ onClose, onCreated, initialFolder = "" }) => {
  const [title, setTitle]   = React.useState("");
  const [cat, setCat]       = React.useState("");
  const [desc, setDesc]     = React.useState("");
  const [color, setColor]   = React.useState(1);
  const [folder, setFolder] = React.useState(initialFolder);
  const [loading, setLoading] = React.useState(false);
  const [error, setError]   = React.useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    try {
      const deck = await createDeck({
        title: title.trim(),
        category: cat.trim(),
        description: desc.trim(),
        color,
        folder_path: folder.trim(),
      });
      onCreated(deck);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "var(--bg-elev)", border: "1px solid var(--border)",
        borderRadius: 18, padding: "32px 28px", width: 440,
        boxShadow: "var(--shadow-lg)", animation: "stagger-up .3s var(--ease-out) both",
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, marginBottom: 22 }}>Novo deck</h2>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-mute)", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 5 }}>Título *</label>
            <input className="auth-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: JLPT N3" required autoFocus/>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-mute)", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 5 }}>Pasta</label>
            <input className="auth-input" value={folder} onChange={e => setFolder(e.target.value)}
              placeholder="Ex: Medicina/Anatomia (deixe vazio para raiz)"/>
            <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 4 }}>
              Use / para criar subpastas (ex: Medicina/Cirurgia)
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-mute)", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 5 }}>Categoria</label>
            <input className="auth-input" value={cat} onChange={e => setCat(e.target.value)} placeholder="Ex: Idiomas · Japonês"/>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-mute)", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 5 }}>Descrição</label>
            <input className="auth-input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Opcional"/>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-mute)", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 8 }}>Cor</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[1,2,3,4,5,6].map(c => (
                <button key={c} type="button"
                  className={`deck-color-${c}`}
                  onClick={() => setColor(c)}
                  style={{
                    width: 28, height: 28, borderRadius: 8, border: "none", cursor: "pointer",
                    outline: color === c ? "2px solid var(--text)" : "2px solid transparent",
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
          </div>
          {error && <div style={{ fontSize: 13, color: "var(--rose)" }}>{error}</div>}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button type="button" className="btn" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn primary" style={{ flex: 1, justifyContent: "center" }} disabled={loading}>
              {loading ? "Criando…" : "Criar deck"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Modal: Nova pasta ─────────────────────────────────────────────────────
const NewFolderModal = ({ onClose, onCreate, parentPath }) => {
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");

  const submit = (e) => {
    e.preventDefault();
    const clean = name.trim().replace(/\//g, "");
    if (!clean) return;
    if (/[\/\\<>:"|?*]/.test(clean)) {
      setError("Nome não pode conter caracteres especiais");
      return;
    }
    const fullPath = parentPath ? `${parentPath}/${clean}` : clean;
    onCreate(fullPath);
    onClose();
  };

  const parentLabel = parentPath || "Raiz";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "var(--bg-elev)", border: "1px solid var(--border)",
        borderRadius: 18, padding: "32px 28px", width: 380,
        boxShadow: "var(--shadow-lg)", animation: "stagger-up .3s var(--ease-out) both",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 24 }}>📁</span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, margin: 0 }}>Nova pasta</h2>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-mute)", marginBottom: 20 }}>
          Dentro de: <strong style={{ color: "var(--text-soft)" }}>{parentLabel}</strong>
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-mute)", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 5 }}>Nome *</label>
            <input className="auth-input" value={name} onChange={e => setName(e.target.value)}
              placeholder="Ex: Anatomia" required autoFocus/>
          </div>
          {error && <div style={{ fontSize: 13, color: "var(--rose)" }}>{error}</div>}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button type="button" className="btn" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn primary" style={{ flex: 1, justifyContent: "center" }}>
              Criar pasta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Modal: Mover deck ─────────────────────────────────────────────────────
const MoveDeckModal = ({ deck, decks, onClose, onMoved }) => {
  const [dest, setDest] = React.useState(deck.folder_path || "");
  const [loading, setLoading] = React.useState(false);

  // Coleta todas as pastas únicas
  const allFolders = React.useMemo(() => {
    const set = new Set([""]);
    for (const d of decks) {
      const fp = d.folder_path || "";
      if (!fp) continue;
      const parts = fp.split("/");
      for (let i = 1; i <= parts.length; i++) {
        set.add(parts.slice(0, i).join("/"));
      }
    }
    return Array.from(set).sort();
  }, [decks]);

  const move = async () => {
    setLoading(true);
    try {
      await updateDeck(deck.id, { folder_path: dest });
      onMoved(deck.id, dest);
      onClose();
    } catch (err) {
      alert("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "var(--bg-elev)", border: "1px solid var(--border)",
        borderRadius: 18, padding: "28px", width: 360,
        boxShadow: "var(--shadow-lg)", animation: "stagger-up .3s var(--ease-out) both",
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 20, marginBottom: 16 }}>
          Mover "{deck.title}"
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 260, overflowY: "auto", marginBottom: 18 }}>
          {allFolders.map(f => (
            <button key={f} onClick={() => setDest(f)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 9, border: "1px solid",
              borderColor: dest === f ? "var(--accent)" : "var(--border)",
              background: dest === f ? "var(--accent-soft)" : "var(--surface)",
              color: dest === f ? "var(--accent)" : "var(--text-soft)",
              cursor: "pointer", textAlign: "left", fontSize: 13,
              transition: "all .15s",
            }}>
              <span>{f === "" ? "🏠" : "📁"}</span>
              <span>{f === "" ? "Raiz" : f}</span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Cancelar</button>
          <button className="btn primary" style={{ flex: 1, justifyContent: "center" }} onClick={move} disabled={loading}>
            {loading ? "Movendo…" : "Mover aqui"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Componente: Card de pasta ─────────────────────────────────────────────
const FolderCard = ({ name, path, deckCount, onClick }) => (
  <button className="folder-card" onClick={onClick}>
    <div className="folder-icon">📁</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 500, fontSize: 14, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ fontSize: 11.5, color: "var(--text-mute)", marginTop: 2, fontFamily: "var(--mono)" }}>
        {deckCount} deck{deckCount !== 1 ? "s" : ""}
      </div>
    </div>
    <Icon name="chevron" size={14} style={{ color: "var(--text-faint)", flexShrink: 0 }}/>
  </button>
);

// ── Componente: Breadcrumb de pastas ──────────────────────────────────────
const FolderBreadcrumb = ({ path, onNavigate }) => {
  const parts = buildBreadcrumb(path);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", minHeight: 28 }}>
      <button className="breadcrumb-item" onClick={() => onNavigate("")}>
        <Icon name="layers" size={13}/> Todos os decks
      </button>
      {parts.map((part, i) => {
        const partPath = parts.slice(0, i + 1).join("/");
        const isLast = i === parts.length - 1;
        return (
          <React.Fragment key={partPath}>
            <span style={{ color: "var(--text-faint)", fontSize: 13 }}>/</span>
            <button
              className={`breadcrumb-item ${isLast ? "active" : ""}`}
              onClick={() => !isLast && onNavigate(partPath)}
              style={{ cursor: isLast ? "default" : "pointer" }}
            >
              {part}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ── DecksScreen principal ─────────────────────────────────────────────────
const DecksScreen = ({ onStudy, onEdit }) => {
  const [view, setView]         = React.useState("grid");
  const [tab, setTab]           = React.useState("todos");
  const [decks, setDecks]       = React.useState([]);
  const [stats, setStats]       = React.useState({});
  const [loading, setLoading]   = React.useState(true);
  const [currentPath, setCurrentPath] = React.useState("");
  const [showNewDeck, setShowNewDeck] = React.useState(false);
  const [showNewFolder, setShowNewFolder] = React.useState(false);
  const [movingDeck, setMovingDeck] = React.useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchDecksSimple();
      setDecks(data);
      const entries = await Promise.all(
        data.map(d => fetchDeckStats(d.id).then(s => [d.id, s]).catch(() => [d.id, { total:0, due:0, newCards:0, learning:0, mastery:0 }]))
      );
      setStats(Object.fromEntries(entries));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, []);

  const subfolders = React.useMemo(() => getSubfolders(decks, currentPath), [decks, currentPath]);
  const visibleDecks = React.useMemo(() => getDecksInFolder(decks, currentPath), [decks, currentPath]);

  const totalCards = Object.values(stats).reduce((a, s) => a + (s.total || 0), 0);
  const totalDue   = Object.values(stats).reduce((a, s) => a + (s.due  || 0), 0);

  const handleDeckCreated = (deck) => {
    setDecks(d => [deck, ...d]);
    setStats(s => ({ ...s, [deck.id]: { total:0, due:0, newCards:0, learning:0, mastery:0 } }));
  };

  const handleDeckMoved = (deckId, newPath) => {
    setDecks(d => d.map(deck => deck.id === deckId ? { ...deck, folder_path: newPath } : deck));
  };

  const handleFolderCreated = (path) => {
    // Pastas são virtuais — criadas ao salvar um deck nelas.
    // Podemos criar um deck placeholder vazio ou apenas navegar para lá.
    // Por ora navegamos para a pasta criada para o usuário criar decks nela.
    setCurrentPath(path);
  };

  const folderLabel = currentPath ? currentPath.split("/").pop() : "Todos os decks";
  const inRoot = currentPath === "";

  return (
    <div className="screen">
      {showNewDeck && (
        <NewDeckModal
          onClose={() => setShowNewDeck(false)}
          onCreated={handleDeckCreated}
          initialFolder={currentPath}
        />
      )}
      {showNewFolder && (
        <NewFolderModal
          onClose={() => setShowNewFolder(false)}
          onCreate={handleFolderCreated}
          parentPath={currentPath}
        />
      )}
      {movingDeck && (
        <MoveDeckModal
          deck={movingDeck}
          decks={decks}
          onClose={() => setMovingDeck(null)}
          onMoved={handleDeckMoved}
        />
      )}

      <div className="screen-head">
        <div>
          <h1 className="screen-title">
            {inRoot ? <>Seus <em>decks</em></> : <><em>{folderLabel}</em></>}
          </h1>
          <div style={{ marginTop: 8 }}>
            <FolderBreadcrumb path={currentPath} onNavigate={setCurrentPath} />
          </div>
          <div className="screen-sub" style={{ marginTop: 6 }}>
            {loading ? "Carregando…" : `${decks.length} deck${decks.length !== 1 ? "s" : ""} · ${totalCards} cards · ${totalDue} due hoje`}
          </div>
        </div>
        <div style={{display:"flex", gap:10, flexWrap:"wrap", justifyContent:"flex-end"}}>
          <button className="btn" onClick={() => setShowNewFolder(true)}>
            <span style={{fontSize:14}}>📁</span> Nova pasta
          </button>
          <button className="btn"><Icon name="upload" size={14}/> Importar</button>
          <button className="btn violet"><Icon name="sparkle" size={14}/> Deck com IA</button>
          <button className="btn primary" onClick={() => setShowNewDeck(true)}>
            <Icon name="plus" size={14}/> Novo deck
          </button>
        </div>
      </div>

      <div className="tabs">
        {["todos","em estudo","dominados","pausados","arquivados"].map(t => (
          <button key={t} className={tab===t?"active":""} onClick={() => setTab(t)}>{t}</button>
        ))}
        <div style={{marginLeft:"auto", display:"flex", gap:8, alignItems:"center"}}>
          <div className="search" style={{width:200, margin:0}}>
            <Icon name="search" size={13}/>
            <span>Filtrar…</span>
          </div>
          <div className="segmented">
            <button className={view==="grid"?"active":""} onClick={() => setView("grid")}>Grade</button>
            <button className={view==="list"?"active":""} onClick={() => setView("list")}>Lista</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-mute)", fontSize: 14 }}>
          Carregando seus decks…
        </div>
      ) : (subfolders.length === 0 && visibleDecks.length === 0) ? (
        <EmptyFolderState currentPath={currentPath} onNewDeck={() => setShowNewDeck(true)} onNewFolder={() => setShowNewFolder(true)} />
      ) : (
        <>
          {subfolders.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text-mute)", marginBottom: 12 }}>
                Pastas
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {subfolders.map(name => {
                  const folderPath = currentPath ? `${currentPath}/${name}` : name;
                  return (
                    <FolderCard
                      key={folderPath}
                      name={name}
                      path={folderPath}
                      deckCount={countDecksInFolder(decks, folderPath)}
                      onClick={() => setCurrentPath(folderPath)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {visibleDecks.length > 0 && (
            <>
              {subfolders.length > 0 && (
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text-mute)", marginBottom: 12 }}>
                  Decks nesta pasta
                </div>
              )}
              {view === "grid" ? (
                <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:18}} className="stagger">
                  {visibleDecks.map(d => (
                    <DeckCardLarge
                      key={d.id} deck={d} deckStats={stats[d.id]}
                      onStudy={() => onStudy(d.id)} onEdit={() => onEdit(d.id)}
                      onRefresh={load} onMove={() => setMovingDeck(d)}
                    />
                  ))}
                </div>
              ) : (
                <DeckListView decks={visibleDecks} stats={stats} onStudy={onStudy} onMove={setMovingDeck}/>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

// ── Empty state ───────────────────────────────────────────────────────────
const EmptyFolderState = ({ currentPath, onNewDeck, onNewFolder }) => (
  <div style={{
    textAlign: "center", padding: "60px 24px",
    background: "var(--bg-elev)", borderRadius: 16,
    border: "1px dashed var(--border)",
  }}>
    <div style={{ fontSize: 40, marginBottom: 16 }}>{currentPath ? "📂" : "🗂️"}</div>
    <div style={{ fontFamily: "var(--serif)", fontSize: 22, marginBottom: 8 }}>
      {currentPath ? "Pasta vazia" : "Nenhum deck ainda"}
    </div>
    <div style={{ color: "var(--text-mute)", marginBottom: 20 }}>
      {currentPath
        ? "Crie decks ou subpastas para organizar seus estudos"
        : "Crie seu primeiro deck ou pasta para começar a estudar"}
    </div>
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      <button className="btn" onClick={onNewFolder}>
        <span style={{fontSize:14}}>📁</span> Nova pasta
      </button>
      <button className="btn primary" onClick={onNewDeck}>
        <Icon name="plus" size={14}/> Criar deck
      </button>
    </div>
  </div>
);

// ── DeckCardLarge ─────────────────────────────────────────────────────────
const DeckCardLarge = ({ deck, deckStats, onStudy, onEdit, onRefresh, onMove }) => {
  const s = deckStats || { total:0, due:0, newCards:0, learning:0, mastery:0 };
  const [deleting, setDeleting] = React.useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm(`Excluir o deck "${deck.title}"? Todos os cards serão removidos.`)) return;
    setDeleting(true);
    try {
      await deleteDeck(deck.id);
      onRefresh();
    } catch (err) {
      alert("Erro ao excluir: " + err.message);
      setDeleting(false);
    }
  };

  return (
    <div className={`deck-card deck-color-${deck.color}`} style={{padding: "22px 22px 20px"}}>
      <div className="deck-tag">{deck.category || "Sem categoria"}</div>
      <h3 style={{fontSize: 26, marginTop: 10}}>{deck.title} {deck.description && <em>{deck.description}</em>}</h3>
      <div className="deck-meta" style={{marginTop:4}}>{s.total} cards</div>

      <div style={{display:"flex", gap:14, marginTop:18, marginBottom:14}}>
        <DeckMini lbl="Novos"      val={s.newCards}  color="var(--violet)" />
        <DeckMini lbl="Aprendendo" val={s.learning}  color="var(--amber)" />
        <DeckMini lbl="Revisão"    val={s.due}       color="var(--accent)" />
      </div>

      <div className="deck-progress-row">
        <div className="deck-progress"><i style={{width:`${s.mastery}%`}}/></div>
        <span className="deck-pct">{s.mastery}%</span>
      </div>

      <div style={{display:"flex", gap:8, marginTop:14}}>
        <button className="btn" style={{flex:1, justifyContent:"center"}} onClick={onEdit}>
          <Icon name="plus" size={12}/> Adicionar cards
        </button>
        <button className="btn primary" style={{flex:1, justifyContent:"center"}} onClick={onStudy} disabled={s.total === 0}>
          <Icon name="play" size={12}/> Estudar {s.due > 0 && <span style={{opacity:.7}}>({s.due})</span>}
        </button>
        <button className="btn icon-btn" style={{width:34, height:34, padding:0, justifyContent:"center"}} onClick={(e) => { e.stopPropagation(); onMove(); }} title="Mover deck">
          <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
        <button className="btn icon-btn" style={{width:34, height:34, padding:0, justifyContent:"center"}} onClick={handleDelete} disabled={deleting} title="Excluir deck">
          <Icon name="trash" size={13}/>
        </button>
      </div>
    </div>
  );
};

const DeckMini = ({ lbl, val, color }) => (
  <div style={{flex:1}}>
    <div style={{fontFamily:"var(--mono)", fontSize:11, color:"var(--text-mute)", letterSpacing:".06em", textTransform:"uppercase"}}>{lbl}</div>
    <div style={{fontFamily:"var(--serif)", fontSize:24, lineHeight:1, marginTop:4, color}}>{val ?? 0}</div>
  </div>
);

// ── DeckListView ──────────────────────────────────────────────────────────
const DeckListView = ({ decks, stats, onStudy, onMove }) => (
  <div className="panel" style={{padding:0, overflow:"hidden"}}>
    <table style={{width:"100%", borderCollapse:"collapse"}}>
      <thead>
        <tr style={{textAlign:"left", fontSize:11, color:"var(--text-mute)", letterSpacing:".06em", textTransform:"uppercase", borderBottom:"1px solid var(--border)"}}>
          <th style={{padding:"14px 22px"}}>Deck</th>
          <th>Cards</th>
          <th>Due</th>
          <th>Maestria</th>
          <th style={{textAlign:"right", paddingRight:22}}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {decks.map(d => {
          const s = stats[d.id] || { total:0, due:0, mastery:0 };
          return (
            <tr key={d.id} style={{borderBottom:"1px solid var(--border)", fontSize:13.5}}>
              <td style={{padding:"14px 22px"}}>
                <div style={{display:"flex", alignItems:"center", gap:12}}>
                  <span style={{width:8, height:38, borderRadius:3}} className={`deck-color-${d.color}`}/>
                  <div>
                    <div style={{fontWeight:500}}>{d.title} {d.description && <em style={{fontFamily:"var(--serif)", color:"var(--text-soft)"}}>{d.description}</em>}</div>
                    <div style={{fontSize:11.5, color:"var(--text-mute)"}}>{d.category || "Sem categoria"}</div>
                  </div>
                </div>
              </td>
              <td style={{fontFamily:"var(--mono)"}}>{s.total}</td>
              <td>{s.due > 0 ? <span style={{color:"var(--accent)", fontFamily:"var(--mono)"}}>{s.due}</span> : <span style={{color:"var(--text-mute)", fontFamily:"var(--mono)"}}>—</span>}</td>
              <td>
                <div style={{display:"flex", alignItems:"center", gap:8, width:140}}>
                  <div className="deck-progress" style={{flex:1}}><i style={{width:`${s.mastery}%`, background:"var(--accent)"}}/></div>
                  <span style={{fontFamily:"var(--mono)", fontSize:11, color:"var(--text-soft)"}}>{s.mastery}%</span>
                </div>
              </td>
              <td style={{textAlign:"right", paddingRight:22}}>
                <div style={{display:"flex", gap:6, justifyContent:"flex-end"}}>
                  {onMove && (
                    <button className="btn ghost" onClick={() => onMove(d)} title="Mover">
                      <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  )}
                  <button className="btn ghost" onClick={() => onStudy(d.id)} disabled={s.total === 0}>
                    <Icon name="play" size={12}/> Estudar
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

Object.assign(window, { DecksScreen, DeckCardLarge, DeckListView, DeckMini });
