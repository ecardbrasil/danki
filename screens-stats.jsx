// =========================================================================
// SCREEN: ESTATÍSTICAS
// =========================================================================

// ── helpers ──────────────────────────────────────────────────────────────

const lerp = (a, b, t) => a + (b - a) * t;

// Build a smooth SVG path from an array of [x,y] points
function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const cpx = (x0 + x1) / 2;
    d += ` C ${cpx} ${y0}, ${cpx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

// ── data ─────────────────────────────────────────────────────────────────

const RETENTION_SERIES = [
  { label: "Retenção %", color: "var(--accent-text)",
    values: [72,74,75,76,74,78,80,79,82,83,82,85,86,84,87,88,87,89,90,89,91,92,91,93,92,94,93,94,94,94] },
  { label: "Meta (90%)", color: "var(--text-mute)", dash: true,
    values: Array(30).fill(90) },
];

const ACTIVITY_DATA = [
  { d:"01/04", v:18 }, { d:"02/04", v:24 }, { d:"03/04", v:0 },
  { d:"04/04", v:31 }, { d:"05/04", v:42 }, { d:"06/04", v:38 },
  { d:"07/04", v:19 }, { d:"08/04", v:55 }, { d:"09/04", v:47 },
  { d:"10/04", v:39 }, { d:"11/04", v:62 }, { d:"12/04", v:0 },
  { d:"13/04", v:28 }, { d:"14/04", v:34 }, { d:"15/04", v:44 },
  { d:"16/04", v:51 }, { d:"17/04", v:38 }, { d:"18/04", v:22 },
  { d:"19/04", v:45 }, { d:"20/04", v:58 }, { d:"21/04", v:0 },
  { d:"22/04", v:33 }, { d:"23/04", v:47 }, { d:"24/04", v:52 },
  { d:"25/04", v:41 }, { d:"26/04", v:63 }, { d:"27/04", v:55 },
  { d:"28/04", v:0  }, { d:"29/04", v:48 }, { d:"30/04", v:47 },
];

const DECK_STATS = [
  { name:"JLPT N3", em:"vocabulário",    color:1, cards:324, mastery:68, retention:94, reviews:842, time:"4h 12m", trend:+2  },
  { name:"Anatomia", em:"cardiovascular", color:2, cards:182, mastery:42, retention:81, reviews:391, time:"2h 08m", trend:+5  },
  { name:"Direito",  em:"constitucional", color:3, cards:540, mastery:81, retention:96, reviews:1203,time:"6h 44m", trend:+1  },
  { name:"System Design", em:"patterns", color:4, cards:96,  mastery:91, retention:98, reviews:204, time:"0h 58m", trend: 0  },
  { name:"C2 Idioms", em:"& collocations",color:5, cards:211, mastery:55, retention:88, reviews:518, time:"2h 33m", trend:+3  },
  { name:"Antibióticos", em:"& mecanismos",color:6,cards:78, mastery:28, retention:72, reviews:112, time:"0h 34m", trend:-2  },
];

const MATURITY = [
  { label:"Novo",      count:142, pct:9,  color:"var(--text-mute)" },
  { label:"Aprendendo",count:218, pct:14, color:"var(--amber-text)"  },
  { label:"Jovem",     count:387, pct:26, color:"var(--sky)"         },
  { label:"Maduro",    count:509, pct:34, color:"var(--violet-text)" },
  { label:"Dominado",  count:245, pct:16, color:"var(--accent-text)" },
];

const FORECAST_30 = Array.from({length:30}, (_, i) => {
  const base = 47 + Math.sin(i * 0.4) * 15 + (i < 5 ? 0 : -i * 0.3);
  return Math.max(8, Math.round(base));
});

// ── sub-components ────────────────────────────────────────────────────────

const KpiCard = ({ label, value, unit, delta, deltaLabel, sub, accent }) => (
  <div className="panel" style={{padding:"20px 22px"}}>
    <div style={{fontSize:11, color:"var(--text-mute)", fontFamily:"var(--mono)", letterSpacing:".07em", textTransform:"uppercase", marginBottom:10}}>
      {label}
    </div>
    <div style={{fontFamily:"var(--serif)", fontSize:38, lineHeight:1, letterSpacing:"-.02em", color: accent || "var(--text)"}}>
      {value}<em style={{fontFamily:"var(--sans)", fontSize:15, fontWeight:400, color:"var(--text-mute)", marginLeft:4}}>{unit}</em>
    </div>
    {delta !== undefined && (
      <div style={{marginTop:8, fontSize:12, color: delta > 0 ? "var(--accent-text)" : delta < 0 ? "var(--rose-text)" : "var(--text-mute)", fontFamily:"var(--mono)"}}>
        {delta > 0 ? "▲" : delta < 0 ? "▼" : "—"} {Math.abs(delta)}% {deltaLabel}
      </div>
    )}
    {sub && <div style={{marginTop:6, fontSize:12, color:"var(--text-mute)"}}>{sub}</div>}
  </div>
);

// Line chart
const LineChart = ({ series, height = 160, showDots = true }) => {
  const W = 100, H = 100;
  const all = series.flatMap(s => s.values);
  const min = Math.min(...all) - 3;
  const max = Math.max(...all) + 3;

  const toXY = (vals) => vals.map((v, i) => [
    (i / (vals.length - 1)) * W,
    H - ((v - min) / (max - min)) * H,
  ]);

  // Grid lines
  const gridVals = [80, 85, 90, 95, 100].filter(v => v >= min && v <= max);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%", height, display:"block", overflow:"visible"}}>
      {/* Grid */}
      {gridVals.map(v => {
        const y = H - ((v - min) / (max - min)) * H;
        return (
          <g key={v}>
            <line x1={0} x2={W} y1={y} y2={y}
                  stroke="var(--border)" strokeWidth={.4} strokeDasharray="2 2"/>
            <text x={-1} y={y+1} fontSize={4} fill="var(--text-mute)" textAnchor="end" dominantBaseline="middle">{v}%</text>
          </g>
        );
      })}

      {series.map((s, si) => {
        const pts = toXY(s.values);
        const pathD = smoothPath(pts);
        const areaD = `${pathD} L ${pts[pts.length-1][0]} ${H} L 0 ${H} Z`;

        return (
          <g key={si}>
            {!s.dash && (
              <path d={areaD} fill={s.color} fillOpacity={.08}/>
            )}
            <path d={pathD}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={s.dash ? .6 : 1.4}
                  strokeDasharray={s.dash ? "2 2" : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
            {showDots && !s.dash && pts.filter((_, i) => i % 6 === 0).map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={1.2} fill={s.color}/>
            ))}
          </g>
        );
      })}
    </svg>
  );
};

// Activity bar chart (30 days)
const ActivityBars = ({ data, height = 120 }) => {
  const max = Math.max(...data.map(d => d.v));
  const W = 100, H = 100;
  const bw = (W / data.length) * 0.72;
  const gap = (W / data.length) * 0.28;
  const isToday = (i) => i === data.length - 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%", height, display:"block", overflow:"visible"}}>
      {data.map((d, i) => {
        const bh = (d.v / max) * (H - 8);
        const x = i * (W / data.length) + gap / 2;
        const y = H - bh;
        const r = 1.2;
        const color = d.v === 0
          ? "var(--surface-2)"
          : isToday(i)
          ? "var(--accent)"
          : "var(--surface-3)";
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh}
                  rx={r} ry={r}
                  fill={color}
                  style={{transition:"fill .3s"}}/>
            {isToday(i) && d.v > 0 && (
              <text x={x + bw/2} y={y - 2} fontSize={4.5} fill="var(--accent)"
                    textAnchor="middle">{d.v}</text>
            )}
            {(i === 0 || i === 14 || i === 29) && (
              <text x={x + bw/2} y={H + 6} fontSize={4} fill="var(--text-mute)"
                    textAnchor="middle">{d.d}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// Donut / maturity ring
const MaturityDonut = ({ data }) => {
  const R = 38, r = 24, cx = 50, cy = 50;
  let angle = -Math.PI / 2;
  const slices = data.map(d => {
    const start = angle;
    angle += (d.pct / 100) * Math.PI * 2;
    return { ...d, start, end: angle };
  });

  const arc = (x1, y1, x2, y2, large) => {
    const dx1 = cx + R * Math.cos(x1), dy1 = cy + R * Math.sin(x1);
    const dx2 = cx + R * Math.cos(x2), dy2 = cy + R * Math.sin(x2);
    const ix1 = cx + r * Math.cos(x2), iy1 = cy + r * Math.sin(x2);
    const ix2 = cx + r * Math.cos(x1), iy2 = cy + r * Math.sin(x1);
    return `M ${dx1} ${dy1} A ${R} ${R} 0 ${large} 1 ${dx2} ${dy2} L ${ix1} ${iy1} A ${r} ${r} 0 ${large} 0 ${ix2} ${iy2} Z`;
  };

  return (
    <svg viewBox="0 0 100 100" style={{width:"100%", maxWidth:180, display:"block", margin:"0 auto"}}>
      {slices.map((s, i) => (
        <path key={i} d={arc(s.start, s.end, (s.end - s.start) > Math.PI ? 1 : 0)}
              fill={s.color} fillOpacity={.88}/>
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={11}
            fontFamily="var(--serif)" fill="var(--text)">1.501</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize={5}
            fontFamily="var(--mono)" fill="var(--text-mute)" letterSpacing=".04em">CARDS</text>
    </svg>
  );
};

// Forecast sparkline for next 30 days
const ForecastMini = ({ data }) => {
  const W = 100, H = 100;
  const max = Math.max(...data);
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - (v / max) * H * 0.85 - 8,
  ]);
  const pathD = smoothPath(pts);
  const areaD = `${pathD} L ${pts[pts.length-1][0]} ${H} L 0 ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%", height:80, display:"block", overflow:"visible"}}>
      <defs>
        <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--violet)" stopOpacity=".25"/>
          <stop offset="100%" stopColor="var(--violet)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#fg)"/>
      <path d={pathD} fill="none" stroke="var(--violet)" strokeWidth={1.4}
            strokeLinecap="round" strokeLinejoin="round"/>
      {/* today marker */}
      <circle cx={pts[0][0]} cy={pts[0][1]} r={2} fill="var(--accent)"/>
      <text x={pts[0][0]} y={pts[0][1] - 4} fontSize={4.5} fill="var(--accent)" textAnchor="middle">Hoje</text>
    </svg>
  );
};

// ── main screen ───────────────────────────────────────────────────────────

const StatsScreen = () => {
  const [period, setPeriod] = React.useState("30d");
  const [deckSort, setDeckSort] = React.useState("mastery");

  const sortedDecks = [...DECK_STATS].sort((a, b) => {
    if (deckSort === "mastery")   return b.mastery - a.mastery;
    if (deckSort === "reviews")   return b.reviews - a.reviews;
    if (deckSort === "retention") return b.retention - a.retention;
    return 0;
  });

  return (
    <div className="screen">

      {/* ── header ── */}
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Suas <em>estatísticas</em></h1>
          <div className="screen-sub">Progresso completo · 1.501 cards · 12 dias de sequência</div>
        </div>
        <div style={{display:"flex", gap:8, alignItems:"center"}}>
          <div className="segmented">
            {["7d","30d","90d","todo"].map(p => (
              <button key={p} className={period===p?"active":""} onClick={() => setPeriod(p)}>
                {p === "todo" ? "Tudo" : p}
              </button>
            ))}
          </div>
          <button className="btn ghost" style={{fontSize:12}}>
            <Icon name="upload" size={12}/> Exportar
          </button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:14, marginBottom:22}} className="stagger">
        <KpiCard label="Retenção média"  value="94"   unit="%"      delta={+2}  deltaLabel="vs. mês anterior" accent="var(--accent)"/>
        <KpiCard label="Reviews totais"  value="3.270" unit=""      delta={+18} deltaLabel="vs. mês anterior"/>
        <KpiCard label="Tempo de estudo" value="17h"  unit="28m"    sub="média 34min/dia"/>
        <KpiCard label="Sequência atual" value="12"   unit="dias"   delta={+4}  deltaLabel="vs. última sequência" accent="var(--amber)"/>
      </div>

      {/* ── charts row ── */}
      <div className="grid-12" style={{marginBottom:22}}>

        {/* retention curve – 8 cols */}
        <div className="col-8">
          <div className="panel" style={{padding:"20px 22px"}}>
            <div className="panel-head" style={{marginBottom:14}}>
              <div className="panel-title">Curva de retenção <em style={{fontFamily:"var(--serif)", fontWeight:400}}>30 dias</em></div>
              <div style={{display:"flex", gap:14, fontSize:11, color:"var(--text-mute)", alignItems:"center"}}>
                <span style={{display:"flex", alignItems:"center", gap:5}}>
                  <span style={{width:12, height:2, background:"var(--accent)", display:"inline-block", borderRadius:2}}/>
                  Retenção real
                </span>
                <span style={{display:"flex", alignItems:"center", gap:5}}>
                  <span style={{width:12, height:1, background:"var(--text-mute)", display:"inline-block", borderRadius:2, borderTop:"1px dashed var(--text-mute)"}}/>
                  Meta 90%
                </span>
              </div>
            </div>
            <LineChart series={RETENTION_SERIES} height={170}/>
            <div style={{display:"flex", justifyContent:"space-between", fontSize:10, color:"var(--text-mute)", fontFamily:"var(--mono)", marginTop:6, padding:"0 2px"}}>
              <span>1 abr</span><span>8 abr</span><span>15 abr</span><span>22 abr</span><span>30 abr</span>
            </div>
          </div>
        </div>

        {/* maturity donut – 4 cols */}
        <div className="col-4">
          <div className="panel" style={{padding:"20px 22px", height:"100%", boxSizing:"border-box"}}>
            <div className="panel-head" style={{marginBottom:14}}>
              <div className="panel-title">Maturidade dos cards</div>
            </div>
            <MaturityDonut data={MATURITY}/>
            <div style={{display:"flex", flexDirection:"column", gap:7, marginTop:14}}>
              {MATURITY.map((m, i) => (
                <div key={i} style={{display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:12}}>
                  <div style={{display:"flex", alignItems:"center", gap:8}}>
                    <span style={{width:8, height:8, borderRadius:2, background:m.color, display:"inline-block", opacity:.88}}/>
                    <span style={{color:"var(--text-soft)"}}>{m.label}</span>
                  </div>
                  <div style={{display:"flex", gap:10, alignItems:"center"}}>
                    <span style={{fontFamily:"var(--mono)", fontSize:11, color:"var(--text-mute)"}}>{m.count}</span>
                    <span style={{fontFamily:"var(--mono)", fontSize:11, color:m.color, width:28, textAlign:"right"}}>{m.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── activity + forecast ── */}
      <div className="grid-12" style={{marginBottom:22}}>

        {/* activity bars – 8 cols */}
        <div className="col-8">
          <div className="panel" style={{padding:"20px 22px"}}>
            <div className="panel-head" style={{marginBottom:14}}>
              <div className="panel-title">Atividade diária <em style={{fontFamily:"var(--serif)", fontWeight:400}}>abril 2025</em></div>
              <span className="kbd">1.200 reviews este mês</span>
            </div>
            <ActivityBars data={ACTIVITY_DATA} height={130}/>
            <div style={{display:"flex", justifyContent:"space-between", marginTop:14, padding:"12px 0 0", borderTop:"1px solid var(--border)"}}>
              {[
                {label:"Maior sequência",   val:"9 dias"},
                {label:"Dia mais produtivo", val:"62 cards"},
                {label:"Dias sem estudo",    val:"4 dias"},
                {label:"Média diária",       val:"40 cards"},
              ].map((s, i) => (
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{fontFamily:"var(--mono)", fontSize:13, color:"var(--text)"}}>{s.val}</div>
                  <div style={{fontSize:11, color:"var(--text-mute)", marginTop:3}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* forecast – 4 cols */}
        <div className="col-4">
          <div className="panel" style={{padding:"20px 22px", height:"100%", boxSizing:"border-box"}}>
            <div className="panel-head" style={{marginBottom:12}}>
              <div className="panel-title">
                <Icon name="trending" size={14} style={{color:"var(--violet)", marginRight:6, verticalAlign:"-2px"}}/>
                Previsão · 30 dias
              </div>
            </div>
            <ForecastMini data={FORECAST_30}/>
            <div style={{display:"flex", flexDirection:"column", gap:8, marginTop:12}}>
              {[
                {label:"Amanhã",       val: FORECAST_30[1] + " cards", color:"var(--text)"},
                {label:"Esta semana",  val: FORECAST_30.slice(0,7).reduce((a,b)=>a+b,0) + " cards", color:"var(--text)"},
                {label:"Este mês",     val: FORECAST_30.reduce((a,b)=>a+b,0) + " cards", color:"var(--violet-text)"},
                {label:"Pico previsto",val: Math.max(...FORECAST_30) + " cards/dia", color:"var(--rose-text)"},
              ].map((r, i) => (
                <div key={i} style={{display:"flex", justifyContent:"space-between", fontSize:12, padding:"6px 0", borderBottom:"1px dashed var(--border)"}}>
                  <span style={{color:"var(--text-mute)"}}>{r.label}</span>
                  <span style={{fontFamily:"var(--mono)", color:r.color}}>{r.val}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:12, padding:"10px 12px", background:"var(--violet-soft)", borderRadius:10, border:"1px solid color-mix(in oklch, var(--violet) 25%, transparent)", fontSize:12, color:"var(--text-soft)"}}>
              <Icon name="sparkle" size={12} style={{color:"var(--violet)", marginRight:6, verticalAlign:"-2px"}}/>
              A IA prevê <strong style={{color:"var(--text)"}}>pico de 63 cards</strong> no sábado. Recomendo 25 min de sessão.
            </div>
          </div>
        </div>
      </div>

      {/* ── deck performance table ── */}
      <div className="panel" style={{padding:0, overflow:"hidden", marginBottom:22}}>
        <div className="panel-head" style={{padding:"16px 22px", borderBottom:"1px solid var(--border)"}}>
          <div className="panel-title">Desempenho por deck</div>
          <div style={{display:"flex", gap:8, alignItems:"center", fontSize:12, color:"var(--text-mute)"}}>
            Ordenar por:
            <div className="segmented">
              {["mastery","retention","reviews"].map(s => (
                <button key={s} className={deckSort===s?"active":""} onClick={() => setDeckSort(s)}>
                  {s === "mastery" ? "Maestria" : s === "retention" ? "Retenção" : "Reviews"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr style={{fontSize:11, color:"var(--text-mute)", letterSpacing:".06em", textTransform:"uppercase", borderBottom:"1px solid var(--border)"}}>
              <th style={{padding:"12px 22px", textAlign:"left", fontWeight:500}}>Deck</th>
              <th style={{padding:"12px 16px", fontWeight:500}}>Cards</th>
              <th style={{padding:"12px 16px", fontWeight:500}}>Maestria</th>
              <th style={{padding:"12px 16px", fontWeight:500}}>Retenção</th>
              <th style={{padding:"12px 16px", fontWeight:500}}>Reviews</th>
              <th style={{padding:"12px 16px", fontWeight:500}}>Tempo</th>
              <th style={{padding:"12px 22px", fontWeight:500, textAlign:"right"}}>Tendência</th>
            </tr>
          </thead>
          <tbody>
            {sortedDecks.map((d, i) => (
              <tr key={i} style={{borderBottom:"1px solid var(--border)", fontSize:13}}>
                <td style={{padding:"14px 22px"}}>
                  <div style={{display:"flex", alignItems:"center", gap:10}}>
                    <span style={{
                      width:4, height:34, borderRadius:2,
                      background: d.color === 1 ? "oklch(0.7 0.18 160)"
                               : d.color === 2 ? "oklch(0.7 0.18 240)"
                               : d.color === 3 ? "oklch(0.7 0.18 290)"
                               : d.color === 4 ? "oklch(0.7 0.18 60)"
                               : d.color === 5 ? "oklch(0.7 0.18 25)"
                               : "oklch(0.7 0.18 200)",
                      display:"inline-block", flexShrink:0
                    }}/>
                    <div>
                      <div style={{fontWeight:500, lineHeight:1.3}}>
                        {d.name} <em style={{fontFamily:"var(--serif)", color:"var(--text-soft)", fontWeight:400}}>{d.em}</em>
                      </div>
                      <div style={{fontSize:11, color:"var(--text-mute)", fontFamily:"var(--mono)"}}>{d.cards} cards</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:"14px 16px", fontFamily:"var(--mono)", color:"var(--text-soft)"}}>{d.cards}</td>
                <td style={{padding:"14px 16px"}}>
                  <div style={{display:"flex", alignItems:"center", gap:8}}>
                    <div style={{width:80, height:5, background:"var(--surface-2)", borderRadius:3, overflow:"hidden"}}>
                      <div style={{
                        height:"100%", width:`${d.mastery}%`,
                        background: d.mastery >= 80 ? "var(--accent)" : d.mastery >= 50 ? "var(--amber)" : "var(--rose)",
                        borderRadius:3, transition:"width .6s var(--ease-out)"
                      }}/>
                    </div>
                    <span style={{fontFamily:"var(--mono)", fontSize:11, color:"var(--text-soft)", width:28}}>{d.mastery}%</span>
                  </div>
                </td>
                <td style={{padding:"14px 16px"}}>
                  <span style={{
                    fontFamily:"var(--mono)", fontSize:12,
                    color: d.retention >= 90 ? "var(--accent-text)" : d.retention >= 80 ? "var(--amber-text)" : "var(--rose-text)"
                  }}>{d.retention}%</span>
                </td>
                <td style={{padding:"14px 16px", fontFamily:"var(--mono)", color:"var(--text-soft)"}}>{d.reviews.toLocaleString("pt-BR")}</td>
                <td style={{padding:"14px 16px", fontFamily:"var(--mono)", fontSize:11, color:"var(--text-mute)"}}>{d.time}</td>
                <td style={{padding:"14px 22px", textAlign:"right"}}>
                  <span style={{
                    fontFamily:"var(--mono)", fontSize:12,
                    color: d.trend > 0 ? "var(--accent-text)" : d.trend < 0 ? "var(--rose-text)" : "var(--text-mute)"
                  }}>
                    {d.trend > 0 ? `▲ +${d.trend}%` : d.trend < 0 ? `▼ ${d.trend}%` : "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── forgetting curve insight ── */}
      <div className="panel" style={{background:"linear-gradient(135deg, var(--bg-elev), var(--surface-2))", padding:"20px 22px", display:"flex", gap:20, alignItems:"center"}}>
        <div style={{width:40, height:40, borderRadius:12, background:"var(--accent-soft)", border:"1px solid var(--accent)", display:"grid", placeItems:"center", flexShrink:0}}>
          <Icon name="target" size={18} style={{color:"var(--accent-text)"}}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontWeight:500, marginBottom:4}}>
            Você está <strong style={{color:"var(--accent-text)"}}>4% acima</strong> da sua meta de retenção
          </div>
          <div style={{fontSize:12.5, color:"var(--text-mute)", lineHeight:1.5}}>
            Seu algoritmo FSRS-5 está ajustado para 92% de retenção alvo. Com 94% real, você pode aumentar os intervalos em ~15% sem perder performance — economizando ~8 minutos por dia.
          </div>
        </div>
        <div style={{display:"flex", gap:8, flexShrink:0}}>
          <button className="btn ghost" style={{fontSize:12}}>Ignorar</button>
          <button className="btn primary" style={{fontSize:12}}>
            <Icon name="bolt" size={12}/> Otimizar agora
          </button>
        </div>
      </div>

    </div>
  );
};

Object.assign(window, { StatsScreen });
