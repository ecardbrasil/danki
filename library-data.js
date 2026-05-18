// =========================================================================
// BIBLIOTECA DE PROVAS — Dados estáticos de flashcards prontos
// Adicione novas provas aqui ou migre para tabela Supabase futuramente.
// =========================================================================

const PUBLIC_LIBRARY = [
  {
    id: "enem-2023-biologia",
    title: "ENEM 2023 — Biologia",
    exam: "ENEM",
    subject: "Biologia",
    year: 2023,
    color: 1,
    description: "Questões de Biologia do ENEM 2023 (1º dia) convertidas em flashcards.",
    tags: ["ENEM", "Biologia", "2023"],
    cards: [
      {
        front: "O que é a teoria da endossimbiose e quais organelas ela explica?",
        back: "Teoria proposta por Lynn Margulis: mitocôndrias e cloroplastos seriam procariontes ancestrais que foram englobados por células hospedeiras e passaram a viver em simbiose. Evidências: DNA próprio circular, ribossomos 70S e membrana dupla.",
      },
      {
        front: "Qual a diferença entre mitose e meiose em termos de resultado?",
        back: "Mitose: 1 célula → 2 células geneticamente idênticas (2n→2n). Meiose: 1 célula → 4 células com metade do número de cromossomos (2n→n), com recombinação genética. Ocorre na formação de gametas.",
      },
      {
        front: "O que é seleção natural e quais seus requisitos?",
        back: "Mecanismo evolutivo descrito por Darwin: indivíduos com características mais adaptadas ao ambiente sobrevivem e reproduzem mais. Requisitos: variação herdável na população, pressão seletiva ambiental e reprodução diferencial.",
      },
      {
        front: "Diferencie respiração aeróbica de fermentação.",
        back: "Respiração aeróbica: usa O₂, ocorre em mitocôndrias, produz ~36 ATP, CO₂ e H₂O. Fermentação: sem O₂, ocorre no citoplasma, produz apenas 2 ATP, com subprodutos como etanol (alcoólica) ou lactato (lática).",
      },
      {
        front: "O que são hormônios e como atuam nas células-alvo?",
        back: "Mensageiros químicos produzidos por glândulas endócrinas. Agem se ligando a receptores específicos na célula-alvo (membrana para hidrofílicos; núcleo para esteroides hidrofóbicos), desencadeando cascatas de sinalização.",
      },
    ],
  },
  {
    id: "enem-2023-quimica",
    title: "ENEM 2023 — Química",
    exam: "ENEM",
    subject: "Química",
    year: 2023,
    color: 3,
    description: "Questões de Química do ENEM 2023 adaptadas para revisão por flashcards.",
    tags: ["ENEM", "Química", "2023"],
    cards: [
      {
        front: "O que é um tampão (solução-tampão) e como ele resiste a variações de pH?",
        back: "Mistura de ácido fraco e sua base conjugada (ou vice-versa). Ao adicionar H⁺, a base conjugada o neutraliza; ao adicionar OH⁻, o ácido fraco o neutraliza. Exemplo: H₂CO₃/HCO₃⁻ no sangue (pH ≈ 7,4).",
      },
      {
        front: "Explique a diferença entre reações endotérmicas e exotérmicas.",
        back: "Exotérmica: libera calor para o ambiente (ΔH < 0), produtos têm menos energia que reagentes. Endotérmica: absorve calor do ambiente (ΔH > 0), produtos têm mais energia que reagentes. Exemplo exo: combustão; endo: fotossíntese.",
      },
      {
        front: "O que é eletronegatividade e qual sua tendência na tabela periódica?",
        back: "Capacidade de um átomo de atrair elétrons de ligação. Aumenta da esquerda para a direita no período (maior carga nuclear) e de baixo para cima no grupo (menor distância ao núcleo). Flúor é o mais eletronegativo.",
      },
      {
        front: "Defina mol e qual é o número de Avogadro.",
        back: "Mol é a quantidade de substância que contém 6,022 × 10²³ entidades (número de Avogadro, Nₐ). 1 mol de qualquer substância pura tem massa em gramas igual à sua massa molar (massa atômica/molecular em u.m.a.).",
      },
      {
        front: "O que é isomeria e cite os principais tipos.",
        back: "Compostos com mesma fórmula molecular mas estruturas diferentes. Tipos: plana (cadeia, posição, função, metameria, tautomeria) e espacial (geométrica cis-trans e óptica/quiral). Isômeros podem ter propriedades físicas e químicas distintas.",
      },
    ],
  },
  {
    id: "enem-2023-historia",
    title: "ENEM 2023 — História",
    exam: "ENEM",
    subject: "História",
    year: 2023,
    color: 5,
    description: "Questões de História e Geografia do ENEM 2023 em formato de flashcard.",
    tags: ["ENEM", "História", "2023"],
    cards: [
      {
        front: "Quais foram as principais causas da Primeira Guerra Mundial?",
        back: "Complexo de fatores: nacionalismo exacerbado, imperialismo e disputa por colônias, sistema de alianças (Tríplice Entente × Tríplice Aliança), corrida armamentista e o estopim: assassinato do arquiduque Francisco Ferdinando em Sarajevo (1914).",
      },
      {
        front: "O que foi a Revolução Industrial e quais suas consequências sociais?",
        back: "Processo de mecanização da produção iniciado na Inglaterra (séc. XVIII). Consequências: êxodo rural, surgimento do proletariado, condições precárias de trabalho, urbanização acelerada, poluição e emergência dos movimentos operários e do socialismo.",
      },
      {
        front: "Explique o conceito de imperialismo do século XIX.",
        back: "Expansão política, econômica e cultural de países industrializados sobre regiões menos desenvolvidas. Motivações: mercados consumidores, matérias-primas, investimento de capital excedente e ideologia da 'missão civilizatória'. Partilha da África na Conferência de Berlim (1884-85).",
      },
      {
        front: "O que foi a Guerra Fria e quais foram seus principais conflitos?",
        back: "Rivalidade geopolítica (1947-1991) entre EUA (capitalismo) e URSS (socialismo) sem confronto direto. Conflitos por procuração: Guerra da Coreia, Guerra do Vietnã, Crise dos Mísseis em Cuba (1962), conflitos africanos e asiáticos.",
      },
      {
        front: "O que foi o processo de independência do Brasil e suas particularidades?",
        back: "Proclamada em 7 set. 1822 por D. Pedro I. Particularidades: sem ruptura violenta (diferente da América hispânica), manutenção da monarquia e da escravidão, negociação com Portugal (reconhecida em 1825 mediante indenização de 2 milhões de libras).",
      },
    ],
  },
  {
    id: "fuvest-2023-matematica",
    title: "FUVEST 2023 — Matemática",
    exam: "FUVEST",
    subject: "Matemática",
    year: 2023,
    color: 4,
    description: "Tópicos recorrentes de Matemática na FUVEST 2023 em flashcards.",
    tags: ["FUVEST", "Matemática", "2023"],
    cards: [
      {
        front: "O que é uma progressão geométrica (PG) e qual sua fórmula do termo geral?",
        back: "Sequência onde cada termo é obtido multiplicando o anterior pela razão q (constante). Fórmula do termo geral: aₙ = a₁ · q^(n-1). Soma dos n primeiros termos: Sₙ = a₁(qⁿ - 1)/(q - 1), para q ≠ 1.",
      },
      {
        front: "Como calcular a área de um triângulo usando o seno do ângulo?",
        back: "A = (b · c · sen A) / 2, onde b e c são dois lados e A é o ângulo entre eles. Caso especial: triângulo equilátero de lado l tem área = (l² · √3) / 4.",
      },
      {
        front: "O que é a lei dos cossenos e quando usá-la?",
        back: "a² = b² + c² − 2bc·cos(A). Usada para calcular lados ou ângulos de triângulos quaisquer (não retângulos) quando se conhece: dois lados e o ângulo entre eles, ou os três lados.",
      },
      {
        front: "Defina limite de uma função e o que é continuidade.",
        back: "Limite: valor que f(x) se aproxima quando x tende a um ponto a, independente de f(a). lim_{x→a} f(x) = L. Continuidade em a: f(a) existe, lim_{x→a} f(x) = f(a) (limite existe e é igual ao valor da função).",
      },
      {
        front: "O que é uma matriz inversa e quando ela existe?",
        back: "A matriz A⁻¹ tal que A·A⁻¹ = I (identidade). Existe somente quando det(A) ≠ 0 (matriz não singular). Para 2×2: se A = [[a,b],[c,d]], então A⁻¹ = (1/det(A))·[[d,-b],[-c,a]].",
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "go-fisiologia-gestacao-2024",
    title: "GO — Fisiologia da Gestação & Patologias",
    exam: "Residencia",
    subject: "Ginecologia e Obstetrícia",
    year: 2024,
    color: 6,
    description: "50 flashcards de Ginecologia e Obstetrícia: fisiologia da gestação, patologias ginecológicas, saúde da mulher e pré-natal. Com imagens de referência.",
    tags: ["GO", "Ginecologia", "Obstetrícia", "Residência", "Pré-natal"],
    cards: [
      // ── FISIOLOGIA DA GESTAÇÃO ───────────────────────────────────────────
      {
        front: "Qual é o período de MAIOR risco teratogênico durante a gravidez?",
        back: '__MC__{"q":"Qual é o período de MAIOR risco teratogênico durante a gravidez?","o":["0-8 semanas (período embrionário)","9-14 semanas","15-20 semanas","Acima de 28 semanas"],"c":0}',
      },
      {
        front: "O hormônio hCG atinge seu PICO máximo em qual semana da gravidez?",
        back: '__MC__{"q":"O hormônio hCG atinge seu PICO máximo em qual semana?","o":["4ª-6ª semana","8ª-10ª semana","12ª-14ª semana","18ª-20ª semana"],"c":1}',
      },
      {
        front: "Qual é o aumento aproximado de VOLEMIA durante a gravidez?",
        back: '__MC__{"q":"Qual é o aumento aproximado de VOLEMIA durante a gravidez?","o":["10-15%","25-30%","40-50%","60-70%"],"c":2}',
      },
      {
        front: "A TFG (Taxa de Filtração Glomerular) aumenta em que percentual na gravidez?",
        back: '__MC__{"q":"A TFG aumenta em aproximadamente:","o":["15-20%","35-40%","50% ou mais","Diminui em 30%"],"c":2}',
      },
      {
        front: "Qual alteração respiratória é observada na gestante?",
        back: '__MC__{"q":"Qual é a alteração respiratória mais típica na gestante?","o":["Aumento de CO₂ (PaCO₂ > 45)","Diminuição de oxigênio (hipoxemia)","Alcalose respiratória (PaCO₂ ≈ 28-32)","Retenção de CO₂"],"c":2}',
      },
      {
        front: "A progesterona é produzida INICIALMENTE por qual estrutura?",
        back: '__MC__{"q":"Nos primeiros 2 meses, a progesterona é produzida por:","o":["Trofoblasto","Placenta","Corpo lúteo","Córtex adrenal"],"c":2}',
      },
      {
        front: "Qual é o método PADRÃO-OURO para datação de gestação?",
        back: '__MC__{"q":"Qual é o método padrão-ouro para datação de gestação?","o":["Cálculo pela DUM","USG de 1º trimestre até 13+6 semanas","USG de 2º trimestre","Exame clínico do útero"],"c":1}',
      },
      {
        front: "Qual é o volume NORMAL de líquido amniótico no 3º trimestre?",
        back: '__MC__{"q":"Qual é o volume normal de líquido amniótico no 3º trimestre?","o":["100-300 mL","300-500 mL","500-1000 mL","1200-1500 mL"],"c":2}',
      },
      {
        front: "A partir de qual semana o hPL começa a ser produzido?",
        back: '__MC__{"q":"A partir de qual semana o lactogênio placentário (hPL) é produzido?","o":["2ª semana","4ª semana","6ª semana","10ª semana"],"c":2}',
      },
      {
        front: "O hPL exerce ação similar a qual hormônio?",
        back: '__MC__{"q":"O hPL exerce efeito metabólico similar ao:","o":["Insulina","Prolactina","Hormônio do crescimento (GH)","Corticotropina (ACTH)"],"c":2}',
      },
      // ── PRÉ-NATAL ────────────────────────────────────────────────────────
      {
        front: "Em qual trimestre é feito o rastreamento de aneuploidia COMBINADO?",
        back: '__MC__{"q":"O rastreio combinado (translucência nucal + hormônios) é feito em qual trimestre?","o":["1º trimestre (até 13+6 semanas)","2º trimestre (14-20 semanas)","3º trimestre","Ao longo de toda gestação"],"c":0}',
      },
      {
        front: "Qual é o valor de corte da TRANSLUCÊNCIA NUCAL para risco aumentado?",
        back: '__MC__{"q":"Translucência nucal ≥ ____ mm indica risco aumentado de aneuploidia:","o":["1,5 mm","2,0 mm","3,0 mm","4,5 mm"],"c":2}',
      },
      {
        front: "Quando é realizado o rastreamento do DIABETES GESTACIONAL?",
        back: '__MC__{"q":"O rastreamento do diabetes gestacional (TOTG) é realizado:","o":["Na 1ª consulta","Entre 16-20 semanas","Entre 24-28 semanas","Acima de 32 semanas"],"c":2}',
      },
      {
        front: "Qual é o valor de glicemia de JEJUM que define diabetes gestacional?",
        back: '__MC__{"q":"Na primeira consulta, glicemia de jejum ≥ _____ mg/dL sugere diabetes gestacional:","o":["85 mg/dL","92 mg/dL","105 mg/dL","125 mg/dL"],"c":1}',
      },
      {
        front: "Qual é a dose PADRÃO de imunoglobulina anti-D (Rh) em gestantes?",
        back: '__MC__{"q":"A dose padrão de imunoglobulina anti-D é:","o":["100 mcg IM","200 mcg IM","300 mcg IM","500 mcg IM"],"c":2}',
      },
      {
        front: "Em qual semana é feito o RASTREIO de Streptococo agalactiae (GBS)?",
        back: '__MC__{"q":"O rastreio de Streptococo agalactiae é feito entre:","o":["28-30 semanas","32-34 semanas","35-37 semanas","38-40 semanas"],"c":2}',
      },
      {
        front: "Qual é a antibioticoterapia de PRIMEIRA ESCOLHA para GBS positivo no parto?",
        back: '__MC__{"q":"Para GBS+ no parto, o antibiótico de 1ª escolha é:","o":["Ampicilina","Penicilina G cristalina IV","Ceftriaxona","Clindamicina"],"c":1}',
      },
      {
        front: "Qual exame NÃO faz parte da rotina do pré-natal de baixo risco?",
        back: '__MC__{"q":"Qual exame NÃO é obrigatório no pré-natal de baixo risco?","o":["Tipagem sanguínea","Ecocardiografia fetal","Soologia (VDRL)","TSH"],"c":1}',
      },
      {
        front: "Quantas doses de corticoide são recomendadas para maturação pulmonar fetal?",
        back: '__MC__{"q":"Para maturação pulmonar fetal, quantas doses de betametasona são usadas?","o":["1 dose","2 doses com intervalo de 24h","3 doses com intervalo de 12h","4 doses diárias"],"c":1}',
      },
      {
        front: "A que idade gestacional a maturação pulmonar é atingida?",
        back: '__MC__{"q":"A maturação pulmonar fetal ocorre aproximadamente a partir de:","o":["28 semanas","30 semanas","34 semanas","36 semanas"],"c":2}',
      },
      // ── HIPERTENSÃO NA GESTAÇÃO ──────────────────────────────────────────
      {
        front: "Qual é o critério de PA para diagnóstico de PARVIDADE na gestação?",
        back: '__MC__{"q":"PA ≥ _____ × _____ mmHg define hipertensão na gravidez:","o":["130 × 85","140 × 90","150 × 100","160 × 110"],"c":1}',
      },
      {
        front: "A partir de qual semana a pré-eclâmpsia pode ser diagnosticada?",
        back: '__MC__{"q":"A pré-eclâmpsia pode aparecer a partir de:","o":["12 semanas","16 semanas","20 semanas","24 semanas"],"c":2}',
      },
      {
        front: "Qual é o valor de proteinúria para diagnóstico de pré-eclâmpsia?",
        back: '__MC__{"q":"Proteinúria ≥ _____ mg/24h define proteinúria na pré-eclâmpsia:","o":["100 mg","150 mg","300 mg","500 mg"],"c":2}',
      },
      {
        front: "HELLP significa qual combinação?",
        back: '__MC__{"q":"HELLP = Hemolysis + Elevated ____ + ____","o":["Liver; Leukocytes","Liver; Low Platelets","Lipase; Low Albumin","Lactate; Low Oxygen"],"c":1}',
      },
      {
        front: "Qual é a dose de ATAQUE de sulfato de magnésio?",
        back: '__MC__{"q":"Protocolo de Zuspan: dose de ataque de MgSO₄ é:","o":["2-3 g IV","4-6 g IV","8-10 g IV","12-15 g IV"],"c":1}',
      },
      {
        front: "Qual é o ANTÍDOTO para toxicidade por sulfato de magnésio?",
        back: '__MC__{"q":"O antídoto para toxicidade por MgSO₄ é:","o":["Gluconato de cálcio","Sulfato de cálcio","Brometo de cálcio","Citrato de cálcio"],"c":0}',
      },
      {
        front: "A HAS gestacional normaliza até quando após o parto?",
        back: '__MC__{"q":"A HAS gestacional normaliza até:","o":["7 dias pós-parto","14 dias pós-parto","3 meses pós-parto","12 meses pós-parto"],"c":2}',
      },
      {
        front: "Qual é o risco de DM2 em mulheres com diabetes gestacional?",
        back: '__MC__{"q":"O risco de desenvolver DM2 após diabetes gestacional é:","o":["10%","25%","50% em 10 anos","80%"],"c":2}',
      },
      {
        front: "A macrossomia fetal no DG está relacionada a qual fator?",
        back: '__MC__{"q":"A macrossomia no diabetes gestacional é causada principalmente por:","o":["Hipoglicemia fetal","Hiperinsulinismo fetal","Hipóxia crônica","Crescimento intrauterino restrito"],"c":1}',
      },
      {
        front: "Qual é o nível mínimo de dilatação cervical para diagnóstico de TP ATIVO?",
        back: '__MC__{"q":"O trabalho de parto ativo inicia-se com dilatação de:","o":["2 cm","3 cm","4 cm","5 cm"],"c":2}',
      },
      {
        front: "Qual é o progresso esperado de dilatação NO TP ATIVO (primípara)?",
        back: '__MC__{"q":"O progresso de dilatação no TP ativo deve ser de:","o":["0,5 cm/h","1 cm/h ou mais","1,5 cm/h","2 cm/h"],"c":1}',
      },
      {
        front: "Qual é o tempo MÁXIMO do 2º período (expulsão) sem analgesia (primípara)?",
        back: '__MC__{"q":"O 2º período (expulsão) em primípara SEM analgesia não deve exceder:","o":["1 hora","1.5 horas","2 horas","3 horas"],"c":2}',
      },
      {
        front: "A sigla HELPERR refere-se ao manejo de qual intercorrência?",
        back: '__MC__{"q":"HELPERR é a sigla do manejo de:","o":["Hemorragia pós-parto","Distócia de ombros","Placenta retida","Rotura uterina"],"c":1}',
      },
      {
        front: "Qual manobra aumenta o espaço pélvico na distócia de ombros?",
        back: '__MC__{"q":"A manobra de McRoberts consiste em:","o":["Hiperflexão das pernas da parturiente","Pressão suprapúbica","Rotação de tronco","Extração manual do braço"],"c":0}',
      },
      {
        front: "Que apresentação fetal é INDICAÇÃO ABSOLUTA para cesárea?",
        back: '__MC__{"q":"Qual apresentação é indicação de cesárea eletiva?","o":["Vértice","Pélvica sem possibilidade de versão","Transversa anterior","Occipital posterior"],"c":1}',
      },
      // ── HEMORRAGIAS ─────────────────────────────────────────────────────
      {
        front: "Na placenta prévia, a hemorragia é típicamente DOLOROSA ou INDOLOR?",
        back: '__MC__{"q":"A hemorragia na placenta prévia é caracteristicamente:","o":["Dolorosa com contrações","Indolor (sangue vivo)","Oculta (intra-amniótica)","Intermitente e progressiva"],"c":1}',
      },
      {
        front: "Qual é a causa MAIS COMUM de hemorragia pós-parto?",
        back: '__MC__{"q":"A causa mais comum de hemorragia pós-parto é:","o":["Trauma vaginal (80%)","Atonia uterina (70-80%)","Retenção placentária (30%)","Coagulopatia (10%)"],"c":1}',
      },
      {
        front: "Qual é a PRIMEIRA medida farmacológica para HPP?",
        back: '__MC__{"q":"O primeiro tônico uterino para hemorragia pós-parto é:","o":["Misoprostol","Ergometrina","Ocitocina","Antibióticos"],"c":2}',
      },
      {
        front: "A mola hidatiforme completa tem quantos cromossomos?",
        back: '__MC__{"q":"A mola hidatiforme completa apresenta cariótipo:","o":["45X0","46XX (diandria)","69XXY (triploide)","92XXYY (tetraploide)"],"c":1}',
      },
      {
        front: "Qual é o achado de USG típico da mola completa?",
        back: '__MC__{"q":"Na mola hidatiforme, a USG mostra:","o":["Saco gestacional com embrião","Útero aumentado sem embrião","Aspecto de flocos de neve","Múltiplas vesículas"],"c":2}',
      },
      {
        front: "Qual é o risco de transformação maligna da mola COMPLETA?",
        back: '__MC__{"q":"Risco de transformação maligna da mola completa:","o":["5%","10%","15-20%","50%"],"c":2}',
      },
      {
        front: "SOP é diagnosticada usando QUAL CRITÉRIO?",
        back: '__MC__{"q":"Para diagnosticar SOP, quantos critérios de Rotterdam são necessários?","o":["1 de 3","2 de 3","3 de 3","Todos os 4"],"c":1}',
      },
      {
        front: "Qual é o número MÍNIMO de folículos para SOP na USG?",
        back: '__MC__{"q":"Na SOP, a USG mostra ≥ _____ folículos de 2-9 mm por ovário:","o":["8","10","12","15"],"c":2}',
      },
      {
        front: "O primeiro tratamento para amenorreia secundária é SEMPRE:",
        back: '__MC__{"q":"Na amenorreia secundária, o primeiro diagnóstico a excluir é:","o":["Hiperprolactinemia","Diabetes","Gravidez","SOP"],"c":2}',
      },
      {
        front: "Qual é a idade MÉDIA da menopausa no Brasil?",
        back: '__MC__{"q":"A idade média da menopausa no Brasil é:","o":["45 anos","48 anos","51 anos","55 anos"],"c":2}',
      },
      {
        front: "Qual é o nível de FSH que CONFIRMA menopausa?",
        back: '__MC__{"q":"Na menopausa, FSH é:","o":["> 20 mUI/mL","> 30 mUI/mL","> 40 mUI/mL","> 60 mUI/mL"],"c":2}',
      },
      {
        front: "Qual é a CONTRAINDICAÇÃO ABSOLUTA para THM?",
        back: '__MC__{"q":"Qual é contraindicação absoluta para terapia hormonal menopáusica?","o":["Idade > 60 anos","Câncer de mama hormônio-dependente ativo","Níveis baixos de estradiol","HAS controlada"],"c":1}',
      },
      {
        front: "A colpocitologia (Papanicolau) inicia-se em qual idade?",
        back: '__MC__{"q":"O rastreamento do câncer de colo com Papanicolau inicia aos:","o":["18 anos","21 anos","25 anos","30 anos"],"c":2}',
      },
      {
        front: "Em qual idade pode ser encerrado o rastreamento cervical?",
        back: '__MC__{"q":"O rastreamento cervical pode ser encerrado aos:","o":["55 anos","60 anos","64 anos com 2 últimos negativos","70 anos"],"c":2}',
      },
      {
        front: "HPV 16 e 18 têm qual risco oncogênico?",
        back: '__MC__{"q":"HPV 16 e 18 são tipos de:","o":["Baixo risco (verrugas)","Risco intermediário","Alto risco oncogênico","Não oncogênicos"],"c":2}',
      },
      {
        front: "QUAL é o tratamento para LSIL (low-grade) no citopatológico?",
        back: '__MC__{"q":"Resultado ASC-US ou LSIL no Papanicolau requer:","o":["Tratamento cirúrgico imediato","Repetição em 6 meses ou teste HPV","Conização","Histerectomia"],"c":1}',
      },
      {
        front: "O câncer de endométrio é mais frequente em qual idade?",
        back: '__MC__{"q":"O câncer de endométrio é mais frequente em:","o":["Pré-menopausa","Menacme","Pós-menopausa (90% dos casos)","Crianças e adolescentes"],"c":2}',
      },
      {
        front: "Qual é a espessura MÁXIMA normal do endométrio pós-menopausa?",
        back: '__MC__{"q":"Endométrio > _____ mm na pós-menopausa deve ser investigado:","o":["3 mm","4-5 mm","8 mm","10 mm"],"c":1}',
      },
      {
        front: "Qual é a taxa de sobrevida do câncer de ovário no ESTÁGIO I?",
        back: '__MC__{"q":"Sobrevida do câncer de ovário estágio I:","o":["50%","70%","90%","95%"],"c":2}',
      },
      {
        front: "BRCA1/2 aumentam o risco de câncer de ovário em quanto?",
        back: '__MC__{"q":"Mulheres com BRCA1/2 têm risco vitalício de câncer de ovário de:","o":["10-20%","30-40%","40-60%","70-80%"],"c":2}',
      },
      {
        front: "Qual é o principal AGENTE da DIP (doença inflamatória pélvica)?",
        back: '__MC__{"q":"Os principais agentes da DIP são:","o":["Apenas Staphylococcus","Apenas Neisseria e Chlamydia","Polimicrobianos (Neisseria, Chlamydia, anaeróbios)","Apenas vírus"],"c":2}',
      },
      {
        front: "O pH vaginal normal é?",
        back: '__MC__{"q":"O pH vaginal normal é:","o":["< 3,5","< 4,5","5,0-6,0","> 6,5"],"c":1}',
      },
      {
        front: "Na vaginose bacteriana, o pH é?",
        back: '__MC__{"q":"Na vaginose bacteriana, o pH vaginal é:","o":["< 4,5 (ácido)","4,5-5,5 (alcalino-neutr)","6,0-7,0 (alcalino)","> 8,0 (muito alcalino)"],"c":2}',
      },
      {
        front: "Qual tipo de HPV causa VERRUGAS genitais (condiloma)?",
        back: '__MC__{"q":"Verrugas genitais (condiloma) são causadas por HPV:","o":["16 e 18","31 e 33","6 e 11 (baixo risco)","Todos os tipos"],"c":2}',
      },
      {
        front: "A dose de METRONIDAZOL para tricomoníase é?",
        back: '__MC__{"q":"Tricomoníase é tratada com metronidazol:","o":["500 mg VO 1×/d por 7 dias","500 mg VO 2×/d por 7 dias","2 g VO em dose única","1 g VO 2×/d por 3 dias"],"c":2}',
      },
      // ── URGÊNCIAS OBSTÉTRICAS ────────────────────────────────────────────
      {
        front: "A gravidez ectópica ocorre em qual local na MAIORIA dos casos?",
        back: '__MC__{"q":"A gravidez ectópica implanta em qual estrutura em 96% dos casos?","o":["Ovário","Tuba uterina (ampola)","Cavidade peritoneal","Cicatriz de cesárea"],"c":1}',
      },
      {
        front: "Qual é o nível de β-hCG para indicar tratamento com METOTREXATO?",
        back: '__MC__{"q":"Para tratar ectópica com metotrexato, β-hCG deve ser <:","o":["2000 mUI/mL","3500 mUI/mL","5000 mUI/mL","7000 mUI/mL"],"c":2}',
      },
      {
        front: "Abortamento é definido como perda gestacional com menos de QUANTAS semanas?",
        back: '__MC__{"q":"Abortamento é interrupção da gestação com:","o":["< 12 semanas","< 16 semanas","< 20 semanas ou feto < 500g","< 28 semanas"],"c":2}',
      },
      {
        front: "Na AMEAÇA de abortamento, o colo está ABERTO ou FECHADO?",
        back: '__MC__{"q":"Na ameaça de abortamento:","o":["Sangramento + colo aberto","Sangramento + colo FECHADO + embrião vivo","Produtos totalmente expulsos","Óbito embrionário retido"],"c":1}',
      },
      {
        front: "Qual é a idade gestacional mínima para PPT?",
        back: '__MC__{"q":"Parto prematuro é definido como parto entre:","o":["16-28 semanas","20-36+6 semanas","28-37 semanas","32-37 semanas"],"c":1}',
      },
      {
        front: "Qual é a medida PREVENTIVA para PPT em gestante com colo curto?",
        back: '__MC__{"q":"Para prevenir PPT em gestante com colo < 25 mm, usa-se:","o":["Repouso absoluto","Progesterona vaginal","Nifedipino","Antibióticos"],"c":1}',
      },
      {
        front: "Qual é o tocolítico de PRIMEIRA ESCOLHA para ameaça de PPT?",
        back: '__MC__{"q":"O tocolítico de 1ª linha para ameaça de PPT é:","o":["Atosibana","Nifedipino (bloqueador de cálcio)","Indometacina","Sulfato de magnésio"],"c":1}',
      },
      {
        front: "RPM é diagnosticada quando há ruptura ANTES do:",
        back: '__MC__{"q":"Ruptura prematura de membranas (RPM) ocorre:","o":["Antes da 34 semanas","Antes da 37 semanas","ANTES do início do trabalho de parto (qualquer IG)","Após 30 minutos do parto"],"c":2}',
      },
      {
        front: "O teste do NITRAZINA na RPM fica de qual COR?",
        back: '__MC__{"q":"O teste do nitrazina na RPM fica:","o":["Amarelo (pH < 6)","Azul (pH > 6 - liquor é alcalino)","Rosa","Verde"],"c":1}',
      },
      {
        front: "A ciclo menstrual normal dura de QUANTOS dias?",
        back: '__MC__{"q":"O ciclo menstrual normal dura:","o":["14-21 dias","21-28 dias","21-35 dias","35-40 dias"],"c":2}',
      },
      {
        front: "O volume NORMAL do fluxo menstrual é?",
        back: '__MC__{"q":"O volume normal de fluxo menstrual é:","o":["< 30 mL","< 50 mL","< 80 mL","< 120 mL"],"c":2}',
      },
      {
        front: "Em qual dia do ciclo ocorre a OVULAÇÃO normalmente?",
        back: '__MC__{"q":"A ovulação ocorre normalmente no:","o":["7º dia","10º dia","14º dia","21º dia"],"c":2}',
      },
      {
        front: "Qual é a duração NORMAL da fase lútea?",
        back: '__MC__{"q":"A fase lútea (pós-ovulação) dura aproximadamente:","o":["7-10 dias","10-12 dias","12-14 dias","14-16 dias"],"c":2}',
      },
      {
        front: "Em qual trimestre ocorrem a MAIORIA das anomalias congênitas?",
        back: '__MC__{"q":"A maioria das anomalias congênitas ocorre durante:","o":["Pré-concepção","1º trimestre (organogênese)","2º trimestre","3º trimestre"],"c":1}',
      },
      {
        front: "Em qual semana é realizada a USG MORFOLÓGICA de 2º trimestre?",
        back: '__MC__{"q":"A USG morfológica é realizada entre:","o":["14-18 semanas","18-22 semanas","20-24 semanas","24-28 semanas"],"c":2}',
      },
      {
        front: "Qual é a FCF (frequência cardíaca fetal) NORMAL?",
        back: '__MC__{"q":"A frequência cardíaca fetal normal é:","o":["80-100 bpm","100-120 bpm","110-160 bpm","160-180 bpm"],"c":2}',
      },
      {
        front: "O que significa DIP II na cardiotocografia?",
        back: '__MC__{"q":"DIP II na CTG indica:","o":["Compressão fisiológica do cordão","Hipóxia uteroplacentária (patológico)","Movimento fetal normal","Contração uterina normal"],"c":1}',
      },
      {
        front: "RCIU GRAVE é definida como PFE menor que qual percentil?",
        back: '__MC__{"q":"RCIU grave é definida como PFE <:","o":["P10","P5","P3","P1"],"c":2}',
      },
      {
        front: "Qual é o Pico sistólico NORMAL da ACM (artéria cerebral média fetal)?",
        back: '__MC__{"q":"Pico sistólico normal da ACM é:","o":["< 0,8 MoM","< 1,2 MoM","< 1,5 MoM","< 2,0 MoM"],"c":2}',
      },
      {
        front: "Qual é o principal HORMÔNIO responsável por isoimunização no Rh-?",
        back: '__MC__{"q":"A isoimunização Rh- é causada por:","o":["Anticorpos anti-D (IgG)","IgM","IgA","IgE"],"c":0}',
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "abdome-agudo-cirurgia-digestiva",
    title: "Abdome Agudo — Cirurgia Digestiva",
    exam: "Medicina",
    subject: "Cirurgia Geral",
    year: 2026,
    color: 2,
    description: "110 flashcards sobre Abdome Agudo: conceitos gerais, fisiopatologia da dor, abdome agudo inflamatório (apendicite, colecistite, pancreatite, diverticulite, DIP), perfurativo, obstrutivo, vascular, hemorrágico + questões comentadas de concursos.",
    tags: ["Cirurgia", "Abdome Agudo", "Apendicite", "Pancreatite", "Residência", "Medicina"],
    cards: [
      // ═══════════════════════════════════════════════════════════════════════
      // 1 — CONCEITOS GERAIS & DEFINIÇÃO (8 cards)
      // ═══════════════════════════════════════════════════════════════════════
      {
        front: "O que é abdome agudo? Defina o conceito.",
        back: "Conjunto de sinais e sintomas caracterizados por dor abdominal de aparecimento súbito, causada por afecção não traumática localizada em estrutura na cavidade abdominal, com duração mínima de 6 horas, que necessita tratamento imediato, clínico ou cirúrgico.",
      },
      {
        front: "Qual é a duração MÍNIMA de dor para definir abdome agudo?",
        back: '__MC__{"q":"A duração mínima de dor para definir abdome agudo é:","o":["2 horas","4 horas","6 horas","12 horas"],"c":2}',
      },
      {
        front: "O abdome agudo SEMPRE necessita de tratamento cirúrgico?",
        back: '__MC__{"q":"O abdome agudo SEMPRE necessita de tratamento cirúrgico?","o":["Sim, todo abdome agudo é cirúrgico","Não, 30-70% dos casos são NÃO cirúrgicos","Não, apenas 10% são cirúrgicos","Sim, mas apenas após 24h de observação"],"c":1}',
      },
      {
        front: "O abdome agudo pode ser causado por traumatismo?",
        back: '__MC__{"q":"O abdome agudo é causado por:","o":["Trauma abdominal fechado","Afecção NÃO traumática na cavidade abdominal","Qualquer dor abdominal aguda","Apenas infecções intra-abdominais"],"c":1}',
      },
      {
        front: "Qual das seguintes NÃO é uma causa de abdome agudo?",
        back: '__MC__{"q":"Qual NÃO é causa de abdome agudo?","o":["Inflamatória","Perfurativa","Traumática penetrante","Vascular"],"c":2}',
      },
      {
        front: "Quais são as 5 grandes categorias de abdome agudo?",
        back: "Inflamatório, Perfurativo, Obstrutivo, Vascular e Hemorrágico.",
      },
      {
        front: "Qual dos seguintes é um exemplo de abdome agudo VASCULAR?",
        back: '__MC__{"q":"Exemplo de abdome agudo vascular:","o":["Apendicite","Torção do pedículo de cisto ovariano","Úlcera perfurada","Diverticulite"],"c":1}',
      },
      {
        front: "Cite exemplos de abdome agudo HEMORRÁGICO.",
        back: "Gravidez ectópica rota, ruptura do baço, ruptura de aneurisma de aorta abdominal, cisto ovariano hemorrágico, necrose tumoral, endometriose.",
      },
      // ═══════════════════════════════════════════════════════════════════════
      // 2 — FISIOPATOLOGIA DA DOR ABDOMINAL (6 cards)
      // ═══════════════════════════════════════════════════════════════════════
      {
        front: "Qual tipo de dor abdominal tem origem no PERITÔNIO PARIETAL?",
        back: '__MC__{"q":"A dor de origem no peritônio parietal é chamada de:","o":["Dor visceral","Dor somática ou parietal","Dor referida","Dor neuropática"],"c":1}',
      },
      {
        front: "Caracterize a DOR SOMÁTICA (parietal) no abdome agudo.",
        back: "Dor constante, fixa, que se acentua com os movimentos. O paciente fica IMÓVEL (peritonite). Exemplo: dor em FID na apendicite.",
      },
      {
        front: "Caracterize a DOR VISCERAL no abdome agudo.",
        back: "Provocada por distensão ou contração de vísceras ocas, de localização imprecisa. O paciente se movimenta constantemente (dor tipo cólica).",
      },
      {
        front: "O que é DOR REFERIDA (ou irradiada) no abdome agudo?",
        back: "Dor de origem intra-abdominal que se manifesta em área anatomicamente distante, por compartilhar os mesmos circuitos neurais centrais. Exemplo: dor no ombro direito por irritação do diafragma.",
      },
      {
        front: "Paciente com peritonite (irritação peritoneal) provavelmente apresenta que tipo de dor e comportamento?",
        back: '__MC__{"q":"Na peritonite, a dor é do tipo:","o":["Visceral — paciente se movimenta","Somática — paciente fica imóvel","Cólica — paciente caminha","Referida — sem alteração comportamental"],"c":1}',
      },
      {
        front: "A dor no ombro direito por irritação do diafragma é um exemplo de:",
        back: '__MC__{"q":"Dor no ombro direito por irritação diafragmática é:","o":["Dor somática","Dor visceral","Dor referida","Dor psicogênica"],"c":2}',
      },
      // ═══════════════════════════════════════════════════════════════════════
      // 3 — EPIDEMIOLOGIA & DIAGNÓSTICO (8 cards)
      // ═══════════════════════════════════════════════════════════════════════
      {
        front: "Qual é o pico de incidência do abdome agudo?",
        back: '__MC__{"q":"O pico de incidência do abdome agudo ocorre entre:","o":["12-18 anos","18-24 anos","25-35 anos","40-50 anos"],"c":1}',
      },
      {
        front: "Qual a principal ferramenta diagnóstica no abdome agudo?",
        back: '__MC__{"q":"A principal ferramenta diagnóstica no abdome agudo é:","o":["TC de abdome","Anamnese detalhada + Exame Físico minucioso","Ultrassonografia","Ressonância magnética"],"c":1}',
      },
      {
        front: "Por que a primeira avaliação do abdome agudo é a mais importante?",
        back: "Porque a analgesia pode alterar o exame físico subsequente. A primeira avaliação sem analgesia fornece os sinais mais fidedignos.",
      },
      {
        front: "Qual é a melhor forma de determinar a progressão ou resolução do abdome agudo?",
        back: '__MC__{"q":"A melhor forma de determinar a progressão do abdome agudo é:","o":["Repetir exames laboratoriais a cada 6h","Avaliações seriadas pelo mesmo médico","TC de abdome contrastada diariamente","USG de repetição"],"c":1}',
      },
      {
        front: "Quais exames compõem a avaliação INICIAL do abdome agudo?",
        back: "Hemograma, EQU (Elementos Anormais da Urina), Amilase, β-hCG.",
      },
      {
        front: "Quais são as 3 incidências do RX de abdome agudo?",
        back: "1. Tórax AP (pneumoperitônio). 2. Abdome em ortostatismo. 3. Abdome em decúbito dorsal.",
      },
      {
        front: "Para que serve a dosagem de β-hCG na avaliação inicial do abdome agudo?",
        back: '__MC__{"q":"O β-hCG na avaliação inicial serve para:","o":["Diagnosticar pancreatite","Descartar gravidez ectópica em mulheres em idade fértil","Avaliar função hepática","Diagnosticar DIP"],"c":1}',
      },
      {
        front: "Para que serve a dosagem de AMILASE na avaliação inicial do abdome agudo?",
        back: "Para investigar pancreatite aguda (elevação ≥ 2x o normal, com sensibilidade de 70-80%, após 6h do início da dor).",
      },
      // ═══════════════════════════════════════════════════════════════════════
      // 4 — ABDOME AGUDO INFLAMATÓRIO — GERAL (6 cards)
      // ═══════════════════════════════════════════════════════════════════════
      {
        front: "Qual é o tipo MAIS COMUM de abdome agudo?",
        back: '__MC__{"q":"O tipo mais comum de abdome agudo é:","o":["Perfurativo","Inflamatório","Obstrutivo","Vascular"],"c":1}',
      },
      {
        front: "Qual é a principal causa de abdome agudo INFLAMATÓRIO?",
        back: '__MC__{"q":"A principal causa de abdome agudo inflamatório é:","o":["Colecistite aguda","Pancreatite aguda","Apendicite aguda","Diverticulite"],"c":2}',
      },
      {
        front: "Características clínicas comuns do abdome agudo inflamatório:",
        back: "Dor de início agudo, média intensidade, insidiosa e progressiva; náuseas, vômitos, queda do estado geral; febre; sinais de irritação peritoneal; hemograma infeccioso (leucocitose). Intervalo longo entre início dos sintomas e procura de atendimento.",
      },
      {
        front: "Qual das seguintes é uma causa de abdome agudo inflamatório?",
        back: '__MC__{"q":"Todas são causas de abdome agudo inflamatório, EXCETO:","o":["Apendicite aguda","Colecistite aguda","Isquemia mesentérica","Doença inflamatória pélvica"],"c":2}',
      },
      {
        front: "No abdome agudo inflamatório, os RHA (ruídos hidroaéreos) tipicamente estão:",
        back: '__MC__{"q":"Na apendicite aguda, os ruídos hidroaéreos (RHA) geralmente estão:","o":["Aumentados (metálicos)","Diminuídos ou ausentes","Normais","Com hipertimpanismo"],"c":1}',
      },
      {
        front: "Cite as principais etiologias do abdome agudo inflamatório.",
        back: "1. Apendicite Aguda. 2. Colecistite Aguda. 3. Pancreatite Aguda (ou crônica agudizada). 4. Diverticulite. 5. Doença Inflamatória Pélvica (DIP).",
      },
      // ═══════════════════════════════════════════════════════════════════════
      // 5 — APENDICITE AGUDA (14 cards)
      // ═══════════════════════════════════════════════════════════════════════
      {
        front: "Qual é a principal causa de abdome agudo cirúrgico?",
        back: '__MC__{"q":"A causa mais comum de abdome agudo cirúrgico é:","o":["Colecistite aguda","Apendicite aguda","Úlcera perfurada","Pancreatite aguda"],"c":1}',
      },
      {
        front: "Qual a sequência típica da dor na apendicite aguda?",
        back: "Dor abdominal INICIALMENTE periumbilical que MIGRA para fossa ilíaca direita (FID), acompanhada de anorexia, febre e irritação peritoneal localizada.",
      },
      {
        front: "O diagnóstico da apendicite aguda é eminentemente:",
        back: '__MC__{"q":"O diagnóstico da apendicite aguda é eminentemente:","o":["Tomográfico","Clínico (Anamnese + Exame Físico)","Ultrassonográfico","Laboratorial"],"c":1}',
      },
      {
        front: "Qual achado laboratorial é esperado na apendicite aguda?",
        back: '__MC__{"q":"Na apendicite aguda, o hemograma tipicamente mostra:","o":["Anemia e plaquetopenia","Leucocitose com desvio à esquerda","Eosinofilia","Leucopenia com linfocitose"],"c":1}',
      },
      {
        front: "Descreva a fisiopatologia da apendicite aguda em suas 4 fases.",
        back: "1. Fase edematosa: obstrução do lúmen → secreção persistente → aumento da pressão luminal. 2. Fase fibrinosa: estase → proliferação bacteriana. 3. Fase flegmonosa: edema → obstrução linfática → ulceração da mucosa. 4. Fase perfurativa/gangrenosa: obstrução venosa e arterial → perfuração.",
      },
      {
        front: "Na apendicite, a obstrução do lúmen leva a qual sequência evolutiva?",
        back: "__MC__{\"q\":\"Qual sequência corresponde às fases evolutivas da apendicite?\",\"o\":[\"Catarral → Gangrenosa → Flegmonosa → Perfurativa\",\"Catarral → Flegmonosa → Gangrenosa → Perfurativa\",\"Flegmonosa → Catarral → Perfurativa → Gangrenosa\",\"Gangrenosa → Flegmonosa → Catarral → Perfurativa\"],\"c\":1}",
      },
      {
        front: "O SINAL DE BLUMBERG é pesquisado em qual condição?",
        back: "__MC__{\"q\":\"O sinal de Blumberg (descompressão dolorosa) é característico de: \",\"o\":[\"Pancreatite\",\"Irritação peritoneal (apendicite)\",\"Colecistite\",\"Diverticulite\"],\"c\":1}",
      },
      {
        front: "O SINAL DE ROVSING na apendicite consiste em:",
        back: "Palpação profunda da FIE (fossa ilíaca esquerda) que causa dor na FID por deslocamento retrógrado de gases no cólon, distendendo o ceco e estimulando o apêndice inflamado.",
      },
      {
        front: "O SINAL DO PSOAS é característico de apendicite com:",
        back: "__MC__{\"q\":\"O sinal do psoas indica apendicite: \",\"o\":[\"Simples (catarral)\",\"Retrocecal (apêndice em contato com o m. psoas)\",\"Gangrenosa\",\"Perfurada\"],\"c\":1}",
      },
      {
        front: "O SINAL DO OBTURADOR na apendicite indica:",
        back: "Irritação do músculo obturador interno, presente na apendicite pélvica. É pesquisado pela rotação interna passiva do quadril direito, que causa dor hipogástrica.",
      },
      {
        front: "Qual é o tratamento da apendicite aguda?",
        back: "__MC__{\"q\":\"O tratamento da apendicite aguda é: \",\"o\":[\"Clínico com antibióticos\",\"Cirúrgico (apendicectomia)\",\"Clínico com analgesia e observação\",\"Drenagem percutânea\"],\"c\":1}",
      },
      {
        front: "Paciente com 20 anos, dor iniciada há 18h em epigástrio que migrou para FID com contratura muscular reflexa. Hemograma e USG normais. É possível descartar apendicite?",
        back: "NÃO. O diagnóstico de apendicite é CLÍNICO. Exames complementares normais NÃO descartam apendicite quando a história e o exame físico são sugestivos. A conduta é cirúrgica.",
      },
      {
        front: "Na suspeita de apendicite aguda com 36h de evolução, deve-se aguardar TC se disponível?",
        back: "__MC__{\"q\":\"Na suspeita de apendicite com 36h de evolução, deve-se: \",\"o\":[\"Aguardar a TC sempre\",\"Não retardar a cirurgia — risco de perfuração aumenta 5% a cada 12h\",\"Iniciar antibiótico e agendar TC eletiva\",\"Solicitar USG seriada\"],\"c\":1}",
      },
      {
        front: "A ausência de sinais de irritação peritoneal descarta apendicite aguda?",
        back: "NÃO. Paciente com história clínica sugestiva mas sem sinais de irritação peritoneal não deve ter o diagnóstico descartado. Fases iniciais (catarral/flegmonosa) podem não apresentar irritação peritoneal evidente.",
      },
      // ═══════════════════════════════════════════════════════════════════════
      // 6 — DOENÇA INFLAMATÓRIA PÉLVICA (DIP) (6 cards)
      // ═══════════════════════════════════════════════════════════════════════
      {
        front: "Qual é o perfil da paciente típica com DIP?",
        back: "__MC__{\"q\":\"A DIP é mais comum em: \",\"o\":[\"Mulheres na pós-menopausa\",\"Mulheres com vida sexual ativa (jovens)\",\"Adolescentes virgens\",\"Gestantes\"],\"c\":1}",
      },
      {
        front: "Quais são os principais agentes etiológicos da DIP?",
        back: "Polimicrobiana: Neisseria gonorrhoeae (gonococo) + Chlamydia trachomatis (clamídia), com possível participação de anaeróbios. Ascensão de micro-organismos do trato genital inferior.",
      },
      {
        front: "Qual complicação FUTURA a DIP pode causar?",
        back: "__MC__{\"q\":\"A DIP eleva o risco de: \",\"o\":[\"Câncer de ovário\",\"Gravidez ectópica e infertilidade\",\"Diabetes gestacional\",\"Trombose venosa profunda\"],\"c\":1}",
      },
      {
        front: "Quais são as manifestações clínicas da DIP?",
        back: "Dor à palpação em abdome inferior, hipertermia vaginal, febre, dor às palpadas das regiões anexiais, dor à mobilização do colo uterino, secreção vaginal/cervical anormal, massa pélvica, abaulamento do fundo de saco e sinais de irritação peritoneal.",
      },
      {
        front: "Qual estrutura é comprometida na DIP?",
        back: "__MC__{\"q\":\"A DIP compromete quais estruturas do trato genital?\",\"o\":[\"Apenas vagina e vulva\",\"Endométrio, trompas, ovários e peritônio (espectro ascendente)\",\"Apenas colo uterino\",\"Apenas ovários\"],\"c\":1}",
      },
      {
        front: "Qual complicação AGUDA grave da DIP?",
        back: "__MC__{\"q\":\"Complicação aguda grave da DIP: \",\"o\":[\"Abscesso tubo-ovariano e peritonite purulenta\",\"Hemorragia pós-parto\",\"Rotura uterina\",\"Mola hidatiforme\"],\"c\":0}",
      },
      // ═══════════════════════════════════════════════════════════════════════
      // 7 — COLECISTITE AGUDA & COLANGITE (12 cards)
      // ═══════════════════════════════════════════════════════════════════════
      {
        front: "Qual é a fisiopatologia da colecistite aguda litiásica?",
        back: "Obstrução do ducto cístico por cálculo impactado no infundíbulo, tornando a vesícula inflamada e distendida.",
      },
      {
        front: "Os tipos de colecistite aguda são:",
        back: "__MC__{\"q\":\"São tipos de colecistite aguda: \",\"o\":[\"Simples e complicada\",\"Litiásica (97%) e Alitiásica (3%)\",\"Primária e secundária\",\"Edematosa e necrotizante\"],\"c\":1}",
      },
      {
        front: "Tríade clínica típica da colecistite aguda:",
        back: "__MC__{\"q\":\"A tríade clínica da colecistite aguda é: \",\"o\":[\"Dor HD, náuseas/vômitos, sinal de Murphy\",\"Dor FID, febre, anorexia\",\"Dor em faixa, icterícia, vômitos\",\"Dor FIE, febre, pneumatúria\"],\"c\":0}",
      },
      {
        front: "O SINAL DE MURPHY é característico de qual patologia?",
        back: "__MC__{\"q\":\"O sinal de Murphy (parada brusca da inspiração à palpação do HD) é típico de: \",\"o\":[\"Apendicite\",\"Colecistite aguda\",\"Pancreatite\",\"Diverticulite\"],\"c\":1}",
      },
      {
        front: "O exame de imagem PADRÃO-OURO para diagnosticar colecistite aguda é:",
        back: "__MC__{\"q\":\"Exame padrão-ouro para colecistite aguda: \",\"o\":[\"TC de abdome\",\"USG de abdome\",\"RX de abdome\",\"Colangio-RM\"],\"c\":1}",
      },
      {
        front: "Qual o tratamento de escolha para colecistite aguda?",
        back: "__MC__{\"q\":\"Tratamento da colecistite aguda: \",\"o\":[\"Clínico com antibióticos apenas\",\"Colecistectomia videolaparoscópica\",\"Drenagem percutânea\",\"Litotripsia\"],\"c\":1}",
      },
      {
        front: "Defina COLANGITE AGUDA.",
        back: "Infecção bacteriana do sistema ductal biliar (E. coli, Klebsiella pneumoniae, Bacteroides fragilis, Enterococos) causada por obstrução biliar + concentração bacteriana na bile de estase.",
      },
      {
        front: "Qual a TRÍADE DE CHARCOT na colangite aguda?",
        back: "__MC__{\"q\":\"A Tríade de Charcot na colangite é composta por: \",\"o\":[\"Icterícia, febre, vômitos\",\"Icterícia, febre e dor abdominal\",\"Febre, hipotensão, confusão\",\"Dor, anemia, icterícia\"],\"c\":1}",
      },
      {
        front: "Qual a PÊNTADE DE REYNOLD na colangite aguda?",
        back: "Icterícia + Febre + Dor abdominal + Obnubilação mental + Hipotensão = Colangite TÓXICA (forma grave).",
      },
      {
        front: "Qual o tratamento da colangite aguda?",
        back: "__MC__{\"q\":\"Tratamento da colangite aguda: \",\"o\":[\"ATB isolado\",\"ATB + desobstrução da via biliar\",\"Apenas drenagem cirúrgica\",\"Apenas suporte clínico\"],\"c\":1}",
      },
      {
        front: "Em quais situações está indicada descompressão URGENTE das vias biliares na colangite?",
        back: "Dor abdominal persistente, hipotensão refratária, febre > 39°C, confusão mental.",
      },
      {
        front: "Qual método de drenagem biliar de urgência reduz a mortalidade na colangite grave?",
        back: "__MC__{\"q\":\"A drenagem que reduz mortalidade na colangite grave é: \",\"o\":[\"Cirúrgica (coledocotomia)\",\"Endoscópica por CPRE (stents)\",\"Percutânea\",\"Colecistostomia\"],\"c\":1}",
      },
      // ═══════════════════════════════════════════════════════════════════════
      // 8 — PANCREATITE AGUDA (14 cards)
      // ═══════════════════════════════════════════════════════════════════════
      {
        front: "Quantos por cento dos casos de abdome agudo são NÃO cirúrgicos?",
        back: "__MC__{\"q\":\"A porcentagem de abdome agudo NÃO cirúrgico é: \",\"o\":[\"5-10%\",\"10-20%\",\"30-70%\",\"80-90%\"],\"c\":2}",
      },
      {
        front: "Quais as 3 principais causas de pancreatite aguda?",
        back: "1. Litíase biliar (70%). 2. Etilismo (2º mais comum). 3. Hipertrigliceridemia (3º).",
      },
      {
        front: "Descreva a dor típica da pancreatite aguda.",
        back: "Dor abdominal em faixa (epigástrio irradiando para dorso/hipocôndrio esquerdo), intensa, contínua, súbita. O paciente assume a posição de 'prece maometana' (semi-fletido).",
      },
      {
        front: "Como a amilase sérica se comporta na pancreatite aguda?",
        back: "__MC__{\"q\":\"Na pancreatite aguda, a amilase sérica: \",\"o\":[\"Eleva-se imediatamente (1h após dor)\",\"Eleva-se 2x acima do normal após 6h da dor — sensibilidade 70-80%\",\"Eleva-se apenas após 48h\",\"Não se eleva — usar lipase\"],\"c\":1}",
      },
      {
        front: "Quais as formas histopatológicas da pancreatite aguda?",
        back: "__MC__{\"q\":\"As formas histopatológicas da pancreatite aguda são: \",\"o\":[\"Litiásica e alcoólica\",\"Edematosa (80%) e Necrotizante (20%)\",\"Leve e grave\",\"Primária e secundária\"],\"c\":1}",
      },
      {
        front: "Quais são os critérios de gravidade na pancreatite aguda? (Classificação de Atlanta 1992)",
        back: "Leve: sem disfunção orgânica. Grave: ≥ 3 critérios de Ranson ou ≥ 8 de APACHE II, com falência orgânica e/ou necrose pancreática.",
      },
      {
        front: "Qual parâmetro NÃO faz parte dos critérios de Ranson para pancreatite?",
        back: "__MC__{\"q\":\"Qual NÃO é critério de Ranson?\",\"o\":[\"Idade > 55 anos\",\"Glicemia > 200 mg/dL\",\"TGP (ALT)\",\"Leucócitos > 16.000/mm³\"],\"c\":2}",
      },
      {
        front: "Qual é a fisiopatologia da pancreatite aguda?",
        back: "Processo inflamatório do pâncreas, geralmente por natureza química, provocado por enzimas por ele próprio produzidas, resultando em autodigestão da glândula.",
      },
      {
        front: "Quais os achados de exame físico na pancreatite aguda?",
        back: "Abdome geralmente flácido (sem defesa), sem correlação com o estado geral grave. Pode haver defesa/rigidez, massa dolorosa no epigástrio, distensão abdominal, RHA diminuídos ou ausentes.",
      },
      {
        front: "Quais sintomas acompanham a dor na pancreatite aguda?",
        back: "Náuseas e vômitos frequentes, parada de eliminação de gases e fezes (60%), dispneia.",
      },
      {
        front: "O tratamento inicial da pancreatite aguda é:",
        back: "__MC__{\"q\":\"O tratamento inicial da pancreatite aguda é: \",\"o\":[\"Cirúrgico imediato\",\"Clínico conservador (NPO + analgesia)\",\"Endoscópico (CPRE)\",\"ATB de amplo espectro\"],\"c\":1}",
      },
      {
        front: "Quando está indicada CIRURGIA na pancreatite aguda?",
        back: "__MC__{\"q\":\"A cirurgia na pancreatite aguda é indicada em caso de: \",\"o\":[\"Sempre\",\"Necrose infectada\",\"Icterícia\",\"Dor refratária\"],\"c\":1}",
      },
      {
        front: "A necrosectomia pancreática na pancreatite aguda DEVE ser feita de imediato?",
        back: "NÃO. A necrosectomia deve ser POSTERGADA (diferida). O tratamento inicial é clínico conservador. A cirurgia é indicada apenas se houver necrose infectada comprovada.",
      },
      {
        front: "Paciente com pancreatite aguda grave de origem biliar evolui com piora em 48h: icterícia crescente, febre, leucocitose, necrose 30%, cálculo no colédoco. Qual a conduta?",
        back: "__MC__{\"q\":\"Na pancreatite biliar grave com colangite associada, a conduta é: \",\"o\":[\"Necrosectomia imediata\",\"ATB + CPRE com papiloesfincterotomia e retirada do cálculo\",\"Apenas ATB\",\"Cirurgia aberta com colecistectomia + exploração de vias biliares\"],\"c\":1}",
      },
      // ═══════════════════════════════════════════════════════════════════════
      // 9 — DIVERTICULITE AGUDA (8 cards)
      // ═══════════════════════════════════════════════════════════════════════
      {
        front: "O que é diverticulite aguda?",
        back: "Perfuração de um divertículo, resultado da ação erosiva de um fecálito ou aumento da pressão intraluminal, levando a quadro de peritonite.",
      },
      {
        front: "A diverticulite aguda é conhecida como:",
        back: '__MC__{"q":"A diverticulite aguda é chamada de:","o":["Apendicite direita","Apendicite esquerda","Pancreatite do idoso","Colecistite atípica"],"c":1}',
      },
      {
        front: "Fatores de risco para doença diverticular dos cólons:",
        back: '__MC__{"q":"A doença diverticular dos cólons atinge:","o":["Apenas jovens < 30 anos","1/3 da população > 50 anos e 2/3 > 80 anos","Igualmente todas as idades","Apenas homens > 60 anos"],"c":1}',
      },
      {
        front: "Qual o quadro clínico típico da diverticulite aguda?",
        back: "Dor na fossa ilíaca ESQUERDA (FIE) + febre persistente. Pode haver massa palpável na FIE, sinais de peritonite localizada e pneumatúria se fístula para bexiga.",
      },
      {
        front: "Qual o exame PADRÃO-OURO para diagnóstico de diverticulite?",
        back: '__MC__{"q":"O exame padrão-ouro para diverticulite é:","o":["RX de abdome","USG","TC de abdome","Colonoscopia"],"c":2}',
      },
      {
        front: "A colonoscopia está indicada na fase aguda da diverticulite?",
        back: '__MC__{"q":"A colonoscopia na fase aguda da diverticulite:","o":["É o exame de escolha","É contraindicada (risco de perfuração)","Pode ser feita com preparo reduzido","Indicada após TC"],"c":1}',
      },
      {
        front: "Qual o tratamento CLÍNICO da diverticulite aguda?",
        back: "Correção dos distúrbios hidroeletrolíticos + antibiótico de amplo espectro (aminoglicosídeos ou ceftriaxona + metronidazol).",
      },
      {
        front: "Em quais situações a diverticulite aguda requer tratamento CIRÚRGICO?",
        back: "Falha do tratamento clínico, perfuração livre, choque séptico. A cirurgia consiste em ressecção da zona lesada + colostomia (cirurgia de Hartmann).",
      },
      // ═══════════════════════════════════════════════════════════════════════
      // 10 — ABDOME AGUDO PERFURATIVO (10 cards)
      // ═══════════════════════════════════════════════════════════════════════
      {
        front: "Qual a fisiopatologia básica do abdome agudo PERFURATIVO?",
        back: "Peritonite secundária a perfuração de víscera oca com extravasamento de material para a cavidade abdominal.",
      },
      {
        front: "Características clínicas do abdome agudo perfurativo:",
        back: "Dor súbita e intensa; início súbito e bem determinado; defesa abdominal — abdome em tábua (contratura generalizada); intervalo curto entre início dos sintomas e procura de atendimento.",
      },
      {
        front: "O SINAL DE JOUBERT no abdome agudo perfurativo consiste em:",
        back: '__MC__{"q":"O sinal de Joubert é:","o":["Dor à descompressão brusca","Som timpânico à percussão do HD por interposição gasosa","Sinal de Murphy positivo","Massa palpável na FIE"],"c":1}',
      },
      {
        front: "Qual achado radiológico é clássico no abdome agudo perfurativo?",
        back: '__MC__{"q":"O achado radiológico clássico no abdome perfurativo é:","o":["Níveis hidroaéreos","Pneumoperitônio (ar sob o diafragma)","Calcificações","Derrame pleural"],"c":1}',
      },
      {
        front: "Principais etiologias do abdome agudo perfurativo:",
        back: "1. Úlcera gástrica perfurada. 2. Úlcera duodenal perfurada. 3. Doença diverticular perfurada. 4. Neoplasia gastrointestinal. 5. Víscera oca perfurada. 6. Apendicite perfurada. 7. Diverticulite complicada. 8. Doença de Crohn.",
      },
      {
        front: "O RX de tórax na úlcera péptica perfurada evidencia pneumoperitônio em qual porcentagem?",
        back: '__MC__{"q":"Na úlcera péptica perfurada, o RX de tórax evidencia pneumoperitônio em:","o":["50-60% dos casos","70-80% dos casos","98% dos casos","Sempre (100%)"],"c":2}',
      },
      {
        front: "Melhor incidência radiológica para evidenciar pneumoperitônio:",
        back: '__MC__{"q":"A melhor incidência radiológica para pneumoperitônio é:","o":["RX de abdome em decúbito","RX de TÓRAX AP (em pé)","RX em perfil","RX em decúbito lateral"],"c":1}',
      },
      {
        front: "Conduta na úlcera duodenal perfurada em paciente NÃO usuário de AINE:",
        back: "__MC__{\"q\":\"Na úlcera duodenal perfurada sem uso de AINE, a conduta é:\",\"o\":[\"Tratamento clínico exclusivo\",\"Sutura da perfuração + pós-op com erradicação de H. pylori\",\"Gastrectomia parcial\",\"Vagotomia + antrectomia\"],\"c\":1}",
      },
      {
        front: "Conduta na úlcera gástrica perfurada em idoso com instabilidade hemodinâmica:",
        back: "__MC__{\"q\":\"Na úlcera gástrica perfurada em idoso instável:\",\"o\":[\"Gastrectomia total\",\"Sutura da lesão com reforço de epiplon\",\"Tratamento clínico\",\"Ressecção ampla\"],\"c\":1}",
      },
      {
        front: "O tratamento do abdome agudo perfurativo é:",
        back: "__MC__{\"q\":\"O tratamento do abdome perfurativo é:\",\"o\":[\"Clínico\",\"Eminentemente cirúrgico (laparotomia ou laparoscopia)\",\"Endoscópico\",\"Antibiótico isolado\"],\"c\":1}",
      },
      // ═══════════════════════════════════════════════════════════════════════
      // 11 — ABDOME AGUDO OBSTRUTIVO, VASCULAR & HEMORRÁGICO (8 cards)
      // ═══════════════════════════════════════════════════════════════════════
      {
        front: "Causas de abdome agudo OBSTRUTIVO:",
        back: "Aderências, hérnia estrangulada, fecaloma, obstrução pilórica, volvo, intussuscepção, cálculo biliar, corpo estranho, bolo de áscaris.",
      },
      {
        front: "Causas de abdome agudo VASCULAR:",
        back: "Isquemia mesentérica, trombose mesentérica, torção do omento, torção do pedículo de cisto ovariano, infarto esplênico.",
      },
      {
        front: "Causas de abdome agudo HEMORRÁGICO:",
        back: "Gravidez ectópica rota, ruptura do baço, ruptura de aneurisma de aorta abdominal, cisto ovariano hemorrágico, necrose tumoral, endometriose.",
      },
      {
        front: "Paciente idosa com dor abdominal súbita e intensa, mas exame físico pouco exuberante (sem defesa ou descompressão dolorosa), leucocitose 19.000. Qual o diagnóstico mais provável?",
        back: "__MC__{\"q\":\"Dor intensa + exame físico pobre + leucocitose em idosa sugere:\",\"o\":[\"Apendicite\",\"Embolia mesentérica (isquemia)\",\"Pancreatite\",\"Úlcera perfurada\"],\"c\":1}",
      },
      {
        front: "Por que o abdome agudo vascular pode ter exame físico dissociado da gravidade?",
        back: "Porque na isquemia mesentérica, a dor é intensa e desproporcional ao exame físico (que pode ser oligossintomático nas fases iniciais — 'dor que não merece o exame'). A leucocitose é marcante.",
      },
      {
        front: "Sobre abdome agudo hemorrágico, marque a correta:",
        back: "__MC__{\"q\":\"No hemoperitônio, o exame físico geralmente:\",\"o\":[\"Mostra abdome em tábua\",\"É flácido sem contratura, mas com descompressão dolorosa\",\"É normal\",\"Tem massas palpáveis\"],\"c\":1}",
      },
      {
        front: "A anticoagulação pode estar relacionada com abdome agudo?",
        back: "__MC__{\"q\":\"A anticoagulação pode causar abdome agudo?\",\"o\":[\"Não, é contraindicação relativa\",\"Sim, por sangramento intra-abdominal espontâneo (ex: hematoma de bainha do reto, hemorragia retroperitoneal)\",\"Não, protege contra abdome agudo\",\"Sim, apenas em traumatizados\"],\"c\":1}",
      },
      {
        front: "Febre precedendo a dor abdominal sugere patologia cirúrgica?",
        back: "__MC__{\"q\":\"Febre precedendo dor abdominal geralmente indica:\",\"o\":[\"Patologia cirúrgica\",\"Patologia não cirúrgica (ex: infecciosa sistêmica)\",\"Apendicite\",\"Pancreatite\"],\"c\":1}",
      },
      // ═══════════════════════════════════════════════════════════════════════
      // 12 — QUESTÕES COMENTADAS (10 cards)
      // ═══════════════════════════════════════════════════════════════════════
      {
        front: "QUESTÃO: São situações que requerem tratamento cirúrgico desde o diagnóstico, EXCETO:\n\na) Empiema da vesícula biliar\nb) Necrose pancreática\nc) Apendicite aguda\nd) Peritonite secundária\ne) Abscesso esplênico",
        back: "__MC__{\"q\":\"Situações que requerem cirurgia desde o diagnóstico, EXCETO:\",\"o\":[\"Empiema da vesícula\",\"Necrose pancreática (deve ser postergada)\",\"Apendicite aguda\",\"Peritonite secundária\"],\"c\":1}",
      },
      {
        front: "QUESTÃO: Homem, 51 anos, dor pélvica 7 dias, vômitos, anorexia, febre, pneumatúria, IMC 35, massa dolorosa em FIE. Principal hipótese diagnóstica?",
        back: "__MC__{\"q\":\"Dor FIE + febre + pneumatúria + massa dolorosa sugere:\",\"o\":[\"Diverticulite aguda com fístula para bexiga\",\"Neoplasia de sigmoide fistulada\",\"Pionefrose\",\"Câncer de próstata fistulizado\"],\"c\":0}",
      },
      {
        front: "QUESTÃO: Paciente 70 anos, dor súbita e forte, abdome sem dor à descompressão, leucócitos 19.000 com desvio. Diagnóstico mais provável?",
        back: "__MC__{\"q\":\"Idoso com dor intensa + exame físico pobre + leucocitose:\",\"o\":[\"Apendicite\",\"Embolia mesentérica\",\"Pancreatite\",\"Úlcera perfurada\"],\"c\":1}",
      },
      {
        front: "QUESTÃO: Sobre apendicite aguda, julgue as afirmações:\nI. Ausência de sinais peritoneais descarta apendicite.\nII. Suspeita com 36h, não aguardar TC (perfuração +5% a cada 12h).\nIII. Dor epigástrica→FID, contratura, exames normais descartam apendicite.",
        back: "__MC__{\"q\":\"Sobre apendicite, qual(is) está(ão) correta(s)?\",\"o\":[\"I e II\",\"I e III\",\"Apenas II\",\"II e III\"],\"c\":2}",
      },
      {
        front: "QUESTÃO (UFSM 2013): Julgue as afirmativas sobre abdome agudo:\nI. Febre precedendo dor → patologia cirúrgica.\nII. Vômito precedendo dor → patologia não cirúrgica.\nIII. Anticoagulação pode causar dor abdominal aguda.\nIV. Hemoperitônio: abdome flácido sem contratura, com descompressão dolorosa.",
        back: "__MC__{\"q\":\"Sequência correta (V/F) sobre abdome agudo:\",\"o\":[\"F-F-V-V\",\"V-F-F-F\",\"F-V-V-V\",\"F-F-V-F\"],\"c\":2}",
      },
      {
        front: "QUESTÃO: Sobre abdome agudo perfurativo:\nI. Úlcera duodenal perfurada sem AINE: sutura + erradicação H. pylori.\nII. Úlcera gástrica perfurada em idoso instável: sutura + epiplon.\nIII. RX tórax evidencia pneumoperitônio em 98%.",
        back: "__MC__{\"q\":\"Sobre abdome perfurativo, quais corretas?\",\"o\":[\"Apenas I\",\"I e II\",\"I e III\",\"Todas\"],\"c\":3}",
      },
      {
        front: "QUESTÃO: Sobre diverticulite aguda:\nI. Consenso: cirurgia eletiva após 2º episódio.\nII. Abscessos pericólicos < 3 cm: tratamento conservador.\nIII. Abscesso grande multiloculado: Hartmann ou colostomia em alça (resultados semelhantes).",
        back: "__MC__{\"q\":\"Sobre diverticulite, qual(is) correta(s)?\",\"o\":[\"Apenas I\",\"Apenas II\",\"I e II\",\"II e III\"],\"c\":1}",
      },
      {
        front: "QUESTÃO: São critérios prognósticos na pancreatite aguda, EXCETO:",
        back: "__MC__{\"q\":\"Qual NÃO é critério prognóstico na pancreatite aguda?\",\"o\":[\"Idade\",\"TGP (ALT)\",\"Desidrogenase lática (DHL)\",\"Glicemia\"],\"c\":1}",
      },
      {
        front: "QUESTÃO: Mulher 70 anos, dor QIE (quadrante inferior esquerdo) com descompressão dolorosa e febre. Diagnóstico mais provável?",
        back: "__MC__{\"q\":\"Idosa com dor FIE + descompressão + febre sugere:\",\"o\":[\"Ruptura de folículo\",\"Apendicite\",\"DIP\",\"Diverticulite aguda\"],\"c\":3}",
      },
      {
        front: "QUESTÃO (UFSM 2013): Pancreatite biliar grave evolui com piora 48h: icterícia crescente, febre, necrose 30%, cálculo colédoco. Conduta?",
        back: "__MC__{\"q\":\"Conduta na pancreatite biliar complicada com colangite:\",\"o\":[\"ATB + necrosectomia + colecistectomia + coledocostomia + drenagem\",\"ATB + necrosectomia + drenagem\",\"ATB + CPRE com papiloesfincterotomia + retirada do cálculo\",\"Apenas ATB\"],\"c\":2}",
      },
    ],
  },
];

window.PUBLIC_LIBRARY = PUBLIC_LIBRARY;

window.PUBLIC_LIBRARY = PUBLIC_LIBRARY;
