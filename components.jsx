// Icons – minimal stroke set inline so we don't pull a library
const Icon = ({ name, size = 16, ...rest }) => {
  const paths = {
    sparkle: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.8 2.8M15.7 15.7l2.8 2.8M5.5 18.5l2.8-2.8M15.7 8.3l2.8-2.8"/><circle cx="12" cy="12" r="2"/></>,
    home: <><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></>,
    layers: <><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 18l9 5 9-5"/></>,
    play: <><path d="M6 4l14 8-14 8V4z"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4z"/></>,
    chat: <><path d="M21 12a8 8 0 11-3.5-6.6L21 4l-1 3.5A8 8 0 0121 12z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    flame: <><path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-3 3-3 5 0-2-2-3-2-5-2 2-6 5-6 9 0 4 3 5 7 5z"/></>,
    chevron: <><path d="M9 18l6-6-6-6"/></>,
    moon: <><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3h.1a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8v.1a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></>,
    book: <><path d="M4 19.5V5a2 2 0 012-2h14v17H6a2 2 0 010-3h14"/></>,
    trending: <><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></>,
    bolt: <><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check: <><path d="M5 12l5 5L20 7"/></>,
    refresh: <><path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/><path d="M3 21v-5h5"/></>,
    library: <><path d="M3 3v18M8 3v18M13 3l8 16-2 1L11 5l2-2z"/></>,
    inbox: <><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13L22 12v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7l3.5-7z"/></>,
    send: <><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></>,
    stack: <><path d="M3 7h18M3 12h18M3 17h18"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></>,
    cards: <><rect x="3" y="7" width="13" height="14" rx="2"/><rect x="8" y="3" width="13" height="14" rx="2"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></>,
    audio: <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
    code: <><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></>,
    upload: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></>,
    link: <><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/></>,
    trash: <><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></>,
    volume: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 010 7M19 5a10 10 0 010 14"/></>,
    "volume-x": <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></>,
    maximize: <><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></>,
    minimize: <><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></>,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {paths[name]}
    </svg>
  );
};

// === Brand mark ===
const BrandMark = () => (
  <div className="brand">
    <div className="brand-mark">d</div>
    <div className="brand-name">Danki<em>ai</em></div>
  </div>
);

// === Sidebar ===
const buildNav = (stats) => [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "decks", label: "Decks", icon: "layers", badge: stats.deckCount > 0 ? String(stats.deckCount) : null },
  { id: "study", label: "Estudar agora", icon: "play", live: true, badge: stats.totalDue > 0 ? String(stats.totalDue) : null },
  { id: "quick-study", label: "Estudo Rápido", icon: "bolt" },
  { id: "ai-create", label: "Criar com IA", icon: "sparkle" },
  { id: "editor", label: "Editor manual", icon: "edit" },
  { id: "chat", label: "Conversar com IA", icon: "chat" },
];

const NAV_SECONDARY = [
  { id: "library", label: "Biblioteca", icon: "library" },
  { id: "stats", label: "Estatísticas", icon: "trending" },
  { id: "inbox", label: "Caixa de revisão", icon: "inbox" },
];

const Sidebar = ({ current, onNav, user, onSignOut, stats = {} }) => {
  const nav = buildNav(stats);
  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Usuário";
  const initials = displayName.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <aside className="sidebar">
      <BrandMark />
      <div className="nav-group">
        <div className="nav-label">Geral</div>
        {nav.map(it => (
          <button key={it.id}
                  className={`nav-item ${current === it.id ? "active" : ""}`}
                  onClick={() => onNav(it.id)}>
            <Icon name={it.icon} />
            <span>{it.label}</span>
            {it.badge && <span className={`badge ${it.live ? "live" : ""}`}>{it.badge}</span>}
          </button>
        ))}
      </div>
      <div className="nav-group">
        <div className="nav-label">Coleção</div>
        {NAV_SECONDARY.map(it => (
          <button key={it.id}
                  className={`nav-item ${current === it.id ? "active" : ""}`}
                  onClick={() => onNav(it.id)}>
            <Icon name={it.icon} />
            <span>{it.label}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-foot">
        <div className="avatar" onClick={() => onNav("profile")} title="Ver perfil" style={{ cursor: "pointer" }}>{initials}</div>
        <div className="user-meta" onClick={() => onNav("profile")} style={{ cursor: "pointer", flex: 1 }}>
          <span className="user-name">{displayName}</span>
          <span className="user-plan">{user?.email || ""}</span>
        </div>
        <button className="icon-btn" title="Configurações / Perfil" onClick={() => onNav("profile")}>
          <Icon name="settings" size={14} />
        </button>
      </div>
    </aside>
  );
};

// === Topbar ===
const Topbar = ({ crumb, streak = 0, theme = "dark", onThemeToggle }) => (
  <div className="topbar">
    <div className="crumbs">
      <span>Danki</span>
      <span className="sep">/</span>
      <strong>{crumb}</strong>
    </div>
    <div className="streak-pill">
      <Icon name="flame" size={14} className="flame" />
      <span>Streak</span>
      <span className="count">{streak}d</span>
    </div>
    <div className="search">
      <Icon name="search" size={14} />
      <span>Buscar decks, cards, tags…</span>
      <kbd>⌘K</kbd>
    </div>
    <button className="icon-btn" title="Alternar tema" onClick={onThemeToggle}>
      <Icon name={theme === "dark" ? "moon" : "sun"} size={14} />
    </button>
  </div>
);

// === Particle field (for dashboard hero) ===
const Particles = ({ count = 18 }) => {
  const items = React.useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 60}%`,
    delay: `${Math.random() * 8}s`,
    dur: `${6 + Math.random() * 5}s`,
    size: 2 + Math.random() * 3,
    color: Math.random() < 0.3 ? "var(--violet)" : "var(--accent)",
    blur: Math.random() < 0.4,
  })), [count]);
  return (
    <div className="hero-particles">
      {items.map((p, i) => (
        <span key={i} className="particle" style={{
          left: p.left, bottom: p.bottom,
          width: p.size, height: p.size,
          background: p.color,
          animationDelay: p.delay,
          animationDuration: p.dur,
          filter: p.blur ? "blur(1px)" : "blur(.5px)",
        }} />
      ))}
    </div>
  );
};

// === Sparkline (svg) ===
const Sparkline = ({ data, color = "var(--accent)" }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 70, h = 30;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg className="stat-spark" viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`${pts} ${w},${h} 0,${h}`} fill={color} opacity=".12" />
    </svg>
  );
};

Object.assign(window, { Icon, Sidebar, Topbar, Particles, Sparkline, BrandMark });
