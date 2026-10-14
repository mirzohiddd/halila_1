<script setup>
import Icon from './Icon.vue';
import { callPhone, telHref, track } from '../api.js';
</script>

<template>
  <nav class="bottom-bar" aria-label="Tezkor aloqa">
    <div class="inner" :style="!callPhone ? 'grid-template-columns:1fr' : ''">
      <a
        v-if="callPhone"
        :href="telHref(callPhone)"
        class="btn ghost"
        @click="track('call_click', 'bottom-bar')"
      >
        <Icon name="phone" :size="20" /> Qo‘ng‘iroq
      </a>
      <router-link to="/aloqa" class="btn">
        <Icon name="send" :size="20" /> Ariza qoldirish
      </router-link>
    </div>
  </nav>
</template>
