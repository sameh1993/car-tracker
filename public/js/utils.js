// ── API helper ───────────────────────────────────────────────
const API_BASE = '/api';

async function api(method, path, body) {
  try {
    const res = await fetch(API_BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'خطأ غير معروف');
    return json;
  } catch (err) {
    throw err;
  }
}

const get = (path) => api('GET', path);
const post = (path, body) => api('POST', path, body);
const put = (path, body) => api('PUT', path, body);
const del = (path) => api('DELETE', path);

// ── Toast ─────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 2500);
}

// ── Format helpers ────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
}

function fmtKm(n) {
  if (!n && n !== 0) return '—';
  return Number(n).toLocaleString('ar-EG') + ' كم';
}

function fmtCost(n) {
  if (!n) return '—';
  return Number(n).toLocaleString('ar-EG') + ' ج';
}

function daysUntil(d) {
  if (!d) return null;
  return Math.ceil((new Date(d) - new Date()) / 86400000);
}

function daysLabel(days) {
  if (days === null) return '—';
  if (days < 0) return `متأخر ${Math.abs(days)} يوم`;
  if (days === 0) return 'اليوم';
  return `${days} يوم`;
}

function statusLevel(days) {
  if (days === null) return 'gray';
  if (days < 0) return 'red';
  if (days < 7) return 'red';
  if (days < 30) return 'yellow';
  return 'green';
}

function kmLevel(remaining) {
  if (remaining === null) return 'gray';
  if (remaining < 0) return 'red';
  if (remaining < 1500) return 'orange';
  return 'green';
}

function badge(text, cls) {
  return `<span class="badge ${cls}">${text}</span>`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ── Sidebar active link ───────────────────────────────────────
function setActiveNav() {
  const page = location.pathname.replace(/^\//, '').replace(/\.html$/, '');
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}

// ── Nav badges (تنبيهات الـ sidebar) ─────────────────────────
async function loadNavBadges() {
  try {
    const { data: cars } = await get('/cars');

    let oilDue = 0, filterDue = 0, licDue = 0;
    cars.forEach(c => {
      const oilLeft = c.next_oil_km != null ? (c.next_oil_km - c.current_km) : null;
      if (oilLeft !== null && oilLeft <= 1500) oilDue++;

      const fltLeft = c.next_air_filter_km != null ? (c.next_air_filter_km - c.current_km) : null;
      if (fltLeft !== null && fltLeft <= 2000) filterDue++;

      const d = daysUntil(c.nearest_expiry);
      if (d !== null && d <= 30) licDue++;
    });

    const setB = (id, n, cls = '') => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = n;
      el.className = 'nav-badge' + (cls ? ' ' + cls : '');
      el.classList.toggle('hidden', n === 0);
    };
    setB('nb-cars', cars.length, 'blue');
    setB('nb-oil', oilDue);
    setB('nb-filters', filterDue, 'warn');
    setB('nb-licenses', licDue);
  } catch (_) { }
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  loadNavBadges();
});


$("document").ready(function () {
  $(".sm-menu .bars").click(function () {
    $("#sidebar-mount").toggleClass("show")
  })
})
