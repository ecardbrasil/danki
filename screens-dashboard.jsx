// =========================================================================
// SCREEN: DASHBOARD
// =========================================================================
const DashboardScreen = ({ onNav, user, onStatsLoaded }) => {
  const [stats, setStats]       = React.useState(null);  // null = carregando
  const [recentDecks, setRecentDecks] = React.useState([]);
  const [activity, setActivity] = React.useState({});

  React.useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [decks, activityData] = await Promise.all([
        fetchDecksSimple(),
        fetchActivity(140),
      ]);

      // Carrega stats de cada deck
      const deckStats = await Promise.all(
        decks.map(d => fetchDeckStats(d.id).catch(() => ({ total:0, due:0, newCards:0, learning:0, mastery:0 })))
      );

      const totalDue      = deckStats.reduce((a, s) => a + (s.due || 0), 0);
      const totalCards    = deckStats.reduce((a, s) => a + (s.total || 0), 0);
      const totalStudied  = Object.values(activityData).reduce((a, v) => a + v, 0);

      // Streak: conta dias consecutivos com atividade até hoje
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        if (activityData[key]) streak++;
        else if (i > 0) break;
      }

      setStats({ totalDue, totalCards, totalStudied, streak, deckCount: decks.length });
      setRecentDecks(decks.slice(0, 2).map((d, i) => ({ ...d, s: deckStats[i] })));
      setActivity(activityData);
      if (onStatsLoaded) onStatsLoaded({ streak, deckCount: decks.length, totalDue });
    } catch (err) {
      console.error(err);
      setStats({ totalDue: 0, totalCards: 0, totalStudied: 0, streak: 0, deckCount: 0 });
    }
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "você";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const dateStr = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const dateCapitalized = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  const isNew = stats && stats.totalCards === 0;
  const loading = stats === null;

  // Monta células do heatmap a partir da atividade real
  const heatCells = React.useMemo(() => {
    const cells = [];
    const today = new Date();
    for (let i = 139; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = activity[key] || 0;
      let cls = "";
      if (count > 0 && count < 5)  cls = "l1";
      else if (count < 15) cls = "l2";
      else if (count < 30) cls = "l3";
      else if (count >= 30) cls = "l4";
      cells.push(cls);
    }
    return cells;
  }, [activity]);

  return (
    <div className="screen">
      {/* HERO */}
      <div className="hero">
        <Particles />
        <div className="hero-content">
          <div className="hero-greeting">{greeting}, {displayName} · {dateCapitalized}</div>

          {loading ? (
            <h1 className="hero-title">Carregando seus dados…</h1>
          ) : isNew ? (
            <>
              <h1 className="hero-title">
                Bem-vindo ao <em>Danki</em>. Vamos começar?
              </h1>
              <p className="hero-sub">
                Crie seu primeiro deck ou use a IA para gerar cards automaticamente a partir de qualquer texto ou PDF.
              </p>
            </>
          ) : (
            <>
              <h1 className="hero-title">
                {stats.totalDue > 0
                  ? <>Você tem <em>{stats.totalDue} {stats.totalDue === 1 ? "card" : "cards"}</em> esperando revisão hoje.</>
                  : <>Tudo em dia! <em>Nenhum card</em> para revisar agora.</>
                }
              </h1>
              <p className="hero-sub">
                {stats.streak > 1
                  ? `Você está em uma sequência de ${stats.streak} dias. Continue assim para manter sua retenção alta.`
                  : "A IA prioriza os cards com maior risco de esquecimento para você."}
              </p>
            </>
          )}

          <div className="hero-cta-row">
            {!isNew && (
              <button className="btn primary" onClick={() => onNav("study")} disabled={loading || stats?.totalDue === 0}>
                <Icon name="play" size={14} /> Começar revisão
              </button>
            )}
            <button className="btn violet" onClick={() => onNav("ai-create")}>
              <Icon name="sparkle" size={14} /> Gerar cards com IA
            </button>
            {isNew && (
              <button className="btn primary" onClick={() => onNav("decks")}>
                <Icon name="plus" size={14} /> Criar primeiro deck
              </button>
            )}
            {!isNew && <span className="kbd" style={{marginLeft:6}}>Pressione <span style={{margin:"0 4px",color:"var(--text)"}}>S</span> para estudar</span>}
          </div>

          {!loading && !isNew && (
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">{stats.totalDue}<em>cards</em></div>
                <div className="hero-stat-lbl">Para hoje</div>
              </div>
              <div>
                <div className="hero-stat-num">{stats.streak}<em>dias</em></div>
                <div className="hero-stat-lbl">Streak atual</div>
              </div>
              <div>
                <div className="hero-stat-num">{stats.deckCount}</div>
                <div className="hero-stat-lbl">Decks ativos</div>
              </div>
              <div>
                <div className="hero-stat-num">{stats.totalStudied > 999 ? (stats.totalStudied/1000).toFixed(1)+"k" : stats.totalStudied}</div>
                <div className="hero-stat-lbl">Cards estudados</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EMPTY STATE */}
      {!loading && isNew ? (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "48px 24px", gap: 32,
        }}>
          <div className="grid-3 stagger" style={{width:"100%"}}>
            <OnboardCard
              icon="sparkle" color="violet"
              title="Gerar com IA"
              desc="Cole um texto ou PDF e a IA cria os cards automaticamente."
              action="Criar com IA" onClick={() => onNav("ai-create")}
            />
            <OnboardCard
              icon="plus" color="accent"
              title="Criar deck manualmente"
              desc="Comece do zero e adicione seus próprios flashcards."
              action="Novo deck" onClick={() => onNav("decks")}
            />
            <OnboardCard
              icon="chat" color="green"
              title="Conversar com a IA"
              desc="Tire dúvidas, peça resumos e gere conteúdo de estudo."
              action="Abrir chat" onClick={() => onNav("chat")}
            />
          </div>
        </div>
      ) : (
        <>
          {/* STAT ROW */}
          {!loading && (
            <div className="grid-3 stagger" style={{marginBottom: 22}}>
              <div className="stat">
                <div className="stat-label">Hoje</div>
                <div className="stat-value">{stats.totalDue} <span style={{fontSize:18, color:"var(--text-mute)", fontFamily:"var(--sans)"}}>cards</span></div>
                <div className="stat-delta">{stats.totalDue > 0 ? "Revisões pendentes" : "Tudo revisado!"}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Total de cards</div>
                <div className="stat-value">{stats.totalCards}</div>
                <div className="stat-delta">em {stats.deckCount} deck{stats.deckCount !== 1 ? "s" : ""}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Sequência</div>
                <div className="stat-value">{stats.streak}<span style={{fontSize:18, color:"var(--text-mute)", fontFamily:"var(--sans)"}}>dias</span></div>
                <div className="stat-delta">{stats.streak > 0 ? "Continue assim!" : "Estude hoje para começar"}</div>
              </div>
            </div>
          )}

          {/* SECONDARY GRID */}
          <div className="grid-12">
            <div className="col-8">
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title"><span className="dot"/>Continuar onde parou</div>
                </div>

                {recentDecks.length === 0 ? (
                  <div style={{ color: "var(--text-mute)", fontSize: 13, padding: "12px 0" }}>
                    Nenhum deck ainda.
                  </div>
                ) : (
                  <div className="grid-2 stagger">
                    {recentDecks.map(d => (
                      <div key={d.id} className={`deck-card deck-color-${d.color || 1}`}>
                        <div className="deck-tag">{d.category || "Sem categoria"}</div>
                        <h3>{d.title} {d.description && <em>{d.description}</em>}</h3>
                        <div className="deck-meta">{d.s?.total || 0} cards</div>
                        <div className="deck-progress-row">
                          <div className="deck-progress"><i style={{width:`${d.s?.mastery || 0}%`}}/></div>
                          <span className="deck-pct">{d.s?.mastery || 0}%</span>
                        </div>
                        {d.s?.due > 0 && <div className="deck-due"><strong>{d.s.due}</strong> due</div>}
                      </div>
                    ))}
                  </div>
                )}

                <div className="panel-head" style={{marginTop: 26, marginBottom: 8}}>
                  <div className="panel-title" style={{fontSize: 13, color:"var(--text-soft)"}}>
                    Atividade · últimos 140 dias
                  </div>
                </div>
                <div className="heatmap">
                  {heatCells.map((cls, i) => (
                    <div key={i} className={`heat ${cls}`} />
                  ))}
                </div>
                <div className="heatmap-legend">
                  <span>menos</span>
                  <i style={{background:"var(--surface-2)"}}/>
                  <i style={{background:"oklch(0.84 0.16 142 / 0.18)"}}/>
                  <i style={{background:"oklch(0.84 0.16 142 / 0.36)"}}/>
                  <i style={{background:"oklch(0.84 0.16 142 / 0.6)"}}/>
                  <i style={{background:"var(--accent)"}}/>
                  <span>mais</span>
                </div>
              </div>
            </div>

            <div className="col-4" style={{display:"flex", flexDirection:"column", gap: 18}}>
              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title">
                    <Icon name="sparkle" size={14} style={{color:"var(--violet)", marginRight:6, verticalAlign:"-2px"}} />
                    Acesso rápido
                  </div>
                </div>
                <div className="stagger" style={{display:"flex", flexDirection:"column", gap:10}}>
                  <div className="activity-row" style={{padding:"6px 0", cursor:"pointer"}} onClick={() => onNav("ai-create")}>
                    <div className="ic violet"><Icon name="sparkle" size={14}/></div>
                    <div className="label">
                      Gerar cards com IA
                      <small>Crie flashcards a partir de qualquer texto</small>
                    </div>
                  </div>
                  <div className="activity-row" style={{padding:"6px 0", cursor:"pointer"}} onClick={() => onNav("decks")}>
                    <div className="ic green"><Icon name="plus" size={14}/></div>
                    <div className="label">
                      Novo deck
                      <small>Organize seus cards por tema ou matéria</small>
                    </div>
                  </div>
                  <div className="activity-row" style={{padding:"6px 0", cursor:"pointer"}} onClick={() => onNav("chat")}>
                    <div className="ic violet"><Icon name="chat" size={14}/></div>
                    <div className="label">
                      Conversar com a IA
                      <small>Tire dúvidas e explore conteúdo com a IA</small>
                    </div>
                  </div>
                </div>
                <button className="btn" style={{width:"100%", justifyContent:"center", marginTop:14}} onClick={() => onNav("decks")}>
                  Ver todos os decks <Icon name="chevron" size={12}/>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const OnboardCard = ({ icon, color, title, desc, action, onClick }) => {
  const bgMap = { violet: "var(--violet-soft)", accent: "var(--accent-soft)", green: "var(--accent-soft)" };
  const fgMap = { violet: "var(--violet)", accent: "var(--accent)", green: "var(--accent)" };
  return (
  <div className="panel" style={{ display:"flex", flexDirection:"column", gap:12, padding: "24px 22px" }}>
    <div style={{ width:38, height:38, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", background: bgMap[color] || "var(--surface-2)", color: fgMap[color] || "var(--text)" }}>
      <Icon name={icon} size={18}/>
    </div>
    <div style={{ fontFamily:"var(--serif)", fontSize:18 }}>{title}</div>
    <div style={{ fontSize:13, color:"var(--text-mute)", lineHeight:1.5, flex:1 }}>{desc}</div>
    <button className={`btn ${color === "accent" ? "primary" : color === "violet" ? "violet" : ""}`} style={{ justifyContent:"center" }} onClick={onClick}>
      {action}
    </button>
  </div>
  );
};

Object.assign(window, { DashboardScreen });
