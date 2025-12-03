/* ULTRA PRO Deluxe - script.js */

/* Helpers */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* PRELOADER */
window.addEventListener('load', () => {
  const p = $('#preloader');
  if (!p) return;
  p.style.transition = 'opacity .45s';
  setTimeout(()=> p.style.opacity = 0, 300);
  setTimeout(()=> p.remove(), 900);
});

/* YEAR */
document.addEventListener('DOMContentLoaded', () => {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
});

/* SMOOTH SCROLL (nav delegation) */
$('body').addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"], button[data-target]');
  if (!a) return;
  e.preventDefault();
  const target = a.getAttribute('href') || a.dataset.target;
  if (target) document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* MODAL */
function openBot(id){
  const modal = $('#botModal'), content = $('#modalContent');
  if(!modal || !content) return;
  const html = id === 'bot1' ? `
    <h3>Elder Automaton</h3>
    <p class="muted">Protección, anti-raid y moderación avanzada.</p>
    <p>Privado — acceso restringido.</p>
    <div style="margin-top:12px"><button class="btn primary" onclick="window.open('https://discord.com','_blank')">Ir a Discord</button></div>
  ` : `
    <h3>Elder Automaton V2</h3>
    <p class="muted">Detección avanzada y respuesta inmediata.</p>
    <div style="margin-top:12px"><button class="btn primary" onclick="window.open('https://discord.com','_blank')">Ir a Discord</button></div>
  `;
  content.innerHTML = html;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
window.openBot = openBot;
function closeModal(){
  const m = $('#botModal');
  if(m) m.style.display = 'none';
  document.body.style.overflow = '';
}
window.closeModal = closeModal;
$('#botModal')?.addEventListener('click', e => { if(e.target === $('#botModal')) closeModal(); });

/* Contact mock */
$('#contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = $('#sendBtn');
  btn.textContent = 'Enviando...';
  setTimeout(()=> {
    btn.textContent = 'Enviado ✔';
    e.target.reset();
    setTimeout(()=> btn.textContent = 'Enviar mensaje', 1400);
  }, 900);
});

/* Cursor (rAF smoothing) */
(() => {
  const cursor = $('#cursor');
  if(!cursor) return;
  let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 }, pos = { x: mouse.x, y: mouse.y };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  function tick(){
    pos.x += (mouse.x - pos.x) * 0.18;
    pos.y += (mouse.y - pos.y) * 0.18;
    cursor.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(1)`;
    requestAnimationFrame(tick);
  }
  tick();

  const hoverEls = ['.btn', '.card', 'a'];
  hoverEls.forEach(sel => $$(sel).forEach(el => {
    el.addEventListener('mouseenter', ()=> { cursor.style.transform += ' scale(2.4)'; cursor.style.opacity = .95; });
    el.addEventListener('mouseleave', ()=> { cursor.style.opacity = 1; });
  }));
})();

/* Reveal on scroll */
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(en => {
    if(en.isIntersecting){ en.target.classList.add('revealed'); obs.unobserve(en.target); }
  });
},{ threshold: 0.12 });

$$('.card, .section-head, .about-grid, .hero-inner').forEach(el => io.observe(el));

/* Particle background - optimized density */
(function bg(){
  const c = $('#bgCanvas'); if(!c) return;
  const ctx = c.getContext('2d');
  let W = c.width = innerWidth, H = c.height = innerHeight;
  const density = matchMedia('(max-width:900px)').matches ? 26000 : 14000;
  let N = Math.floor((W * H) / density);
  const pts = [];
  for(let i=0;i<N;i++) pts.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.3+0.5, vx:(Math.random()-0.5)*0.18, vy:(Math.random()*0.25)+0.03, a:Math.random()*0.4+0.12 });

  window.addEventListener('resize', ()=> { W = c.width = innerWidth; H = c.height = innerHeight; N = Math.floor((W*H)/density); while(pts.length < N) pts.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.3+0.5, vx:(Math.random()-0.5)*0.18, vy:(Math.random()*0.25)+0.03, a:Math.random()*0.4+0.12 }); });

  function frame(){
    ctx.clearRect(0,0,W,H);
    const g = ctx.createLinearGradient(0,0,W,H);
    g.addColorStop(0, 'rgba(60,30,120,0.04)'); g.addColorStop(1, 'rgba(8,10,20,0.04)');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);

    for(const p of pts){
      ctx.beginPath(); ctx.fillStyle = `rgba(125,97,255,${p.a})`; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if(p.y > H + 10) p.y = -10;
      if(p.x < -20) p.x = W + 20;
      if(p.x > W + 20) p.x = -20;
    }
    requestAnimationFrame(frame);
  }
  frame();
})();

/* Tech icons micro animation */
$$('.tech').forEach((t, i) => {
  t.style.transition = 'transform .3s, box-shadow .3s';
  t.addEventListener('mouseenter', ()=> { t.style.transform = 'translateY(-6px)'; t.style.boxShadow = '0 12px 40px rgba(120,80,255,0.12)'; });
  t.addEventListener('mouseleave', ()=> { t.style.transform = ''; t.style.boxShadow = ''; });
});

/* Hero stats counter */
(function counters(){
  const els = $$('.count');
  els.forEach(el => {
    const target = +el.dataset.target || 0;
    let current = 0;
    const increment = Math.ceil(target / 80);
    const id = setInterval(()=> {
      current += increment;
      if(current >= target){ el.textContent = target; clearInterval(id); } else el.textContent = current;
    }, 18);
  });
})();

/* FAQ toggle class */
$$('details').forEach(d => d.addEventListener('toggle', ()=> d.classList.toggle('faq-open', d.open)));

/* anime.js headline subtle */
anime({
  targets: '.title span',
  translateY: [-6, 0],
  duration: 1800,
  direction: 'alternate',
  loop: true,
  easing: 'easeInOutSine'
});

/* Hacker overlay */
const hackerBtn = $('#hackerBtn'), hackerOverlay = $('#hackerOverlay'), closeHacker = $('#closeHacker'), termContent = $('#termContent');
if(hackerBtn && hackerOverlay){
  hackerBtn.addEventListener('click', ()=>{
    hackerOverlay.style.display = 'flex';
    termContent.innerHTML = '<pre></pre>';
    const pre = termContent.querySelector('pre');
    const lines = ['$ connecting to private cluster...', '$ auth: limitedbreaker', '$ opening secure console', '$ welcome'];
    let i=0;
    const t = setInterval(()=> {
      if(i < lines.length){ pre.textContent += lines[i] + '\n'; pre.scrollTop = pre.scrollHeight; i++; } else clearInterval(t);
    }, 360);
  });
  closeHacker?.addEventListener('click', ()=> hackerOverlay.style.display = 'none');
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape'){ hackerOverlay.style.display = 'none'; closeModal(); } });
}
