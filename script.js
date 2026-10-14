(() => {
'use strict';

/* ===== 1. Documented models (omit anything unverified; "claimed" = manufacturer figure) ===== */
const REAL = [
{n:'Bugatti Type 35',f:'vint',k:'model',c:'Grand Prix racing car',s:['1924','Straight-8'],d:'A lightweight racer that won the Targa Florio every year from 1925 to 1929.'},
{n:'Bugatti Type 41 Royale',f:'vint',k:'model',c:'Ultra-luxury car',s:['1927','12.7 L straight-8','6 built'],d:'Conceived as a car for royalty and built in extremely small numbers.'},
{n:'Bugatti Type 57 SC Atlantic',f:'vint',k:'model',c:'Coupé',s:['1936','Supercharged straight-8','4 built'],d:'Styled by Jean Bugatti and known for the riveted seam along its roofline.'},
{n:'Bugatti EB110',f:'wedge',k:'model',c:'Supercar',s:['1991','3.5 L quad-turbo V12','All-wheel drive'],d:'Revived the marque in 1991 under Romano Artioli, built in Campogalliano, Italy.'},
{n:'Bugatti Veyron 16.4',f:'hyper',k:'model',c:'Hypercar',s:['2005','8.0 L quad-turbo W16','1,001 PS (claimed)'],d:'The first production road car with a W16 engine. A 2010 Super Sport run reached 431 km/h.'},
{n:'Bugatti Chiron',f:'hyper',k:'model',c:'Hypercar',s:['2016','8.0 L quad-turbo W16','1,500 PS (claimed)'],d:'Successor to the Veyron. A Chiron-based prototype recorded 490.48 km/h in 2019.'},
{n:'Bugatti Divo',f:'hyper',k:'model',c:'Handling-focused hypercar',s:['2018','40 built','1,500 PS (claimed)'],d:'A Chiron derivative tuned for cornering, first shown at Pebble Beach.'},
{n:'Bugatti Centodieci',f:'wedge',k:'model',c:'Hypercar',s:['2019','10 built','1,600 PS (claimed)'],d:'A homage to the EB110, created for the marque’s 110th anniversary.'},
{n:'Bugatti Bolide',f:'track',k:'concept',c:'Track-only hypercar',s:['2020','8.0 L quad-turbo W16','1,850 PS (claimed)'],d:'A track-only design study built around the W16 engine.'},
{n:'Bugatti La Voiture Noire',f:'hyper',k:'oneoff',c:'One-off grand tourer',s:['2019','1 built','1,500 PS (claimed)'],d:'A one-off coachbuilt car that echoes the Type 57 SC Atlantic.'},
{n:'Bugatti Mistral',f:'hyper',k:'model',c:'Roadster',s:['2022','1,600 PS (claimed)','99 planned'],d:'An open roadster presented as the final Bugatti to use the W16 engine.'},
{n:'Bugatti Tourbillon',f:'hyper',k:'model',c:'Hybrid hypercar',s:['2024','8.3 L V16 hybrid','1,800 PS (claimed)'],d:'Successor to the Chiron, pairing a V16 engine with electric motors.'}
];
const TAG = {model:'Documented model', oneoff:'Documented one-off', concept:'Documented concept'};

/* ===== 2. Fictional concept rules + palettes ===== */
const PAL = [['Obsidian Black','#2d3037','#0e0f12','#000'],['Midnight Blue','#2e4f9a','#0f2352','#050c24'],
 ['Metallic Silver','#f3f5f8','#aeb4be','#5e646e'],['Champagne Gold','#f1dfb4','#c2a263','#6e5629'],
 ['Matte Graphite','#6a6e77','#33363d','#14161a'],['Pearl White','#ffffff','#dfe3e9','#8b919b'],
 ['Electric Blue','#6cc0ff','#1f78d1','#0a3a78']];
const WH = [['polished silver','#d5dae1'],['satin graphite','#6a6f78'],['champagne gold','#cdb277'],['gloss black','#2a2d33'],['electric blue','#4aa3ff']];
const ENV = ['studio','dusk','tunnel','coast','vault'];
const FAMS = ['vint','hyper','track','wedge'];
const FCLS = {vint:'vintage-style roadster', hyper:'hypercar', track:'track-focused', wedge:'wedge-profile supercar'};
const VIEWS = [['f34','front three-quarter view',.4],['side','side view',.65],['r34','rear three-quarter view',.85],['front','front view',1]];

/* ===== 3. Deterministic BigInt generator (cost grows with digits only) ===== */
const M64 = (1n << 64n) - 1n;
const mix = x => {
  x = BigInt.asUintN(64, x + 0x9E3779B97F4A7C15n);
  x = BigInt.asUintN(64, (x ^ (x >> 30n)) * 0xBF58476D1CE4E5B9n);
  x = BigInt.asUintN(64, (x ^ (x >> 27n)) * 0x94D049BB133111EBn);
  return x ^ (x >> 31n);
};
function rng(id) {
  let h = 0x1234n, x = id;
  do { h = mix(h ^ (x & M64)); x >>= 64n; } while (x > 0n);
  return () => { h = mix(h); return Number(h >> 11n) / 9007199254740992; };
}
const cache = new Map(); // small LRU
function gen(id) {
  const key = id.toString();
  if (cache.has(key)) { const v = cache.get(key); cache.delete(key); cache.set(key, v); return v; }
  const r = rng(id);
  const rr = r(), rp = r(), rf = r(), pc = r(), pt = r(), p2 = r(), pw = r(), pe = r(), pl = r(), pv = r();
  const real = id <= 12n ? REAL[Number(id) - 1] : (rr < .22 ? REAL[Math.floor(rp * REAL.length)] : null);
  const fam = real ? real.f : FAMS[Math.floor(rf * 4)];
  const pal = PAL[Math.floor(pc * PAL.length)];
  const two = pt < .4 ? PAL[Math.floor(p2 * PAL.length)] : null;
  const wh = WH[Math.floor(pw * WH.length)];
  const env = Math.floor(pe * 5);
  const vw = VIEWS.find(v => pv < v[2]);
  const color = pal[0] + (two ? ' with a ' + two[0].toLowerCase() + ' lower body' : '');
  const p = {real: !!real, fam, env, vk: vw[0], vn: vw[1], lx: 15 + Math.floor(pl * 70), pal, two, wh};
  if (real) {
    p.name = real.n; p.tag = TAG[real.k];
    p.meta = real.c + '. Illustration livery: ' + color + ', ' + vw[1] + '.';
    p.chips = real.s; p.desc = real.d;
  } else {
    p.name = 'Bugatti-Inspired Concept ' + key; p.tag = 'Fictional concept';
    p.meta = 'Fictional ' + FCLS[fam] + ' in ' + color + ', ' + vw[1] + '.';
    p.chips = ['Horseshoe grille', fam === 'vint' ? 'Round headlamps' : fam === 'track' ? 'Rear wing' : 'Low sculpted nose',
      wh[0] + ' wheels', two ? 'Two-tone body' : 'Single-colour body'];
    p.desc = 'A ' + FCLS[fam] + ' study shown in a ' + ENV[env] + ' setting. Not a Bugatti product; no specifications or performance figures are claimed.';
  }
  cache.set(key, p);
  if (cache.size > 48) cache.delete(cache.keys().next().value);
  return p;
}

/* ===== 4. CSS car templates ===== */
const FR = '<i class="shd"></i><i class="cab"><i class="gl"></i></i><i class="tire l"></i><i class="tire r"></i><i class="body"></i><i class="hl l"></i><i class="hl r"></i><i class="grl"></i><i class="vent l"></i><i class="vent r"></i><i class="spl"></i>';
const RE = '<i class="shd"></i><i class="cab"><i class="gl"></i></i><i class="tire l"></i><i class="tire r"></i><i class="body"></i><i class="wing"></i><i class="tl"></i><i class="dif"></i><i class="ex a"></i><i class="ex b"></i>';
const SD = '<i class="shd"></i><i class="sil"></i><i class="gls"></i><i class="cl"></i><i class="vt"></i><i class="lamp"></i><i class="wh a"></i><i class="wh b"></i>';
const car = (c, t) => '<div class="car"><div class="v ' + c + '">' + t + '</div></div>';
const VT = {f34: car('fv t34', FR), front: car('fv', FR), r34: car('rv t34', RE), side: car('sv', SD)};

/* ===== 5. Virtualised feed: fixed pool of recycled cards ===== */
const $ = s => document.querySelector(s);
const track = $('#track'), bar = $('#bar'), st = $('#st'), q = $('#q');
const MAXD = 200;
const CARD = '<div class="in"><div class="art"></div><div class="info"><div class="top"><b class="num" tabindex="0"></b><span class="tag"></span></div><h2 class="nm"></h2><p class="mt"></p><div class="ch"></div><p class="ds"></p></div></div>';
let H = 450, BH = 90, V = 3, POOL = 0, base = 1n, cur = 1n, raf = 0, ht = 0;
const els = [];

function mk() {
  const e = document.createElement('article');
  e.className = 'card'; e.innerHTML = CARD;
  e._a = e.querySelector('.art'); e._n = e.querySelector('.num'); e._t = e.querySelector('.tag');
  e._m = e.querySelector('.nm'); e._i = e.querySelector('.mt'); e._c = e.querySelector('.ch'); e._d = e.querySelector('.ds');
  e._v = ''; return e;
}
function bind(e, id) {
  const p = gen(id), s = id.toString();
  e._id = s; e.setAttribute('aria-label', 'Profile ' + s);
  e._n.textContent = 'Profile ' + s; e._n.className = 'num' + (s.length > 12 ? ' long' : '');
  e._t.textContent = p.tag; e._t.className = 'tag' + (p.real ? '' : ' fic');
  e._m.textContent = p.name; e._m.title = p.name;
  e._i.textContent = p.meta; e._d.textContent = p.desc;
  e._c.innerHTML = p.chips.map(c => '<span>' + c + '</span>').join('');
  const a = e._a;
  a.className = 'art e' + p.env + ' f-' + p.fam;
  a.style.cssText = '--lx:' + p.lx + '%;--hi:' + p.pal[1] + ';--bd:' + p.pal[2] + ';--lo:' + p.pal[3] +
    ';--b2:' + (p.two ? p.two[2] : p.pal[2]) + ';--wh:' + p.wh[1];
  if (e._v !== p.vk) { a.innerHTML = VT[p.vk]; e._v = p.vk; }
}
const place = () => els.forEach((e, i) => { e.style.transform = 'translate3d(0,' + i * H + 'px,0)'; });

function metrics() {
  H = Math.round((track.clientWidth - 24) * .625) + 284;
  BH = bar.offsetHeight;
  V = Math.ceil((innerHeight - BH) / H) + 1;
  track.style.setProperty('--h', H + 'px');
  return Math.max(14, 2 * V + 8);
}
function fit(n) {
  while (els.length < n) { const e = mk(); track.appendChild(e); els.push(e); }
  while (els.length > n) track.removeChild(els.pop());
  POOL = n; track.style.height = n * H + 'px';
}
function msg(t, err) { st.textContent = t; st.className = err ? 'err' : ''; }
function stamp() { msg('Viewing profile ' + cur); clearTimeout(ht); ht = setTimeout(() => history.replaceState(null, '', '#' + cur), 250); }

/* Jump straight to any id: rebinds the pool only, never walks the sequence. */
function go(id, flash) {
  base = id > 4n ? id - 4n : 1n;
  els.forEach((e, i) => bind(e, base + BigInt(i)));
  place();
  const k = Number(id - base);
  scrollTo(0, k * H);
  cur = id; stamp();
  if (flash) { const e = els[k]; e.classList.remove('hit'); void e.offsetWidth; e.classList.add('hit'); }
}

/* Recycle d cards (d>0 forward, d<0 backward) and offset scroll in the same frame. */
function shift(d) {
  const k = Math.abs(d);
  if (k >= POOL) { base += BigInt(d); els.forEach((e, i) => bind(e, base + BigInt(i))); }
  else if (d > 0) { const m = els.splice(0, k); els.push(...m); base += BigInt(k); m.forEach((e, j) => bind(e, base + BigInt(POOL - k + j))); }
  else { const m = els.splice(POOL - k, k); els.unshift(...m); base -= BigInt(k); m.forEach((e, j) => bind(e, base + BigInt(j))); }
  place();
  scrollTo(0, scrollY - d * H);
}
function tick() {
  raf = 0;
  const y = scrollY, vh = innerHeight, f = Math.floor(y / H), mid = Math.floor((POOL - V) / 2);
  if (POOL - (f + V) < 3) shift(f - mid);
  else if (f < 3 && base > 1n) {
    const room = base > BigInt(mid) ? mid : Number(base - 1n);
    const d = Math.min(room, mid - f);
    if (d > 0) shift(-d);
  }
  const c = Math.min(POOL - 1, Math.max(0, Math.floor((scrollY + (vh - BH) / 2) / H)));
  const id = base + BigInt(c);
  if (id !== cur) { cur = id; stamp(); }
}
const sched = () => { if (!raf) raf = requestAnimationFrame(tick); };

/* ===== 6. Search ===== */
$('#f').addEventListener('submit', ev => {
  ev.preventDefault();
  const v = q.value.trim();
  if (!/^\d+$/.test(v)) return msg('Enter a whole number using digits 0 to 9 only.', 1);
  const t = v.replace(/^0+(?=\d)/, '');
  if (t.length > MAXD) return msg('This site accepts profile numbers up to ' + MAXD + ' digits.', 1);
  const id = BigInt(t);
  if (id < 1n) return msg('Profile numbers start at 1.', 1);
  q.value = t; go(id, true); q.blur();
});

/* ===== 7. Start ===== */
addEventListener('scroll', sched, {passive: true});
let rt = 0;
addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { fit(metrics()); go(cur, false); }, 150); });
const h = /^#(\d{1,200})$/.exec(location.hash);
const start = h && BigInt(h[1]) > 0n ? BigInt(h[1]) : 1n;
fit(metrics());
go(start, !!h);
})();
