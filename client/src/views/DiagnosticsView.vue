<script setup>
import PageHead from '../components/PageHead.vue';
import CallCard from '../components/CallCard.vue';
import Icon from '../components/Icon.vue';

const types = [
  ['Laboratoriya tahlillari', 'Qon, siydik va boshqa tahlillar. Umumiy holatni baholash va ayrim o‘zgarishlarni aniqlashga yordam beradi.'],
  ['Ultratovush tekshiruvi (UTT)', 'Ichki a’zolar va yumshoq to‘qimalarni nurlanishsiz ko‘rish usuli.'],
  ['Rentgen va mammografiya', 'Ko‘krak qafasi, suyaklar va ko‘krak bezini tekshirish uchun qo‘llaniladi.'],
  ['KT (kompyuter tomografiyasi)', 'A’zolarning qavatma-qavat batafsil tasvirini beradi.'],
  ['MRT (magnit-rezonans tomografiya)', 'Yumshoq to‘qimalarni, bosh miya va umurtqa pog‘onasini aniq ko‘rsatadi.'],
  ['Endoskopiya', 'Oshqozon, ichak va boshqa a’zolarni ichidan maxsus kamera bilan ko‘rish.'],
  ['Biopsiya', 'To‘qimadan namuna olib, mikroskop ostida tekshirish. Tashxisni aniq tasdiqlaydigan asosiy usul.']
];

const prep = [
  ['Qon tahlili', 'Ko‘pincha och qoringa topshiriladi. Qancha vaqt ovqatlanmaslik kerakligini laboratoriyadan aniqlang.'],
  ['Qorin bo‘shlig‘i UTT', 'Odatda och qoringa o‘tkaziladi; ayrim tekshiruvlar uchun siydik pufagi to‘la bo‘lishi kerak.'],
  ['KT va MRT', 'Tanadagi metall buyumlar, implantlar, kardiostimulyator, allergiya, homiladorlik va buyrak kasalliklari haqida oldindan ayting.'],
  ['Endoskopiya', 'Maxsus parhez va tayyorgarlik talab qilinadi — faqat shifokor ko‘rsatmasiga amal qiling.'],
  ['Har qanday tekshiruv', 'Shaxsingizni tasdiqlovchi hujjat, yo‘llanma va avvalgi tekshiruv natijalarini o‘zingiz bilan oling. Doimiy ichadigan dorilaringizni shifokorga ayting.']
];
</script>

<template>
  <div class="container">
    <PageHead
      icon="clipboard"
      title="Tekshiruv haqida ma’lumot oling"
      lead="Tekshiruv turlari, ularga tayyorgarlik va qayerda o‘tish mumkinligi."
    />

    <div class="acc">
      <details open>
        <summary>Qanday tekshiruv turlari mavjud?</summary>
        <div class="body">
          <ul>
            <li v-for="[t, d] in types" :key="t"><b>{{ t }}</b> — {{ d }}</li>
          </ul>
        </div>
      </details>
      <details>
        <summary>Qachon tekshiruvdan o‘tish tavsiya etiladi?</summary>
        <div class="body">
          <p><b>Bezovta qiluvchi belgi bo‘lganda.</b> Agar biror belgi 2–3 haftadan ortiq davom etsa yoki kuchaysa, shifokor ko‘rigidan o‘ting — u kerakli tekshiruvlarni belgilaydi.</p>
          <p><b>Profilaktik (skrining) tekshiruvlar.</b> Hech qanday belgi bo‘lmasa ham, ma’lum yoshdan boshlab muntazam tekshiruvlar tavsiya etiladi. Ularning turi va qanchalik tez-tez o‘tkazilishi yosh, jins va xavf omillariga bog‘liq.</p>
          <p><b>Oilada saraton holatlari bo‘lsa</b>, bu haqda shifokoringizga ayting — tekshiruvlar ertaroq boshlanishi mumkin.</p>
        </div>
      </details>
      <details>
        <summary>Tekshiruvga qanday tayyorlanish kerak?</summary>
        <div class="body">
          <ul>
            <li v-for="[t, d] in prep" :key="t"><b>{{ t }}:</b> {{ d }}</li>
          </ul>
          <p class="muted small">Har bir klinikaning o‘z talablari bo‘lishi mumkin — yozilayotganda aniqlashtirib oling.</p>
        </div>
      </details>
      <details>
        <summary>Qayerda tekshiruvdan o‘tish mumkin?</summary>
        <div class="body">
          <p>Toshkent shahridagi diagnostika markazlari va klinikalar ro‘yxatini “Mutaxassislar” bo‘limida ko‘rishingiz mumkin.</p>
          <router-link :to="{ path: '/mutaxassislar', query: { s: 'diagnostika' } }" class="btn small ghost">
            Diagnostika markazlari <Icon name="right" :size="18" />
          </router-link>
        </div>
      </details>
      <details>
        <summary>Qanday qilib mutaxassis bilan maslahatlashish mumkin?</summary>
        <div class="body">
          <p>Call-markazimizga qo‘ng‘iroq qiling yoki ariza qoldiring — operator sizga mos mutaxassis yoki markazni topishda va qabulga yozilishda yordam beradi.</p>
          <router-link to="/aloqa?m=tekshiruv" class="btn small">Ariza qoldirish</router-link>
        </div>
      </details>
    </div>

    <p class="note">Tekshiruv zaruratini shifokor individual holatga qarab belgilaydi.</p>

    <CallCard from="diagnostika" />
  </div>
</template>
