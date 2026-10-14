<script setup>
import { onMounted, ref } from 'vue';
import PageHead from '../components/PageHead.vue';
import CallCard from '../components/CallCard.vue';
import { getJSON } from '../api.js';

const docs = ref([]);
const loading = ref(true);
const error = ref(false);

onMounted(async () => {
  try {
    docs.value = await getJSON('/api/documents');
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
});

const fmt = (d) => {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return day && m && y ? `${day}.${m}.${y}` : d;
};
const expired = (d) => d && new Date(d) < new Date();
</script>

<template>
  <div class="container">
    <PageHead icon="file" title="Sifat va hujjatlar" lead="Mahsulotlarning ro‘yxatdan o‘tish va sifat hujjatlari." />

    <div class="section">
      <div v-if="loading" class="spinner" />
      <div v-else-if="error" class="alert danger">Ma’lumotlarni yuklab bo‘lmadi. Sahifani yangilab ko‘ring.</div>
      <div v-else-if="!docs.length" class="empty">Hujjatlar tez orada joylashtiriladi.</div>

      <article v-for="d in docs" :key="d.id" class="card">
        <span v-if="d.example" class="badge">Namuna ma’lumot</span>
        <span v-else-if="expired(d.validUntil)" class="badge" style="color: var(--danger)">Muddati tugagan</span>
        <h3 style="margin-top: 8px">{{ d.title }}</h3>
        <dl class="kv">
          <div><dt>Bergan tashkilot</dt><dd>{{ d.issuer }}</dd></div>
          <div><dt>Hujjat raqami</dt><dd>{{ d.number }}</dd></div>
          <div><dt>Berilgan sana</dt><dd>{{ fmt(d.issuedAt) || '—' }}</dd></div>
          <div v-if="d.validUntil"><dt>Amal qilish muddati</dt><dd>{{ fmt(d.validUntil) }} gacha</dd></div>
          <div><dt>Nimani tasdiqlaydi</dt><dd>{{ d.confirms }}</dd></div>
        </dl>
        <a v-if="d.file" :href="d.file" target="_blank" rel="noopener" class="btn small ghost" style="margin-top: 14px">
          Hujjatni ko‘rish
        </a>
      </article>
    </div>

    <div class="alert">
      Faqat haqiqiy, amaldagi va tekshiriladigan hujjatlar joylashtiriladi. Sertifikat mahsulot sifatini va
      xavfsizlik talablariga muvofiqligini tasdiqlaydi — u mahsulotning saratonni davolash samaradorligini
      tasdiqlamaydi.
    </div>

    <CallCard from="hujjatlar" />
  </div>
</template>
