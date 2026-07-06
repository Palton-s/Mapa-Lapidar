// ============================================================
//  CONFIG · LOCAIS (prédios / departamentos)
// ============================================================
//  Campos de cada prédio:
//    id          -> identificador único (texto)
//    name        -> nome exibido no hover
//    description -> texto exibido no hover (aceita HTML simples)
//    x, y        -> CENTRO geométrico do prédio (coords da imagem)
//    lat, lng    -> (opcional) coordenada REAL. Se informada, o programa
//                   calcula x/y automaticamente a partir do GEO_REF.
//                   Se você puser lat/lng E x/y, o lat/lng tem prioridade.
//    latlng      -> (opcional) a MESMA coordenada, mas colada num só campo,
//                   como vem do Google Maps. Ex.:
//                     latlng: "-15.758377, -47.870247",
//    width,height-> tamanho do prédio. Número = PIXELS (ex.: 40).
//                   Texto com "m" = METROS (ex.: "30m"), convertido pela
//                   MAP_SCALE. Também aceita "40px".
//    angle       -> rotação em graus (gira em torno do centro do prédio)
//    color       -> nome da PALETTE ("azul", "verde"...) ou um "#hex"
//    radius      -> (opcional) arredondamento dos cantos em px. Se omitido,
//                   é calculado automático (cantos suaves).
//    svg         -> (opcional) SVG PRÓPRIO do prédio. Pode ser um <svg>
//                   completo (com viewBox): ele é redimensionado para caber
//                   em width×height. Por padrão ESTICA para preencher; para
//                   manter a proporção, adicione preserveAspectRatio="xMidYMid
//                   meet" no <svg>. Se null, usa o quadrado dourado.
//    panorama    -> (opcional) caminho de uma imagem 360; se existir,
//                   clicar no prédio abre o tour.
//    parts       -> (opcional) LISTA de partes, quando o prédio tem vários
//                   blocos separados. Cada parte aceita os MESMOS campos de
//                   posição/forma: x,y (ou lat,lng), width, height, angle,
//                   svg, radius. Se "parts" existir, ele substitui o
//                   x/y/width/height do prédio. Todas as partes reagem
//                   JUNTAS ao passar o mouse (hover), e no modo edição você
//                   arrasta cada parte separadamente.
//                   Ex.:
//                     parts: [
//                       { x: 820, y: 300, width: 60, height: 30, angle: 10 },
//                       { lat: -15.766, lng: -47.865, width: 40, height: 40 },
//                     ],
// ------------------------------------------------------------

// Forma (SVG) do ICC, compartilhada pelas duas partes do prédio.
const ICC_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="44.63 168.74 431.25 85.43">
  <path fill="currentColor" stroke="none" d="M 470.87553181144455,232.67721846750385 C 470.87553181144455,232.67721846750385 471.6529691709575,232.94704091288895 459.9706919252045,228.61387943962688 C 425.41495416579846,215.79786083386784 401.71482026827124,208.0172943224061 384.78986683322967,202.0573976604099 C 364.8607680219102,195.0382557207805 353.37208964332973,190.43764803118796 341.0431363402116,187.17882685635587 C 323.9345465379265,182.65631903688825 304.3586786142422,176.8475030616257 264.565464231178,173.90660063830398 C 257.5811358650416,173.3910201169682 248.73781746535474,174.21650039036217 241.71248711750138,174.838188015725 C 215.84958509694331,177.12702004866506 188.16910061189412,184.79219321519906 162.1865116468146,192.60505457783233 C 101.77495608540386,210.76827014255488 49.63457523433294,232.67721846750382 49.63457523433294,232.67721846750382 L 54.40484042252382,246.13664962317807 C 80.77137055826768,238.84234701080254 101.04807000697485,229.97379022478606 118.51050097943289,223.85397605014492 C 163.2670775435846,208.1664201137594 186.02075378599773,199.41266734963332 213.70481236795388,194.22091837353474 C 232.88392577289903,190.62365913902676 251.44573136164087,186.31234944407893 278.0672808950068,189.04103950389646 C 297.78080581783763,191.06152833507736 321.6403775524302,197.28125386293064 352.01395243215075,206.2700581230094 C 382.34000792970426,215.24330898093746 419.85232704368707,232.49341088471525 466.08112548065776,248.83106212575774 C 468.4644020408424,249.67320394141257 467.5060165213515,249.15896839613185 468.5573327124421,244.60254433044713 L 470.87553181144455,232.67721846750385 Z"/>
</svg>`;

const BUILDINGS = [

  {
    id: "icc",
    name: "ICC Norte",
    description: "Ala norte do Minhocão. Diversos institutos e salas de aula.",
    color: "#5b8def",
    // Mesma forma duplicada: uma parte em cima e outra embaixo, com um
    // vão entre elas. Ajuste a distância movendo os x/y (ou arraste cada
    // parte no modo Posicionar). Aumente a diferença para afastar mais.
    parts: [
      { latlng: "-15.763380724654429, -47.869083399919504", width: "695m", height: "115m", angle: 240, svg: ICC_SVG },
      { latlng: "-15.76358504755736, -47.869362434134864", width: "725m", height: "120m", angle: 240, svg: ICC_SVG },
    ],
    panorama: null,
  },
  {
    id: "PAT",
    name: "PAT",
    description: "Prédio do PAT.",
    lat: -15.759004389500056, lng: -47.87079819509181,
    width: "154m", height: "70m",
    angle: 75,
    color: "#5b8def",
    svg: null,
    panorama: null,
  },

  {
    id: "PJC",
    name: "PJC",
    description: "Prédio do PJC.",
    latlng: "-15.758377598901532, -47.87024755525104",
    width: "154m", height: "70m",
    angle: 75,
    color: "#5b8def",
    svg: null,
    panorama: null,
  },
  {
    id: "multiuso-i",
    name: "Multiuso I",
    description: "Prédio do Multiuso I.",
    // Coordenada colada num só campo (como vem do Google Maps):
    latlng: "-15.766969752316394, -47.86970679935755",
    width: 40, height: 20,
    angle: 55,
    color: "#e0a458",
    svg: null,
    panorama: null,
  },
  {
    id: "FACE",
    name: "FACE",
    description: "Prédio da FACE.",
    latlng: "-15.758501326161976, -47.871915698092266",
    width: "120m", height: "88m",
    angle: 75,
    color: "#5b8def",
    svg: null,
    panorama: null,
  },
  {
    id: "FD",
    name: "FD",
    description: "Prédio da FD.",
    // Posicionado pela coordenada real — o programa calcula o x/y.
    latlng: "-15.759564275684024, -47.87215804253725",
    width: "88m", height: "88m",
    angle: 75,
    color: "#5b8def",
    svg: null,
    panorama: null,
  },
  {
    id: "bce",
    name: "Biblioteca Central (BCE)",
    description: "Biblioteca Central da UnB.",
    latlng: "-15.760915566153686, -47.86786055432192",
    width: "65m", height: "130m",
    angle: 55,
    color: "#5b8def",
    svg: null,
    panorama: null,
  },
  {
    id: "reitoria",
    name: "Reitoria",
    description: "Reitoria da UnB.",
    latlng: "-15.762870623326213, -47.86701087874551",
    width: "50m", height: "80m",
    angle: 145,
    color: "#8595b0",
    svg: null,
    panorama: null,
  },
  {
    id: "beijodromo",
    name: "Beijódromo",
    description: "Beijódromo.",
    latlng: "-15.763930954215263, -47.86589698305221",
    width: "40m", height: "40m",
    angle: 125,
    color: "#f472b6",
    svg: null,
    panorama: null,
  },
  {
    id: "instituto-artes",
    name: "Instituto de Artes",
    description: "Instituto de Artes (IdA).",
    color: "#9b6dff",
    parts: [
      { latlng: "-15.765026991944637, -47.86433890472272",  width: "35m", height: "60m", angle: 120 },
      { latlng: "-15.764817991840724, -47.865126326432694", width: "10m", height: "35m", angle: 120 },
      { latlng: "-15.764687485191283, -47.864916751240486", width: "6m",  height: "15m", angle: 120 },
    ],
  },
  {
    id: "instituto-biologicas",
    name: "Instituto de Ciências Biológicas",
    description: "Instituto de Ciências Biológicas (IB).",
    latlng: "-15.766459133897186, -47.8650947912769",
    width: "140m", height: "250m",
    angle: 125,
    color: "#43c59e",
    svg: null,
    panorama: null,
  },
  {
    id: "instituto-quimica",
    name: "Instituto de Química",
    description: "Instituto de Química (IQ).",
    latlng: "-15.768486505384814, -47.86484240562605",
    width: "135m", height: "60m",
    angle: 125,
    color: "#e0576b",
    svg: null,
    panorama: null,
  },
  {
    id: "multiuso-2",
    name: "Multiuso 2",
    description: "Pavilhão Multiuso 2.",
    latlng: "-15.767942253248707, -47.86886062296353",
    width: "35m", height: "80m",
    angle: 145,
    color: "#e0a458",
    svg: null,
    panorama: null,
  },
  {
    id: "departamento-musica",
    name: "Departamento de Música",
    description: "Departamento de Música (MUS).",
    latlng: "-15.76495319199317, -47.87153416265127",
    width: "15m", height: "70m",
    angle: 145,
    color: "#f2c14e",
    svg: null,
    panorama: null,
  },
  {
    id: "restaurante-universitario",
    name: "Restaurante Universitário (RU)",
    description: "Restaurante Universitário.",
    latlng: "-15.764215887715292, -47.870433129110566",
    width: "40m", height: "60m",
    angle: 55,
    color: "#38bdf8",
    svg: null,
    panorama: null,
  },
  {
    id: "cead",
    name: "CEAD ⭐",
    description: "O prédio do CEAD",
    // Exemplo de prédio com VÁRIAS partes: um bloco maior + um anexo.
    // Passe o mouse: os dois crescem juntos. No modo edição, arraste
    // cada um separadamente.
    parts: [
      { latlng: "-15.771910497432854, -47.86577224076018", width: "30m", height: "80m", angle: -30 },

    ],
    // Ao ter panorama, clicar em qualquer parte abre o tour.
    panorama: "assets/360/predio-01.jpg",
  },
];
