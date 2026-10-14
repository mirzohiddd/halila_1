<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import BottomBar from './components/BottomBar.vue';

const route = useRoute();
const isAdmin = computed(() => route.meta.admin);
</script>

<template>
  <AppHeader />
  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <AppFooter v-if="!isAdmin" />
  <BottomBar v-if="!isAdmin && route.path !== '/aloqa'" />
</template>
