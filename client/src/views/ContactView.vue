<script setup>
import { useRoute } from 'vue-router';
import PageHead from '../components/PageHead.vue';
import LeadForm from '../components/LeadForm.vue';
import Icon from '../components/Icon.vue';
import { callPhone, telHref, track } from '../api.js';

const route = useRoute();
const topic = String(route.query.m || '');
</script>

<template>
  <div class="container">
    <PageHead title="Savollaringiz bormi?" lead="Kerakli ma’lumotni olish uchun HALILA call-markazi bilan bog‘laning." />

    <section class="card">
      <div class="call-row">
        <div class="icon-box lg round"><Icon name="phone" :size="26" /></div>
        <div>
          <h3 style="margin: 0">Call-markaz</h3>
          <a v-if="callPhone" :href="telHref(callPhone)" class="phone" @click="track('call_click', 'aloqa')">{{ callPhone }}</a>
          <p v-else class="muted" style="margin: 0">Telefon raqami tez orada joylashtiriladi.</p>
        </div>
      </div>
      <a v-if="callPhone" :href="telHref(callPhone)" class="btn block" style="margin-top: 14px" @click="track('call_click', 'aloqa_btn')">
        <Icon name="phone" :size="20" /> Qo‘ng‘iroq qilish
      </a>
    </section>

    <section class="card" style="margin-top: 16px">
      <h2>Ariza shakli</h2>
      <p class="muted">Ma’lumotlaringizni qoldiring — o‘zimiz qo‘ng‘iroq qilamiz.</p>
      <LeadForm :initial-topic="topic" />
    </section>
  </div>
</template>

<style scoped>
.call-row { display: flex; gap: 14px; align-items: center; }
.round { border-radius: 50%; }
.phone { font-size: 22px; font-weight: 800; color: var(--ink); text-decoration: none; }
</style>
