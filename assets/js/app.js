/* =========================================================
   BUGpairoj Fruit Growth AI 360° — Shared Layout & UI Kit (v1.0.0)
   AI Pairoj — by BUGpairoj  |  https://www.youtube.com/c/BUGpairoj
   ---------------------------------------------------------
   • ข้อมูลทุกหน้าเป็น "ข้อมูลตัวอย่าง (DEMO)" — ตอนพัฒนาเป็น PHP ให้แทนที่ด้วย
     include('partials/sidebar.php' / 'topbar.php') และ fetch('/api/v1/...')
   • กราฟทุกตัวครอบด้วย <div class="relative flex items-center justify-center h-[300px]">
     + maintainAspectRatio:false เพื่อแก้ปัญหา "กราฟวิ่ง/ยืดไม่หยุด"
   ========================================================= */
'use strict';

const APP = {
  name: 'BUGpairoj', product: 'Fruit Growth AI 360°', version: 'v1.0.0',
  today: { text: 'วันอังคารที่ 22 เม.ย. 2568', lunar: 'ขึ้น 15 ค่ำ เดือน 5' }, // DEMO date (จะเปลี่ยนเป็น server time)
  weather: { temp: '32°C', text: 'มีเมฆบางส่วน' },
  user: { name: 'สมชาย ใจดี', role: 'เจ้าของสวน', initials: 'สจ' },
  credit: { text: 'AI Pairoj — by BUGpairoj', url: 'https://www.youtube.com/c/BUGpairoj' }
};

const MENU = [
  { key: 'dashboard', href: 'dashboard.html', label: 'แดชบอร์ด', icon: 'house' },
  { key: 'farms', href: 'farms.html', label: 'สวน/แปลง', icon: 'map' },
  { key: 'trees', href: 'trees.html', label: 'ต้นไม้', icon: 'trees' },
  { key: 'calendar', href: 'calendar.html', label: 'ปฏิทินงาน', icon: 'calendar-days' },
  { key: 'growth', href: 'growth-monitoring.html', label: 'การเติบโต', icon: 'trending-up' },
  { key: 'fertilizer', href: 'fertilizer-plans.html', label: 'ใส่ปุ๋ย', icon: 'sprout' },
  { key: 'pest', href: 'pest-management.html', label: 'โรค/แมลง', icon: 'bug' },
  { key: 'harvest', href: 'harvest-forecast.html', label: 'คาดการณ์เก็บเกี่ยว', icon: 'apple' },
  { key: 'ai', href: 'ai-advisor.html', label: 'AI วิเคราะห์', icon: 'scan-search' },
  { key: 'iot', href: 'integrations.html', label: 'IoT/API', icon: 'radio-tower' },
  { key: 'reports', href: 'reports.html', label: 'รายงาน', icon: 'file-text' },
  { key: 'settings', href: 'settings.html', label: 'ตั้งค่า', icon: 'settings' }
];

/* ---------- Utilities ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nf = (n, d = 0) => Number(n).toLocaleString('th-TH', { minimumFractionDigits: d, maximumFractionDigits: d });
const ic = (name, cls = '') => `<i data-lucide="${name}" class="${cls}"></i>`;
const TH_MONTH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const TH_MONTH_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
/** ค.ศ. (ISO) -> พ.ศ. สั้น เช่น 2025-04-22 => 22 เม.ย. 2568 */
function thDate(iso, withTime = false) {
  const d = new Date(iso); if (isNaN(d)) return esc(iso);
  let s = `${d.getDate()} ${TH_MONTH[d.getMonth()]} ${d.getFullYear() + 543}`;
  if (withTime) s += ` ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return s;
}

/* ---------- Fruit icons (SVG) ---------- */
const FRUIT = {
  durian: { th: 'ทุเรียน', color: '#43a047' },
  mangosteen: { th: 'มังคุด', color: '#8e5bd6' },
  mango: { th: 'มะม่วง', color: '#f4c430' },
  rambutan: { th: 'เงาะ', color: '#e53935' },
  longan: { th: 'ลำไย', color: '#b07d4f' }
};
const FRUIT_BY_TH = Object.fromEntries(Object.entries(FRUIT).map(([k, v]) => [v.th, k]));
function fruitSvg(t, s = 26) {
  if (FRUIT_BY_TH[t]) t = FRUIT_BY_TH[t];
  const o = `<svg width="${s}" height="${s}" viewBox="0 0 32 32" aria-hidden="true">`;
  if (t === 'durian') {
    let sp = '';
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2, c = (x) => x.toFixed(2);
      const b1 = [16 + Math.cos(a - .22) * 10, 18 + Math.sin(a - .22) * 10], b2 = [16 + Math.cos(a + .22) * 10, 18 + Math.sin(a + .22) * 10], tp = [16 + Math.cos(a) * 14, 18 + Math.sin(a) * 14];
      sp += `<polygon points="${c(b1[0])},${c(b1[1])} ${c(tp[0])},${c(tp[1])} ${c(b2[0])},${c(b2[1])}" fill="#7cb342"/>`;
    }
    return o + sp + `<circle cx="16" cy="18" r="10.5" fill="#8bc34a" stroke="#558b2f" stroke-width="1"/><path d="M11 15l2 2m3-4l1 3m3-1l1 2m-9 4l2 1m4 0l1 2m3-4l1 2" stroke="#558b2f" stroke-width="1.2" stroke-linecap="round"/><rect x="15" y="2" width="2.4" height="6" rx="1" fill="#6d4c41"/></svg>`;
  }
  if (t === 'mangosteen') return o + `<defs><radialGradient id="mg" cx=".35" cy=".35"><stop offset="0" stop-color="#9c4d8f"/><stop offset="1" stop-color="#4a1440"/></radialGradient></defs><circle cx="16" cy="19" r="11" fill="url(#mg)"/><ellipse cx="11.5" cy="9.5" rx="3.6" ry="2.2" fill="#558b2f"/><ellipse cx="20.5" cy="9.5" rx="3.6" ry="2.2" fill="#558b2f"/><ellipse cx="16" cy="8" rx="3" ry="2.4" fill="#689f38"/><rect x="15" y="2.5" width="2" height="5" rx="1" fill="#5d4037"/></svg>`;
  if (t === 'mango') return o + `<defs><linearGradient id="mo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe066"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><path d="M9 9c6-5 17-2 18 8 1 8-6 12-12 11S4 22 5 16c.4-3 2-5.5 4-7z" fill="url(#mo)"/><path d="M14 7c2-4 7-5 10-3-3 2-6 3-10 3z" fill="#43a047"/></svg>`;
  if (t === 'rambutan') {
    let h = '';
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2;
      h += `<line x1="${(16 + Math.cos(a) * 8.5).toFixed(2)}" y1="${(17 + Math.sin(a) * 8.5).toFixed(2)}" x2="${(16 + Math.cos(a + .25) * 13.5).toFixed(2)}" y2="${(17 + Math.sin(a + .25) * 13.5).toFixed(2)}" stroke="${i % 3 ? '#e53935' : '#7cb342'}" stroke-width="1.6" stroke-linecap="round"/>`;
    }
    return o + h + `<circle cx="16" cy="17" r="9" fill="#e53935" stroke="#b71c1c"/></svg>`;
  }
  if (t === 'longan') return o + `<path d="M16 3v6M16 6l-6 6M16 6l6 6" stroke="#6d4c41" stroke-width="1.5" fill="none"/><circle cx="10" cy="17" r="6" fill="#c8955f" stroke="#8d6e4c"/><circle cx="22" cy="17" r="6" fill="#c08850" stroke="#8d6e4c"/><circle cx="16" cy="24" r="6" fill="#d1a06a" stroke="#8d6e4c"/></svg>`;
  return o + `<circle cx="16" cy="16" r="11" fill="#9ccc65"/></svg>`;
}

/* ---------- Illustrations (แทนภาพถ่าย — เปลี่ยนเป็น <img src="/uploads/..."> ภายหลังได้) ---------- */
const SCENE = {
  orchard(seed = 1) {
    let trees = '';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
      const x = 10 + c * 30 + (r % 2) * 14 + ((seed * (c + 3) * (r + 1)) % 7), y = 52 + r * 22, s = 11 + r * 2.5;
      trees += `<ellipse cx="${x}" cy="${y}" rx="${s}" ry="${s * .8}" fill="${['#2e7d32', '#388e3c', '#43a047', '#1b5e20'][(c + r + seed) % 4]}"/>`;
    }
    return `<svg viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="sk${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3ff"/><stop offset="1" stop-color="#eaf6e2"/></linearGradient></defs><rect width="220" height="140" fill="url(#sk${seed})"/><path d="M0 55 L40 30 L80 48 L120 22 L170 45 L220 28 V140 H0Z" fill="#8bb98d"/><rect y="60" width="220" height="80" fill="#6aa84f"/>${trees}</svg>`;
  },
  leaf(kind = 'k') {
    const spots = kind === 'spot' ? '#5d4037' : kind === 'hole' ? '#1b2a20' : kind === 'mite' ? '#b71c1c' : '#8d6e63';
    const fill = kind === 'healthy' ? '#43a047' : kind === 'k' ? '#c0ca33' : '#9e9d24';
    let d = '';
    for (let i = 0; i < 16; i++) d += `<circle cx="${50 + ((i * 37) % 120)}" cy="${40 + ((i * 53) % 70)}" r="${1.5 + (i % 4)}" fill="${spots}" opacity=".85"/>`;
    return `<svg viewBox="0 0 220 150" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="lb${kind}" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#4e6b3a"/><stop offset="1" stop-color="#1d2d17"/></radialGradient><linearGradient id="lf${kind}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${fill}"/><stop offset="1" stop-color="${kind === 'healthy' ? '#2e7d32' : '#9e7b1f'}"/></linearGradient></defs><rect width="220" height="150" fill="url(#lb${kind})"/><path d="M20 130 C40 40 140 0 205 20 C190 90 110 150 20 130Z" fill="url(#lf${kind})" stroke="#6d5a1a" stroke-width="2"/><path d="M22 128 C80 90 140 50 203 22" stroke="#e8e3a0" stroke-width="2.4" fill="none"/>${kind === 'healthy' ? '' : d}</svg>`;
  },
  durian() {
    return `<svg viewBox="0 0 220 160" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="dbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3e6b2f"/><stop offset="1" stop-color="#1e3a18"/></linearGradient></defs><rect width="220" height="160" fill="url(#dbg)"/><g transform="translate(60,22) scale(3.2)">${fruitSvg('durian', 32).replace(/<\/?svg[^>]*>/g, '')}</g></svg>`;
  },
  bug(color = '#d4a017') {
    return `<svg viewBox="0 0 220 150" preserveAspectRatio="xMidYMid slice"><rect width="220" height="150" fill="#5b7f3a"/><path d="M0 150 C60 60 160 40 220 70 V150Z" fill="#7da34b"/><g transform="translate(110 78) rotate(-20)"><ellipse rx="34" ry="12" fill="${color}"/><circle cx="36" cy="0" r="8" fill="${color}"/><path d="M-10 -10 l-14 -16 M5 -11 l-4 -20 M-10 10 l-14 16 M5 11 l-4 20 M40 -6 l14 -12 M40 6 l14 12" stroke="#3e2f0a" stroke-width="2"/></g></svg>`;
  },
  mealy() {
    let c = ''; for (let i = 0; i < 14; i++) c += `<ellipse cx="${60 + (i * 29) % 110}" cy="${55 + (i * 17) % 50}" rx="9" ry="6" fill="#f5f5f5" stroke="#ddd"/>`;
    return `<svg viewBox="0 0 220 150" preserveAspectRatio="xMidYMid slice"><rect width="220" height="150" fill="#355e2b"/><path d="M10 140 C70 70 150 60 210 10" stroke="#6b8e23" stroke-width="22" fill="none"/>${c}</svg>`;
  },
  root() {
    return `<svg viewBox="0 0 220 150" preserveAspectRatio="xMidYMid slice"><rect width="220" height="150" fill="#5d4a36"/><rect x="80" y="0" width="60" height="150" fill="#7b5e44"/><path d="M85 60 C100 70 120 50 135 70 L135 150 L85 150Z" fill="#3e2a1a"/><path d="M90 80 l10 20 M110 75 l5 30 M125 85 l-5 25" stroke="#2a1a0e" stroke-width="3"/></svg>`;
  },
  camera(seed = 1) { return SCENE.orchard(seed + 5); }
};
const scene = (kind, cls = 'h-24', arg) => `<div class="scene ${cls}">${SCENE[kind] ? SCENE[kind](arg) : ''}</div>`;

/* ---------- UI helpers ---------- */
const UI = {
  icons() { if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': 2 } }); },
  badge(text, tone = 'green', dot = false) { return `<span class="bdg t-${tone}">${dot ? '<i class="dot"></i>' : ''}${esc(text)}</span>`; },
  /** KPI card: {icon,tone,label,value,unit,foot,footTone,footIcon,extra} */
  kpi(o) {
    const ft = o.foot ? `<div class="text-[12.5px] mt-1 flex items-center gap-1 ${o.footTone ? 'text-' + o.footTone : 'muted'}">${o.footIcon === 'triangle' ? '<span class="text-[10px]">▲</span>' : o.footIcon ? ic(o.footIcon, 'w-3.5 h-3.5') : ''}<span>${o.foot}</span></div>` : '';
    return `<div class="card card-pad flex gap-3 items-start ${o.cls || ''}">
      <div class="ib t-${o.tone || 'green'}">${ic(o.icon)}</div>
      <div class="min-w-0 flex-1"><div class="text-[13px] muted leading-5">${o.label}</div>
      <div class="flex items-baseline gap-1.5 flex-wrap"><span class="text-[26px] font-bold leading-tight">${o.value}</span>${o.unit ? `<span class="text-[14px] muted">${o.unit}</span>` : ''}</div>${ft}${o.extra || ''}</div></div>`;
  },
  mountKpis(sel, list) { const el = $(sel); if (el) el.innerHTML = list.map(UI.kpi).join(''); },
  /** วงแหวนเปอร์เซ็นต์ */
  ring(v, { size = 110, stroke = 10, color = '#2e8b47', label = '', sub = '' } = {}) {
    const r = 50 - stroke / 2;
    return `<svg class="gauge" width="${size}" height="${size}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="${r}" fill="none" stroke="var(--soft)" stroke-width="${stroke}"/><circle cx="50" cy="50" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" pathLength="100" stroke-dasharray="${v} 100" transform="rotate(-90 50 50)"/><text x="50" y="${sub ? 50 : 56}" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text)">${label || v}</text>${sub ? `<text x="50" y="66" text-anchor="middle" font-size="10" fill="var(--muted)">${sub}</text>` : ''}</svg>`;
  },
  /** เกจครึ่งวง */
  semi(v, { w = 130, color = '#2e8b47', label = '' } = {}) {
    return `<svg class="gauge" width="${w}" height="${w * .62}" viewBox="0 0 120 74"><path d="M12 64 A48 48 0 0 1 108 64" fill="none" stroke="var(--soft)" stroke-width="11" stroke-linecap="round"/><path d="M12 64 A48 48 0 0 1 108 64" fill="none" stroke="${color}" stroke-width="11" stroke-linecap="round" pathLength="100" stroke-dasharray="${v} 100"/><text x="60" y="62" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text)">${label || v + '%'}</text></svg>`;
  },
  avatar(name, i = 0) {
    const colors = ['#2e8b47', '#F58A25', '#1e66d0', '#7c4dce', '#d32f2f', '#0f8a7a'];
    const ini = String(name).replace(/^(นาย|นางสาว|นาง|น\.ส\.)/, '').trim().slice(0, 2);
    return `<span class="avatar" style="background:${colors[i % colors.length]}" title="${esc(name)}">${esc(ini)}</span>`;
  },
  /* ---- Modal ---- */
  modal({ title, body, saveText = 'บันทึก', onSave, size = 'max-w-[620px]' }) {
    let bg = $('#modal-bg');
    if (!bg) { bg = document.createElement('div'); bg.id = 'modal-bg'; bg.className = 'modal-bg'; document.body.appendChild(bg); }
    bg.innerHTML = `<div class="modal ${size}" role="dialog" aria-modal="true"><div class="flex items-center justify-between px-5 py-4 border-b bline"><h3 class="text-lg font-semibold">${title}</h3><button class="btn btn-sm" data-close>${ic('x')}</button></div><form id="modal-form" class="p-5" novalidate><input type="hidden" name="csrf_token" value="DEMO-CSRF-TOKEN">${body}<div class="flex justify-end gap-2 mt-5"><button type="button" class="btn" data-close>ยกเลิก</button>${saveText ? `<button type="submit" class="btn btn-green">${ic('save')} ${saveText}</button>` : ''}</div></form></div>`;
    bg.classList.add('open'); UI.icons();
    const close = () => bg.classList.remove('open');
    $$('[data-close]', bg).forEach(b => b.onclick = close);
    bg.onclick = e => { if (e.target === bg) close(); };
    $('#modal-form', bg).onsubmit = e => {
      e.preventDefault();
      const req = $$('[required]', bg).find(x => !x.value.trim());
      if (req) { req.focus(); UI.toast('กรุณากรอกข้อมูลที่จำเป็นให้ครบ', 'alert-circle'); return; }
      const data = Object.fromEntries(new FormData(e.target).entries());
      if (onSave) onSave(data); close();
    };
  },
  /** fields: [{n,l,t:'text|number|date|select|textarea',o:[],req,full,v,ph}] */
  formModal(title, fields, { api = '', onSave } = {}) {
    const f = fields.map(x => {
      const req = x.req ? 'required' : '', star = x.req ? ' <span class="text-red-500">*</span>' : '';
      let ctl;
      if (x.t === 'select') ctl = `<select class="sel" name="${x.n}" ${req}>${(x.o || []).map(o => `<option ${o === x.v ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
      else if (x.t === 'textarea') ctl = `<textarea class="inp" rows="3" name="${x.n}" placeholder="${esc(x.ph || '')}" ${req}>${esc(x.v || '')}</textarea>`;
      else ctl = `<input class="inp" type="${x.t || 'text'}" name="${x.n}" value="${esc(x.v || '')}" placeholder="${esc(x.ph || '')}" ${req}>`;
      return `<div class="${x.full ? 'sm:col-span-2' : ''}"><label class="lb">${x.l}${star}</label>${ctl}</div>`;
    }).join('');
    UI.modal({
      title, body: `<div class="grid sm:grid-cols-2 gap-4">${f}</div>${api ? `<p class="text-[12px] muted mt-4 flex items-center gap-1">${ic('plug', 'w-3.5 h-3.5')} เชื่อมต่อ API: <code>${esc(api)}</code></p>` : ''}`,
      onSave: d => { const r = onSave ? onSave(d) : true; if (r !== false) UI.toast('บันทึกข้อมูลเรียบร้อย (โหมดตัวอย่าง)'); }
    });
  },
  /** เมนูจุดสามจุดแบบ fixed (ไม่โดน overflow ของตารางตัด) — items:[{t,icon,href|onClick,danger}] */
  menu(btn, items) {
    let d = $('#ctx-dd');
    if (!d) { d = document.createElement('div'); d.id = 'ctx-dd'; d.className = 'dd'; d.style.position = 'fixed'; document.body.appendChild(d); }
    d.innerHTML = items.map((it, i) => it.href ? `<a href="${it.href}">${ic(it.icon || 'chevron-right', 'w-4 h-4')}${it.t}</a>` : `<button data-mi="${i}" class="${it.danger ? 'text-red-600' : ''}">${ic(it.icon || 'chevron-right', 'w-4 h-4')}${it.t}</button>`).join('');
    const r = btn.getBoundingClientRect();
    d.style.minWidth = '200px'; d.style.right = 'auto';
    d.style.left = Math.max(8, Math.min(window.innerWidth - 210, r.right - 200)) + 'px';
    d.style.top = (r.bottom + 220 > window.innerHeight ? r.top - 8 - Math.min(items.length * 40 + 12, 300) : r.bottom + 6) + 'px';
    d.onclick = e => { const b = e.target.closest('[data-mi]'); if (b) { d.classList.remove('open'); items[+b.dataset.mi].onClick && items[+b.dataset.mi].onClick(); } };
    d.classList.add('open'); UI.icons();
  },
  toast(msg, icon = 'check-circle-2') {
    let w = $('#toast-wrap'); if (!w) { w = document.createElement('div'); w.id = 'toast-wrap'; document.body.appendChild(w); }
    const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = `${ic(icon)}<span>${esc(msg)}</span>`;
    w.appendChild(t); UI.icons(); setTimeout(() => { t.style.opacity = '0'; t.style.transition = '.3s'; setTimeout(() => t.remove(), 300); }, 2600);
  },
  /** tabs: container ที่มีปุ่ม [data-tab] */
  tabs(container, onChange) {
    const el = typeof container === 'string' ? $(container) : container; if (!el) return;
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-tab]'); if (!b) return;
      $$('[data-tab]', el).forEach(x => x.classList.toggle('on', x === b));
      onChange && onChange(b.dataset.tab, b);
    });
  }
};

/* ---------- Theme ---------- */
const Theme = {
  get() { try { return localStorage.getItem('fg360-theme') || 'light'; } catch (e) { return 'light'; } },
  set(mode) {
    try { localStorage.setItem('fg360-theme', mode); } catch (e) {}
    const dark = mode === 'dark' || (mode === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    Charts.refresh();
    $$('[data-theme-icon]').forEach(x => { x.innerHTML = ic(dark ? 'sun' : 'moon'); });
    UI.icons();
  },
  toggle() { this.set(document.documentElement.classList.contains('dark') ? 'light' : 'dark'); }
};

/* ---------- Charts (Chart.js) ---------- */
const Charts = {
  list: [],
  colors() {
    const d = document.documentElement.classList.contains('dark');
    return { grid: d ? 'rgba(255,255,255,.07)' : 'rgba(20,50,30,.07)', text: d ? '#9fb1a6' : '#6a786f' };
  },
  make(id, cfg) {
    const el = document.getElementById(id); if (!el || !window.Chart) return null;
    const c = this.colors(); cfg.options = cfg.options || {}; const o = cfg.options;
    o.responsive = true; o.maintainAspectRatio = false; // <— แก้กราฟวิ่ง
    o.animation = o.animation ?? { duration: 600 };
    o.plugins = o.plugins || {};
    o.plugins.legend = Object.assign({ position: 'top', align: 'start' }, o.plugins.legend || {});
    o.plugins.legend.labels = Object.assign({ usePointStyle: true, pointStyle: 'circle', boxWidth: 8, boxHeight: 8, padding: 14, color: c.text, font: { size: 12 } }, o.plugins.legend.labels || {});
    o.plugins.tooltip = Object.assign({ backgroundColor: '#1d2a22', padding: 10, cornerRadius: 10, titleFont: { family: 'Prompt' }, bodyFont: { family: 'Prompt' } }, o.plugins.tooltip || {});
    if (o.scales) Object.values(o.scales).forEach(s => {
      s.grid = Object.assign({ color: c.grid }, s.grid || {});
      s.ticks = Object.assign({ color: c.text, font: { size: 11 } }, s.ticks || {});
      if (s.title) s.title = Object.assign({ color: c.text, font: { size: 11 } }, s.title);
      s.border = { display: false };
    });
    const ch = new Chart(el, cfg); this.list.push(ch); return ch;
  },
  refresh() {
    const c = this.colors();
    this.list.forEach(ch => {
      const o = ch.options;
      if (o.plugins && o.plugins.legend && o.plugins.legend.labels) o.plugins.legend.labels.color = c.text;
      if (o.scales) Object.values(o.scales).forEach(s => { if (s.grid) s.grid.color = c.grid; if (s.ticks) s.ticks.color = c.text; if (s.title) s.title.color = c.text; });
      ch.update('none');
    });
  },
  /** ไล่สีพื้นใต้เส้น */
  fade(color, a1 = .28, a2 = 0) {
    return (ctx) => {
      const { chart } = ctx; const { ctx: g, chartArea } = chart; if (!chartArea) return color;
      const gr = g.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
      gr.addColorStop(0, hexA(color, a1)); gr.addColorStop(1, hexA(color, a2)); return gr;
    };
  },
  /** plugin: แสดงค่าบนแท่ง */
  valueLabels: {
    id: 'valueLabels',
    afterDatasetsDraw(chart) {
      const { ctx } = chart; ctx.save(); ctx.font = '600 12px Prompt'; ctx.fillStyle = Charts.colors().text; ctx.textAlign = 'center';
      chart.getDatasetMeta(0).data.forEach((bar, i) => ctx.fillText(nf(chart.data.datasets[0].data[i]), bar.x, bar.y - 6));
      ctx.restore();
    }
  }
};
function hexA(hex, a) {
  const h = hex.replace('#', ''); const n = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
if (window.Chart) { Chart.defaults.font.family = 'Prompt, sans-serif'; Chart.defaults.font.size = 12; }

/* ---------- Maps (Leaflet + Esri World Imagery / OSM) ---------- */
const Maps = {
  center: [12.6095, 102.1040], d: 0.00115, // DEMO: จ.จันทบุรี — production ใช้ polygon_geojson จากตาราง plots
  geom: {
    A1: [[0, 0], [4, .2], [4, 3], [.3, 3.2]], A2: [[4, .2], [7.5, 0], [7.3, 3], [4, 3]], B1: [[7.5, 0], [11, .4], [10.8, 3.4], [7.3, 3]],
    B2: [[.2, 3.9], [3.6, 3.8], [3.8, 7.4], [0, 7.2]], C1: [[3.8, 3.8], [7.4, 3.9], [7.6, 7.6], [3.8, 7.4]], C2: [[7.6, 3.9], [11.2, 4.2], [11, 7.8], [7.6, 7.6]]
  },
  ll(p) { return [this.center[0] - p[1] * this.d, this.center[1] + p[0] * this.d]; },
  tiles() {
    return {
      sat: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Imagery © Esri' }),
      osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' })
    };
  },
  /** plots: [{code,color,l1,l2,alert:'red|orange',pin:true,popup}] */
  farm(id, plots, opt = {}) {
    const el = document.getElementById(id); if (!el || !window.L) return null;
    const m = L.map(el, { zoomControl: opt.zoom !== false, scrollWheelZoom: false, attributionControl: true });
    const t = this.tiles(); (opt.base === 'osm' ? t.osm : t.sat).addTo(m); m._tiles = t; m._base = opt.base || 'sat';
    const g = L.featureGroup();
    plots.forEach(p => {
      const pts = (p.geom || this.geom[p.code]).map(q => this.ll(q));
      const poly = L.polygon(pts, { color: p.stroke || '#ffffff', weight: 2, dashArray: opt.dash ? '6 5' : null, fillColor: p.color, fillOpacity: p.opacity ?? .42 });
      poly.bindTooltip(`<div class="pt-code">${esc(p.code)}</div>${p.l1 ? `<div>${esc(p.l1)}</div>` : ''}${p.l2 ? `<div>${esc(p.l2)}</div>` : ''}`, { permanent: true, direction: 'center', className: 'plot-tip' });
      poly._meta = p;
      if (p.popup) poly.bindPopup(p.popup);
      if (p.onClick) poly.on('click', () => p.onClick(p));
      poly.addTo(g);
      const b = poly.getBounds();
      if (p.alert) L.marker([b.getNorth() - (b.getNorth() - b.getSouth()) * .22, b.getWest() + (b.getEast() - b.getWest()) * .28], { icon: L.divIcon({ className: '', html: `<div class="map-alert ${p.alert}">!</div>`, iconSize: [26, 26] }) }).addTo(g);
      if (p.pin) L.marker([b.getCenter().lat, b.getWest() + (b.getEast() - b.getWest()) * .2], { icon: L.divIcon({ className: '', html: `<svg class="map-pin" width="28" height="34" viewBox="0 0 24 30"><path d="M12 0C5.4 0 0 5.2 0 11.6 0 20 12 30 12 30s12-10 12-18.4C24 5.2 18.6 0 12 0z" fill="#1f7a3a"/><circle cx="12" cy="11.5" r="4.5" fill="#fff"/></svg>`, iconSize: [28, 34], iconAnchor: [14, 34] }) }).addTo(g);
    });
    g.addTo(m); m.fitBounds(g.getBounds(), { padding: [14, 14] }); m._group = g;
    setTimeout(() => m.invalidateSize(), 200);
    return m;
  },
  setBase(m, base) { if (!m || m._base === base) return; m.removeLayer(m._tiles[m._base]); m._tiles[base].addTo(m); m._base = base; },
  fullscreen(m, el) {
    const box = typeof el === 'string' ? $(el) : el; if (!box) return;
    if (document.fullscreenElement) document.exitFullscreen(); else box.requestFullscreen && box.requestFullscreen();
    setTimeout(() => m && m.invalidateSize(), 300);
  }
};

/* ---------- Layout ---------- */
const LOGO = `<svg width="42" height="42" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8bc34a"/><stop offset="1" stop-color="#2e7d32"/></linearGradient><linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c5e1a5"/><stop offset="1" stop-color="#43a047"/></linearGradient></defs><path d="M22 44C10 40 4 28 8 12c10 2 18 10 17 22-1 4-2 7-3 10z" fill="url(#lg1)"/><path d="M24 44c2-12 8-24 20-30 2 14-6 26-20 30z" fill="url(#lg2)"/><path d="M22 44c0-10-4-20-11-28" stroke="#1b5e20" stroke-width="1.6" fill="none"/></svg>`;
const SB_ART = `<svg viewBox="0 0 232 190" class="w-full block" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><linearGradient id="sbsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#17221b" stop-opacity="0"/><stop offset=".45" stop-color="#2f4a35"/><stop offset="1" stop-color="#3f6b3e"/></linearGradient></defs><rect width="232" height="190" fill="url(#sbsky)"/><path d="M0 95 L50 55 L95 85 L140 45 L190 80 L232 60 V190 H0Z" fill="#45624a" opacity=".85"/><path d="M0 120 C60 95 120 110 232 92 V190 H0Z" fill="#4f7d43"/><path d="M0 145 C70 125 150 140 232 122 V190 H0Z" fill="#5f9446"/><path d="M0 168 C80 152 160 166 232 150 V190 H0Z" fill="#6aa84f"/><g fill="#2e5d2b">${Array.from({ length: 12 }, (_, i) => `<circle cx="${8 + i * 20}" cy="${150 - (i % 3) * 4}" r="${7 + (i % 3)}"/>`).join('')}</g><g fill="#3b7a34">${Array.from({ length: 10 }, (_, i) => `<circle cx="${18 + i * 22}" cy="${176 - (i % 2) * 4}" r="${9 + (i % 2) * 2}"/>`).join('')}</g><g transform="translate(150,112)"><rect width="30" height="18" fill="#d7c3a1"/><path d="M-4 0 L15 -12 L34 0Z" fill="#8d4f2a"/><rect x="12" y="8" width="7" height="10" fill="#6d4c41"/></g></svg>`;

const Layout = {
  init() {
    const body = document.body, page = body.dataset.page || '', loc = body.dataset.loc || 'อำเภอเมือง จ.จันทบุรี';
    const sb = $('#sidebar');
    if (sb) sb.innerHTML = `<div class="flex flex-col h-full">
      <a href="dashboard.html" class="flex items-center gap-2.5 px-5 pt-5 pb-5">${LOGO}<div><div class="text-white text-[22px] font-bold leading-6 tracking-tight">${APP.name}</div><div class="text-[13px] text-green-100/80">${APP.product}</div></div></a>
      <nav class="px-3 space-y-1 flex-1 overflow-y-auto" aria-label="เมนูหลัก">${MENU.map(m => `<a href="${m.href}" class="nv ${m.key === page ? 'active' : ''}" ${m.key === page ? 'aria-current="page"' : ''}>${ic(m.icon)}<span>${m.label}</span></a>`).join('')}</nav>
      <div class="relative mt-2">${SB_ART}<div class="absolute left-0 right-0 bottom-0 px-5 pb-3"><p class="text-[13px] leading-5 text-white/95 drop-shadow">เกษตรไทย ก้าวไกล<br>ด้วย AI เพื่อผลผลิตที่ยั่งยืน</p><p class="text-[11.5px] text-white/70 mt-2">${APP.version}</p></div></div></div>`;
    const tb = $('#topbar');
    if (tb) tb.innerHTML = `<div class="h-[68px] flex items-center gap-3 px-4 lg:px-6">
      <button id="sbToggle" class="btn btn-icon lg:hidden" aria-label="เปิดเมนู">${ic('menu')}</button>
      <div class="relative flex-1 max-w-[730px]">
        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 muted">${ic('search', 'w-5 h-5')}</span>
        <input id="gSearch" class="inp !pl-11 !pr-14 !py-2.5 !rounded-xl" placeholder="${esc(body.dataset.search || 'ค้นหาสวน แปลง ต้นไม้ หรือกิจกรรม...')}" autocomplete="off">
        <span class="absolute right-3 top-1/2 -translate-y-1/2 kbd hidden sm:inline">⌘ K</span>
        <div id="gSearchDD" class="dd !left-0 !right-auto w-full"></div>
      </div>
      <span class="demo-pill hidden xl:inline">DEMO</span>
      <div class="hidden md:flex items-center gap-2.5 pl-3 border-l bline">${Layout.wxIcon(40)}<div class="leading-tight"><div class="font-bold text-[17px]">${APP.weather.temp}</div><div class="text-[11.5px] muted">${APP.weather.text}</div><div class="text-[11px] muted max-w-[130px] truncate">${esc(loc)}</div></div></div>
      <div class="hidden lg:flex items-center gap-2.5 pl-3 border-l bline">${ic('calendar-days', 'w-6 h-6 muted')}<div class="leading-tight"><div class="font-semibold text-[14px]">${APP.today.text}</div><div class="text-[11.5px] muted">${APP.today.lunar}</div></div></div>
      <button class="btn btn-icon !border-0" id="themeBtn" aria-label="สลับธีม" data-theme-icon>${ic(document.documentElement.classList.contains('dark') ? 'sun' : 'moon')}</button>
      <div class="relative"><button class="btn btn-icon !border-0 relative" id="bellBtn" aria-label="การแจ้งเตือน">${ic('bell')}<span class="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] grid place-items-center">3</span></button>
        <div class="dd w-[320px]" id="bellDD"><div class="px-2.5 py-2 font-semibold">การแจ้งเตือน (3)</div>
          <a href="pest-management.html"><span class="ib ib-xs t-red">${ic('triangle-alert')}</span><span><b>ความเสี่ยงสูง</b> โรครากเน่าโคนเน่า แปลง A2<br><span class="text-[11.5px] muted">22 เม.ย. 2568 09:20</span></span></a>
          <a href="pest-management.html"><span class="ib ib-xs t-orange">${ic('shield-alert')}</span><span>PHI แปลง A2 คงเหลือ 7 วัน — ห้ามเก็บเกี่ยว<br><span class="text-[11.5px] muted">22 เม.ย. 2568 08:00</span></span></a>
          <a href="calendar.html"><span class="ib ib-xs t-blue">${ic('calendar-clock')}</span><span>งานพ่นยา แปลง A1 ใกล้ถึงกำหนด (อีก 3 วัน)<br><span class="text-[11.5px] muted">21 เม.ย. 2568 17:00</span></span></a>
        </div></div>
      <div class="relative"><button id="userBtn" class="flex items-center gap-2.5 pl-2" aria-label="เมนูผู้ใช้"><span class="avatar !w-10 !h-10 !text-sm" style="background:linear-gradient(135deg,#2e8b47,#1f5c33)">${APP.user.initials}</span><span class="hidden sm:block text-left leading-tight"><span class="block font-semibold">${APP.user.name}</span><span class="block text-[12px] muted">${APP.user.role}</span></span>${ic('chevron-down', 'w-4 h-4 muted hidden sm:block')}</button>
        <div class="dd" id="userDD"><a href="settings.html">${ic('user', 'w-4 h-4')} โปรไฟล์ของฉัน</a><a href="settings.html">${ic('settings', 'w-4 h-4')} ตั้งค่าระบบ</a><a href="integrations.html">${ic('plug', 'w-4 h-4')} IoT/API</a><button data-toast="ออกจากระบบแล้ว (โหมดตัวอย่าง)" class="text-red-600">${ic('log-out', 'w-4 h-4')} ออกจากระบบ</button></div></div>
    </div>`;
    const ft = $('#footer');
    if (ft) ft.innerHTML = `<div class="px-4 lg:px-6 py-4 text-[12px] muted flex flex-wrap items-center justify-between gap-2 border-t bline"><span>© 2569 ${APP.name} ${APP.product} · ${APP.version} · ข้อมูลในหน้านี้เป็นข้อมูลตัวอย่าง (DEMO)</span><a href="${APP.credit.url}" target="_blank" rel="noopener" class="font-medium text-[#F58A25] hover:underline">${APP.credit.text}</a></div>`;
    if (!$('#sb-overlay')) { const o = document.createElement('div'); o.id = 'sb-overlay'; body.appendChild(o); }
    this.bind(); UI.icons();
  },
  wxIcon(s = 40) {
    return `<svg width="${s}" height="${s}" viewBox="0 0 48 48" aria-hidden="true"><circle cx="18" cy="17" r="8" fill="#FDB813"/><g stroke="#FDB813" stroke-width="2.4" stroke-linecap="round"><path d="M18 3v4M5 17h4M8 7l3 3M28 7l-3 3"/></g><path d="M16 38h22a8 8 0 0 0 0-16 11 11 0 0 0-21 3 6.5 6.5 0 0 0-1 13z" fill="#5aa9f0"/><path d="M16 38h22a8 8 0 0 0 1-15.9" fill="#3d8fe0" opacity=".35"/></svg>`;
  },
  bind() {
    const body = document.body;
    const tog = (btn, dd) => { const b = $(btn), d = $(dd); if (!b || !d) return; b.addEventListener('click', e => { e.stopPropagation(); $$('.dd.open').forEach(x => x !== d && x.classList.remove('open')); d.classList.toggle('open'); }); };
    tog('#bellBtn', '#bellDD'); tog('#userBtn', '#userDD');
    document.addEventListener('click', e => { if (!e.target.closest('.dd')) $$('.dd.open').forEach(x => x.classList.remove('open')); });
    $('#sbToggle') && $('#sbToggle').addEventListener('click', () => body.classList.toggle('sb-open'));
    $('#sb-overlay') && $('#sb-overlay').addEventListener('click', () => body.classList.remove('sb-open'));
    $('#themeBtn') && $('#themeBtn').addEventListener('click', () => Theme.toggle());
    // ⌘K / Ctrl+K quick search
    const inp = $('#gSearch'), dd = $('#gSearchDD');
    document.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); inp && inp.focus(); } if (e.key === 'Escape') { $$('.dd.open,.modal-bg.open').forEach(x => x.classList.remove('open')); } });
    if (inp) {
      const extra = [
        { label: 'แปลง A1 — ทุเรียน หมอนทอง', href: 'growth-monitoring.html', icon: 'map-pin' },
        { label: 'ต้นไม้ TUR-A1-001', href: 'trees.html', icon: 'tree-deciduous' },
        { label: 'แผนใส่ปุ๋ยฤดูกาล 2568', href: 'fertilizer-plans.html', icon: 'sprout' },
        { label: 'เว้นระยะเก็บเกี่ยว (PHI)', href: 'pest-management.html#phi', icon: 'shield-alert' }
      ];
      const run = () => {
        const q = inp.value.trim().toLowerCase();
        if (!q) { dd.classList.remove('open'); return; }
        const res = [...MENU, ...extra].filter(x => x.label.toLowerCase().includes(q)).slice(0, 8);
        dd.innerHTML = res.length ? res.map(x => `<a href="${x.href}">${ic(x.icon, 'w-4 h-4 muted')}<span>${esc(x.label)}</span></a>`).join('') : `<div class="px-3 py-2 muted text-[13px]">ไม่พบผลลัพธ์ “${esc(inp.value)}”</div>`;
        dd.classList.add('open'); UI.icons();
      };
      inp.addEventListener('input', run);
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') { const a = $('a', dd); if (a) location.href = a.getAttribute('href'); } });
    }
    // Generic delegated actions
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-toast]'); if (t) { e.preventDefault(); UI.toast(t.dataset.toast); }
      const f = e.target.closest('[data-form]'); if (f && window.FORMS && FORMS[f.dataset.form]) { e.preventDefault(); FORMS[f.dataset.form](); }
      const p = e.target.closest('[data-print]'); if (p) { e.preventDefault(); window.print(); }
    });
  }
};

Layout.init();
