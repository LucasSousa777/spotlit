// Spotlit · interações e motion. GSAP + ScrollTrigger + Lenis (rolagem suave).
(() => {
  const WA = 'https://wa.me/5581992071058?text=' + encodeURIComponent('Olá! Quero o diagnóstico grátis do meu negócio.');
  document.querySelectorAll('[data-wa]').forEach(a => a.href = WA);

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- estado do holofote (lido também pelo WebGL em dust.js) ----------
  const hero = $('[data-hero]'), title = $('.hero__title'), lit = $('.hero__layer--lit'), beam = $('.hero__beam');
  const SPOT = window.SPOT = { tx: .25, ty: .9, x: .25, y: .9, on: 0, ox: .5, oy: -.06, half: .2, w: 1, h: 1 };
  let pointerActive = false;

  function layoutBeam() {
    const r = hero.getBoundingClientRect(); SPOT.w = r.width; SPOT.h = r.height;
    const ox = SPOT.ox * r.width, oy = SPOT.oy * r.height, px = SPOT.x * r.width, py = SPOT.y * r.height;
    const dx = px - ox, dy = py - oy, dist = Math.hypot(dx, dy), len = dist * 1.18, bw = Math.max(520, Math.min(980, r.width * .55));
    const ang = Math.atan2(dx, dy) * -180 / Math.PI;
    SPOT.half = Math.atan((bw / 2) / len);
    beam.style.setProperty('--bl', len + 'px'); beam.style.setProperty('--bw', bw + 'px'); beam.style.setProperty('--ba', ang + 'deg'); beam.style.setProperty('--bo', SPOT.on);
    const t = title.getBoundingClientRect(), rad = bw * (dist / len) * .42;
    lit.style.setProperty('--mx', (px + r.left - t.left) + 'px'); lit.style.setProperty('--my', (py + r.top - t.top) + 'px'); lit.style.setProperty('--mr', rad + 'px');
  }
  function heroTick(time) {
    if (!pointerActive) {                       // sem mouse (celular) o holofote varre sozinho
      const s = time / 1000;
      SPOT.tx = .5 + Math.sin(s * .45) * .32; SPOT.ty = .48 + Math.sin(s * .8) * .12;
    }
    SPOT.x += (SPOT.tx - SPOT.x) * .08; SPOT.y += (SPOT.ty - SPOT.y) * .08;
    layoutBeam();
  }

  // ---------- texto que sobe palavra por palavra ----------
  function split(el) {
    const words = [];
    const walk = (node, parent) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { parent.appendChild(document.createTextNode(' ')); return; }
            const outer = document.createElement('span'), inner = document.createElement('span');
            outer.className = 'split-line'; outer.style.display = 'inline-block'; inner.textContent = part; outer.appendChild(inner); parent.appendChild(outer); words.push(inner);
          });
        } else if (n.nodeType === 1) { const clone = n.cloneNode(false); parent.appendChild(clone); walk(n, clone); }
      });
    };
    const frag = document.createElement('span'); walk(el, frag); el.innerHTML = ''; el.append(...frag.childNodes);
    el.setAttribute('aria-label', el.textContent.trim());
    return words;
  }

  // ---------- botões magnéticos ----------
  if (fine && !reduce) $$('[data-magnetic]').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.setProperty('--bx', (e.clientX - r.left - r.width / 2) * .22 + 'px'); b.style.setProperty('--by', (e.clientY - r.top - r.height / 2) * .3 + 'px'); });
    b.addEventListener('pointerleave', () => { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px'); });
  });

  // ---------- luz do cursor ----------
  const cl = $('.cursor-light');
  if (fine) addEventListener('pointermove', e => { cl.style.setProperty('--cx', e.clientX + 'px'); cl.style.setProperty('--cy', e.clientY + 'px'); }, { passive: true });

  // ---------- som do showreel ----------
  const video = $('[data-reel-video]'), soundBtn = $('[data-sound]');
  soundBtn.addEventListener('click', () => {
    video.muted = !video.muted; soundBtn.setAttribute('aria-pressed', String(!video.muted)); soundBtn.textContent = video.muted ? 'Ativar som' : 'Som ligado';
    if (video.paused) video.play().catch(() => {});
  });

  // ---------- nav e botão flutuante ----------
  const nav = $('[data-nav]'), fab = $('.fab'); let lastY = 0;
  function onScroll(y) {
    nav.classList.toggle('is-solid', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 500);
    fab.classList.toggle('is-on', y > innerHeight * .8);
    lastY = y;
  }

  if (reduce || !window.gsap) {
    SPOT.x = SPOT.tx = .5; SPOT.y = SPOT.ty = .5; SPOT.on = 1; layoutBeam();
    addEventListener('scroll', () => onScroll(scrollY), { passive: true });
    $$('[data-count]').forEach(el => el.textContent = el.dataset.count);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ lerp: .1, smoothWheel: true });
  lenis.on('scroll', e => { ScrollTrigger.update(); onScroll(e.scroll); });
  gsap.ticker.add(t => { lenis.raf(t * 1000); heroTick(t * 1000); });
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const id = a.getAttribute('href'); if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -10 }); } }));

  // hero: entrada
  if (fine) hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect(); pointerActive = true; SPOT.tx = (e.clientX - r.left) / r.width; SPOT.ty = (e.clientY - r.top) / r.height;
  });
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.to(SPOT, { on: 1, duration: .6 }, .2)
       .fromTo(SPOT, { tx: .08, ty: .95 }, { tx: .42, ty: .42, duration: 1.8, ease: 'power2.inOut' }, .2)
       .from('[data-reveal]', { y: 40, opacity: 0, duration: 1, stagger: .12 }, .5)
       .from('.nav', { y: -30, opacity: 0, duration: .8 }, .3);
  gsap.to('.hero__inner', { yPercent: -14, opacity: .2, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });

  // títulos
  $$('[data-split]').forEach(h => {
    const w = split(h);
    gsap.from(w, { yPercent: 110, duration: 1, ease: 'power4.out', stagger: .05, scrollTrigger: { trigger: h, start: 'top 85%' } });
  });

  // showreel: o quadro cresce até a borda
  const frame = $('[data-reel-frame]');
  const reelTl = gsap.timeline({ scrollTrigger: { trigger: '[data-reel]', start: 'top top', end: 'bottom bottom', scrub: .6 } });
  reelTl.fromTo(frame, { scale: .72, borderRadius: 18 }, { scale: () => (innerWidth < innerHeight ? innerWidth / frame.offsetWidth : Math.max(innerWidth / frame.offsetWidth, innerHeight / frame.offsetHeight)) * 1.002, borderRadius: 0, ease: 'power2.inOut', duration: 1 })
        .to('.reel__title', { yPercent: -60, opacity: 0, ease: 'power2.in', duration: .5 }, 0);
  ScrollTrigger.create({ trigger: '[data-reel]', start: 'top 80%', end: 'bottom top', onToggle: s => s.isActive ? video.play().catch(() => {}) : video.pause() });

  // caminho do cliente: rolagem horizontal
  const track = $('[data-track]'), stops = $$('.stop');
  const mm = gsap.matchMedia();
  mm.add('(min-width: 801px)', () => {                 // computador: a seção para e rola de lado
    const dist = () => track.scrollWidth - innerWidth + 40;
    const hTween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '[data-journey]', pin: '.journey__pin', start: 'top top', end: () => '+=' + dist(), scrub: .8, invalidateOnRefresh: true } });
    stops.forEach(st => ScrollTrigger.create({ trigger: st, containerAnimation: hTween, start: 'left 75%', end: 'right 10%', onEnter: () => on(st), onEnterBack: () => on(st) }));
  });
  mm.add('(max-width: 800px)', () => {                 // celular: lista vertical, cada parada acende ao entrar na tela
    stops.forEach(st => ScrollTrigger.create({ trigger: st, start: 'top 75%', onEnter: () => on(st), onEnterBack: () => on(st) }));
  });
  // o vídeo do celular toca sempre que aparece na tela (e pausa fora dela)
  const pv = $('[data-lazy-video]');
  if (pv) new IntersectionObserver(([e]) => e.isIntersecting ? pv.play().catch(() => {}) : pv.pause(), { threshold: .25 }).observe(pv);
  function on(st) {
    if (st.classList.contains('is-on')) return; st.classList.add('is-on');
    const typer = $('[data-type]', st);
    if (typer) { const txt = typer.dataset.type; let i = 0; const id = setInterval(() => { typer.textContent = txt.slice(0, ++i); if (i >= txt.length) clearInterval(id); }, 55); }
  }

  // serviços: o cartão de trás encolhe quando o próximo chega
  const cards = $$('.card');
  cards.forEach((c, i) => {
    const next = cards[i + 1]; if (!next) return;
    // só escurece quando o próximo cartão começa a cobrir este (e não quando ele aparece lá embaixo)
    const stuck = el => parseFloat(getComputedStyle(el).top) || 0;
    gsap.to(c, { scale: .96, filter: 'brightness(.45)', ease: 'none', scrollTrigger: {
      trigger: next, start: () => 'top ' + (stuck(c) + c.offsetHeight) + 'px', end: () => 'top ' + stuck(next) + 'px', scrub: true, invalidateOnRefresh: true } });
  });

  // caso: o print do site se levanta em 3D
  gsap.fromTo('[data-tilt]', { rotateX: 32, scale: .86, y: 60 }, { rotateX: 0, scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.case__stage', start: 'top 95%', end: 'top 35%', scrub: true } });
  $$('[data-count]').forEach(el => {
    const n = +el.dataset.count, o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.to(o, { v: n, duration: n ? 1.6 : .1, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v) }) });
  });

  // como funciona: a linha desenha e acende os passos
  const steps = $$('.steps__list li'), line = $('.steps__line line');
  ScrollTrigger.create({ trigger: '[data-steps]', start: 'top 75%', end: 'bottom 45%', scrub: true,
    onUpdate: s => { line.style.setProperty('--dash', 1000 * (1 - s.progress)); steps.forEach((li, i) => li.classList.toggle('is-on', s.progress >= i / (steps.length - 1) - .02)); } });

  // fechamento: a luz acende e o ponto cai no lugar
  const close = $('[data-close]'), light = $('[data-close-light]'), dot = $('[data-dot]');
  gsap.timeline({ scrollTrigger: { trigger: close, start: 'top 85%', end: 'top 15%', scrub: .5 } })
    .fromTo(light, { '--lr': '0%' }, { '--lr': '80%', ease: 'power2.in' })
    .fromTo('.close__inner', { '--co': 0 }, { '--co': 1, ease: 'none' }, .45);
  ScrollTrigger.create({ trigger: close, start: 'top 25%', once: true, onEnter: () => gsap.fromTo(dot, { '--dy': '-3em' }, { '--dy': '0em', duration: 1.1, ease: 'bounce.out' }) });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
