// =========================================================================
// PROFILE SCREEN — user info, theme, stats summary, sign out
// =========================================================================

const ProfileScreen = ({ user, onSignOut, onNav, stats = {}, theme = "dark", onThemeToggle }) => {
  const [displayName, setDisplayName] = React.useState(
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || ""
  );
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving]   = React.useState(false);
  const [saved, setSaved]     = React.useState(false);
  const [nameInput, setNameInput] = React.useState(displayName);

  const initials = displayName.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";
  const email = user?.email || "";

  const handleSave = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    try {
      await saveSettings({ display_name: nameInput.trim() });
      setDisplayName(nameInput.trim());
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error("Erro ao salvar nome:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setNameInput(displayName);
    setEditing(false);
  };

  const statCards = [
    { label: "Sequência atual", value: `${stats.streak || 0}d`, icon: "flame", color: "var(--accent)" },
    { label: "Total de decks", value: stats.deckCount || 0, icon: "layers", color: "var(--violet)" },
    { label: "Cards para revisar", value: stats.totalDue || 0, icon: "inbox", color: "var(--text-mute)" },
  ];

  return (
    <div className="profile-screen" style={{
      maxWidth: 600,
      margin: "0 auto",
      padding: "var(--space-6) var(--space-4)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)",
    }}>

      {/* Avatar + info */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-4)",
        position: "relative",
      }}>
        <div style={{
          width: 80, height: 80,
          borderRadius: "50%",
          background: "var(--accent)",
          color: "#000",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 700, letterSpacing: "-1px",
          flexShrink: 0,
        }}>{initials}</div>

        {/* Name */}
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
            <input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") handleCancel(); }}
              autoFocus
              style={{
                background: "var(--bg)",
                border: "1.5px solid var(--accent)",
                borderRadius: "var(--radius)",
                color: "var(--text)",
                fontSize: 18,
                fontWeight: 600,
                padding: "6px 14px",
                textAlign: "center",
                outline: "none",
                width: "100%",
                maxWidth: 300,
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ minWidth: 80, padding: "6px 16px", fontSize: 13 }}>
                {saving ? "Salvando…" : "Salvar"}
              </button>
              <button className="btn" onClick={handleCancel} style={{ minWidth: 80, padding: "6px 16px", fontSize: 13 }}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{displayName}</span>
              <button
                className="icon-btn"
                title="Editar nome"
                onClick={() => { setNameInput(displayName); setEditing(true); }}
                style={{ opacity: 0.5, transition: "opacity .15s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.5}
              >
                <Icon name="edit" size={14} />
              </button>
            </div>
            <span style={{ fontSize: 13, color: "var(--text-mute)" }}>{email}</span>
            {saved && (
              <span style={{ fontSize: 12, color: "var(--accent)", display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="check" size={12} /> Nome atualizado!
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-3)" }}>
        {statCards.map(s => (
          <div key={s.label} style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-4)",
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            <Icon name={s.icon} size={16} style={{ color: s.color }} />
            <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>{s.value}</span>
            <span style={{ fontSize: 11, color: "var(--text-mute)", textTransform: "uppercase", letterSpacing: ".06em" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Preferências */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-5)",
        display: "flex", flexDirection: "column", gap: "var(--space-1)",
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-mute)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "var(--space-3)" }}>
          Preferências
        </div>

        {/* Theme toggle row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 0",
          borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name={theme === "dark" ? "moon" : "sun"} size={16} style={{ color: "var(--text-mute)" }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>Tema</div>
              <div style={{ fontSize: 12, color: "var(--text-mute)" }}>{theme === "dark" ? "Escuro" : "Claro"}</div>
            </div>
          </div>
          <button
            onClick={onThemeToggle}
            style={{
              width: 44, height: 24,
              borderRadius: 12,
              background: theme === "dark" ? "var(--accent)" : "var(--border)",
              border: "none", cursor: "pointer",
              position: "relative", transition: "background .2s",
            }}
          >
            <span style={{
              position: "absolute",
              top: 3, left: theme === "dark" ? 23 : 3,
              width: 18, height: 18,
              borderRadius: "50%",
              background: theme === "dark" ? "#000" : "var(--text)",
              transition: "left .2s",
            }} />
          </button>
        </div>

        {/* Nav shortcuts */}
        {[
          { label: "Estatísticas detalhadas", icon: "trending", screen: "stats" },
          { label: "Biblioteca de decks", icon: "library", screen: "library" },
          { label: "Criar com IA", icon: "sparkle", screen: "ai-create" },
        ].map(item => (
          <button
            key={item.screen}
            onClick={() => onNav(item.screen)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 0",
              borderBottom: "1px solid var(--border)",
              background: "none", border: "none", borderBottom: "1px solid var(--border)",
              cursor: "pointer", width: "100%", textAlign: "left",
              color: "var(--text)",
            }}
          >
            <Icon name={item.icon} size={16} style={{ color: "var(--text-mute)" }} />
            <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{item.label}</span>
            <Icon name="chevron" size={14} style={{ color: "var(--text-mute)" }} />
          </button>
        ))}
      </div>

      {/* Sign out */}
      <button
        onClick={onSignOut}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "12px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          color: "#ef4444",
          fontSize: 14, fontWeight: 600,
          cursor: "pointer",
          transition: "background .15s, border-color .15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,.08)"; e.currentTarget.style.borderColor = "#ef4444"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "var(--border)"; }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sair da conta
      </button>
    </div>
  );
};
