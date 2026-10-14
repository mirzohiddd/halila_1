<script setup>
import { onMounted, ref } from 'vue';
import PageHead from '../components/PageHead.vue';
import CallCard from '../components/CallCard.vue';
import Icon from '../components/Icon.vue';
import { getJSON } from '../api.js';

const products = ref([]);
const docs = ref({});
const loading = ref(true);
const error = ref(false);

onMounted(async () => {
  try {
    const [p, d] = await Promise.all([getJSON('/api/products'), getJSON('/api/documents')]);
    products.value = p;
    docs.value = Object.fromEntries(d.map((x) => [x.id, x]));
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
});

const rows = [
  ['composition', 'Tarkibi'],
  ['purpose', 'Mo‘ljallangan qo‘llanilishi'],
  ['usage', 'Qo‘llash tartibi'],
  ['precautions', 'Ehtiyot choralari'],
  ['contraindications', 'Qarshi ko‘rsatmalar va cheklovlar']
];
</script>

<template>
  <div class="container">
    <PageHead icon="leaf" title="Biologik faol qo‘shimchalar" lead="HALILA mahsulotlari haqida batafsil ma’lumot." />

    <div class="alert">
      <strong>Muhim</strong>
      Biologik faol qo‘shimchalar dori vositasi emas. Ular saratonni yoki boshqa kasalliklarni davolash uchun
      mo‘ljallanmagan va shifokor belgilagan davolash o‘rnini bosmaydi. Qabul qilishdan oldin shifokoringiz bilan
      maslahatlashing — ayniqsa davolanayotgan bo‘lsangiz.
    </div>

    <div class="section">
      <div v-if="loading" class="spinner" />
      <div v-else-if="error" class="alert danger">Ma’lumotlarni yuklab bo‘lmadi. Sahifani yangilab ko‘ring.</div>
      <div v-else-if="!products.length" class="empty">Mahsulotlar tez orada joylashtiriladi.</div>

      <article v-for="p in products" :key="p.id" class="card product">
        <div class="ph">
          <img v-if="p.image" :src="p.image" :alt="p.name" loading="lazy" />
          <div v-else class="ph-empty"><Icon name="leaf" :size="40" /><span>Fotosurat</span></div>
        </div>
        <span v-if="p.example" class="badge">Namuna ma’lumot</span>
        <h3 style="margin-top: 8px">{{ p.name }}</h3>
        <p v-if="p.form" class="muted" style="margin: 0">{{ p.form }}</p>

        <div class="acc" style="margin-top: 14px">
          <details v-for="[k, l] in rows" :key="k">
            <summary>{{ l }}</summary>
            <div class="body"><p>{{ p[k] }}</p></div>
          </details>
          <details v-if="p.documentIds && p.documentIds.length">
            <summary>Ro‘yxatdan o‘tish va sertifikat hujjatlari</summary>
            <div class="body">
              <ul>
                <li v-for="id in p.documentIds" :key="id">
                  <template v-if="docs[id]">{{ docs[id].title }} — {{ docs[id].number }}</template>
                </li>
              </ul>
              <router-link to="/hujjatlar" class="btn small ghost">Barcha hujjatlar</router-link>
            </div>
          </details>
        </div>

        <router-link to="/aloqa?m=mahsulot" class="btn block" style="margin-top: 14px">
          Mahsulot bo‘yicha maslahat olish
        </router-link>
      </article>
    </div>

    <CallCard from="mahsulotlar" title="Mahsulot haqida savolingiz bormi?" />
  </div>
</template>

<style scoped>
.product + .product { margin-top: 16px; }
.ph { margin: -20px -20px 14px; border-radius: var(--radius) var(--radius) 0 0; overflow: hidden; background: var(--green-softer); }
.ph img { width: 100%; aspect-ratio: 4 / 3; object-fit: contain; background: #fff; }
.ph-empty { aspect-ratio: 16 / 9; display: grid; place-items: center; align-content: center; gap: 6px; color: var(--green); font-size: 14px; }
</style>
