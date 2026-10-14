<script setup>
import Icon from './Icon.vue';
defineProps({ title: String, lead: String, icon: String });
</script>

<template>
  <div class="page-head">
    <router-link to="/" class="back"><Icon name="left" :size="18" /> Bosh sahifa</router-link>
    <div class="ttl">
      <div v-if="icon" class="icon-box lg"><Icon :name="icon" :size="28" /></div>
      <h1>{{ title }}</h1>
    </div>
    <p v-if="lead" class="lead">{{ lead }}</p>
  </div>
</template>

<style scoped>
.ttl { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
.ttl h1 { margin: 0; font-size: clamp(24px, 6.5vw, 34px); }
</style>
