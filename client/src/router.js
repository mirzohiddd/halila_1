import { createRouter, createWebHistory } from 'vue-router';
import { track } from './api.js';
import HomeView from './views/HomeView.vue';

const routes = [
  { path: '/', component: HomeView, meta: { title: 'Bosh sahifa' } },
  { path: '/saraton', component: () => import('./views/CancerView.vue'), meta: { title: 'Saraton haqida', section: 'saraton' } },
  { path: '/mutaxassislar', component: () => import('./views/SpecialistsView.vue'), meta: { title: 'Mutaxassislar', section: 'mutaxassislar' } },
  { path: '/alomatlar', component: () => import('./views/SymptomsView.vue'), meta: { title: 'Alomatlar', section: 'alomatlar' } },
  { path: '/diagnostika', component: () => import('./views/DiagnosticsView.vue'), meta: { title: 'Diagnostika', section: 'diagnostika' } },
  { path: '/mahsulotlar', component: () => import('./views/ProductsView.vue'), meta: { title: 'Mahsulotlar', section: 'mahsulotlar' } },
  { path: '/hujjatlar', component: () => import('./views/DocumentsView.vue'), meta: { title: 'Sifat va hujjatlar', section: 'hujjatlar' } },
  { path: '/aloqa', component: () => import('./views/ContactView.vue'), meta: { title: 'Bog‘lanish', section: 'aloqa' } },
  { path: '/admin', component: () => import('./views/AdminView.vue'), meta: { title: 'Statistika', admin: true } },
  { path: '/:pathMatch(.*)*', component: () => import('./views/NotFoundView.vue'), meta: { title: 'Sahifa topilmadi' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to, _from, saved) => saved || (to.hash ? { el: to.hash, top: 80 } : { top: 0 })
});

router.afterEach((to) => {
  document.title = `${to.meta.title} — HALILA`;
  if (to.meta.section) track('section', to.meta.section);
});

export default router;
