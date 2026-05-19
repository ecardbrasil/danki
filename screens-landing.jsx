// =========================================================================
// SCREEN: LANDING — Página inicial para usuários não autenticados
// =========================================================================

const LandingScreen = ({ onGoAuth }) => {
  const features = [
    {
      icon: "✦",
      title: "IA que cria flashcards",
      desc: "Cole qualquer texto, PDF ou anotação. A IA gera perguntas e respostas prontas para revisar.",
    },
    {
      icon: "◎",
      title: "Repetição espaçada",
      desc: "O algoritmo sabe exatamente quando mostrar cada card para você lembrar com o mínimo de esforço.",
    },
    {
      icon: "▸",
      title: "Estude em qualquer lugar",
      desc: "Funciona direto no navegador, sem instalar nada. Seus decks sincronizados onde quer que você esteja.",
    },
  ];

  const stats = [
    { value: "10×", label: "mais rápido criar cards" },
    { value: "87%", label: "de retenção média" },
    { value: "0", label: "instalação necessária" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", overflowX: "hidden" }}>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 60,
        background: "color-mix(in oklch, var(--bg) 80%, transparent)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "var(--accent)", color: "#000",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--serif)", fontSize: 18, fontStyle: "italic",
          }}>d</div>
          <span style={{ fontFamily: "var(--serif)", fontSize: 18, letterSpacing: "-.01em" }}>
            Danki <em>AI</em>
          </span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn ghost"
            style={{ fontSize: 14, height: 36, padding: "0 18px" }}
            onClick={() => onGoAuth("login")}
          >Entrar</button>
          <button
            className="btn primary"
            style={{ fontSize: 14, height: 36, padding: "0 18px" }}
            onClick={() => onGoAuth("signup")}
          >Começar grátis</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "100px 24px 80px",
        textAlign: "center",
        position: "relative",
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: "30%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, height: 400, borderRadius: "50%",
          background: "radial-gradient(ellipse, color-mix(in oklch, var(--accent) 8%, transparent) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Partículas */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {[...Array(16)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              width: i % 3 === 0 ? 2 : 3, height: i % 3 === 0 ? 2 : 3,
              borderRadius: "50%",
              background: i % 2 === 0 ? "var(--accent)" : "var(--violet)",
              left: `${(i * 61 + 13) % 100}%`,
              top: `${(i * 43 + 9) % 100}%`,
              opacity: 0.15 + (i % 5) * 0.06,
              animation: `fade-in ${0.8 + i * 0.15}s ease both`,
            }} />
          ))}
        </div>

        <div style={{ position: "relative", maxWidth: 720, animation: "stagger-up .7s var(--ease-out) both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--accent-soft)", border: "1px solid color-mix(in oklch, var(--accent) 25%, transparent)",
            borderRadius: 100, padding: "5px 14px",
            fontSize: 12, color: "var(--accent)", letterSpacing: ".06em", textTransform: "uppercase",
            marginBottom: 28,
          }}>
            ✦ Flashcards com inteligência artificial
          </div>

          <h1 style={{
            fontFamily: "var(--serif)", fontSize: "clamp(42px, 7vw, 76px)",
            fontWeight: 400, lineHeight: 1.08, letterSpacing: "-.03em",
            margin: "0 0 24px",
          }}>
            Aprenda mais rápido,<br />
            <em style={{ color: "var(--accent)" }}>esqueça menos</em>
          </h1>

          <p style={{
            fontSize: "clamp(16px, 2vw, 19px)", color: "var(--text-soft)",
            lineHeight: 1.65, margin: "0 0 40px",
            maxWidth: 520, marginLeft: "auto", marginRight: "auto",
          }}>
            O Danki usa IA para transformar qualquer material em flashcards otimizados,
            e repetição espaçada para fixar o conhecimento de forma duradoura.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              className="btn primary"
              style={{ fontSize: 16, height: 48, padding: "0 32px", borderRadius: 12 }}
              onClick={() => onGoAuth("signup")}
            >
              Criar conta grátis
            </button>
            <button
              className="btn ghost"
              style={{ fontSize: 16, height: 48, padding: "0 28px", borderRadius: 12 }}
              onClick={() => onGoAuth("login")}
            >
              Já tenho conta →
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
        padding: "48px 24px",
        display: "flex", justifyContent: "center",
      }}>
        <div style={{
          display: "flex", gap: 0,
          maxWidth: 640, width: "100%",
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              flex: 1, textAlign: "center",
              borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none",
              padding: "0 24px",
            }}>
              <div style={{
                fontFamily: "var(--serif)", fontSize: "clamp(32px, 5vw, 48px)",
                fontStyle: "italic", color: "var(--accent)",
                lineHeight: 1,
              }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "var(--text-mute)", marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "100px 24px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{
            fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 400, letterSpacing: "-.025em", margin: "0 0 16px",
          }}>
            Tudo que você precisa para <em>estudar melhor</em>
          </h2>
          <p style={{ color: "var(--text-mute)", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
            Sem complexidade. Sem configuração. Só você e o conhecimento.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "var(--bg-elev)",
              border: "1px solid var(--border)",
              borderRadius: 16, padding: "32px 28px",
              transition: "border-color .2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--accent) 40%, transparent)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "var(--accent-soft)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, color: "var(--accent)", marginBottom: 20,
              }}>{f.icon}</div>
              <h3 style={{
                fontFamily: "var(--heading)", fontSize: 17, fontWeight: 600,
                margin: "0 0 10px", letterSpacing: "-.02em",
              }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-soft)", lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Card demo decorativo */}
      <section style={{ padding: "0 24px 100px", display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: 480 }}>
          {/* Card de baixo */}
          <div style={{
            position: "absolute", bottom: -14, left: 20, right: 20,
            height: 80, borderRadius: 16,
            background: "var(--surface)", border: "1px solid var(--border)",
            opacity: .5,
          }} />
          {/* Card do meio */}
          <div style={{
            position: "absolute", bottom: -7, left: 10, right: 10,
            height: 80, borderRadius: 16,
            background: "var(--surface-2)", border: "1px solid var(--border)",
            opacity: .75,
          }} />
          {/* Card principal */}
          <div style={{
            position: "relative",
            background: "var(--bg-elev)", border: "1px solid var(--border-strong)",
            borderRadius: 20, padding: "40px 36px",
            boxShadow: "var(--shadow-lg)",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: 11, color: "var(--accent)", letterSpacing: ".1em",
              textTransform: "uppercase", marginBottom: 24,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <span style={{ opacity: .5 }}>•</span> Pergunta
            </div>
            <p style={{
              fontFamily: "var(--serif)", fontSize: 22, lineHeight: 1.4,
              margin: "0 0 32px", color: "var(--text)",
            }}>
              O que é repetição espaçada e por que ela funciona?
            </p>
            <div style={{
              display: "flex", gap: 8, justifyContent: "center",
              paddingTop: 24, borderTop: "1px solid var(--border)",
            }}>
              {["Difícil", "Bom", "Fácil"].map((l, i) => (
                <button key={i} className="btn ghost" style={{
                  fontSize: 13, height: 34, padding: "0 16px",
                  color: i === 0 ? "var(--rose)" : i === 2 ? "var(--accent)" : "var(--text-soft)",
                }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={{
        borderTop: "1px solid var(--border)",
        padding: "100px 24px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 48px)",
          fontWeight: 400, letterSpacing: "-.025em", margin: "0 0 20px",
        }}>
          Pronto para começar a <em style={{ color: "var(--accent)" }}>aprender de verdade</em>?
        </h2>
        <p style={{ color: "var(--text-mute)", fontSize: 16, marginBottom: 36 }}>
          Gratuito para começar. Sem cartão de crédito.
        </p>
        <button
          className="btn primary"
          style={{ fontSize: 16, height: 50, padding: "0 40px", borderRadius: 14 }}
          onClick={() => onGoAuth("signup")}
        >
          Criar minha conta →
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "24px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: "var(--accent)", color: "#000",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--serif)", fontSize: 13, fontStyle: "italic",
          }}>d</div>
          <span style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--text-soft)" }}>Danki AI</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-mute)" }}>
          © 2025 Danki AI — Todos os direitos reservados
        </div>
      </footer>
    </div>
  );
};

Object.assign(window, { LandingScreen });
