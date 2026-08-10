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

  // Tamanho REAL (em pixels) da imagem assets/mapa.png. TEM que bater com
  // o tamanho de verdade do arquivo — se ficar diferente, a imagem é
  // desenhada menor/pillarboxed dentro desse retângulo (sobra fundo/grade
  // nas bordas). Trocou de imagem? Atualize width/height aqui também.
  width: 736,
  height: 1411,
};
