<script setup>
import Icon from './Icon.vue';
import { callPhone, telHref, track } from '../api.js';
defineProps({
  title: { type: String, default: 'Savollaringiz bormi?' },
  text: { type: String, default: 'Kerakli ma’lumotni olish uchun HALILA call-markazi bilan bog‘laning.' },
  from: { type: String, default: 'card' }
});
</script>

<template>
  <section class="card cta">
    <h2>{{ title }}</h2>
    <p class="muted">{{ text }}</p>
    <div class="btn-row two">
      <a v-if="callPhone" :href="telHref(callPhone)" class="btn" @click="track('call_click', from)">
        <Icon name="phone" :size="20" /> {{ callPhone }}
      </a>
      <router-link to="/aloqa" :class="['btn', callPhone ? 'ghost' : '']">
        <Icon name="send" :size="20" /> Ariza qoldirish
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.cta { background: var(--green-softer); border-color: #d5ebcc; margin: 28px 0; }
</style>
