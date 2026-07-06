// ============================================================
//  CONFIG · CALIBRAÇÃO  (georreferenciamento + escala)
// ============================================================
//  Liga o desenho ao mundo real: onde ficam as coordenadas de
//  verdade e quantos metros vale cada pixel.
// ============================================================

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
