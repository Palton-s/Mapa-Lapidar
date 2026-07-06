// ============================================================
//  CONFIG · MAPA BASE
// ============================================================
//  A imagem de fundo e o tamanho dela.
//
//  Sistema de coordenadas:
//    - (0,0) é o CANTO SUPERIOR ESQUERDO da imagem mapa.png
//    - x cresce para a direita, y cresce para baixo
//    - As coordenadas estão em PIXELS DA IMAGEM (não da tela),
//      então tudo escala junto quando você dá zoom / redimensiona.
// ============================================================

const MAP_CONFIG = {
  image: "assets/mapa.png",

  // Coloque aqui o tamanho REAL (em pixels) da sua imagem mapa.png.
  // Se não souber, deixe assim e ajuste depois — não quebra nada.
  width: 1600,
  height: 1000,
};
