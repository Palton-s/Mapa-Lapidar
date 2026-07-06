// ============================================================
//  MOTOR DO MAPA  —  normalmente você NÃO precisa mexer aqui.
//  Toda a configuração fica em js/config.js
// ============================================================

const SVGNS = "http://www.w3.org/2000/svg";

// ---- Atalhos de DOM -----------------------------------------
const $ = (id) => document.getElementById(id);
const overlay   = $("overlay");
const tooltip   = $("tooltip");
const hud       = $("hud");
const tourModal = $("tourModal");
const panoramaEl= $("panorama");
const tourTitle = $("tourTitle");

// ---- Estado -------------------------------------------------
const view = { scale: 1, tx: 0, ty: 0 };   // zoom/pan da cena
let editMode = false;
let scene, gBuildings, gTours, gRoute, gNetwork, gPathDebug;  // grupos SVG
let routeGraph = null;                      // grafo dos caminhos (PATHS)

// DEBUG: mostra pontos vermelhos nos nós do grafo de caminhos (PATHS),
// com o número de cada nó. Deixe false para esconder.
const DEBUG_PATHS = true;
let currentViewer = null;                   // instância do Pannellum

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const byId  = (list, id) => list.find((it) => it.id === id);

// Resolve a cor: nome da paleta ("azul") -> hex, ou usa o valor direto.
function resolveColor(c) {
  const pal = (typeof PALETTE !== "undefined") ? PALETTE : {};
  return pal[c] || c || "#5b8def";
}

// Cor dos prédios: TODOS em tons de #FDD06A (dourado), com uma leve
// variação determinística por prédio (matiz/luminosidade sutis), para
// não ficarem 100% chapados iguais. Base em HSL ≈ (42, 92%, 70%).
function buildingGold(b) {
  const key = (b && (b.id || b.name)) ? String(b.id || b.name) : "x";
  let seed = 0;
  for (let i = 0; i < key.length; i++) seed = (seed * 31 + key.charCodeAt(i)) & 0xffff;
  const dh = (seed % 7) - 3;             // matiz  ±3°
  const dl = ((seed >> 3) % 13) - 6;     // luz    ±6%
  return `hsl(${42 + dh} 92% ${70 + dl}%)`;
}

// Cria um elemento SVG com atributos.
function el(tag, attrs = {}, parent) {
  const node = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  }
  if (parent) parent.appendChild(node);
  return node;
}

// ============================================================
//  GEORREFERENCIAMENTO  (lat/lng -> pixel da imagem)
// ============================================================
//  Monta uma função geoToPixel(lat, lng) a partir dos pontos do
//  GEO_REF (config.js). Estratégia:
//    - 2 pontos: transformação de SIMILARIDADE (rotação + escala
//      uniforme + deslocamento). Ideal p/ mapa girado em relação
//      ao norte.
//    - 3+ pontos: transformação AFIM por mínimos quadrados (também
//      corrige distorção/esticamento do desenho).
//  Antes de tudo convertemos lat/lng para METROS locais (plano),
//  usando o 1º ponto como origem, para remover a distorção natural
//  entre graus de latitude e longitude.
// ------------------------------------------------------------
let geoToPixel = null;   // função (lat,lng)->{x,y} ou null se sem GEO_REF

// Aceita a coordenada colada num só campo: latlng: "-15.7583, -47.8702"
// (também aceita os apelidos "coord" e "gps"). Preenche lat/lng no objeto.
function parseLatLng(v) {
  if (!v || typeof v !== "string") return null;
  const parts = v.split(",");
  if (parts.length < 2) return null;
  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);
  return (Number.isFinite(lat) && Number.isFinite(lng)) ? { lat, lng } : null;
}
function normalizeLatLng(o) {
  if (o && (o.lat == null || o.lng == null)) {
    const c = parseLatLng(o.latlng || o.coord || o.gps);
    if (c) { o.lat = c.lat; o.lng = c.lng; }
  }
}

function buildGeoTransform() {
  const refs = (typeof GEO_REF !== "undefined") ? GEO_REF : [];
  refs.forEach(normalizeLatLng);   // permite latlng: "..." também no GEO_REF
  if (!refs || refs.length < 2) return null;

  // Origem = primeiro ponto. Fatores de conversão grau -> metro.
  const lat0 = refs[0].lat, lng0 = refs[0].lng;
  const M_PER_DEG_LAT = 110540;
  const M_PER_DEG_LNG = 111320 * Math.cos(lat0 * Math.PI / 180);
  // Importante: usamos "S" (sul positivo) como eixo vertical local, para
  // já ficar na mesma orientação da TELA (y cresce para baixo). Sem isso,
  // com apenas 2 pontos a similaridade escolhe a solução ESPELHADA e os
  // prédios ao sul aparecem ao norte (e vice-versa).
  const toMeters = (lat, lng) => ({
    E: (lng - lng0) * M_PER_DEG_LNG,   // leste (x local, p/ direita)
    N: (lat0 - lat) * M_PER_DEG_LAT,   // sul   (y local, p/ baixo)
  });

  const pts = refs.map((r) => {
    const m = toMeters(r.lat, r.lng);
    return { E: m.E, N: m.N, x: r.x, y: r.y };
  });

  if (pts.length === 2) {
    // ---- Similaridade exata a partir de 2 pontos ----
    //   x = a*E - b*N + c
    //   y = b*E + a*N + d
    const [p1, p2] = pts;
    const dE = p2.E - p1.E, dN = p2.N - p1.N;
    const dx = p2.x - p1.x, dy = p2.y - p1.y;
    const det = dE * dE + dN * dN || 1e-9;
    const a = (dE * dx + dN * dy) / det;
    const b = (dE * dy - dN * dx) / det;
    const c = p1.x - a * p1.E + b * p1.N;
    const d = p1.y - b * p1.E - a * p1.N;
    return (lat, lng) => {
      const { E, N } = toMeters(lat, lng);
      return { x: a * E - b * N + c, y: b * E + a * N + d };
    };
  }

  // ---- Afim por mínimos quadrados a partir de 3+ pontos ----
  //   x = p*E + q*N + r  ;  y = s*E + t*N + u
  // Resolve as normais 3x3 (mesma matriz A p/ x e y).
  let Se = 0, Sn = 0, S1 = pts.length, See = 0, Snn = 0, Sen = 0;
  let Sx = 0, Sxe = 0, Sxn = 0, Sy = 0, Sye = 0, Syn = 0;
  for (const p of pts) {
    Se += p.E; Sn += p.N;
    See += p.E * p.E; Snn += p.N * p.N; Sen += p.E * p.N;
    Sx += p.x; Sxe += p.x * p.E; Sxn += p.x * p.N;
    Sy += p.y; Sye += p.y * p.E; Syn += p.y * p.N;
  }
  const A = [
    [See, Sen, Se],
    [Sen, Snn, Sn],
    [Se,  Sn,  S1],
  ];
  const solve3 = (A, bv) => {           // eliminação de Gauss 3x3
    const M = A.map((row, i) => [...row, bv[i]]);
    for (let i = 0; i < 3; i++) {
      let piv = i;
      for (let k = i + 1; k < 3; k++)
        if (Math.abs(M[k][i]) > Math.abs(M[piv][i])) piv = k;
      [M[i], M[piv]] = [M[piv], M[i]];
      const d = M[i][i] || 1e-9;
      for (let j = i; j < 4; j++) M[i][j] /= d;
      for (let k = 0; k < 3; k++) {
        if (k === i) continue;
        const f = M[k][i];
        for (let j = i; j < 4; j++) M[k][j] -= f * M[i][j];
      }
    }
    return [M[0][3], M[1][3], M[2][3]];
  };
  const [p_, q_, r_] = solve3(A, [Sxe, Sxn, Sx]);
  const [s_, t_, u_] = solve3(A, [Sye, Syn, Sy]);
  return (lat, lng) => {
    const { E, N } = toMeters(lat, lng);
    return { x: p_ * E + q_ * N + r_, y: s_ * E + t_ * N + u_ };
  };
}

// Preenche x/y de prédios e tours que vierem só com lat/lng.
function resolveGeoCoords() {
  geoToPixel = buildGeoTransform();
  if (!geoToPixel) return;
  const apply = (item) => {
    if (!item) return;
    normalizeLatLng(item);           // aceita latlng/coord/gps num só campo
    if (item.lat != null && item.lng != null) {
      const p = geoToPixel(item.lat, item.lng);
      item.x = Math.round(p.x);
      item.y = Math.round(p.y);
    }
  };
  if (typeof BUILDINGS !== "undefined") BUILDINGS.forEach((b) => {
    apply(b);                                  // prédio de parte única
    if (b.parts) b.parts.forEach(apply);       // e cada parte, se houver
  });
  if (typeof TOUR_POINTS !== "undefined") TOUR_POINTS.forEach(apply);
}

// ============================================================
//  MONTAGEM DA CENA
// ============================================================
function buildScene() {
  resolveGeoCoords();          // lat/lng -> x/y antes de desenhar
  const W = MAP_CONFIG.width;
  const H = MAP_CONFIG.height;

  overlay.setAttribute("viewBox", `0 0 ${W} ${H}`);
  overlay.setAttribute("preserveAspectRatio", "xMidYMid meet");

  scene = el("g", { id: "scene" }, overlay);

  // Placeholder (aparece se mapa.png não existir; a imagem cobre por cima).
  const ph = el("g", { class: "placeholder" }, scene);
  el("rect", { x: 0, y: 0, width: W, height: H, fill: "#2c2039" }, ph);
  for (let gx = 0; gx <= W; gx += 100)
    el("line", { x1: gx, y1: 0, x2: gx, y2: H, stroke: "#423056" }, ph);
  for (let gy = 0; gy <= H; gy += 100)
    el("line", { x1: 0, y1: gy, x2: W, y2: gy, stroke: "#423056" }, ph);
  const t = el("text", {
    x: W / 2, y: H / 2, "text-anchor": "middle",
    "font-size": 28, fill: "#b0a2c4", "font-family": "system-ui",
  }, ph);
  t.textContent = "Coloque sua imagem em assets/mapa.png";

  // Imagem de fundo.
  const img = el("image", {
    x: 0, y: 0, width: W, height: H, href: MAP_CONFIG.image,
  }, scene);
  img.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", MAP_CONFIG.image);

  gBuildings = el("g", { id: "buildings" }, scene);
  gNetwork   = el("g", { id: "network" }, scene); // rede de caminhos (só no editor)
  gRoute     = el("g", { id: "route" }, scene);   // rota fica acima dos prédios
  gTours     = el("g", { id: "tours" }, scene);
  gPathDebug = el("g", { id: "pathdebug" }, scene); // pontos de debug (por cima)

  BUILDINGS.forEach((b) => gBuildings.appendChild(renderBuilding(b)));
  TOUR_POINTS.forEach((tp) => gTours.appendChild(renderTour(tp)));

  routeGraph = buildRouteGraph();   // monta o grafo dos caminhos
  renderNetwork();                  // desenha a rede (visível no modo Posicionar)
  renderPathDebug();                // pontos vermelhos de debug (DEBUG_PATHS)
  buildSidebar();
  applyView();
}

// Quantos pixels vale 1 metro, a partir da calibração MAP_SCALE.
function pxPerMeter() {
  if (typeof MAP_SCALE !== "undefined" && MAP_SCALE && MAP_SCALE.meters > 0) {
    const d = Math.hypot(MAP_SCALE.ax - MAP_SCALE.bx, MAP_SCALE.ay - MAP_SCALE.by);
    if (d > 0) return d / MAP_SCALE.meters;
  }
  return 0.4688;   // fallback aproximado, caso MAP_SCALE não exista
}

// Interpreta um tamanho: número = pixels; "30m" = metros; "40"/"40px" = pixels.
function parseSize(v, fallback = 40) {
  if (v == null) return fallback;
  if (typeof v === "number") return v;
  const m = String(v).trim().match(/^([\d.]+)\s*(m|px)?$/i);
  if (!m) return fallback;
  const n = parseFloat(m[1]);
  return (m[2] && m[2].toLowerCase() === "m") ? n * pxPerMeter() : n;
}

// Um prédio pode ter VÁRIAS partes (blocos separados). getParts devolve
// a lista de partes; se não houver "parts", o próprio prédio é tratado
// como uma parte única (compatível com a config antiga).
function getParts(b) {
  return (b.parts && b.parts.length) ? b.parts : [b];
}

// Desenha a forma de UMA parte dentro do grupo .place já posicionado.
// A cor (dourado) vem do PRÉDIO, para todas as partes ficarem no mesmo tom.
function renderPartShape(place, part, b) {
  const w = parseSize(part.width);      // aceita pixels ou "30m"
  const h = parseSize(part.height);
  if (part.svg) {
    // Centraliza o desenho numa caixa w×h em torno de (0,0).
    // O "color" define o currentColor: SVGs que usam fill="currentColor"
    // (ou stroke="currentColor") herdam o DOURADO do prédio automaticamente.
    const wrap = el("g", {
      transform: `translate(${-w / 2} ${-h / 2})`,
      color: buildingGold(b),
      fill: buildingGold(b),
    }, place);
    wrap.innerHTML = part.svg;
    // Se o conteúdo for um <svg> completo (com viewBox), FORÇAMOS o tamanho
    // dele para w×h — senão um width="100%" viraria 100% do mapa (gigante).
    // O viewBox interno escala o desenho e preserva a proporção.
    const inner = wrap.querySelector("svg");
    if (inner) {
      inner.setAttribute("width", w);
      inner.setAttribute("height", h);
      // Padrão: ESTICA para preencher w×h (width/height controlam direto).
      // Para manter a proporção, ponha preserveAspectRatio no seu <svg>.
      if (!inner.getAttribute("preserveAspectRatio"))
        inner.setAttribute("preserveAspectRatio", "none");
    }
  } else {
    // Cantos suaves: usa part.radius, senão ~18% do menor lado.
    const rx = part.radius != null ? parseSize(part.radius) : Math.min(w, h) * 0.18;
    el("rect", {
      class: "shape", x: -w / 2, y: -h / 2,
      width: w, height: h, rx, ry: rx,
      fill: buildingGold(b),
    }, place);
  }
}

// ---- Render de um prédio ------------------------------------
function renderBuilding(b) {
  const g = el("g", {
    class: "building", "data-id": b.id, "data-kind": "building",
    tabindex: 0, role: "button", "aria-label": b.name,
  });
  // TODAS as partes ficam dentro do MESMO .hoverbox, então o efeito de
  // hover (scale) é aplicado ao conjunto inteiro de uma vez.
  const hover = el("g", { class: "hoverbox" }, g);

  // Cada parte tem seu próprio (x,y) = CENTRO e sua rotação em torno dele.
  getParts(b).forEach((part, i) => {
    const place = el("g", {
      class: "place", "data-part": i,
      transform: `translate(${part.x} ${part.y}) rotate(${part.angle || 0})`,
    }, hover);
    renderPartShape(place, part, b);
  });
  return g;
}

// ---- Render de um ponto de tour 360 -------------------------
function renderTour(t) {
  const g = el("g", {
    class: "tour", "data-id": t.id, "data-kind": "tour",
    tabindex: 0, role: "button", "aria-label": t.name,
  });
  const hover = el("g", { class: "hoverbox" }, g);
  const gp = el("g", { class: "place", transform: `translate(${t.x} ${t.y})` }, hover);
  // Grupo que recebe a CONTRA-ESCALA do zoom (mantém tamanho fixo na tela).
  const gs = el("g", { class: "tour__scale" }, gp);
  el("circle", { class: "tour__pulse", r: 23 }, gs);
  el("circle", { class: "tour__dot",   r: 15 }, gs);
  const label = el("text", {
    class: "tour__icon", x: 0, y: 4, "text-anchor": "middle",
  }, gs);
  label.textContent = "360";
  return g;
}

// ============================================================
//  MENU LATERAL ("Onde estou?")  +  ROTA ATÉ O CEAD
// ============================================================
const DEST_ID = "cead";   // prédio de destino da rota

// Centro geométrico de um prédio (média dos centros das partes).
function getCenter(b) {
  let sx = 0, sy = 0, n = 0;
  for (const part of getParts(b)) {
    if (part.x != null && part.y != null) { sx += part.x; sy += part.y; n++; }
  }
  return n ? { x: sx / n, y: sy / n } : null;
}

// Monta a lista de lugares na barra lateral.
function buildSidebar() {
  const list = document.getElementById("placeList");
  if (!list) return;
  list.innerHTML = "";
  // Ordena por nome; mantém o destino (CEAD) no topo, destacado.
  const places = BUILDINGS.filter((b) => getCenter(b))
    .sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id, "pt"));

  places.forEach((b) => {
    const li = document.createElement("li");
    li.className = "sidebar__item";
    li.textContent = b.name || b.id;
    li.dataset.id = b.id;
    li.addEventListener("click", () => selectPlace(b.id));
    list.appendChild(li);
  });
}

let selectedPlaceId = null;

// Ação ao clicar num lugar: destaca, centraliza e traça a rota até o CEAD.
function selectPlace(id) {
  const b = byId(BUILDINGS, id);
  if (!b) return;
  selectedPlaceId = id;

  // Destaque na lista.
  document.querySelectorAll(".sidebar__item").forEach((li) =>
    li.classList.toggle("sidebar__item--active", li.dataset.id === id));

  const from = getCenter(b);
  const dest = byId(BUILDINGS, DEST_ID);
  const to = dest ? getCenter(dest) : null;

  if (from && to && id !== DEST_ID) {
    const pts = computeRoute(from, to);   // trajeto pela rede de caminhos
    drawRoute(pts);
    fitPath(pts);                         // enquadra o trajeto todo
  } else {
    clearRoute();
    focusPoint(from, 2.6);   // é o próprio CEAD (ou sem destino): só centraliza
  }
}

// Desenha o trajeto (lista de pontos) pontilhado + marcadores nas pontas.
function drawRoute(pts) {
  gRoute.innerHTML = "";
  if (!pts || pts.length < 2) return;
  const d = pts.map((p, i) => (i ? "L" : "M") + p.x + " " + p.y).join(" ");
  el("path", { class: "route-line", d }, gRoute);
  const a = pts[0], z = pts[pts.length - 1];
  el("circle", { class: "route-end", cx: a.x, cy: a.y, r: 6 }, gRoute);
  el("circle", { class: "route-end", cx: z.x, cy: z.y, r: 6 }, gRoute);
  const lbl = el("text", {
    class: "route-label", x: z.x, y: z.y - 12, "text-anchor": "middle",
  }, gRoute);
  lbl.textContent = "CEAD";
}
function clearRoute() { if (gRoute) gRoute.innerHTML = ""; }

// Centraliza um ponto da imagem no meio do mapa, com um dado zoom.
function focusPoint(p, scale) {
  if (!p) return;
  view.scale = clamp(scale, 0.4, 10);
  view.tx = MAP_CONFIG.width  / 2 - p.x * view.scale;
  view.ty = MAP_CONFIG.height / 2 - p.y * view.scale;
  applyView();
}

// Enquadra uma lista de pontos (o trajeto todo) na tela.
function fitPath(pts) {
  if (!pts || !pts.length) return;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of pts) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  }
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const margin = 1.6;   // folga em volta do trajeto
  const sx = MAP_CONFIG.width  / ((maxX - minX) * margin + 120);
  const sy = MAP_CONFIG.height / ((maxY - minY) * margin + 120);
  focusPoint({ x: cx, y: cy }, Math.min(sx, sy));
}

// ============================================================
//  REDE DE CAMINHOS  (grafo + menor caminho)
// ============================================================
// Converte um ponto de PATHS (string "lat,lng" ou {x,y} ou {lat,lng}) em pixel.
function pointToPixel(pt) {
  if (!pt) return null;
  if (typeof pt === "string") {
    const c = parseLatLng(pt);
    if (c && geoToPixel) { const p = geoToPixel(c.lat, c.lng); return { x: p.x, y: p.y }; }
    return null;
  }
  if (pt.x != null && pt.y != null) return { x: pt.x, y: pt.y };
  normalizeLatLng(pt);
  if (pt.lat != null && pt.lng != null && geoToPixel) {
    const p = geoToPixel(pt.lat, pt.lng); return { x: p.x, y: p.y };
  }
  return null;
}

// Monta o grafo: nós = pontos (pontos próximos são FUNDIDOS em cruzamentos),
// arestas = trechos consecutivos de cada caminho (peso = distância em pixels).
function buildRouteGraph() {
  const paths = (typeof PATHS !== "undefined") ? PATHS : [];
  const nodes = [];                       // [{x,y}]
  const adj = [];                         // [[{to,w}]]
  const merge = 15 * pxPerMeter();        // pontos a <15m viram o mesmo nó

  const nodeIndex = (p) => {
    for (let i = 0; i < nodes.length; i++)
      if (Math.hypot(nodes[i].x - p.x, nodes[i].y - p.y) <= merge) return i;
    nodes.push(p); adj.push([]); return nodes.length - 1;
  };
  const addEdge = (a, b) => {
    if (a === b) return;
    const w = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
    if (!adj[a].some((e) => e.to === b)) adj[a].push({ to: b, w });
    if (!adj[b].some((e) => e.to === a)) adj[b].push({ to: a, w });
  };

  for (const path of paths) {
    let prev = null;
    for (const raw of path) {
      const p = pointToPixel(raw);
      if (!p) continue;
      const idx = nodeIndex(p);
      if (prev != null) addEdge(prev, idx);
      prev = idx;
    }
  }
  return { nodes, adj };
}

// Nó mais próximo de um ponto.
function nearestNode(g, p) {
  let bi = -1, bd = Infinity;
  for (let i = 0; i < g.nodes.length; i++) {
    const d = Math.hypot(g.nodes[i].x - p.x, g.nodes[i].y - p.y);
    if (d < bd) { bd = d; bi = i; }
  }
  return bi;
}

// Menor caminho (Dijkstra) entre dois nós; devolve lista de pontos.
function shortestPath(g, s, t) {
  const N = g.nodes.length;
  const dist = Array(N).fill(Infinity), prev = Array(N).fill(-1), done = Array(N).fill(false);
  dist[s] = 0;
  for (let k = 0; k < N; k++) {
    let u = -1, best = Infinity;
    for (let i = 0; i < N; i++) if (!done[i] && dist[i] < best) { best = dist[i]; u = i; }
    if (u < 0) break;
    done[u] = true;
    if (u === t) break;
    for (const e of g.adj[u]) {
      if (dist[u] + e.w < dist[e.to]) { dist[e.to] = dist[u] + e.w; prev[e.to] = u; }
    }
  }
  if (dist[t] === Infinity) return null;
  const path = [];
  for (let c = t; c >= 0; c = prev[c]) path.unshift(g.nodes[c]);
  return path;
}

// Trajeto final: origem -> entra na rede -> ... -> sai da rede -> destino.
// Se não houver rede utilizável, cai numa linha reta (comportamento antigo).
function computeRoute(from, to) {
  if (!routeGraph || routeGraph.nodes.length < 2) return [from, to];
  const s = nearestNode(routeGraph, from);
  const t = nearestNode(routeGraph, to);
  const mid = shortestPath(routeGraph, s, t);
  if (!mid || !mid.length) return [from, to];
  return [from, ...mid, to];
}

// DEBUG: pontos vermelhos nos nós do grafo (os pontos usados no cálculo
// de trajetória, JÁ com os cruzamentos fundidos). O número é o índice do nó.
function renderPathDebug() {
  if (!gPathDebug) return;
  gPathDebug.innerHTML = "";
  if (!DEBUG_PATHS || !routeGraph) return;
  routeGraph.nodes.forEach((p, i) => {
    el("circle", { class: "path-debug-node", cx: p.x, cy: p.y, r: 5 }, gPathDebug);
    const t = el("text", {
      class: "path-debug-label", x: p.x + 7, y: p.y - 6,
    }, gPathDebug);
    t.textContent = i;
  });
}

// Desenha a rede de caminhos (fica visível só no modo "Posicionar").
function renderNetwork() {
  if (!gNetwork) return;
  gNetwork.innerHTML = "";
  const paths = (typeof PATHS !== "undefined") ? PATHS : [];
  for (const path of paths) {
    const pts = path.map(pointToPixel).filter(Boolean);
    if (pts.length < 2) continue;
    const d = pts.map((p, i) => (i ? "L" : "M") + p.x + " " + p.y).join(" ");
    el("path", { class: "net-line", d }, gNetwork);
    for (const p of pts) el("circle", { class: "net-node", cx: p.x, cy: p.y, r: 4 }, gNetwork);
  }
}

// ============================================================
//  ZOOM / PAN
// ============================================================
function applyView() {
  scene.setAttribute("transform",
    `translate(${view.tx} ${view.ty}) scale(${view.scale})`);
  updateTourScale();
}

// Mantém os marcadores 360 com tamanho ~constante na tela: ao dar zoom,
// o mapa cresce e os pontos se afastam, mas o marcador não incha (fica
// relativamente menor, ajudando a separar pontos próximos).
function updateTourScale() {
  if (!gTours) return;
  const k = 1 / view.scale;
  gTours.querySelectorAll(".tour__scale").forEach((g) => {
    g.setAttribute("transform", `scale(${k})`);
  });
}

// Converte coordenada da TELA -> coordenada da IMAGEM.
function toImageCoords(clientX, clientY) {
  const ctm = scene.getScreenCTM().inverse();
  const p = new DOMPoint(clientX, clientY).matrixTransform(ctm);
  return { x: p.x, y: p.y };
}

function zoomAt(clientX, clientY, factor) {
  const before = toImageCoords(clientX, clientY);
  view.scale = clamp(view.scale * factor, 0.4, 10);
  applyView();
  const after = toImageCoords(clientX, clientY);
  view.tx += (after.x - before.x) * view.scale;
  view.ty += (after.y - before.y) * view.scale;
  applyView();
}

overlay.addEventListener("wheel", (e) => {
  e.preventDefault();
  zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.12 : 1 / 1.12);
}, { passive: false });

$("btnZoomIn").onclick  = () => zoomCenter(1.2);
$("btnZoomOut").onclick = () => zoomCenter(1 / 1.2);
$("btnReset").onclick   = () => { view.scale = 1; view.tx = 0; view.ty = 0; applyView(); };

function zoomCenter(factor) {
  const r = overlay.getBoundingClientRect();
  zoomAt(r.left + r.width / 2, r.top + r.height / 2, factor);
}

// ============================================================
//  INTERAÇÃO (pan, arrastar prédio, abrir tour, pegar coords)
// ============================================================
let panning = false;
let dragEl = null;          // {kind, data} sendo arrastado no modo edição
let dragOffset = { x: 0, y: 0 };
let downPt = null;          // ponto do pointerdown (tela)
let downNode = null;        // grupo (prédio/tour) sob o pointerdown
let lastPan = { x: 0, y: 0 };
let moved = false;

const MOVE_THRESHOLD = 5;   // px para diferenciar clique de arraste

overlay.addEventListener("pointerdown", (e) => {
  if (!e.isPrimary) return;
  downPt = { x: e.clientX, y: e.clientY };
  lastPan = { x: e.clientX, y: e.clientY };
  moved = false;
  downNode = e.target.closest("[data-id]");

  if (editMode && downNode) {
    // arrastar o elemento
    const kind = downNode.dataset.kind;
    const data = kind === "building"
      ? byId(BUILDINGS, downNode.dataset.id)
      : byId(TOUR_POINTS, downNode.dataset.id);
    // Descobre qual PARTE (grupo .place) do prédio foi tocada, para
    // arrastar só ela. Em prédio de parte única, é a parte 0.
    const placeNode = e.target.closest(".place") || downNode.querySelector(".place");
    const partIdx = (placeNode && placeNode.dataset.part != null)
      ? +placeNode.dataset.part : 0;
    const target = kind === "building" ? getParts(data)[partIdx] : data;
    const p = toImageCoords(e.clientX, e.clientY);
    dragEl = { kind, data, part: target, place: placeNode, node: downNode };
    dragOffset = { x: p.x - target.x, y: p.y - target.y };
  } else {
    panning = true;
  }
  overlay.setPointerCapture(e.pointerId);
});

overlay.addEventListener("pointermove", (e) => {
  if (editMode) updateHud(e);

  if (dragEl) {
    const p = toImageCoords(e.clientX, e.clientY);
    dragEl.part.x = Math.round(p.x - dragOffset.x);
    dragEl.part.y = Math.round(p.y - dragOffset.y);
    updatePlaceTransform(dragEl);
    moved = true;
    showDragHud(dragEl);
  } else if (panning && downPt) {
    if (Math.hypot(e.clientX - downPt.x, e.clientY - downPt.y) > MOVE_THRESHOLD)
      moved = true;
    // move em pixels de tela -> unidades da viewBox (considera o letterbox)
    const r = overlay.getBoundingClientRect();
    const renderScale = Math.min(r.width / MAP_CONFIG.width, r.height / MAP_CONFIG.height);
    const k = 1 / renderScale;
    view.tx += (e.clientX - lastPan.x) * k;
    view.ty += (e.clientY - lastPan.y) * k;
    applyView();
  }
  lastPan = { x: e.clientX, y: e.clientY };
});

overlay.addEventListener("pointerup", (e) => {
  try { overlay.releasePointerCapture(e.pointerId); } catch (_) {}

  if (dragEl) {
    const d = dragEl.part;
    const txt = `x: ${d.x}, y: ${d.y},`;
    navigator.clipboard?.writeText(txt).catch(() => {});
    toast(`Copiado → ${txt}`);
    dragEl = null;
    return;
  }
  panning = false;

  if (moved) return;   // foi arraste, não clique

  // Clique "limpo":
  if (downNode) {
    const kind = downNode.dataset.kind;
    const data = kind === "building"
      ? byId(BUILDINGS, downNode.dataset.id)
      : byId(TOUR_POINTS, downNode.dataset.id);
    if (!editMode && data && data.panorama) openTour(data);
  } else if (editMode) {
    copyCoord(e);       // clicou no mapa vazio no modo edição -> copia coord
  }
});

// Atualiza a transform (posição/rotação) da PARTE arrastada.
function updatePlaceTransform(item) {
  const d = item.part;
  const place = item.place || item.node.querySelector(".place");
  if (item.kind === "building") {
    place.setAttribute("transform",
      `translate(${d.x} ${d.y}) rotate(${d.angle || 0})`);
  } else {
    place.setAttribute("transform", `translate(${d.x} ${d.y})`);
  }
}

// ============================================================
//  TOOLTIP (hover)
// ============================================================
function showTooltip(kind, id, e) {
  const data = kind === "building" ? byId(BUILDINGS, id) : byId(TOUR_POINTS, id);
  if (!data) return;
  tooltip.innerHTML =
    `<strong>${data.name}</strong>` +
    (data.description ? `<span>${data.description}</span>` : "");
  tooltip.hidden = false;
  positionTooltip(e);
}
function positionTooltip(e) {
  const pad = 16;
  let x = e.clientX + pad, y = e.clientY + pad;
  const r = tooltip.getBoundingClientRect();
  if (x + r.width > window.innerWidth)  x = e.clientX - r.width - pad;
  if (y + r.height > window.innerHeight) y = e.clientY - r.height - pad;
  tooltip.style.left = x + "px";
  tooltip.style.top  = y + "px";
}
function hideTooltip() { tooltip.hidden = true; }

overlay.addEventListener("pointerover", (e) => {
  const node = e.target.closest("[data-id]");
  if (node && !dragEl && !panning)
    showTooltip(node.dataset.kind, node.dataset.id, e);
});
overlay.addEventListener("pointerout", (e) => {
  const node = e.target.closest("[data-id]");
  const to = e.relatedTarget && e.relatedTarget.closest
    ? e.relatedTarget.closest("[data-id]") : null;
  if (node && to !== node) hideTooltip();
});
overlay.addEventListener("pointermove", (e) => {
  if (!tooltip.hidden) positionTooltip(e);
});

// Acessibilidade: Enter abre o tour do elemento focado.
overlay.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const node = e.target.closest && e.target.closest("[data-id]");
  if (!node) return;
  const data = node.dataset.kind === "building"
    ? byId(BUILDINGS, node.dataset.id)
    : byId(TOUR_POINTS, node.dataset.id);
  if (data && data.panorama) openTour(data);
});

// ============================================================
//  TOUR 360 (Pannellum)
// ============================================================
function openTour(data, initialYaw) {
  tourTitle.textContent = data.name || "Tour 360°";
  tourModal.hidden = false;
  // Destroi o visualizador anterior (importante ao pular de cena em cena).
  if (currentViewer) { try { currentViewer.destroy(); } catch (_) {} currentViewer = null; }
  panoramaEl.innerHTML = "";

  if (window.pannellum) {
    const cfg = {
      type: "equirectangular",
      panorama: data.panorama,
      autoLoad: true,
      showZoomCtrl: true,
      compass: false,
      hotSpots: (data.hotSpots || []).concat(buildSceneArrows(data)),
    };
    if (initialYaw != null) cfg.yaw = initialYaw;   // mantém a direção ao trocar de cena
    currentViewer = pannellum.viewer("panorama", cfg);
  } else {
    panoramaEl.innerHTML =
      "<div class='pano-fallback'>Não foi possível carregar o visualizador 360.<br>" +
      "Verifique a conexão com a internet (Pannellum vem por CDN).</div>";
  }
}

// Gera as SETAS de navegação (estilo Street View) a partir de data.links.
// Cada link: { to: "tour-0669", yaw: 90, pitch?, label? }.
function buildSceneArrows(data) {
  const links = data.links || [];
  return links.map((link) => {
    const target = byId(TOUR_POINTS, link.to) || byId(BUILDINGS, link.to);
    if (!target || !target.panorama) return null;
    return {
      pitch: link.pitch != null ? link.pitch : -18,   // aponta pro "chão"
      yaw: link.yaw || 0,
      cssClass: "pano-arrow",
      createTooltipFunc: makeArrow,
      createTooltipArgs: link.label || target.name || link.to,
      clickHandlerFunc: () => {
        // Preserva a direção olhada, dando sensação de caminhada contínua.
        const yaw = currentViewer ? currentViewer.getYaw() : 0;
        openTour(target, yaw);
      },
    };
  }).filter(Boolean);
}

// Constrói o elemento visual da seta dentro do panorama.
function makeArrow(hotSpotDiv, label) {
  hotSpotDiv.classList.add("pano-arrow");
  const icon = document.createElement("div");
  icon.className = "pano-arrow__icon";
  icon.innerHTML =
    "<svg viewBox='0 0 24 24' width='54' height='54'><path fill='currentColor'" +
    " d='M12 3l7 8h-4v10h-6V11H5z'/></svg>";
  hotSpotDiv.appendChild(icon);
  const tip = document.createElement("div");
  tip.className = "pano-arrow__label";
  tip.textContent = label;
  hotSpotDiv.appendChild(tip);
}
function closeTour() {
  if (currentViewer) { try { currentViewer.destroy(); } catch (_) {} currentViewer = null; }
  panoramaEl.innerHTML = "";
  tourModal.hidden = true;
}
// Usado por hotSpots que trocam de cena (ver exemplo no config.js).
function openTourByPanorama(path) {
  openTour({ name: tourTitle.textContent, panorama: path });
}
$("tourClose").onclick = closeTour;
tourModal.addEventListener("click", (e) => { if (e.target === tourModal) closeTour(); });

// ============================================================
//  MODO EDIÇÃO
// ============================================================
$("btnEdit").onclick = () => {
  editMode = !editMode;
  document.body.classList.toggle("edit-on", editMode);
  $("btnEdit").classList.toggle("btn--active", editMode);
  hud.hidden = !editMode;
  hud.textContent = editMode ? "mova o mouse…" : "";
};

// Coordenada do mouse (em pixels da imagem), em tempo real.
function updateHud(e) {
  const p = toImageCoords(e.clientX, e.clientY);
  hud.textContent = `x: ${Math.round(p.x)}   y: ${Math.round(p.y)}`;
}

// Enquanto arrasta um elemento, mostra o x/y (e tamanho/ângulo) dele ao vivo.
function showDragHud(item) {
  const d = item.part, id = item.data.id;
  hud.textContent = item.kind === "building"
    ? `${id}  →  x: ${d.x}  y: ${d.y}   ${d.width}×${d.height}  ${d.angle || 0}°`
    : `${id}  →  x: ${d.x}  y: ${d.y}`;
}

// Clique no mapa vazio copia a coordenada.
function copyCoord(e) {
  const p = toImageCoords(e.clientX, e.clientY);
  const txt = `x: ${Math.round(p.x)}, y: ${Math.round(p.y)},`;
  navigator.clipboard?.writeText(txt).catch(() => {});
  toast(`Copiado → ${txt}`);
}

// ---- Toast simples ------------------------------------------
let toastTimer = null;
function toast(msg) {
  let t = $("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast"; t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("toast--show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("toast--show"), 1800);
}

// ---- Ajuda --------------------------------------------------
$("btnHelp").onclick   = () => { $("helpModal").hidden = false; };
$("helpClose").onclick = () => { $("helpModal").hidden = true; };
$("helpModal").addEventListener("click", (e) => {
  if (e.target === $("helpModal")) $("helpModal").hidden = true;
});

// ============================================================
//  INÍCIO
// ============================================================
buildScene();
