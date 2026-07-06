// ============================================================
//  CONFIG · TOUR 360°  (pontos clicáveis com panorama)
// ============================================================
//    id       -> identificador único
//    name     -> nome exibido
//    x, y     -> posição do marcador (coords da imagem)
//    latlng   -> (opcional) coordenada real, igual aos prédios
//    panorama -> caminho da imagem 360 equirretangular
//    links    -> (opcional) SETAS de navegação para outras cenas, estilo
//                Street View. Lista de ligações, cada uma:
//                  { to: "tour-0669", yaw: 90, pitch: -18, label: "..." }
//                    to    = id da cena de destino
//                    yaw   = direção (graus 0..360) em que a seta aparece.
//                            AJUSTE olhando o panorama: gire até a seta
//                            apontar para onde fica a cena vizinha.
//                    pitch = (opcional) inclinação; padrão -18 (pro chão).
//                    label = (opcional) texto que aparece ao passar o mouse.
//                Dica: coloque a ligação nos DOIS lados (ida e volta).
//    hotSpots -> (opcional) hotspots crus do Pannellum, se precisar.
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
    // EXEMPLO de setas — ajuste os "yaw" olhando cada panorama.
    links: [
      { to: "tour-0669", yaw: 0, label: "Corredor do CEAD 2" },
    ],
  },
  {
    id: "tour-0669",
    name: "Corredor do CEAD 2",
    description: "Corredor do CEAD 2",
    latlng: "-15.771877903576748, -47.86566880600828",
    panorama: "assets/360/DJI_0669.JPG",
    links: [
      { to: "tour-0668", yaw: 180, label: "Voltar" },
      { to: "tour-0670", yaw: 0,   label: "Entrada do LAPIDAR" },
    ],
  },
  {
    id: "tour-0670",
    name: "Entrada do LAPIDAR",
    description: "Entrada do LAPIDAR",
    latlng: "-15.771923113011093, -47.86569672669459",
    panorama: "assets/360/DJI_0670.JPG",
    links: [
      { to: "tour-0669", yaw: 180, label: "Voltar" },
      { to: "tour-0671", yaw: 0,   label: "LAPIDAR" },
    ],
  },
  {
    id: "tour-0671",
    name: "LAPIDAR",
    description: "LAPIDAR",
    latlng: "-15.771965496811898, -47.86575716408343",
    panorama: "assets/360/DJI_0671.JPG",
    links: [
      { to: "tour-0670", yaw: 180, label: "Voltar" },
      { to: "tour-0672", yaw: 0,   label: "Recepção do CEAD" },
    ],
  },
  {
    id: "tour-0672",
    name: "Recepção do CEAD",
    description: "Recepção do CEAD",
    latlng: "-15.771625481839708, -47.86585624092276",
    panorama: "assets/360/DJI_0672.JPG",
    links: [
      { to: "tour-0671", yaw: 180, label: "Voltar" },
      { to: "tour-0673", yaw: 0,   label: "Entrada ICC sul" },
    ],
  },
  {
    id: "tour-0673",
    name: "Entrada ICC sul",
    description: "Entrada ICC sul",
    latlng: "-15.764965658310457, -47.86885344182786",
    panorama: "assets/360/DJI_0673.JPG",
    links: [
      { to: "tour-0672", yaw: 180, label: "Voltar" },
      { to: "tour-0674", yaw: 0,   label: "Centro de Vivência" },
    ],
  },
  {
    id: "tour-0674",
    name: "Centro de Vivência",
    description: "Centro de Vivência",
    latlng: "-15.765267323142597, -47.86918950333259",
    panorama: "assets/360/DJI_0674.JPG",
    links: [
      { to: "tour-0673", yaw: 180, label: "Voltar" },
      { to: "tour-0675", yaw: 0,   label: "Estacionamento ICC sul" },
    ],
  },
  {
    id: "tour-0675",
    name: "Estacionamento ICC sul",
    description: "Estacionamento ICC sul",
    latlng: "-15.765626703001354, -47.86940633672129",
    panorama: "assets/360/DJI_0675.JPG",
    links: [
      { to: "tour-0674", yaw: 180, label: "Voltar" },
      { to: "tour-0676", yaw: 0,   label: "Estacionamento do ICC sul" },
    ],
  },
  {
    id: "tour-0676",
    name: "Estacionamento do ICC sul",
    description: "Estacionamento do ICC sul",
    latlng: "-15.766455675368334, -47.868882920931036",
    panorama: "assets/360/DJI_0676.JPG",
    links: [
      { to: "tour-0675", yaw: 180, label: "Voltar" },
      { to: "tour-0677", yaw: 0,   label: "Estacionamento do ICC sul" },
    ],
  },
  {
    id: "tour-0677",
    name: "Estacionamento do ICC sul",
    description: "Estacionamento do ICC sul",
    latlng: "-15.766674666399235, -47.868777613524315",
    panorama: "assets/360/DJI_0677.JPG",
    links: [
      { to: "tour-0676", yaw: 180, label: "Voltar" },
      { to: "tour-0678", yaw: 0,   label: "Balão do Multiuso 1" },
    ],
  },
  {
    id: "tour-0678",
    name: "Balão do Multiuso 1",
    description: "Balão do Multiuso 1",
    latlng: "-15.767061493084832, -47.86908265446757",
    panorama: "assets/360/DJI_0678.JPG",
    links: [
      { to: "tour-0677", yaw: 180, label: "Voltar" },
      { to: "tour-0679", yaw: 0,   label: "Balão do Multiuso 2" },
    ],
  },
  {
    id: "tour-0679",
    name: "Balão do Multiuso 2",
    description: "Balão do Multiuso 2",
    latlng: "-15.768174352841644, -47.86827809813906",
    panorama: "assets/360/DJI_0679.JPG",
    links: [
      { to: "tour-0678", yaw: 180, label: "Voltar" },
      { to: "tour-0681", yaw: 0,   label: "Ponto de ônibus da FS" },
    ],
  },
  {
    id: "tour-0681",
    name: "Ponto de ônibus da FS",
    description: "Ponto de ônibus da FS",
    latlng: "-15.769571232119102, -47.86733997249625",
    panorama: "assets/360/DJI_0681.JPG",
    links: [
      { to: "tour-0679", yaw: 180, label: "Voltar" },
      { to: "tour-0682", yaw: 0,   label: "Faculdade de Saúde (FS)" },
    ],
  },
  {
    id: "tour-0682",
    name: "Faculdade de Saúde (FS)",
    description: "Faculdade de Saúde (FS)",
    latlng: "-15.769966700440024, -47.86695957629646",
    panorama: "assets/360/DJI_0682.JPG",
    links: [
      { to: "tour-0681", yaw: 180, label: "Voltar" },
      { to: "tour-0684", yaw: 0,   label: "Balão do CEAD" },
    ],
  },
  {
    id: "tour-0684",
    name: "Balão do CEAD",
    description: "Balão do CEAD",
    latlng: "-15.770836044263396, -47.866338412487686",
    panorama: "assets/360/DJI_0684.JPG",
    links: [
      { to: "tour-0682", yaw: 180, label: "Voltar" },
      { to: "tour-0686", yaw: 0,   label: "Frente no CEAD" },
    ],
  },
  {
    id: "tour-0686",
    name: "Frente no CEAD",
    description: "Frente no CEAD",
    latlng: "-15.771547761447495, -47.865963367669956",
    panorama: "assets/360/DJI_0686.JPG",
    links: [
      { to: "tour-0684", yaw: 180, label: "Voltar" },
    ],
  },
];
