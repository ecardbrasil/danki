// =========================================================================
// SCREEN: QUICK STUDY — escolher decks e qtd de cards para sessão rápida
// =========================================================================

const DECK_COLORS = [
  "var(--accent)",
  "var(--violet)",
  "#f59e0b",
  "#ef4444",
  "#10b981",
  "#3b82f6",
  "#ec4899",
  "#8b5cf6",
];

const LIMIT_OPTIONS = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "Todos", value: Infinity },
];

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QuickStudyScreen = ({ onStart, onBack }) => {
  const [decks, setDecks]         = React.useState([]);
  const [dueCounts, setDueCounts] = React.useState({});
  const [selected, setSelected]   = React.useState(new Set());
  const [limit, setLimit]         = React.useState(20);
  const [loading, setLoading]     = React.useState(true);
  const [starting, setStarting]   = React.useState(false);
  const [error, setError]         = React.useState(null);

  // Carrega decks e contagem de cards devidos de cada um
  React.useEffect(() => {
    (async () => {
      try {
        const allDecks = await fetchDecksSimple();
        setDecks(allDecks);

        const now = new Date().toISOString();
        const counts = {};
        await Promise.all(allDecks.map(async (d) => {
          try {
            const cards = await fetchDueCards(d.id, 500);
            counts[d.id] = cards.length;
          } catch (_) {
            counts[d.id] = 0;
          }
        }));
        setDueCounts(counts);

        // Pré-selecionar todos os decks que têm cards devidos
        const withDue = new Set(allDecks.filter(d => (counts[d.id] || 0) > 0).map(d => d.id));
        setSelected(withDue.size > 0 ? withDue : new Set(allDecks.map(d => d.id)));
      } catch (err) {
        setError("Erro ao carregar decks.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalDue = [...selected].reduce((s, id) => s + (dueCounts[id] || 0), 0);
  const actualLimit = limit === Infinity ? totalDue : Math.min(limit, totalDue);

  const allSelected = decks.length > 0 && selected.size === decks.length;
  const noneSelected = selected.size === 0;

  const toggleDeck = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(decks.map(d => d.id)));
  };

  const handleStart = async () => {
    if (noneSelected || totalDue === 0) return;
    setStarting(true);
    try {
      // Busca cards de cada deck selecionado em paralelo
      const results = await Promise.all(
        [...selected].map(id => fetchDueCards(id, 500).catch(() => []))
      );
      let allCards = results.flat();
      allCards = shuffle(allCards);
      if (limit !== Infinity) allCards = allCards.slice(0, limit);

      const deckNames = decks.filter(d => selected.has(d.id)).map(d => d.title);
      const label = selected.size === decks.length
        ? `Estudo Rápido · todos os decks`
        : selected.size === 1
          ? `Estudo Rápido · ${deckNames[0]}`
          : `Estudo Rápido · ${selected.size} decks`;

      onStart(allCards, label);
    } catch (err) {
      setError("Erro ao carregar cards. Tente novamente.");
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, color: "var(--text-mute)", gap: 10 }}>
        <Icon name="refresh" size={16} style={{ animation: "spin 1s linear infinite" }} />
        Carregando decks…
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 16 }}>
        <Icon name="layers" size={32} style={{ color: "var(--text-mute)" }} />
        <div style={{ color: "var(--text-mute)", fontSize: 15 }}>Nenhum deck encontrado.</div>
        <button className="btn" onClick={onBack}>Voltar</button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 640,
      margin: "0 auto",
      padding: "var(--space-6) var(--space-4)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)",
    }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.2 }}>
          Estudo Rápido
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-mute)", margin: "6px 0 0" }}>
          Escolha os decks e quantos cards revisar nesta sessão.
        </p>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: "var(--radius)", padding: "10px 14px", fontSize: 13, color: "#ef4444" }}>
          {error}
        </div>
      )}

      {/* Seção decks */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}>
        {/* Header da seção */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px",
          borderBottom: "1px solid var(--border)",
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-mute)", textTransform: "uppercase", letterSpacing: ".07em" }}>
            Decks ({selected.size}/{decks.length} selecionados)
          </span>
          <button
            onClick={toggleAll}
            style={{
              fontSize: 12, fontWeight: 600,
              color: allSelected ? "var(--text-mute)" : "var(--accent)",
              background: "none", border: "none", cursor: "pointer", padding: "2px 0",
            }}
          >
            {allSelected ? "Desselecionar todos" : "Selecionar todos"}
          </button>
        </div>

        {/* Lista de decks */}
        {decks.map((deck, i) => {
          const isSelected = selected.has(deck.id);
          const due = dueCounts[deck.id] || 0;
          const color = DECK_COLORS[deck.color % DECK_COLORS.length] || DECK_COLORS[0];

          return (
            <button
              key={deck.id}
              onClick={() => toggleDeck(deck.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                width: "100%", padding: "12px 16px",
                background: isSelected ? "rgba(var(--accent-rgb, 16,185,129), .05)" : "none",
                border: "none",
                borderBottom: i < decks.length - 1 ? "1px solid var(--border)" : "none",
                cursor: "pointer",
                textAlign: "left",
                transition: "background .15s",
              }}
            >
              {/* Checkbox visual */}
              <div style={{
                width: 18, height: 18, flexShrink: 0,
                borderRadius: 5,
                border: isSelected ? `2px solid ${color}` : "2px solid var(--border)",
                background: isSelected ? color : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .15s",
              }}>
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7"/>
                  </svg>
                )}
              </div>

              {/* Cor do deck */}
              <div style={{
                width: 6, height: 28, flexShrink: 0,
                borderRadius: 3,
                background: color,
                opacity: isSelected ? 1 : 0.35,
              }} />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: isSelected ? "var(--text)" : "var(--text-mute)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {deck.title}
                </div>
                {deck.category && (
                  <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 1 }}>{deck.category}</div>
                )}
              </div>

              {/* Badge de cards devidos */}
              {due > 0 ? (
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: isSelected ? color : "var(--surface-2, var(--border))",
                  color: isSelected ? "#000" : "var(--text-mute)",
                  borderRadius: 20, padding: "2px 8px",
                  flexShrink: 0,
                  transition: "all .15s",
                }}>
                  {due} para revisar
                </span>
              ) : (
                <span style={{
                  fontSize: 11, color: "var(--text-mute)",
                  background: "var(--surface-2, var(--border))",
                  borderRadius: 20, padding: "2px 8px",
                  flexShrink: 0,
                }}>
                  Em dia
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Seção quantidade */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "14px 16px",
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-mute)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 12 }}>
          Quantidade de cards
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {LIMIT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setLimit(opt.value)}
              style={{
                padding: "7px 16px",
                borderRadius: "var(--radius)",
                border: limit === opt.value ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
                background: limit === opt.value ? "rgba(var(--accent-rgb, 16,185,129),.1)" : "transparent",
                color: limit === opt.value ? "var(--accent)" : "var(--text-mute)",
                fontSize: 13, fontWeight: 600,
                cursor: "pointer",
                transition: "all .15s",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Resumo */}
        <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-mute)" }}>
          {noneSelected ? (
            <span style={{ color: "#ef4444" }}>Selecione ao menos um deck para continuar.</span>
          ) : totalDue === 0 ? (
            <span style={{ color: "var(--accent)" }}>Todos os cards dos decks selecionados estão em dia!</span>
          ) : (
            <>
              <span style={{ color: "var(--text)", fontWeight: 600 }}>{actualLimit}</span>
              {" "}card{actualLimit !== 1 ? "s" : ""} de{" "}
              <span style={{ color: "var(--text)", fontWeight: 600 }}>{totalDue}</span>{" "}
              disponíve{totalDue !== 1 ? "is" : "l"}
            </>
          )}
        </div>
      </div>

      {/* Botões de ação */}
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn" onClick={onBack} style={{ flex: "0 0 auto", padding: "10px 20px" }}>
          Voltar
        </button>
        <button
          onClick={handleStart}
          disabled={noneSelected || totalDue === 0 || starting}
          style={{
            flex: 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "12px 20px",
            borderRadius: "var(--radius)",
            border: "none",
            background: (noneSelected || totalDue === 0) ? "var(--border)" : "var(--accent)",
            color: (noneSelected || totalDue === 0) ? "var(--text-mute)" : "#000",
            fontSize: 14, fontWeight: 700,
            cursor: (noneSelected || totalDue === 0) ? "not-allowed" : "pointer",
            transition: "opacity .15s",
            opacity: starting ? 0.7 : 1,
          }}
        >
          {starting ? (
            <>
              <Icon name="refresh" size={15} style={{ animation: "spin 1s linear infinite" }} />
              Carregando…
            </>
          ) : (
            <>
              <Icon name="play" size={15} />
              Iniciar sessão
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
