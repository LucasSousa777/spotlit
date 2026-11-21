// Poeira no ar do hero (Three.js). As partículas acendem quando passam dentro do facho do holofote.
import * as THREE from '../vendor/three.module.js';

const canvas = document.querySelector('[data-dust]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (canvas && !reduce) start();

function start() {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' }); }
  catch (e) { return; }                                 // sem WebGL: o hero continua com o facho em CSS
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, .1, 100); camera.position.z = 10;

  const small = innerWidth < 800, N = small ? 900 : 2200;
  const pos = new Float32Array(N * 3), seed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - .5) * 22; pos[i * 3 + 1] = (Math.random() - .5) * 13; pos[i * 3 + 2] = (Math.random() - .5) * 8;
    seed[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('seed', new THREE.BufferAttribute(seed, 1));

  const uniforms = {
    uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uOrigin: { value: new THREE.Vector2(.5, -.06) },
    uTarget: { value: new THREE.Vector2(.5, .5) }, uHalf: { value: .2 }, uOn: { value: 0 }, uPx: { value: renderer.getPixelRatio() },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float seed; uniform float uTime, uHalf, uOn, uPx; uniform vec2 uRes, uOrigin, uTarget; varying float vA;
      void main(){
        vec3 p = position;
        float t = uTime * (.05 + seed * .08);
        p.x += sin(t * 2.1 + seed * 40.) * .6; p.y += mod(t * 1.4 + seed * 13., 13.) - 6.5 - position.y * 0.; p.y = mod(p.y + 6.5, 13.) - 6.5;
        p.z += cos(t * 1.7 + seed * 20.) * .4;
        vec4 mv = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mv;
        vec2 sp = (gl_Position.xy / gl_Position.w * .5 + .5); sp.y = 1. - sp.y;          // 0..1, de cima para baixo
        vec2 o = uOrigin * uRes, d = sp * uRes - o, dir = normalize(uTarget * uRes - o);
        float ang = acos(clamp(dot(normalize(d), dir), -1., 1.));
        float inBeam = (1. - smoothstep(uHalf * .55, uHalf, ang)) * smoothstep(0., 120., length(d));
        vA = (.05 + inBeam * .95 * uOn) * (.35 + seed * .65);
        gl_PointSize = (1.2 + seed * 2.6 + inBeam * 1.6) * uPx * (10. / -mv.z);
      }`,
    fragmentShader: `
      varying float vA;
      void main(){ vec2 c = gl_PointCoord - .5; float r = length(c); if (r > .5) discard; gl_FragColor = vec4(1., .86, .5, vA * (1. - r * 2.)); }`,
  });
  scene.add(new THREE.Points(geo, mat));

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); uniforms.uRes.value.set(w, h);
  }
  addEventListener('resize', resize); resize();

  let visible = true;
  new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(canvas);
  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    if (!visible) return;
    const S = window.SPOT || {};
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uOrigin.value.set(S.ox ?? .5, S.oy ?? -.06); uniforms.uTarget.value.set(S.x ?? .5, S.y ?? .5);
    uniforms.uHalf.value = S.half ?? .2; uniforms.uOn.value = S.on ?? 1;
    renderer.render(scene, camera);
  })();
}
