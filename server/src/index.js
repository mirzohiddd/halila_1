import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { readData, appendStore, listStore } from './storage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const CALL_CENTER_PHONE = process.env.CALL_CENTER_PHONE || '';

app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.set('trust proxy', true);

// ---------- Yordamchi funksiyalar ----------
const clean = (v, max = 200) =>
  typeof v === 'string' ? v.replace(/[<>]/g, '').trim().slice(0, max) : '';

const cleanSource = (v) =>
  typeof v === 'string' ? v.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40) : '';

// O‘zbekiston raqami: +998 XX XXX XX XX
function normalizePhone(v) {
  const digits = String(v || '').replace(/\D/g, '');
  if (/^998\d{9}$/.test(digits)) return `+${digits}`;
  if (/^\d{9}$/.test(digits)) return `+998${digits}`;
  return null;
}

// Oddiy so‘rovlar cheklovi (bir IP dan juda ko‘p ariza kelmasligi uchun)
const hits = new Map();
function rateLimit(max, windowMs) {
  return (req, res, next) => {
    const key = `${req.path}:${req.ip}`;
    const now = Date.now();
    const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (arr.length >= max) {
      return res.status(429).json({ error: 'Juda ko‘p so‘rov. Birozdan so‘ng qayta urinib ko‘ring.' });
    }
    arr.push(now);
    hits.set(key, arr);
    next();
  };
}

function requireAdmin(req, res, next) {
  const token = req.get('x-admin-token') || '';
  const ok =
    ADMIN_TOKEN &&
    token.length === ADMIN_TOKEN.length &&
    crypto.timingSafeEqual(Buffer.from(token), Buffer.from(ADMIN_TOKEN));
  if (!ok) return res.status(401).json({ error: 'Ruxsat yo‘q' });
  next();
}

async function notifyTelegram(lead) {
  const { TELEGRAM_BOT_TOKEN: t, TELEGRAM_CHAT_ID: chat } = process.env;
  if (!t || !chat) return;
  const text =
    `🟢 Yangi ariza (HALILA)\n` +
    `Ism: ${lead.name}\nTelefon: ${lead.phone}\n` +
    `Masala: ${lead.topicLabel}\nQulay vaqt: ${lead.timeLabel}\n` +
    `Manba (QR): ${lead.source || '—'}\nIzoh: ${lead.message || '—'}`;
  try {
    await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text })
    });
  } catch (e) {
    console.error('Telegram xabari yuborilmadi:', e.message);
  }
}

// ---------- Ommaviy API ----------
app.get('/api/config', (_req, res) => {
  res.json({ callCenterPhone: CALL_CENTER_PHONE });
});

for (const name of ['specialists', 'products', 'documents']) {
  app.get(`/api/${name}`, async (_req, res, next) => {
    try {
      res.json(await readData(name));
    } catch (e) {
      next(e);
    }
  });
}

const TOPICS = {
  saraton: 'Saraton haqida ma’lumot',
  mutaxassis: 'Mutaxassis topish',
  alomat: 'Alomatlar bo‘yicha savol',
  tekshiruv: 'Tekshiruv va diagnostika',
  mahsulot: 'HALILA mahsulotlari',
  boshqa: 'Boshqa masala'
};
const TIMES = {
  hozir: 'Imkon qadar tezroq',
  ertalab: 'Ertalab (09:00–12:00)',
  tushdan: 'Tushdan keyin (12:00–17:00)',
  kechqurun: 'Kechqurun (17:00–20:00)'
};

app.post('/api/leads', rateLimit(5, 10 * 60 * 1000), async (req, res, next) => {
  try {
    const b = req.body || {};
    // Bot tuzog‘i: yashirin maydon to‘ldirilgan bo‘lsa — jim qabul qilamiz
    if (b.website) return res.json({ ok: true });

    const name = clean(b.name, 80);
    const phone = normalizePhone(b.phone);
    const topic = TOPICS[b.topic] ? b.topic : null;
    const time = TIMES[b.time] ? b.time : null;
    const errors = {};
    if (name.length < 2) errors.name = 'Ismingizni kiriting';
    if (!phone) errors.phone = 'Telefon raqamini to‘g‘ri kiriting (+998 XX XXX XX XX)';
    if (!topic) errors.topic = 'Masalani tanlang';
    if (!time) errors.time = 'Qulay vaqtni tanlang';
    if (b.consent !== true) errors.consent = 'Shaxsiy ma’lumotlarni qayta ishlashga rozilik kerak';
    if (Object.keys(errors).length) return res.status(400).json({ errors });

    const lead = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name,
      phone,
      topic,
      topicLabel: TOPICS[topic],
      time,
      timeLabel: TIMES[time],
      message: clean(b.message, 500),
      source: cleanSource(b.source),
      consent: true
    };
    await appendStore('leads', lead);
    notifyTelegram(lead);
    res.status(201).json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// Reklama samaradorligini o‘lchash uchun hodisalar
const EVENT_TYPES = new Set(['visit', 'section', 'call_click', 'lead']);
app.post('/api/track', rateLimit(120, 60 * 1000), async (req, res) => {
  const b = req.body || {};
  if (!EVENT_TYPES.has(b.type)) return res.status(400).json({ error: 'Noto‘g‘ri hodisa' });
  await appendStore('events', {
    t: new Date().toISOString(),
    type: b.type,
    section: clean(b.section, 40),
    source: cleanSource(b.source),
    sid: clean(b.sid, 40)
  }).catch(() => {});
  res.status(204).end();
});

// ---------- Admin API ----------
app.get('/api/admin/stats', requireAdmin, async (_req, res, next) => {
  try {
    const [events, leads] = await Promise.all([listStore('events'), listStore('leads')]);
    const bySource = {};
    const bySection = {};
    const row = (s) =>
      (bySource[s] ||= { source: s, visits: 0, uniqueVisitors: new Set(), calls: 0, leads: 0 });

    for (const e of events) {
      const s = e.source || '(to‘g‘ridan-to‘g‘ri)';
      if (e.type === 'visit') {
        row(s).visits++;
        if (e.sid) row(s).uniqueVisitors.add(e.sid);
      } else if (e.type === 'call_click') row(s).calls++;
      else if (e.type === 'section' && e.section) bySection[e.section] = (bySection[e.section] || 0) + 1;
    }
    for (const l of leads) row(l.source || '(to‘g‘ridan-to‘g‘ri)').leads++;

    const sources = Object.values(bySource)
      .map((r) => ({
        ...r,
        uniqueVisitors: r.uniqueVisitors.size,
        conversion: r.visits ? +((r.leads / r.visits) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.leads - a.leads || b.visits - a.visits);

    res.json({
      totals: {
        visits: events.filter((e) => e.type === 'visit').length,
        calls: events.filter((e) => e.type === 'call_click').length,
        leads: leads.length
      },
      sources,
      sections: Object.entries(bySection)
        .map(([section, count]) => ({ section, count }))
        .sort((a, b) => b.count - a.count)
    });
  } catch (e) {
    next(e);
  }
});

app.get('/api/admin/leads', requireAdmin, async (_req, res, next) => {
  try {
    const leads = await listStore('leads');
    res.json(leads.reverse());
  } catch (e) {
    next(e);
  }
});

app.get('/api/admin/leads.csv', async (req, res, next) => {
  // Brauzerdan yuklab olish uchun token so‘rov parametrida ham qabul qilinadi
  req.headers['x-admin-token'] ||= String(req.query.token || '');
  requireAdmin(req, res, async () => {
    try {
      const leads = await listStore('leads');
      const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const head = ['Sana', 'Ism', 'Telefon', 'Masala', 'Qulay vaqt', 'Izoh', 'Manba (QR)'];
      const lines = leads.map((l) =>
        [l.createdAt, l.name, l.phone, l.topicLabel, l.timeLabel, l.message, l.source].map(esc).join(',')
      );
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="halila-arizalar.csv"');
      res.send('﻿' + [head.map(esc).join(','), ...lines].join('\n'));
    } catch (e) {
      next(e);
    }
  });
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Topilmadi' }));

// ---------- Frontend (build qilingan Vue ilovasi) ----------
const dist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(dist)) {
  app.use(
    express.static(dist, {
      maxAge: '7d',
      setHeaders: (res, file) => {
        if (file.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache');
      }
    })
  );
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
});

app.listen(PORT, () => {
  console.log(`HALILA server: http://localhost:${PORT}`);
  if (!ADMIN_TOKEN) console.warn('Diqqat: ADMIN_TOKEN o‘rnatilmagan — admin statistika yopiq.');
});
