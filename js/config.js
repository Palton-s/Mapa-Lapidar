// ============================================================
//  CONFIGURAÇÃO DO MAPA  —  edite APENAS este arquivo
// ============================================================
//
//  Sistema de coordenadas:
//    - (0,0) é o CANTO SUPERIOR ESQUERDO da imagem mapa.png
//    - x cresce para a direita, y cresce para baixo
//    - As coordenadas estão em PIXELS DA IMAGEM (não da tela),
//      então tudo escala junto quando você dá zoom / redimensiona.
//
//  Dica: ligue o "Modo edição" no site, clique no mapa para pegar
//  coordenadas e arraste os prédios. Depois copie a config gerada.
// ============================================================

const MAP_CONFIG = {
  image: "assets/mapa.png",

  // Coloque aqui o tamanho REAL (em pixels) da sua imagem mapa.png.
  // Se não souber, deixe assim e ajuste depois — não quebra nada.
  width: 1600,
  height: 1000,
};

// ------------------------------------------------------------
//  GEORREFERENCIAMENTO  (opcional, mas muito útil)
// ------------------------------------------------------------
//  Ligue as coordenadas REAIS (latitude/longitude do Google Maps)
//  aos PIXELS do seu mapa. Depois de cadastrar aqui, qualquer prédio
//  pode ser posicionado só informando "lat" e "lng" — o programa
//  calcula o x/y na tela sozinho.
//
//  Como pegar lat/lng no Google Maps: clique com o botão direito no
//  local -> aparece "-15.7595706, -47.8720123" (lat, lng).
//  No formato de URL "...!3d-15.7595706!4d-47.8720123", o 3d é a lat
//  e o 4d é a lng.
//
//  Regras:
//    - Com 2 pontos: calcula rotação + escala + posição (ótimo p/ mapa
//      ilustrado que está girado em relação ao norte).
//    - Com 3+ pontos: usa ajuste por mínimos quadrados (mais preciso,
//      corrige distorções do desenho). Basta ir adicionando pontos.
//    - Quanto mais separados e espalhados os pontos, melhor a precisão.
// ------------------------------------------------------------
//  Obs.: aqui o x/y é o CENTRO do ponto no seu mapa (mesma convenção
//  dos prédios). Escala resultante ≈ 2,12 m/px (consistente em x e y).
const GEO_REF = [
  { nome: "balao1", lat: -15.759219085236897, lng: -47.86790093049296, x: 856,  y: 138 },
  { nome: "balao2", lat: -15.763386388836198, lng: -47.86477470552754, x: 1013, y: 356 },
  { nome: "balao3", lat: -15.768186668164441, lng: -47.86827274259501, x: 836,  y: 607 },
];

// ------------------------------------------------------------
//  ESCALA (metros -> pixels)
// ------------------------------------------------------------
//  Permite informar o tamanho dos prédios em METROS além de pixels.
//  Basta dizer dois pontos do mapa e a distância REAL entre eles.
//  Com isso, em qualquer prédio você pode escrever, por exemplo:
//     width: "30m", height: "18m"     (em metros)
//     width: 40,    height: 20        (em pixels, como antes)
// ------------------------------------------------------------
const MAP_SCALE = {
  ax: 855, ay: 140,     // ponto A (pixels)
  bx: 837, by: 607,     // ponto B (pixels)
  meters: 997,          // distância real entre A e B, em metros
};

// ------------------------------------------------------------
//  CAMINHOS (calçadas / ruas) para as ROTAS
// ------------------------------------------------------------
//  Cadastre aqui os trajetos possíveis a pé. Cada caminho é uma
//  SEQUÊNCIA de pontos (como se você fosse desenhando a calçada).
//  O programa liga pontos vizinhos de cada caminho e monta uma rede;
//  quando dois caminhos têm pontos PRÓXIMOS, eles viram um CRUZAMENTO
//  automaticamente (então você pode andar de um para o outro).
//
//  Ao clicar num lugar, a rota vai da origem até o CEAD seguindo o
//  MENOR caminho por essa rede (não em linha reta).
//
//  Cada ponto pode ser:
//     "-15.7601, -47.8702"      (lat,lng colada — recomendado)
//     { x: 820, y: 300 }         (pixels)
//
//  DICA: ligue o "📍 Posicionar" para VER a rede desenhada por cima do
//  mapa (linhas tracejadas + bolinhas) e conferir se está ligada certo.
//  Para conectar dois caminhos, ponha um ponto de cada perto do outro.
// ------------------------------------------------------------
const PATHS = [
  // EXEMPLO (troque pelos caminhos reais do campus). Este liga a região
  // da FD até o CEAD passando pelos balões — só para você ver funcionando:
  [
    "-15.7595706, -47.8720123",         // ~FD
    "-15.759219085236897, -47.86790093049296",   // balao1
    "-15.763386388836198, -47.86477470552754",   // balao2
    "-15.768186668164441, -47.86827274259501",   // balao3
    "-15.771910497432854, -47.86577224076018",   // ~CEAD
	"-15.76408394280415, -47.871216314457605",
	"-15.760427516704448, -47.872050890574",
	"-15.760674972675522, -47.87293954171906",
	"-15.760087141966627, -47.87083956443408"
  ],
];

// ------------------------------------------------------------
//  PALETA DE CORES  —  use o NOME em vez do código hexadecimal.
//  Ex.:  color: "azul"   (ou continue usando "#5b8def" se quiser)
//  Adicione/edite cores à vontade aqui.
// ------------------------------------------------------------
const PALETTE = {
  azul:     "#5b8def",
  verde:    "#43c59e",
  laranja:  "#e0a458",
  vermelho: "#e0576b",
  roxo:     "#9b6dff",
  amarelo:  "#f2c14e",
  rosa:     "#f472b6",
  ciano:    "#38bdf8",
  cinza:    "#8595b0",
};

// ------------------------------------------------------------
//  PRÉDIOS
// ------------------------------------------------------------
//  Campos de cada prédio:
//    id          -> identificador único (texto)
//    name        -> nome exibido no hover
//    description -> texto exibido no hover (aceita HTML simples)
//    x, y        -> CENTRO geométrico do prédio (coords da imagem)
//    lat, lng    -> (opcional) coordenada REAL. Se informada, o programa
//                   calcula x/y automaticamente a partir do GEO_REF acima.
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

const BUILDINGS = [

  {
    id: "icc",
    name: "ICC Norte",
    description: "Ala norte do Minhocão. Diversos institutos e salas de aula.",
    //-15.7620485,-47.8699025
	latlng: "-15.76364499590717, -47.86950427487364",
	//x: 763, y: 205,
    width: "725m", height: "120m",
    angle: 60,
    color: "#5b8def",
    // viewBox enquadrado na curva (inclui metade da stroke), então a curva
    // preenche a caixa width×height e fica centralizada.
    svg: null,
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

// ------------------------------------------------------------
//  PONTOS DE TOUR 360°  (marcadores clicáveis separados)
// ------------------------------------------------------------
//    x, y     -> posição do marcador (coords da imagem)
//    panorama -> caminho da imagem 360 equirretangular
//    hotSpots -> (opcional) setas do Pannellum para andar entre cenas
// ------------------------------------------------------------

const TOUR_POINTS = [
  // --- Panoramas 360° da pasta assets/360, espalhados numa grade. ---
  // Reposicione cada um arrastando no Modo edição (ou editando x/y).
  {
    id: "tour-0668",
    name: "Corredor do CEAD",
    description: "Corredor do CEAD",
    latlng: "-15.771768331694098, -47.86575629631583",
    panorama: "assets/360/DJI_0668.JPG",
  },
  {
    id: "tour-0669",
    name: "Corredor do CEAD 2",
    description: "Corredor do CEAD 2",
    latlng: "-15.771877903576748, -47.86566880600828",
    panorama: "assets/360/DJI_0669.JPG",
  },
  {
    id: "tour-0670",
    name: "Entrada do LAPIDAR",
    description: "Entrada do LAPIDAR",
    latlng: "-15.771923113011093, -47.86569672669459",
    panorama: "assets/360/DJI_0670.JPG",
  },
  {
    id: "tour-0671",
    name: "LAPIDAR",
    description: "LAPIDAR",
    latlng: "-15.771965496811898, -47.86575716408343",
    panorama: "assets/360/DJI_0671.JPG",
  },
  {
    id: "tour-0672",
    name: "Recepção do CEAD",
    description: "Recepção do CEAD",
    latlng: "-15.771625481839708, -47.86585624092276",
    panorama: "assets/360/DJI_0672.JPG",
  },
  {
    id: "tour-0673",
    name: "Entrada ICC sul",
    description: "Entrada ICC sul",
    latlng: "-15.764965658310457, -47.86885344182786",
    panorama: "assets/360/DJI_0673.JPG",
  },
  {
    id: "tour-0674",
    name: "Centro de Vivência",
    description: "Centro de Vivência",
    latlng: "-15.765267323142597, -47.86918950333259",
    panorama: "assets/360/DJI_0674.JPG",
  },
  {
    id: "tour-0675",
    name: "Estacionamento ICC sul",
    description: "Estacionamento ICC sul",
    latlng: "-15.765626703001354, -47.86940633672129",
    panorama: "assets/360/DJI_0675.JPG",
  },
  {
    id: "tour-0676",
    name: "Estacionamento do ICC sul",
    description: "Estacionamento do ICC sul",
    latlng: "-15.766455675368334, -47.868882920931036",
    panorama: "assets/360/DJI_0676.JPG",
  },
  {
    id: "tour-0677",
    name: "Estacionamento do ICC sul",
    description: "Estacionamento do ICC sul",
    latlng: "-15.766674666399235, -47.868777613524315",
    panorama: "assets/360/DJI_0677.JPG",
  },
  {
    id: "tour-0678",
    name: "Balão do Multiuso 1",
    description: "Balão do Multiuso 1",
    latlng: "-15.767061493084832, -47.86908265446757",
    panorama: "assets/360/DJI_0678.JPG",
  },
  {
    id: "tour-0679",
    name: "Balão do Multiuso 2",
    description: "Balão do Multiuso 2",
    latlng: "-15.768174352841644, -47.86827809813906",
    panorama: "assets/360/DJI_0679.JPG",
  },
  {
    id: "tour-0681",
    name: "Ponto de ônibus da FS",
    description: "Ponto de ônibus da FS",
    latlng: "-15.769571232119102, -47.86733997249625",
    panorama: "assets/360/DJI_0681.JPG",
  },
  {
    id: "tour-0682",
    name: "Faculdade de Saúde (FS)",
    description: "Faculdade de Saúde (FS)",
    latlng: "-15.769966700440024, -47.86695957629646",
    panorama: "assets/360/DJI_0682.JPG",
  },
  {
    id: "tour-0684",
    name: "Balão do CEAD",
    description: "Balão do CEAD",
    latlng: "-15.770836044263396, -47.866338412487686",
    panorama: "assets/360/DJI_0684.JPG",
  },
  {
    id: "tour-0686",
    name: "Frente no CEAD",
    description: "Frente no CEAD",
    latlng: "-15.771547761447495, -47.865963367669956",
    panorama: "assets/360/DJI_0686.JPG",
  },
];
