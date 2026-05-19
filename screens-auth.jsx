// =========================================================================
// SCREEN: AUTH — Login e Cadastro
// =========================================================================
const AuthScreen = ({ onAuth, initialMode = "login", onBack }) => {
  const [mode, setMode]       = React.useState(initialMode); // "login" | "signup"
  const [email, setEmail]     = React.useState("");
  const [password, setPass]   = React.useState("");
  const [name, setName]       = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError]     = React.useState("");
  const [info, setInfo]       = React.useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: err } = await signUp(email, password, name);
        if (err) throw err;
        if (data.user && !data.session) {
          setInfo("Verifique seu e-mail para confirmar o cadastro.");
        } else {
          onAuth(data.user);
        }
      } else {
        const { data, error: err } = await signIn(email, password);
        if (err) throw err;
        onAuth(data.user);
      }
    } catch (err) {
      const msgs = {
        "Invalid login credentials": "E-mail ou senha incorretos.",
        "Email not confirmed": "Confirme seu e-mail antes de entrar.",
        "User already registered": "Este e-mail já está cadastrado.",
        "Password should be at least 6 characters": "A senha deve ter ao menos 6 caracteres.",
      };
      setError(msgs[err.message] || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: 24,
    }}>
      {/* Partículas decorativas */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", opacity: .4
      }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 3, height: 3,
            borderRadius: "50%",
            background: "var(--accent)",
            left: `${(i * 73 + 11) % 100}%`,
            top:  `${(i * 47 + 7)  % 100}%`,
            opacity: .3 + (i % 4) * .15,
            animation: `fade-in ${1 + i * .2}s ease both`,
          }}/>
        ))}
      </div>

      <div style={{
        width: "100%", maxWidth: 400,
        background: "var(--bg-elev)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: "40px 36px",
        boxShadow: "var(--shadow-lg)",
        animation: "stagger-up .5s var(--ease-out) both",
        position: "relative",
      }}>
        {/* Voltar para landing */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              position: "absolute", top: 16, left: 16,
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-mute)", fontSize: 13,
              display: "flex", alignItems: "center", gap: 4, padding: "4px 8px",
              borderRadius: 6, transition: "color .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-mute)"}
          >
            ← Voltar
          </button>
        )}

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "var(--accent)", color: "#000",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--serif)", fontSize: 28, fontStyle: "italic",
            marginBottom: 14,
          }}>d</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 26, letterSpacing: "-.02em" }}>
            Danki <em>AI</em>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-mute)", marginTop: 4 }}>
            {mode === "login" ? "Entre na sua conta" : "Crie sua conta gratuita"}
          </div>
        </div>

        {/* Tabs login/cadastro */}
        <div className="segmented" style={{ marginBottom: 28, width: "100%" }}>
          <button
            style={{ flex: 1 }}
            className={mode === "login" ? "active" : ""}
            onClick={() => { setMode("login"); setError(""); setInfo(""); }}
          >Entrar</button>
          <button
            style={{ flex: 1 }}
            className={mode === "signup" ? "active" : ""}
            onClick={() => { setMode("signup"); setError(""); setInfo(""); }}
          >Cadastrar</button>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize: 12, color: "var(--text-mute)", letterSpacing: ".06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Nome
              </label>
              <input
                className="auth-input"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: 12, color: "var(--text-mute)", letterSpacing: ".06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              E-mail
            </label>
            <input
              className="auth-input"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus={mode === "login"}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: "var(--text-mute)", letterSpacing: ".06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              Senha
            </label>
            <input
              className="auth-input"
              type="password"
              placeholder={mode === "signup" ? "Mínimo 6 caracteres" : "••••••••"}
              value={password}
              onChange={e => setPass(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <div style={{
              background: "color-mix(in oklch, var(--rose) 12%, transparent)",
              border: "1px solid color-mix(in oklch, var(--rose) 30%, transparent)",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: "var(--rose)",
            }}>{error}</div>
          )}

          {info && (
            <div style={{
              background: "color-mix(in oklch, var(--accent) 12%, transparent)",
              border: "1px solid color-mix(in oklch, var(--accent) 30%, transparent)",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: "var(--accent)",
            }}>{info}</div>
          )}

          <button
            type="submit"
            className="btn primary"
            style={{ justifyContent: "center", height: 42, marginTop: 4, fontSize: 14 }}
            disabled={loading}
          >
            {loading
              ? "Aguarde…"
              : mode === "login" ? "Entrar" : "Criar conta"
            }
          </button>
        </form>

        {mode === "login" && (
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-mute)" }}>
            Não tem conta?{" "}
            <button
              style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", padding: 0, fontSize: 13 }}
              onClick={() => { setMode("signup"); setError(""); setInfo(""); }}
            >Cadastre-se grátis</button>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { AuthScreen });
