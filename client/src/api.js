// API so‘rovlari va QR-kod manbasini kuzatish
import { ref } from 'vue';

const safe = (fn, fallback = null) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

// Har bir bekat QR-kodi: https://sayt.uz/?src=bekat-01
// Manba 30 kun davomida eslab qolinadi — keyinroq qaytib ariza qoldirsa ham hisoblanadi.
const SRC_KEY = 'halila_src';
const SID_KEY = 'halila_sid';
const SRC_TTL = 30 * 24 * 60 * 60 * 1000;

export function getSource() {
  const raw = safe(() => localStorage.getItem(SRC_KEY));
  if (!raw) return '';
  const data = safe(() => JSON.parse(raw));
  if (!data || Date.now() - data.at > SRC_TTL) return '';
  return data.src || '';
}

function getSid() {
  let sid = safe(() => sessionStorage.getItem(SID_KEY));
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    safe(() => sessionStorage.setItem(SID_KEY, sid));
  }
  return sid;
}

export function track(type, section = '') {
  const body = JSON.stringify({ type, section, source: getSource(), sid: getSid() });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
      return;
    }
  } catch {}
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true
  }).catch(() => {});
}

export function initTracking() {
  const params = new URLSearchParams(location.search);
  const src = (params.get('src') || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
  if (src) {
    safe(() => localStorage.setItem(SRC_KEY, JSON.stringify({ src, at: Date.now() })));
    // Manzil satridan parametrni olib tashlaymiz (ulashilganda qayta hisoblanmasligi uchun)
    params.delete('src');
    const qs = params.toString();
    history.replaceState(null, '', location.pathname + (qs ? `?${qs}` : '') + location.hash);
  }
  if (!safe(() => sessionStorage.getItem('halila_visit'))) {
    safe(() => sessionStorage.setItem('halila_visit', '1'));
    if (!location.pathname.startsWith('/admin')) track('visit');
  }
}

export async function getJSON(url, opts = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) throw Object.assign(new Error('So‘rov bajarilmadi'), { status: res.status });
  return res.json();
}

// Call-markaz telefon raqami (server .env faylidan)
export const callPhone = ref('');
getJSON('/api/config')
  .then((c) => (callPhone.value = c.callCenterPhone || ''))
  .catch(() => {});

export const telHref = (p) => 'tel:' + String(p).replace(/[^\d+]/g, '');
