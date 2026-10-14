import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import { initTracking } from './api.js';
import './style.css';

initTracking();
createApp(App).use(router).mount('#app');
