<script setup>
import { computed, onMounted, ref } from 'vue';
import Icon from '../components/Icon.vue';

const KEY = 'halila_admin';
const token = ref('');
const input = ref('');
const stats = ref(null);
const leads = ref([]);
const error = ref('');
const loading = ref(false);
const tab = ref('stats');

const sectionNames = {
  saraton: 'Saraton haqida',
  mutaxassislar: 'Mutaxassislar',
  alomatlar: 'Alomatlar',
  alomatlar_natija: 'Alomatlar — natijagacha yetgan',
  diagnostika: 'Diagnostika',
  mahsulotlar: 'Mahsulotlar',
  hujjatlar: 'Hujjatlar',
  aloqa: 'Aloqa sahifasi',
  specialist_call: 'Mutaxassisga qo‘ng‘iroq'
};

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const h = { 'x-admin-token': token.value };
    const [s, l] = await Promise.all([
      fetch('/api/admin/stats', { headers: h }),
      fetch('/api/admin/leads', { headers: h })
    ]);
    if (s.status === 401) throw new Error('Kalit noto‘g‘ri');
    if (!s.ok || !l.ok) throw new Error('Ma’lumot yuklanmadi');
    stats.value = await s.json();
    leads.value = await l.json();
    try { sessionStorage.setItem(KEY, token.value); } catch {}
  } catch (e) {
    error.value = e.message;
    stats.value = null;
    if (e.message === 'Kalit noto‘g‘ri') logout();
  } finally {
    loading.value = false;
  }
}

function login() {
  token.value = input.value.trim();
  if (token.value) load();
}
function logout() {
  token.value = '';
  try { sessionStorage.removeItem(KEY); } catch {}
}

onMounted(() => {
  try { token.value = sessionStorage.getItem(KEY) || ''; } catch {}
  if (token.value) load();
});

const csvHref = computed(() => `/api/admin/leads.csv?token=${encodeURIComponent(token.value)}`);
const fmt = (iso) => new Date(iso).toLocaleString('uz-UZ', { dateStyle: 'short', timeStyle: 'short' });

// ---- QR-kod yaratish ----
const qrCode = ref('');
const qrImg = ref('');
const qrUrl = computed(() => {
  const c = qrCode.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  return c ? `${location.origin}/?src=${c}` : '';
});
async function makeQr() {
  if (!qrUrl.value) return;
  const QR = await import('qrcode');
  qrImg.value = await QR.toDataURL(qrUrl.value, { width: 600, margin: 2, color: { dark: '#111611' } });
}
</script>

<template>
  <div class="container" style="padding-top: 24px">
    <h1 style="font-size: 28px">Statistika</h1>

    <form v-if="!token" class="card" @submit.prevent="login">
      <div class="field">
        <label for="adm">Admin kaliti</label>
        <input id="adm" v-model="input" type="password" class="input" autocomplete="current-password" />
      </div>
      <div v-if="error" class="alert danger" style="margin-bottom: 12px">{{ error }}</div>
      <button class="btn block">Kirish</button>
      <p class="muted small">Kalit server <code>.env</code> faylidagi <code>ADMIN_TOKEN</code> qiymati.</p>
    </form>

    <template v-else>
      <div class="chips" style="margin-bottom: 16px">
        <button :class="['chip', { on: tab === 'stats' }]" @click="tab = 'stats'">Ko‘rsatkichlar</button>
        <button :class="['chip', { on: tab === 'leads' }]" @click="tab = 'leads'">Arizalar ({{ leads.length }})</button>
        <button :class="['chip', { on: tab === 'qr' }]" @click="tab = 'qr'">QR-kod yaratish</button>
        <button class="chip" @click="load">Yangilash</button>
        <button class="chip" @click="logout">Chiqish</button>
      </div>

      <div v-if="loading" class="spinner" />
      <div v-if="error" class="alert danger">{{ error }}</div>

      <template v-if="stats && tab === 'stats'">
        <div class="kpis">
          <div class="card"><div class="muted small">Kirishlar</div><div class="kpi">{{ stats.totals.visits }}</div></div>
          <div class="card"><div class="muted small">Qo‘ng‘iroq bosilgan</div><div class="kpi">{{ stats.totals.calls }}</div></div>
          <div class="card"><div class="muted small">Arizalar</div><div class="kpi">{{ stats.totals.leads }}</div></div>
        </div>

        <section class="card section">
          <h3>Bekatlar (QR-kod manbalari) bo‘yicha</h3>
          <div class="scroll-x">
            <table class="tbl">
              <thead>
                <tr><th>Manba</th><th class="num">Kirish</th><th class="num">Noyob</th><th class="num">Qo‘ng‘iroq</th><th class="num">Ariza</th><th class="num">Konversiya</th></tr>
              </thead>
              <tbody>
                <tr v-for="s in stats.sources" :key="s.source">
                  <td>{{ s.source }}</td>
                  <td class="num">{{ s.visits }}</td>
                  <td class="num">{{ s.uniqueVisitors }}</td>
                  <td class="num">{{ s.calls }}</td>
                  <td class="num"><b>{{ s.leads }}</b></td>
                  <td class="num">{{ s.conversion }}%</td>
                </tr>
                <tr v-if="!stats.sources.length"><td colspan="6" class="muted">Hozircha ma’lumot yo‘q</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="card section">
          <h3>Qaysi bo‘lim ko‘proq ochilgan</h3>
          <div v-for="s in stats.sections" :key="s.section" class="bar-row">
            <span>{{ sectionNames[s.section] || s.section }}</span>
            <div class="bar"><span :style="{ width: (s.count / stats.sections[0].count) * 100 + '%' }" /></div>
            <b>{{ s.count }}</b>
          </div>
          <p v-if="!stats.sections.length" class="muted">Hozircha ma’lumot yo‘q</p>
        </section>
      </template>

      <template v-if="tab === 'leads'">
        <a :href="csvHref" class="btn small ghost" style="margin-bottom: 12px">Excel (CSV) yuklab olish</a>
        <article v-for="l in leads" :key="l.id" class="card">
          <div class="muted small">{{ fmt(l.createdAt) }} · manba: {{ l.source || '—' }}</div>
          <h3 style="margin: 4px 0">{{ l.name }} — <a :href="'tel:' + l.phone">{{ l.phone }}</a></h3>
          <div class="small">{{ l.topicLabel }} · {{ l.timeLabel }}</div>
          <p v-if="l.message" class="small" style="margin: 6px 0 0">{{ l.message }}</p>
        </article>
        <p v-if="!leads.length" class="empty">Arizalar hali yo‘q</p>
      </template>

      <section v-if="tab === 'qr'" class="card">
        <h3>Bekat uchun QR-kod</h3>
        <p class="muted small">Har bir bekatga alohida kod bering (lotin harflari, raqam, “-”). Masalan: <code>chilonzor-01</code></p>
        <div class="field">
          <input v-model="qrCode" class="input" placeholder="bekat-kodi" @keyup.enter="makeQr" />
        </div>
        <p v-if="qrUrl" class="small" style="word-break: break-all">Havola: <b>{{ qrUrl }}</b></p>
        <button class="btn" :disabled="!qrUrl" @click="makeQr"><Icon name="chart" :size="18" /> QR-kod yaratish</button>
        <div v-if="qrImg" style="margin-top: 16px">
          <img :src="qrImg" alt="QR-kod" style="max-width: 280px; border: 1px solid var(--line); border-radius: 12px" />
          <a :href="qrImg" :download="`halila-qr-${qrCode}.png`" class="btn small ghost" style="margin-top: 10px">PNG yuklab olish</a>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.kpis .card { padding: 14px; margin: 0; }
.kpi { font-size: 28px; font-weight: 800; }
.bar-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 10px; align-items: center; font-size: 14px; margin: 8px 0; }
.bar { height: 10px; background: var(--card); border-radius: 99px; overflow: hidden; }
.bar span { display: block; height: 100%; background: var(--green); }
</style>
