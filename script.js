const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Quick exit: button or Esc twice. Replaces history so Back won't return here. */
function quickExit() {
  window.open('https://www.google.com/search?q=weather', '_blank', 'noopener');
  location.replace('https://www.google.com');
}
$('#exit').addEventListener('click', quickExit);
let lastEsc = 0;
addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const now = Date.now();
  if (now - lastEsc < 600) quickExit();
  lastEsc = now;
});

/* Header, progress bar, back-to-top */
const header = $('#header'), bar = $('#progress'), totop = $('#totop');
let ticking = false;
function onScroll() {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  header.classList.toggle('is-scrolled', y > 8);
  totop.classList.toggle('is-shown', y > 700);
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
totop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* Mobile menu */
const burger = $('#burger'), links = $('#links');
function setMenu(open) {
  links.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
burger.addEventListener('click', () => setMenu(!links.classList.contains('open')));
$$('a', links).forEach((a) => a.addEventListener('click', () => setMenu(false)));

/* Scroll-spy */
const navLinks = $$('[data-nav]');
const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach((a) => { const s = $(a.getAttribute('href')); if (s) spy.observe(s); });

/* Stage tabs (arrow keys, Home/End) */
const tabs = $$('.tab'), panels = $$('.panel');
function showStage(name, focus) {
  tabs.forEach((t) => {
    const on = t.dataset.stage === name;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    if (on && focus) t.focus();
  });
  panels.forEach((p) => { p.hidden = p.dataset.stage !== name; });
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => showStage(t.dataset.stage));
  t.addEventListener('keydown', (e) => {
    const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (k === undefined) return;
    e.preventDefault();
    showStage(tabs[(k + tabs.length) % tabs.length].dataset.stage, true);
  });
});
$$('[data-stage-link]').forEach((a) => a.addEventListener('click', () => showStage(a.dataset.stageLink)));

/* Involve buttons pre-select the contact reason */
$$('[data-reason]').forEach((a) => a.addEventListener('click', () => {
  const r = $(`input[name=reason][value="${a.dataset.reason}"]`);
  if (r) r.checked = true;
  setTimeout(() => $('#name').focus({ preventScroll: true }), 800);
}));

/* Contact form: live validation, auto-growing message, success state */
const form = $('#form'), fields = $('#fields'), sent = $('#ok'), msg = $('#message'), count = $('#count');
const req = $$('[required]', form);
const valid = (f) => f.value.trim() && (f.type !== 'email' || /^\S+@\S+\.\S+$/.test(f.value.trim()));
function mark(f, showBad) {
  const row = f.closest('.field'), v = !!valid(f);
  row.classList.toggle('is-ok', v);
  row.classList.toggle('is-bad', showBad && !v);
}
req.forEach((f) => {
  f.addEventListener('input', () => mark(f, f.closest('.field').classList.contains('is-bad')));
  f.addEventListener('blur', () => { if (f.value) mark(f, true); });
});
msg.addEventListener('input', () => {
  count.textContent = `${msg.value.length} / 800`;
  msg.style.height = 'auto';
  msg.style.height = Math.min(msg.scrollHeight, 320) + 'px';
});
function resetForm() {
  form.reset();
  $$('.field').forEach((r) => r.classList.remove('is-ok', 'is-bad'));
  count.textContent = '0 / 800';
  msg.style.height = '';
}
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let firstBad = null;
  req.forEach((f) => { mark(f, true); if (!valid(f) && !firstBad) firstBad = f; });
  if (firstBad) {
    const row = firstBad.closest('.field');
    firstBad.focus();
    row.classList.remove('shake'); void row.offsetWidth; row.classList.add('shake');
    return;
  }
  const btn = $('.send', form), d = new FormData(form);
  btn.classList.add('is-loading'); btn.disabled = true;
  setTimeout(() => {
    btn.classList.remove('is-loading'); btn.disabled = false;
    fields.hidden = true; sent.hidden = false; sent.focus();
    location.href = `mailto:info@tisef.org?subject=${encodeURIComponent('Website enquiry: ' + d.get('reason'))}&body=${encodeURIComponent(d.get('message') + '\n\n— ' + d.get('name') + ' (' + d.get('email') + ')')}`;
    resetForm();
  }, 900);
});
$('#again').addEventListener('click', () => { sent.hidden = true; fields.hidden = false; $('#name').focus(); });

/* Interactive emblem: each part is a stage. Hover/focus explains it, click opens it. */
const emb = $('#emblem'), cap = $('#cap'), hero = $('.hero');
const info = {
  prevention: 'Leaves: Prevention. Education that stops harm before it starts.',
  protection: 'Central figure: Protection. Safe shelter and trauma-informed support.',
  prosecution: 'Purple figure: Prosecution. Legal aid and access to justice.',
  empowerment: 'Gold figure: Empowerment. Skills, income, and independence.'
};
const def = cap.textContent;
const say = (s) => { s ? cap.dataset.stage = s : delete cap.dataset.stage; cap.textContent = s ? info[s] : def; };
const stageColor = { prevention: 'var(--green)', protection: 'var(--teal)', prosecution: 'var(--purple)', empowerment: 'var(--gold)' };
$$('.part', emb).forEach((p) => {
  const s = p.dataset.stage, go = () => { showStage(s); $('#approach').scrollIntoView({ behavior: 'smooth' }); };
  ['mouseenter', 'focus'].forEach((ev) => p.addEventListener(ev, () => { cap.style.setProperty('--c', stageColor[s]); say(s); }));
  ['mouseleave', 'blur'].forEach((ev) => p.addEventListener(ev, () => say()));
  p.addEventListener('click', go);
  p.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
});
if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  hero.addEventListener('pointermove', (e) => {
    const r = emb.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / innerWidth, y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
    emb.style.setProperty('--px', x * 36 + 'px'); emb.style.setProperty('--py', y * 36 + 'px');
    emb.style.setProperty('--rx', -y * 12 + 'deg'); emb.style.setProperty('--ry', x * 16 + 'deg');
  });
  hero.addEventListener('pointerleave', () => ['--px', '--py', '--rx', '--ry'].forEach((v) => emb.style.removeProperty(v)));
}

$('#year').textContent = new Date().getFullYear();
onScroll();
