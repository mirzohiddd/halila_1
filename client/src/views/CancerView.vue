<script setup>
import { useRoute } from 'vue-router';
import PageHead from '../components/PageHead.vue';
import CallCard from '../components/CallCard.vue';
import Icon from '../components/Icon.vue';
import { topics, review } from '../content/cancer.js';

const route = useRoute();
const openId = route.hash ? route.hash.slice(1) : 'nima';
</script>

<template>
  <div class="container">
    <PageHead
      icon="book"
      title="Saraton haqida bilishingiz kerak bo‘lgan ma’lumotlar"
      lead="Asosiy savollarga qisqa va tushunarli javoblar."
    />

    <div class="acc">
      <details v-for="t in topics" :id="t.id" :key="t.id" :open="t.id === openId">
        <summary>{{ t.q }}</summary>
        <div class="body" v-html="t.html" />
      </details>
    </div>

    <p v-if="review.reviewedBy" class="note">
      Ma’lumotlarni tekshirgan mutaxassis: {{ review.reviewedBy }}<span v-if="review.reviewedAt">, {{ review.reviewedAt }}</span>
    </p>
    <p class="note">Ushbu ma’lumotlar umumiy tanishtirish uchun berilgan va shifokor maslahati o‘rnini bosmaydi.</p>

    <section class="section">
      <h2>Keyingi qadam</h2>
      <router-link to="/alomatlar" class="nav-card">
        <div class="icon-box"><Icon name="message" /></div>
        <div class="grow">
          <span class="t">Sizni biror narsa bezovta qilyaptimi?</span>
          <span class="d">3 ta savolga javob bering — qayerga murojaat qilishni aytamiz</span>
        </div>
        <Icon name="right" class="chev" />
      </router-link>
      <router-link to="/mutaxassislar" class="nav-card">
        <div class="icon-box"><Icon name="stethoscope" /></div>
        <div class="grow">
          <span class="t">Mutaxassis topish</span>
          <span class="d">Onkolog, terapevt yoki diagnostika markazi</span>
        </div>
        <Icon name="right" class="chev" />
      </router-link>
    </section>

    <CallCard from="saraton" />
  </div>
</template>
