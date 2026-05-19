// =========================================================================
// MAIN APP — auth + routing + layout
// =========================================================================

// Apply saved theme immediately to avoid flash on load
(function() {
  const t = localStorage.getItem("danki-theme");
  if (t === "light") document.documentElement.classList.add("theme-light");
})();

const SCREEN_CRUMBS = {
  dashboard: "Dashboard",
  decks: "Decks",
  study: "Sessão de estudo",
  "ai-create": "Criar com IA",
  editor: "Editor manual",
  chat: "Conversar com IA",
  library: "Biblioteca",
  stats: "Estatísticas",
  inbox: "Caixa de revisão",
  profile: "Perfil",
  "quick-study": "Estudo Rápido",
};

function App() {
  const [user, setUser]     = React.useState(undefined); // undefined = carregando
  const [screen, setScreen] = React.useState("dashboard");
  const [authMode, setAuthMode] = React.useState("login"); // "login" | "signup"
  const [showAuth, setShowAuth] = React.useState(false);
  const [studyDeckId, setStudyDeckId] = React.useState(null);
  const [editorDeckId, setEditorDeckId] = React.useState(null);
  const [appStats, setAppStats] = React.useState({ streak: 0, deckCount: 0, totalDue: 0 });
  const [theme, setTheme] = React.useState(() => localStorage.getItem("danki-theme") || "dark");
  const [quickStudyCards, setQuickStudyCards] = React.useState(null);
  const [quickStudyLabel, setQuickStudyLabel] = React.useState("");

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("danki-theme", next);
      document.documentElement.classList.toggle("theme-light", next === "light");
      return next;
    });
  };

  // Verifica sessão ao iniciar e escuta mudanças de auth
  React.useEffect(() => {
    getSession().then(u => setUser(u));
    const sub = onAuthChange(u => setUser(u));
    return () => sub.unsubscribe();
  }, []);

  // Tela de carregamento inicial
  if (user === undefined) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "var(--bg)",
        flexDirection: "column", gap: 16,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: "var(--accent)", color: "#000",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--serif)", fontSize: 26, fontStyle: "italic",
          animation: "fade-in .6s ease both",
        }}>d</div>
        <div style={{ color: "var(--text-mute)", fontSize: 13 }}>Carregando…</div>
      </div>
    );
  }

  // Não autenticado → landing page ou tela de auth
  if (!user) {
    if (showAuth) {
      return <AuthScreen onAuth={(u) => { setUser(u); setShowAuth(false); }} initialMode={authMode} onBack={() => setShowAuth(false)} />;
    }
    return (
      <LandingScreen onGoAuth={(mode) => { setAuthMode(mode); setShowAuth(true); }} />
    );
  }

  // Autenticado → app principal
  const safeScreen = ["dashboard","decks","study","ai-create","editor","chat","library","stats","profile","quick-study"].includes(screen)
    ? screen : "dashboard";

  const goStudy = (deckId) => {
    setStudyDeckId(deckId || null);
    setScreen("study");
  };

  const goEditor = (deckId) => {
    setEditorDeckId(deckId || null);
    setScreen("editor");
  };

  const goQuickStudy = (cards, label) => {
    setQuickStudyCards(cards);
    setQuickStudyLabel(label);
    setScreen("study");
  };

  const Content = (() => {
    switch (safeScreen) {
      case "dashboard": return <DashboardScreen onNav={setScreen} user={user} onStatsLoaded={setAppStats}/>;
      case "decks":     return <DecksScreen onStudy={goStudy} onEdit={goEditor}/>;
      case "study":     return <StudyScreen deckId={studyDeckId} onExit={() => { setQuickStudyCards(null); setScreen("decks"); }} onNav={setScreen} preloadedCards={quickStudyCards} quickStudyLabel={quickStudyLabel}/>;
      case "ai-create": return <AICreateScreen onSave={() => setScreen("decks")}/>;
      case "editor":    return <EditorScreen initialDeckId={editorDeckId} onBack={() => setScreen("decks")}/>;
      case "chat":      return <AIChatScreen/>;
      case "library":   return <LibraryScreen onNav={setScreen}/>;
      case "stats":     return <StatsScreen/>;
      case "profile":   return <ProfileScreen user={user} onSignOut={() => signOut()} onNav={setScreen} stats={appStats} theme={theme} onThemeToggle={toggleTheme}/>;
      case "quick-study": return <QuickStudyScreen onStart={goQuickStudy} onBack={() => setScreen("dashboard")}/>;
      default:          return <DashboardScreen onNav={setScreen} user={user} onStatsLoaded={setAppStats}/>;
    }
  })();

  return (
    <div className="app" data-screen-label={SCREEN_CRUMBS[screen]}>
      <Sidebar current={screen} onNav={setScreen} user={user} onSignOut={() => signOut()} stats={appStats}/>
      <div className="main">
        <Topbar crumb={SCREEN_CRUMBS[screen] || "—"} streak={appStats.streak} theme={theme} onThemeToggle={toggleTheme}/>
        <div key={safeScreen} className="screen-wrap" style={{animation: "stagger-up .4s var(--ease-out) both"}}>
          {Content}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
