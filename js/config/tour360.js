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
//                  { to: "tour-0669", yaw: 90, label: "..." }
//                    to    = id da cena de destino
//                    yaw   = direção (graus 0..360) em que a seta aparece.
//                            AJUSTE olhando o panorama: gire até a seta
//                            apontar para onde fica a cena vizinha.
//                    pitch = (opcional) inclinação; padrão -18 (pro chão).
//                    label = (opcional) texto que aparece ao passar o mouse.
//                    arriveYaw, arrivePitch = (opcional) força a cena de
//                            DESTINO a abrir olhando pra esse ângulo só
//                            quando se chega por ESSA seta específica
//                            (diferente do initialYaw da cena, que vale
//                            sempre, não importa de onde você veio).
//                Dica: coloque a ligação nos DOIS lados (ida e volta).
//    hotSpots -> (opcional) hotspots crus do Pannellum, se precisar.
//    onMap    -> (opcional) false = NÃO aparece como marcador no mapa
//                (continua existindo e sendo acessível pelas SETAS/links de
//                dentro do tour). Padrão: true (aparece no mapa).
//    initialYaw, initialPitch -> (opcional) força ESSA cena a sempre abrir
//                olhando pra esse ângulo, não importa de onde você veio
//                (por padrão, o tour mantém a direção ao trocar de cena).
// ------------------------------------------------------------
//  DICA DE CALIBRAÇÃO: dentro de qualquer tour aberto, clique em um ponto
//  do panorama — o ângulo (yaw/pitch) daquele ponto aparece na tela (e no
//  console). Use esse valor no campo "yaw" da seta até ela apontar certo.
// ------------------------------------------------------------

const TOUR_POINTS = [
  // --- Panoramas 360° da pasta assets/360, espalhados numa grade. ---
  // Reposicione cada um arrastando no Modo edição (ou editando x/y).

  // --- CEAD/LAPIDAR: só a entrada (0686) fica marcada no mapa; os demais
  // --- pontos deste trecho só se acessa navegando pelas setas a partir dela.
  {
    id: "tour-0668",
    name: "Corredor do CEAD",
    description: "Corredor do CEAD",
    latlng: "-15.771768331694098, -47.86575629631583",
    panorama: "assets/360/DJI_0695.JPG",
    onMap: false,
    // EXEMPLO de setas — ajuste os "yaw" olhando cada panorama.
    links: [
      { to: "tour-0706", yaw: 0, label: "Frente da Sala da TI" },
      { to: "tour-0699", yaw: 104, label: "Secretaria" },
      { to: "tour-0672", yaw: 187, label: "Recepção do CEAD" },
    ],
  },
  {
    id: "tour-0669",
    name: "Frente do Lapidar",
    description: "Frente do Lapidar",
    latlng: "-15.771877903576748, -47.86566880600828",
    panorama: "assets/360/DJI_0669.JPG",
    onMap: false,
    links: [
      { to: "tour-0668", yaw: 180, label: "Voltar" },
      { to: "tour-0670", yaw: 96, label: "Entrada do LAPIDAR" },
      { to: "tour-0702", yaw: 1,  label: "Frente do polo Darcy Ribeiro" },
      { to: "tour-0701", yaw: 8,  label: "Copa" },
    ],
  },
  {
    id: "tour-0670",
    name: "Entrada do LAPIDAR",
    description: "Entrada do LAPIDAR",
    latlng: "-15.771923113011093, -47.86569672669459",
    panorama: "assets/360/DJI_0670.JPG",
    onMap: false,
    links: [
      { to: "tour-0669", yaw: 180, label: "Frente do Lapidar" },
      { to: "tour-0671", yaw: 0,   label: "LAPIDAR" },
    ],
  },
  {
    id: "tour-0671",
    name: "LAPIDAR",
    description: "LAPIDAR",
    latlng: "-15.771965496811898, -47.86575716408343",
    panorama: "assets/360/DJI_0671.JPG",
    onMap: false,
    links: [
      { to: "tour-0670", yaw: 180, label: "Entrada do LAPIDAR" },
    ],
  },
  {
    id: "tour-0672",
    name: "Recepção do CEAD",
    description: "Recepção do CEAD",
    latlng: "-15.771625481839708, -47.86585624092276",
    panorama: "assets/360/DJI_0672.JPG",
    onMap: false,
    links: [
      { to: "tour-0686", yaw: 180, label: "Frente do CEAD" },
      { to: "tour-0668", yaw: 12, label: "Corredor do CEAD" },
    ],
  },
  {
    id: "tour-0673",
    name: "Entrada ICC sul",
    description: "Entrada ICC sul",
    latlng: "-15.764965658310457, -47.86885344182786",
    panorama: "assets/360/DJI_0673.JPG",
    initialYaw: 18, initialPitch: -15,   // sempre abre olhando pra cá
    links: [
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
      { to: "tour-0673", yaw: 180, label: "Entrada do ICC sul" },
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
    initialYaw: 229, initialPitch: -9,   // sempre abre olhando pra cá
    links: [
      { to: "tour-0678", yaw: 210, label: "Balão do Multiuso 1" },
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
      { to: "tour-0676", yaw: 98, label: "Estacionamento do ICC sul" },
      { to: "tour-0678", yaw: 0,   label: "Balão do Multiuso 1" },
    ],
  },
  {
    id: "tour-0678",
    name: "Balão do Multiuso 1",
    description: "Balão do Multiuso 1",
    latlng: "-15.767061493084832, -47.86908265446757",
    panorama: "assets/360/DJI_0678.JPG",
    initialYaw: 134, initialPitch: -29,   // sempre abre olhando pra cá
    links: [
      { to: "tour-0677", yaw: 180, label: "Voltar" },
      { to: "tour-0679", yaw: 134, label: "Balão do Multiuso 2" },
    ],
  },
  {
    id: "tour-0679",
    name: "Balão do Multiuso 2",
    description: "Balão do Multiuso 2",
    latlng: "-15.768174352841644, -47.86827809813906",
    panorama: "assets/360/DJI_0679.JPG",
    initialYaw: 188, initialPitch: -18,   // sempre abre olhando pra cá
    links: [
      { to: "tour-0681", yaw: 180, arriveYaw: 19, arrivePitch: -17, label: "Ponto de ônibus da FS" },
      { to: "tour-0678", yaw: 0,   label: "Balão do Multiuso 1" },
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
      { to: "tour-0681", yaw: 180, label: "Ponto de ônibus da FS" },
      { to: "tour-0684", yaw: 2,   label: "Balão do CEAD" },
    ],
  },
  {
    id: "tour-0684",
    name: "Balão do CEAD",
    description: "Balão do CEAD",
    latlng: "-15.770836044263396, -47.866338412487686",
    panorama: "assets/360/DJI_0684.JPG",
    onMap: false,
    initialYaw: 213, initialPitch: -22,   // sempre abre olhando pra cá
    links: [
      { to: "tour-0682", yaw: 0,   label: "Faculdade de Saúde" },
      { to: "tour-0686", yaw: 190, label: "Frente do CEAD" },
    ],
  },
  {
    id: "tour-0686",
    name: "Frente do CEAD",
    description: "Frente do CEAD",
    latlng: "-15.771547761447495, -47.865963367669956",
    panorama: "assets/360/DJI_0709.JPG",
    initialYaw: 7, initialPitch: -13,   // sempre abre olhando pra cá
    links: [
      { to: "tour-0684", yaw: 180, label: "Voltar" },
      { to: "tour-0672", yaw: 4, label: "Recepção do CEAD" },
    ],
  },

  // --- Demais panoramas da pasta assets/360 que ainda não tinham entrada
  // --- aqui. Ficam disponíveis no tour (onMap: false = sem marcador no
  // --- mapa, pois são muitos e muito próximos uns dos outros). Para cada
  // --- um: renomeie "name"/"description", troque "SEU_ID_AQUI" pelo id
  // --- da cena vizinha e ajuste o "yaw" das 2 setas (use o clique no
  // --- panorama pra ler o ângulo certo — ver dica no topo do arquivo).
  {
    id: "tour-0683",
    name: "Panorama 0683 (ainda não posicionado)",
    description: "Ainda não posicionado no mapa nem nomeado — edite name/description e as 2 setas abaixo.",
    panorama: "assets/360/DJI_0683.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    // 2 setas de exemplo p/ você posicionar (yaw) e nomear (to/label).
    links: [
      { to: "SEU_ID_AQUI", yaw: 0,   label: "Nomeie este trecho" },
      { to: "SEU_ID_AQUI", yaw: 180, label: "Nomeie este trecho" },
    ],
  },
  {
    id: "tour-0692",
    name: "Panorama 0692 (ainda não posicionado)",
    description: "Ainda não posicionado no mapa nem nomeado — edite name/description e as 2 setas abaixo.",
    panorama: "assets/360/DJI_0692.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    // 2 setas de exemplo p/ você posicionar (yaw) e nomear (to/label).
    links: [
      { to: "SEU_ID_AQUI", yaw: 0,   label: "Nomeie este trecho" },
      { to: "SEU_ID_AQUI", yaw: 180, label: "Nomeie este trecho" },
    ],
  },
  {
    id: "tour-0693",
    name: "Panorama 0693 (ainda não posicionado)",
    description: "Ainda não posicionado no mapa nem nomeado — edite name/description e as 2 setas abaixo.",
    panorama: "assets/360/DJI_0693.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    // 2 setas de exemplo p/ você posicionar (yaw) e nomear (to/label).
    links: [
      { to: "SEU_ID_AQUI", yaw: 0,   label: "Nomeie este trecho" },
      { to: "SEU_ID_AQUI", yaw: 180, label: "Nomeie este trecho" },
    ],
  },
  {
    id: "tour-0694",
    name: "Panorama 0694 (ainda não posicionado)",
    description: "Ainda não posicionado no mapa nem nomeado — edite name/description e as 2 setas abaixo.",
    panorama: "assets/360/DJI_0694.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    // 2 setas de exemplo p/ você posicionar (yaw) e nomear (to/label).
    links: [
      { to: "SEU_ID_AQUI", yaw: 0,   label: "Nomeie este trecho" },
      { to: "SEU_ID_AQUI", yaw: 180, label: "Nomeie este trecho" },
    ],
  },
  {
    id: "tour-0696",
    name: "Panorama 0696 (ainda não posicionado)",
    description: "Ainda não posicionado no mapa nem nomeado — edite name/description e as 2 setas abaixo.",
    panorama: "assets/360/DJI_0696.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    // 2 setas de exemplo p/ você posicionar (yaw) e nomear (to/label).
    links: [
      { to: "SEU_ID_AQUI", yaw: 0,   label: "Nomeie este trecho" },
      { to: "SEU_ID_AQUI", yaw: 180, label: "Nomeie este trecho" },
    ],
  },
  {
    id: "tour-0698",
    name: "Frente da sala da CAC",
    description: "Frente da sala da CAC",
    panorama: "assets/360/DJI_0698.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    links: [
      { to: "tour-0706", yaw: 180, label: "Frente da Sala da TI" },   // AJUSTE o yaw olhando o panorama
      { to: "tour-0669", yaw: 0,   label: "Frente do Lapidar" },      // AJUSTE o yaw olhando o panorama
      { to: "tour-0710", yaw: 101, label: "Entrada do estúdio" },
    ],
  },
  {
    id: "tour-0699",
    name: "Secretaria",
    description: "Secretaria",
    panorama: "assets/360/DJI_0699.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    links: [
      { to: "tour-0668", yaw: 180, label: "Corredor do CEAD" },   // AJUSTE o yaw olhando o panorama
      { to: "tour-0700", yaw: 4, label: "Sala da direção" },
    ],
  },
  {
    id: "tour-0700",
    name: "Sala da direção",
    description: "Sala da direção",
    panorama: "assets/360/DJI_0700.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    links: [
      { to: "tour-0699", yaw: 281, label: "Secretaria" },
    ],
  },
  {
    id: "tour-0701",
    name: "Copa",
    description: "Copa",
    panorama: "assets/360/DJI_0701.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    links: [
      { to: "tour-0669", yaw: 180, label: "Frente do Lapidar" },   // AJUSTE o yaw olhando o panorama
    ],
  },
  {
    id: "tour-0702",
    name: "Frente do polo Darcy Ribeiro",
    description: "Frente do polo Darcy Ribeiro",
    panorama: "assets/360/DJI_0702.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    links: [
      { to: "tour-0669", yaw: 180, label: "Frente do Lapidar" },   // AJUSTE o yaw olhando o panorama
      { to: "tour-0703", yaw: 79,  label: "Sala de estudos do polo" },
    ],
  },
  {
    id: "tour-0703",
    name: "Sala de estudos do polo",
    description: "Sala de estudos do polo",
    panorama: "assets/360/DJI_0703.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    links: [
      { to: "tour-0702", yaw: 180, label: "Frente do polo Darcy Ribeiro" },   // AJUSTE o yaw olhando o panorama
      { to: "tour-0704", yaw: 19,  label: "Secretaria do polo" },
    ],
  },
  {
    id: "tour-0704",
    name: "Secretaria do polo",
    description: "Secretaria do polo",
    panorama: "assets/360/DJI_0704.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    links: [
      { to: "tour-0703", yaw: 180, label: "Sala de estudos do polo" },   // AJUSTE o yaw olhando o panorama
    ],
  },
  {
    id: "tour-0705",
    name: "Sala da TI",
    description: "Sala da TI",
    panorama: "assets/360/DJI_0705.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    links: [
      { to: "tour-0706", yaw: 180, label: "Frente da Sala da TI" },   // AJUSTE o yaw olhando o panorama
    ],
  },
  {
    id: "tour-0706",
    name: "Frente da Sala da TI",
    description: "Frente da Sala da TI",
    panorama: "assets/360/DJI_0706.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    links: [
      { to: "tour-0698", yaw: 0,   label: "Frente da sala da CAC" },   // AJUSTE o yaw olhando o panorama
      { to: "tour-0668", yaw: 180, label: "Corredor do CEAD" },        // AJUSTE o yaw olhando o panorama
      { to: "tour-0705", yaw: 100, label: "Sala da TI" },
    ],
  },
  {
    id: "tour-0707",
    name: "Panorama 0707 (ainda não posicionado)",
    description: "Ainda não posicionado no mapa nem nomeado — edite name/description e as 2 setas abaixo.",
    panorama: "assets/360/DJI_0707.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    // 2 setas de exemplo p/ você posicionar (yaw) e nomear (to/label).
    links: [
      { to: "SEU_ID_AQUI", yaw: 0,   label: "Nomeie este trecho" },
      { to: "SEU_ID_AQUI", yaw: 180, label: "Nomeie este trecho" },
    ],
  },
  {
    id: "tour-0708",
    name: "Panorama 0708 (ainda não posicionado)",
    description: "Ainda não posicionado no mapa nem nomeado — edite name/description e as 2 setas abaixo.",
    panorama: "assets/360/DJI_0708.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    // 2 setas de exemplo p/ você posicionar (yaw) e nomear (to/label).
    links: [
      { to: "SEU_ID_AQUI", yaw: 0,   label: "Nomeie este trecho" },
      { to: "SEU_ID_AQUI", yaw: 180, label: "Nomeie este trecho" },
    ],
  },
  {
    id: "tour-0710",
    name: "Entrada do estúdio",
    description: "Entrada do estúdio",
    panorama: "assets/360/DJI_0710.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    initialYaw: 352, initialPitch: -25,   // sempre abre olhando pra cá
    links: [
      { to: "tour-0698", yaw: 180, label: "Frente da sala da CAC" },   // AJUSTE o yaw olhando o panorama
      { to: "tour-0711", yaw: 354, label: "Estúdio de gravação" },
      { to: "tour-0712", yaw: 287, label: "Ilhas de edição" },
    ],
  },
  {
    id: "tour-0711",
    name: "Estúdio de gravação",
    description: "Estúdio de gravação",
    panorama: "assets/360/DJI_0711.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    links: [
      { to: "tour-0710", yaw: 180, label: "Entrada do estúdio" },   // AJUSTE o yaw olhando o panorama
    ],
  },
  {
    id: "tour-0712",
    name: "Ilhas de edição",
    description: "Ilhas de edição",
    panorama: "assets/360/DJI_0712.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    initialYaw: 34, initialPitch: -29,   // sempre abre olhando pra cá
    links: [
      { to: "tour-0710", yaw: 120, label: "Entrada do estúdio" },
      { to: "tour-0713", yaw: 198, label: "Depósito de materiais de gravação" },
    ],
  },
  {
    id: "tour-0713",
    name: "Depósito de materiais de gravação",
    description: "Depósito de materiais de gravação",
    panorama: "assets/360/DJI_0713.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    initialYaw: 336, initialPitch: -11,   // sempre abre olhando pra cá
    links: [
      { to: "tour-0712", yaw: 180, label: "Ilhas de edição" },   // AJUSTE o yaw olhando o panorama
    ],
  },
  {
    id: "tour-0714",
    name: "Panorama 0714 (ainda não posicionado)",
    description: "Ainda não posicionado no mapa nem nomeado — edite name/description e as 2 setas abaixo.",
    panorama: "assets/360/DJI_0714.JPG",
    onMap: false,   // não aparece no mapa (só acessível navegando pelas setas)
    // 2 setas de exemplo p/ você posicionar (yaw) e nomear (to/label).
    links: [
      { to: "SEU_ID_AQUI", yaw: 0,   label: "Nomeie este trecho" },
      { to: "SEU_ID_AQUI", yaw: 180, label: "Nomeie este trecho" },
    ],
  },
];
