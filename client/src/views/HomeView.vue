<script setup>
import Icon from '../components/Icon.vue';
import CallCard from '../components/CallCard.vue';

const sections = [
  { to: '/saraton', icon: 'book', t: 'Saraton haqida ma’lumot', d: 'Kasallik, xavf omillari va erta aniqlash' },
  { to: '/mutaxassislar', icon: 'stethoscope', t: 'Mutaxassis topish', d: 'Shifokor yoki tibbiy markazni izlash' },
  { to: '/alomatlar', icon: 'message', t: 'Alomatlar haqida savol', d: 'Qayerga murojaat qilishni aniqlash' },
  { to: '/diagnostika', icon: 'clipboard', t: 'Tekshiruv va diagnostika', d: 'Tekshiruv turlari va ularga tayyorgarlik' }
];

const steps = [
  ['Kerakli bo‘limni tanlang', 'O‘zingizga kerakli ma’lumot yoki yordam turini tanlang.'],
  ['Bir nechta savolga javob bering', 'Ehtiyojingizni aniqlash uchun 2–3 ta sodda savol beramiz.'],
  ['Mos ma’lumotni oling', 'Maqola, mutaxassislar ro‘yxati yoki keyingi qadamlar ko‘rsatiladi.'],
  ['HALILA bilan bog‘laning', 'Istasangiz, call-markazga qo‘ng‘iroq qiling yoki ariza qoldiring.']
];
</script>

<template>
  <div class="container">
    <section class="hero">
      <div class="banner">
        <h1>Sizga qanday yordam kerak?</h1>
        <p>Savolingizni tanlang — kerakli ma’lumot va keyingi qadamni topishga yordam beramiz.</p>
      </div>

      <router-link v-for="s in sections" :key="s.to" :to="s.to" class="nav-card">
        <div class="icon-box"><Icon :name="s.icon" /></div>
        <div class="grow">
          <span class="t">{{ s.t }}</span>
          <span class="d">{{ s.d }}</span>
        </div>
        <Icon name="right" class="chev" />
      </router-link>

      <p class="note">Eslatma: tashxis malakali tibbiyot mutaxassisi tomonidan qo‘yiladi.</p>
    </section>

    <section class="section">
      <h2>Qanday ishlaydi?</h2>
      <ol class="steps" style="margin-top: 16px">
        <li v-for="(s, i) in steps" :key="i">
          <span class="num">0{{ i + 1 }}</span>
          <div>
            <div class="t">{{ s[0] }}</div>
            <div class="d">{{ s[1] }}</div>
          </div>
        </li>
      </ol>
    </section>

    <section class="section">
      <h2>HALILA mahsulotlari</h2>
      <p class="muted">Mahsulotlar va ularning sifat hujjatlari tibbiy ma’lumotlardan alohida joylashtirilgan.</p>
      <router-link to="/mahsulotlar" class="nav-card">
        <div class="icon-box"><Icon name="leaf" /></div>
        <div class="grow">
          <span class="t">Biologik faol qo‘shimchalar</span>
          <span class="d">Mahsulotlar haqida batafsil ma’lumot</span>
        </div>
        <Icon name="right" class="chev" />
      </router-link>
      <router-link to="/hujjatlar" class="nav-card">
        <div class="icon-box"><Icon name="file" /></div>
        <div class="grow">
          <span class="t">Sifat va hujjatlar</span>
          <span class="d">Sertifikatlar va ro‘yxatdan o‘tish hujjatlari</span>
        </div>
        <Icon name="right" class="chev" />
      </router-link>
    </section>

    <CallCard from="home" />
  </div>
</template>

<style scoped>
.hero { padding-top: 16px; }
.banner {
  /* Logodagi gradient: och yashildan laym rangga */
  background: linear-gradient(135deg, #eef9e6 0%, #c4e7a3 55%, #7acc33 100%);
  border-radius: var(--radius);
  padding: 28px 20px 24px;
  margin-bottom: 16px;
}
.banner h1 { margin-bottom: 10px; }
.banner p { margin: 0; font-size: 17px; color: #26331f; }
</style>
