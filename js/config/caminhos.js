// ============================================================
//  CONFIG · CAMINHOS (calçadas / ruas) para as ROTAS
// ============================================================
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
//  IMPORTANTE: um array = UMA linha (sem ramificações). Para ter uma
//  REDE (pontos que se ligam de várias formas), use VÁRIOS arrays. Onde
//  dois caminhos têm pontos próximos (< 15m), eles viram um cruzamento.
//
//  DICA: ligue o "📍 Posicionar" para VER a rede desenhada por cima do
//  mapa (linhas tracejadas + bolinhas) e conferir se está ligada certo.
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
    "-15.760087141966627, -47.87083956443408",
  ],
];
