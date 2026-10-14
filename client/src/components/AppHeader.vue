<script setup>
import Icon from './Icon.vue';
import { callPhone, telHref, track } from '../api.js';
</script>

<template>
  <header class="hdr">
    <div class="container row">
      <router-link to="/" class="brand" aria-label="HALILA — bosh sahifa">
        <img class="logo" src="/logo.png" alt="HALILA" width="120" height="31" />
        <span class="tag">Sog‘lom hayot yo‘lida</span>
      </router-link>
      <a
        v-if="callPhone"
        :href="telHref(callPhone)"
        class="call"
        aria-label="Call-markazga qo‘ng‘iroq qilish"
        @click="track('call_click', 'header')"
      >
        <Icon name="phone" :size="20" />
      </a>
    </div>
  </header>
</template>

<style scoped>
.hdr {
  position: sticky; top: 0; z-index: 20;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid var(--line);
}
.row { display: flex; align-items: center; justify-content: space-between; height: 60px; }
.brand { display: flex; align-items: center; gap: 10px; text-decoration: none; min-width: 0; }
.logo { height: 31px; width: auto; flex-shrink: 0; }
.tag { color: var(--green); font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.call {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--green-soft); color: var(--green);
  display: grid; place-items: center; flex-shrink: 0;
}
</style>
