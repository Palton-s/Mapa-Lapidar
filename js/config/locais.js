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
//                   JUNTAS ao passar o mouse (hover).
//                   Ex.:
//                     parts: [
//                       { x: 820, y: 300, width: 60, height: 30, angle: 10 },
//                       { lat: -15.766, lng: -47.865, width: 40, height: 40 },
//                     ],
// ------------------------------------------------------------

// Formas (SVG) do ICC, uma para cada trecho (sul/centro/norte), cada uma
// compartilhada pelas duas partes (duplicadas) do respectivo prédio.
const ICC_SUL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="44.63 168.74 143.75 85.43">
  <defs>
    <clipPath id="clip-icc-sul"><rect x="44.63" y="168.74" width="143.75" height="85.43"/></clipPath>
  </defs>
  <path fill="currentColor" clip-path="url(#clip-icc-sul)" d="M 470.87553181144455,232.67721846750385 C 470.87553181144455,232.67721846750385 471.6529691709575,232.94704091288895 459.9706919252045,228.61387943962688 C 425.41495416579846,215.79786083386784 401.71482026827124,208.0172943224061 384.78986683322967,202.0573976604099 C 364.8607680219102,195.0382557207805 353.37208964332973,190.43764803118796 341.0431363402116,187.17882685635587 C 323.9345465379265,182.65631903688825 304.3586786142422,176.8475030616257 264.565464231178,173.90660063830398 C 257.5811358650416,173.3910201169682 248.73781746535474,174.21650039036217 241.71248711750138,174.838188015725 C 215.84958509694331,177.12702004866506 188.16910061189412,184.79219321519906 162.1865116468146,192.60505457783233 C 101.77495608540386,210.76827014255488 49.63457523433294,232.67721846750382 49.63457523433294,232.67721846750382 L 54.40484042252382,246.13664962317807 C 80.77137055826768,238.84234701080254 101.04807000697485,229.97379022478606 118.51050097943289,223.85397605014492 C 163.2670775435846,208.1664201137594 186.02075378599773,199.41266734963332 213.70481236795388,194.22091837353474 C 232.88392577289903,190.62365913902676 251.44573136164087,186.31234944407893 278.0672808950068,189.04103950389646 C 297.78080581783763,191.06152833507736 321.6403775524302,197.28125386293064 352.01395243215075,206.2700581230094 C 382.34000792970426,215.24330898093746 419.85232704368707,232.49341088471525 466.08112548065776,248.83106212575774 C 468.4644020408424,249.67320394141257 467.5060165213515,249.15896839613185 468.5573327124421,244.60254433044713 L 470.87553181144455,232.67721846750385 Z"/>
</svg>`;

const ICC_CENTRO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="188.38 168.74 143.75 85.43">
  <defs>
    <clipPath id="clip-icc-centro"><rect x="188.38" y="168.74" width="143.75" height="85.43"/></clipPath>
  </defs>
  <path fill="currentColor" clip-path="url(#clip-icc-centro)" d="M 470.87553181144455,232.67721846750385 C 470.87553181144455,232.67721846750385 471.6529691709575,232.94704091288895 459.9706919252045,228.61387943962688 C 425.41495416579846,215.79786083386784 401.71482026827124,208.0172943224061 384.78986683322967,202.0573976604099 C 364.8607680219102,195.0382557207805 353.37208964332973,190.43764803118796 341.0431363402116,187.17882685635587 C 323.9345465379265,182.65631903688825 304.3586786142422,176.8475030616257 264.565464231178,173.90660063830398 C 257.5811358650416,173.3910201169682 248.73781746535474,174.21650039036217 241.71248711750138,174.838188015725 C 215.84958509694331,177.12702004866506 188.16910061189412,184.79219321519906 162.1865116468146,192.60505457783233 C 101.77495608540386,210.76827014255488 49.63457523433294,232.67721846750382 49.63457523433294,232.67721846750382 L 54.40484042252382,246.13664962317807 C 80.77137055826768,238.84234701080254 101.04807000697485,229.97379022478606 118.51050097943289,223.85397605014492 C 163.2670775435846,208.1664201137594 186.02075378599773,199.41266734963332 213.70481236795388,194.22091837353474 C 232.88392577289903,190.62365913902676 251.44573136164087,186.31234944407893 278.0672808950068,189.04103950389646 C 297.78080581783763,191.06152833507736 321.6403775524302,197.28125386293064 352.01395243215075,206.2700581230094 C 382.34000792970426,215.24330898093746 419.85232704368707,232.49341088471525 466.08112548065776,248.83106212575774 C 468.4644020408424,249.67320394141257 467.5060165213515,249.15896839613185 468.5573327124421,244.60254433044713 L 470.87553181144455,232.67721846750385 Z"/>
</svg>`;

const ICC_NORTE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="332.13 168.74 143.75 85.43">
  <defs>
    <clipPath id="clip-icc-norte"><rect x="332.13" y="168.74" width="143.75" height="85.43"/></clipPath>
  </defs>
  <path fill="currentColor" clip-path="url(#clip-icc-norte)" d="M 470.87553181144455,232.67721846750385 C 470.87553181144455,232.67721846750385 471.6529691709575,232.94704091288895 459.9706919252045,228.61387943962688 C 425.41495416579846,215.79786083386784 401.71482026827124,208.0172943224061 384.78986683322967,202.0573976604099 C 364.8607680219102,195.0382557207805 353.37208964332973,190.43764803118796 341.0431363402116,187.17882685635587 C 323.9345465379265,182.65631903688825 304.3586786142422,176.8475030616257 264.565464231178,173.90660063830398 C 257.5811358650416,173.3910201169682 248.73781746535474,174.21650039036217 241.71248711750138,174.838188015725 C 215.84958509694331,177.12702004866506 188.16910061189412,184.79219321519906 162.1865116468146,192.60505457783233 C 101.77495608540386,210.76827014255488 49.63457523433294,232.67721846750382 49.63457523433294,232.67721846750382 L 54.40484042252382,246.13664962317807 C 80.77137055826768,238.84234701080254 101.04807000697485,229.97379022478606 118.51050097943289,223.85397605014492 C 163.2670775435846,208.1664201137594 186.02075378599773,199.41266734963332 213.70481236795388,194.22091837353474 C 232.88392577289903,190.62365913902676 251.44573136164087,186.31234944407893 278.0672808950068,189.04103950389646 C 297.78080581783763,191.06152833507736 321.6403775524302,197.28125386293064 352.01395243215075,206.2700581230094 C 382.34000792970426,215.24330898093746 419.85232704368707,232.49341088471525 466.08112548065776,248.83106212575774 C 468.4644020408424,249.67320394141257 467.5060165213515,249.15896839613185 468.5573327124421,244.60254433044713 L 470.87553181144455,232.67721846750385 Z"/>
</svg>`;

const BUILDINGS = [

  {
    id: "icc-sul",
    name: "Instituto Central de Ciências (ICC Sul)",
    description: "Ala sul do Minhocão. Diversos institutos e salas de aula.",
    // Mesma forma duplicada: uma parte em cima e outra embaixo, com um
    // vão entre elas. Ajuste a distância movendo os x/y (ou lat/lng) de
    // cada parte. Aumente a diferença para afastar mais.
    parts: [
      { latlng: "-15.765187662882964, -47.868004601785181", width: "218m", height: "108m", angle: 240, svg: ICC_SUL_SVG },
      { latlng: "-15.765469983119502, -47.868237069174604", width: "227m", height: "113m", angle: 240, svg: ICC_SUL_SVG },
    ],
    panorama: null,
  },
  {
    id: "icc-centro",
    name: "Instituto Central de Ciências (ICC Centro)",
    description: "Trecho central do Minhocão. Diversos institutos e salas de aula.",
    parts: [
      { latlng: "-15.763380724654429, -47.869083399919504", width: "218m", height: "108m", angle: 240, svg: ICC_CENTRO_SVG },
      { latlng: "-15.76358504755736, -47.869362434134864", width: "227m", height: "113m", angle: 240, svg: ICC_CENTRO_SVG },
    ],
    panorama: null,
  },
  {
    id: "icc-norte",
    name: "Instituto Central de Ciências (ICC Norte)",
    description: "Ala norte do Minhocão. Diversos institutos e salas de aula.",
    parts: [
      { latlng: "-15.761573786425894, -47.870162198053826", width: "218m", height: "108m", angle: 240, svg: ICC_NORTE_SVG },
      { latlng: "-15.761700111995218, -47.870487799095123", width: "227m", height: "113m", angle: 240, svg: ICC_NORTE_SVG },
    ],
    panorama: null,
  },
  {
    id: "PAT",
    name: "Pavilhão Anísio Teixeira (PAT)",
    description: "Prédio do PAT.",
    lat: -15.759004389500056, lng: -47.87079819509181,
    width: "154m", height: "70m",
    angle: 75,
    svg: null,
    panorama: null,
  },

  {
    id: "PJC",
    name: "Pavilhão João Calmon (PJC)",
    description: "Prédio do PJC.",
    latlng: "-15.758377598901532, -47.87024755525104",
    width: "154m", height: "70m",
    angle: 75,
    svg: null,
    panorama: null,
  },
  {
    id: "multiuso-i",
    name: "Pavilhão Multiuso 1",
    description: "Prédio do Multiuso I.",
    // Coordenada colada num só campo (como vem do Google Maps):
    latlng: "-15.766969752316394, -47.86970679935755",
    width: 40, height: 20,
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "FACE",
    name: "Faculdade de Economia, Administração, Contabilidade e Gestão de Políticas Públicas (FACE)",
    description: "Prédio da FACE.",
    latlng: "-15.758501326161976, -47.871915698092266",
    width: "120m", height: "88m",
    angle: 75,
    svg: null,
    panorama: null,
  },
  {
    id: "FD",
    name: "Faculdade de Direito (FD)",
    description: "Prédio da FD.",
    // Posicionado pela coordenada real — o programa calcula o x/y.
    latlng: "-15.759564275684024, -47.87215804253725",
    width: "88m", height: "88m",
    angle: 75,
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
    svg: null,
    panorama: null,
  },
  {
    id: "beijodromo",
    name: "Beijódromo",
    description: "Beijódromo.",
    latlng: "-15.763930954215263, -47.86589698305221",
    width: "40m", height: "40m",
	radius: 20,
    angle: 125,
    svg: null,
    panorama: null,
  },
  {
    id: "instituto-artes",
    name: "Instituto de Artes (IdA)",
    description: "Instituto de Artes (IdA).",
    latlng: "-15.765624618690909, -47.87047290518963",
    width: "30m", height: "90m",
    angle: -35,
    svg: null,
    panorama: null,
  },
  {
    id: "instituto-biologicas",
    name: "Instituto de Ciências Biológicas (IB)",
    description: "Instituto de Ciências Biológicas (IB).",
    latlng: "-15.766459133897186, -47.8650947912769",
    width: "140m", height: "250m",
    angle: 125,
    svg: null,
    panorama: null,
  },
  {
    id: "instituto-quimica",
    name: "Instituto de Química (IQ)",
    description: "Instituto de Química (IQ).",
    latlng: "-15.768486505384814, -47.86484240562605",
    width: "135m", height: "60m",
    angle: 226,
    svg: null,
    panorama: null,
  },
  {
    id: "multiuso-2",
    name: "Pavilhão Multiuso 2",
    description: "Pavilhão Multiuso 2.",
    latlng: "-15.767942253248707, -47.86886062296353",
    width: "35m", height: "80m",
    angle: 145,
    svg: null,
    panorama: null,
  },
  {
    id: "departamento-musica",
    name: "Departamento de Música (MUS)",
    description: "Departamento de Música (MUS).",
    latlng: "-15.76495319199317, -47.87153416265127",
    width: "15m", height: "70m",
    angle: 145,
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
    svg: null,
    panorama: null,
  },
  {
    id: "faculdade-saude",
    name: "Faculdade de Ciências da Saúde (FS)",
    description: "Faculdade de Ciências da Saúde.",
    latlng: "-15.768483185049357, -47.866735697009524",
    width: "100m", height: "170m",
    angle: -42,
    svg: null,
    panorama: null,
  },
  {
    id: "nucleo-medicina-tropical",
    name: "Núcleo de Medicina Tropical (NMT)",
    description: "Núcleo de Medicina Tropical (NMT/UnB).",
    latlng: "-15.769769797047424, -47.86779512498248",
    width: "50m", height: "100m",
    angle: -30,
    svg: null,
    panorama: null,
  },
  {
    id: "centro-apoio-tecnologico",
    name: "Centro de Apoio ao Desenvolvimento Tecnológico (CDT)",
    description: "Centro de Apoio ao Desenvolvimento Tecnológico - CDT/UnB.",
    latlng: "-15.774508584164693, -47.86687132235437",
    width: "45m", height: "50m",
    angle: 0,
    svg: null,
    panorama: null,
  },
  {
    id: "centro-recursos-humanos-transportes",
    name: "Centro De Formação de Recursos Humanos em Transportes (CEFTRU)",
    description: "Centro De Formação De Recursos Humanos Em Transportes.",
    angle: 0,
    parts: [
      { latlng: "-15.77306138280126, -47.86708828489967", width: "35m", height: "50m", angle: 0 },
      { latlng: "-15.772793205733976, -47.866732565887084", width: "20m", height: "50m", angle: 0 },
    ],
    svg: null,
    panorama: null,
  },
  {
    id: "diretoria-manutencao-equipamentos-cientificos",
    name: "Diretoria Manutenção de Equipamentos Científicos (Dimeq)",
    description: "Diretoria Manutenção de Equipamentos Científicos.",
    latlng: "-15.772477614766382, -47.86749306448978",
    width: "20m", height: "60m",
    angle: 0,
    svg: null,
    panorama: null,
  },
  {
    id: "pisac",
    name: "Parque de Inovação e Sustentabilidade do Ambiente Construído (PISAC)",
    description: "Parque de Inovação e Sustentabilidade do Ambiente Construído.",
    angle: 0,
    parts: [
      { latlng: "-15.774763540013074, -47.86941840766755", width: "8m", height: "15m", angle: 0 },
      { latlng: "-15.77479365544397, -47.869133916460335", width: "20m", height: "5m", angle: 0 },
    ],
    svg: null,
    panorama: null,
  },
  {
    id: "sti",
    name: "Secretaria de Tecnologia da Informação (STI)",
    description: "Secretaria de Tecnologia da Informação da UnB.",
    latlng: "-15.772754081559011, -47.865781823795416",
    width: "60m", height: "20m",
    angle: 0,
    svg: null,
    panorama: null,
  },
  {
    id: "legga",
    name: "Laboratório de Estudos Geodinâmicos, Geocronológicos e Ambientais (LEGGA)",
    description: "Laboratório de Estudos Geodinâmicos, Geocronológicos e Ambientais.",
    latlng: "-15.771120960320168, -47.86696278795763",
    width: "20m", height: "60m",
    angle: -30,
    svg: null,
    panorama: null,
  },
  {
    id: "lab-termobiologia",
    name: "Laboratório de Termobiologia",
    description: "Laboratório de Termobiologia.",
    latlng: "-15.770268833472182, -47.86848721332735",
    width: "10m", height: "60m",
    angle: -30,
    svg: null,
    panorama: null,
  },
  {
    id: "fiocruz",
    name: "Fundação Oswaldo Cruz (Fiocruz)",
    description: "Fundação Oswaldo Cruz (Fiocruz).",
    latlng: "-15.771040988488636, -47.871231238077705",
    width: "60m", height: "90m",
    angle: -50,
    svg: null,
    panorama: null,
  },
  {
    id: "fe",
    name: "Faculdade de Educação (FE)",
    description: "Faculdade de Educação - UnB.",
    parts: [
      { latlng: "-15.76800283910083, -47.87185247199138", width: "35m", height: "80m", angle: -35 },
      { latlng: "-15.767552104387715, -47.87147019013235", width: "40m", height: "40m", angle: 50 },
      { latlng: "-15.768178259907698, -47.871014489903054", width: "40m", height: "70m", angle: -35 },
    ],
  },
  {
    id: "achados-perdidos-central",
    name: "Achados e Perdidos Central",
    description: "Achados e perdidos Central - UnB.",
    latlng: "-15.767532024607034, -47.87009533780203",
    width: "20m", height: "50m",
    angle: -35,
    svg: null,
    panorama: null,
  },
  {
    id: "adunb",
    name: "Associação dos Docentes da UnB (ADUnB)",
    description: "ADUnB Associação dos Docentes da UnB e UnB Secretaria de Gestão Patrimonial - SPI -UnB.",
    latlng: "-15.767124373137484, -47.872457715150695",
    width: "40m", height: "60m",
    angle: -35,
    svg: null,
    panorama: null,
  },
  {
    id: "aposfub",
    name: "Associação dos Aposentados da FUB (APOSFUB)",
    description: "APOSFUB - Associacao dos Aposentados da FUB",
    latlng: "-15.766370148479611, -47.87249344767167",
    width: "30m", height: "30m",
    angle: -35,
    svg: null,
    panorama: null,
  },
  {
    id: "lab-eng-civil",
    name: "Laboratório de Engenharia Civil",
    description: "UnB Laboratório de Engenharia Civil.",
    latlng: "-15.765089682779413, -47.872507669282506",
    width: "30m", height: "75m",
    angle: -35,
    svg: null,
    panorama: null,
  },
  {
    id: "lab-eng-eletrica",
    name: "Laboratório de Engenharia Elétrica",
    description: "UnB Laboratório de Engenharia Elétrica.",
    latlng: "-15.765873095949539, -47.87211903720197",
    width: "30m", height: "75m",
    angle: -35,
    svg: null,
    panorama: null,
  },
  {
    id: "lab-eng-mecanica",
    name: "Laboratório de Engenharia Mecânica",
    description: "UnB Laboratório de Engenharia Mecânica.",
    latlng: "-15.766458176330028, -47.8715149240283",
    width: "30m", height: "75m",
    angle: -35,
    svg: null,
    panorama: null,
  },
  {
    id: "hvet",
    name: "Hospital Veterinário - UnB",
    description: "Hospital Veterinário - UnB.",
    latlng: "-15.748947753859737, -47.87731899531158",
    width: "240m", height: "130m",
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "lab-termociencia",
    name: "Laboratório de Termociência e Metrologia Dinâmica",
    description: "UnB Laboratório de Termociência e Metrologia Dinâmica.",
    latlng: "-15.762128674596989, -47.87370021826218",
    width: "45m", height: "45m",
    angle: -25,
    svg: null,
    panorama: null,
  },
  {
    id: "lab-fauna",
    name: "Laboratório de Fauna e Unidades de Conservação (LAFUC)",
    description: "Laboratório de Fauna e Unidades de Conservação.",
    latlng: "-15.76142291479457, -47.87356283661967",
    width: "55m", height: "17m",
    angle: -25,
    svg: null,
    panorama: null,
  },
  {
    id: "ft",
    name: "Faculdade de Tecnologia (FT)",
    description: "Faculdade de Tecnologia - FT.",
    latlng: "-15.763453209644023, -47.872636391989765",
    width: "120m", height: "125m",
    angle: -30,
    svg: null,
    panorama: null,
  },
  {
    id: "cead",
    name: "CEAD ⭐",
    description: "O prédio do CEAD",
    // Exemplo de prédio com VÁRIAS partes: um bloco maior + um anexo.
    // Passe o mouse: os dois crescem juntos.
    parts: [
      { latlng: "-15.771910497432854, -47.86577224076018", width: "30m", height: "80m", angle: -30 },

    ],
    // Ao ter panorama, clicar em qualquer parte abre o tour.
    panorama: "assets/360/predio-01.jpg",
    // Clicar no prédio abre direto essa cena do tour 360° (em vez do
    // panorama acima, que é só um placeholder).
    tourId: "tour-0686",
  },
  {
    id: "colina-bloco-a",
    name: "Colina bloco A",
    description: "Colina bloco A.",
    latlng: "-15.75694720117604, -47.87387334363973",
    width: "90m", height: "14m",
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "colina-bloco-b",
    name: "Colina bloco B",
    description: "Colina bloco B.",
    latlng: "-15.757644182780455, -47.87369900005998",
    width: "90m", height: "14m",
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "colina-bloco-c",
    name: "Colina bloco C",
    description: "Colina bloco C.",
    latlng: "-15.756874921467636, -47.87430786146443",
    width: "90m", height: "14m",
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "colina-bloco-d",
    name: "Colina bloco D",
    description: "Colina bloco D.",
    latlng: "-15.757533182167927, -47.87416302219935",
    width: "90m", height: "14m",
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "colina-bloco-e",
    name: "Colina bloco E",
    description: "Colina bloco E.",
    latlng: "-15.75782746273336, -47.87456803572288",
    width: "90m", height: "14m",
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "colina-bloco-f",
    name: "Colina bloco F",
    description: "Colina bloco F.",
    latlng: "-15.756332822804444, -47.87547194013208",
    width: "90m", height: "14m",
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "colina-bloco-g",
    name: "Colina bloco G",
    description: "Colina bloco G.",
    latlng: "-15.755576463687737, -47.87599497088532",
    width: "90m", height: "14m",
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "colina-bloco-h",
    name: "Colina bloco H",
    description: "Colina bloco H.",
    latlng: "-15.755674558201232, -47.87534587635741",
    width: "90m", height: "14m",
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "departamento-sociologia",
    name: "Departamento de Sociologia",
    description: "Departamento de Sociologia.",
    latlng: "-15.757430008504906, -47.87288590823104",
    width: "36m", height: "85m",
    angle: 165,
    svg: null,
    panorama: null,
  },
  {
    id: "bsan",
    name: "BSAN - Blocos de Sala de Aula Norte",
    description: "BSAN - Blocos de Sala de Aula Norte.",
    latlng: "-15.757049162195182, -47.871173838101164",
    width: "60m", height: "40m",
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "dds",
    name: "Diretoria de Desenvolvimento Social (DDS)",
    description: "Diretoria de Desenvolvimento Social (DDS).",
    latlng: "-15.756917577121886, -47.870401155184986",
    width: "90m", height: "15m",
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "casa-estudante-universitario",
    name: "Casa do Estudante Universitário",
    description: "Casa do Estudante Universitário.",
    latlng: "-15.757058689300683, -47.875414037938576",
    width: "50m", height: "30m",
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "associacao-servidores-unb",
    name: "Associação dos Servidores da UnB",
    description: "Associação dos Servidores da UnB.",
    latlng: "-15.759048834216378, -47.87342324997898",
    width: "20m", height: "50m",
    angle: 85,
    svg: null,
    panorama: null,
  },
  {
    id: "maloca",
    name: "Maloca - Centro de Convivência Multicultural dos Povos Indígenas da UnB",
    description: "Maloca - Centro de Convivência Multicultural dos Povos Indígenas da UnB.",
    latlng: "-15.759920607672607, -47.87324608778485",
    width: "35m", height: "35m",
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "posto-petrobras",
    name: "Posto Petrobrás",
    description: "Posto Petrobrás.",
    latlng: "-15.760724866289753, -47.87432843045668",
    width: "50m", height: "40m",
    angle: 160,
    svg: null,
    panorama: null,
  },
  {
    id: "prefeitura-campus",
    name: "Prefeitura do Campus",
    description: "Prefeitura do Campus.",
    latlng: "-15.760371218328034, -47.87442230776443",
    width: "70m", height: "45m",
    angle: 160,
    svg: null,
    panorama: null,
  },
  {
    id: "secretaria-admin-academica",
    name: "Secretaria de Administração Acadêmica",
    description: "Secretaria de Administração Acadêmica.",
    latlng: "-15.765074035369855, -47.86941937472736",
    width: "40m", height: "40m",
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "cet",
    name: "Centro de Excelência em Turismo (CET)",
    description: "Centro de Excelência em Turismo (CET).",
    latlng: "-15.76959012650129, -47.87029116033999",
    width: "75m", height: "75m",
    angle: 35,
    svg: null,
    panorama: null,
  },
  {
    id: "cds",
    name: "Centro de Desenvolvimento Sustentável (CDS)",
    description: "Centro de Desenvolvimento Sustentável (CDS).",
    latlng: "-15.768513197689852, -47.86932784859471",
    width: "60m", height: "60m",
	radius: 30,
    angle: 55,
    svg: null,
    panorama: null,
  },
  {
    id: "ida",
    name: "Instituto de Artes da Universidade de Brasília (IdA)",
    description: "Instituto de Artes da Universidade de Brasília (IdA).",
    latlng: "-15.76495399327456, -47.86446316232395",
    width: "18m", height: "35m",
    angle: 35,
    svg: null,
    panorama: null,
  },
  {
    id: "din",
    name: "Departamento de Design (DIN)",
    description: "Departamento de Design (DIN).",
    latlng: "-15.76506933986184, -47.86427019874561",
    // TAMANHO NÃO INFORMADO — usei um placeholder de 30x30m. Ajuste width/height
    // para o tamanho real do prédio.
    width: "30m", height: "30m",
    angle: 35,
    svg: null,
    panorama: null,
  },
];
