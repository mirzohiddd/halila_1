<template>
  <footer class="ftr">
    <div class="container">
      <img src="/logo.png" alt="HALILA" width="110" height="28" loading="lazy" style="height: 28px; width: auto; margin-bottom: 16px" />
      <div class="links">
        <router-link to="/saraton">Saraton haqida</router-link>
        <router-link to="/mutaxassislar">Mutaxassislar</router-link>
        <router-link to="/alomatlar">Alomatlar</router-link>
        <router-link to="/diagnostika">Diagnostika</router-link>
        <router-link to="/mahsulotlar">Mahsulotlar</router-link>
        <router-link to="/hujjatlar">Sifat va hujjatlar</router-link>
        <router-link to="/aloqa">Bog‘lanish</router-link>
      </div>
      <p class="small muted">
        Saytdagi ma’lumotlar umumiy tanishtirish uchun berilgan va shifokor maslahati o‘rnini bosmaydi.
        Tashxis malakali tibbiyot mutaxassisi tomonidan qo‘yiladi. Shoshilinch holatda
        <a href="tel:103">103</a> raqamiga qo‘ng‘iroq qiling.
      </p>
      <p class="small muted">© {{ new Date().getFullYear() }} HALILA</p>
    </div>
  </footer>
</template>

<style scoped>
.ftr { border-top: 1px solid var(--line); padding: 24px 0 120px; background: #fafbf9; }
.links { display: flex; flex-wrap: wrap; gap: 8px 16px; margin-bottom: 16px; }
.links a { color: var(--ink); text-decoration: none; font-size: 15px; }
.links a:hover { color: var(--green); }
</style>
