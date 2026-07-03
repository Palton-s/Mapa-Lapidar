# Mapa Ilustrado — UnB

Mapa interativo com prédios posicionáveis, hover com nome/descrição, animação
de scale e pontos de tour 360° (imagens de drone).

## Estrutura

```
mapa_ilustrado_unb/
├─ index.html
├─ css/style.css
├─ js/
│  ├─ config.js   ← VOCÊ EDITA AQUI (prédios, pontos 360, tamanho do mapa)
│  └─ map.js      ← motor (não precisa mexer)
└─ assets/
   ├─ mapa.png    ← coloque sua imagem de fundo aqui
   └─ 360/        ← coloque suas fotos 360 equirretangulares aqui
```

## Como rodar (com reload automático)

O navegador bloqueia carregar imagens locais direto do arquivo (`file://`),
então use um servidor local. Recomendado — recarrega sozinho ao salvar:

```
npm run dev
```
Abre o navegador em http://localhost:8000 e, toda vez que você salvar um
arquivo (`config.js`, `css`, etc.), a página recarrega sozinha.

Alternativas:
- Extensão **Live Server** do VS Code (botão "Go Live") — também tem reload.
- Sem reload: `python -m http.server 8000` e abra http://localhost:8000

## Como usar

- **Arrastar** o mapa = mover a visão · **Scroll** = zoom.
- **Passar o mouse** num prédio → mostra nome + descrição e cresce (scale).
- **Clicar** num ponto **360°** (ou prédio com `panorama`) → abre o tour.
- **📍 Posicionar** (botão no topo) — para achar coordenadas rápido:
  - mostra a **posição do mouse em tempo real** (canto inferior direito);
  - **clique** no mapa para copiar a coordenada (x, y);
  - **arraste** um prédio/ponto para ver o **x/y (e tamanho/ângulo) dele ao vivo**
    e anotar no `js/config.js`. (O arraste é só visual, não grava nada.)

## Adicionar um prédio

Em `js/config.js`, adicione um objeto em `BUILDINGS`:

```js
{
  id: "meu-id",
  name: "Nome do prédio",
  description: "Texto que aparece no hover.",
  x: 500, y: 400,          // canto superior esquerdo (coords da imagem)
  width: 160, height: 100,
  angle: 15,               // rotação em graus
  color: "#5b8def",
  svg: null,               // ou um SVG próprio desenhado em 0..width x 0..height
  panorama: null,          // ou "assets/360/foto.jpg" para virar clicável
}
```

## Tour 360 com várias cenas

Cada foto 360 é uma cena. Para "andar" entre elas, use `hotSpots` no ponto
(ver exemplo comentado em `js/config.js`), chamando `openTourByPanorama(...)`.
