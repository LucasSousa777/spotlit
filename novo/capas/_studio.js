// Shared bits for the cover prototypes: a softbox studio environment (for metal and gloss reflections),
// the 0-100 loader and the pointer (mouse or finger; on a phone with no touch it drifts on its own).
import * as THREE from 'three';

export function studioEnv(renderer, { warm = '#fff4dc' } = {}) {
  const s = new THREE.Scene();
  s.background = new THREE.Color('#2a2b30');
  const box = (w, h, x, y, z, c, int = 1) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(int), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m);
  };
  box(8, 3, 0, 7, 2, '#ffffff', 3);      // top softbox
  box(3, 6, -7, 1, 3, warm, 2.2);        // left key, warm
  box(3, 6, 7, 0, -2, '#dfe8ff', 1.4);   // right fill, cool
  box(10, 2, 0, -6, 4, '#ffffff', .6);   // floor bounce
  box(2, 2, 2, 3, 7, '#ffc93c', 1.6);    // a yellow card in front: the brand colour in every reflection
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(s, 0.04).texture;
  pm.dispose();
  return tex;
}

export function loader(onDone) {
  const el = document.querySelector('.loader b');
  const wrap = document.querySelector('.loader');
  let n = 0;
  const t = setInterval(() => {
    n = Math.min(100, n + Math.ceil(Math.random() * 9));
    if (el) el.textContent = n;
    if (n >= 100) { clearInterval(t); wrap && wrap.classList.add('done'); onDone && onDone(); }
  }, 40);
}

export function pointer() {
  const p = { x: 0, y: 0, tx: 0, ty: 0, active: false };
  const set = (cx, cy) => { p.tx = (cx / innerWidth) * 2 - 1; p.ty = -((cy / innerHeight) * 2 - 1); p.active = true; clearTimeout(p._t); p._t = setTimeout(() => (p.active = false), 2500); };
  addEventListener('pointermove', e => set(e.clientX, e.clientY));
  addEventListener('touchmove', e => set(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  p.update = (t) => {
    if (!p.active) { p.tx = Math.sin(t * 0.45) * 0.55; p.ty = Math.cos(t * 0.33) * 0.25 - 0.1; }
    p.x += (p.tx - p.x) * 0.06; p.y += (p.ty - p.y) * 0.06;
  };
  return p;
}

export function renderer(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  r.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.6 : 2));
  r.setSize(innerWidth, innerHeight, false);
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.05;
  r.outputColorSpace = THREE.SRGBColorSpace;
  return r;
}
