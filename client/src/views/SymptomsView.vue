<script setup>
import { computed, reactive, ref } from 'vue';
import PageHead from '../components/PageHead.vue';
import CallCard from '../components/CallCard.vue';
import Icon from '../components/Icon.vue';
import { track } from '../api.js';

// Javoblar serverga yuborilmaydi — faqat foydalanuvchi qurilmasida qayta ishlanadi.
const questions = [
  {
    key: 'what',
    q: 'Sizni nima bezovta qilmoqda?',
    options: [
      ['shish', 'Shish yoki tugun paydo bo‘lgan'],
      ['vazn', 'Sababsiz vazn yo‘qotish yoki doimiy holsizlik'],
      ['qon', 'Sababsiz qon ketishi'],
      ['yotal', 'Uzoq davom etayotgan yo‘tal yoki ovoz bo‘g‘ilishi'],
      ['hazm', 'Yutish yoki ovqat hazm qilish bilan muammo'],
      ['teri', 'Teridagi o‘zgarish, xol yoki bitmaydigan yara'],
      ['ogriq', 'Uzoq davom etayotgan og‘riq'],
      ['boshqa', 'Boshqa holat']
    ]
  },
  {
    key: 'how',
    q: 'Bu holat qachondan beri davom etmoqda?',
    options: [
      ['1h', 'Bir haftadan kam'],
      ['3h', '1–3 hafta'],
      ['3h+', '3 haftadan ko‘p'],
      ['oy', 'Bir necha oy']
    ]
  },
  {
    key: 'doc',
    q: 'Shu masala bo‘yicha shifokorga murojaat qilganmisiz?',
    options: [
      ['yoq', 'Yo‘q, hali murojaat qilmaganman'],
      ['kutish', 'Ha, tekshiruv natijalarini kutyapman'],
      ['davo', 'Ha, tashxis qo‘yilgan yoki davolanyapman']
    ]
  }
];

const answers = reactive({ what: '', how: '', doc: '' });
const step = ref(0);
const current = computed(() => questions[step.value]);

function choose(val) {
  answers[current.value.key] = val;
  if (step.value < questions.length - 1) {
    step.value++;
  } else {
    step.value = questions.length;
    track('section', 'alomatlar_natija');
  }
}
function restart() {
  answers.what = answers.how = answers.doc = '';
  step.value = 0;
}

// Natija: faqat yo‘l-yo‘riq. Tashxis qo‘yilmaydi, davolash tavsiya qilinmaydi.
const result = computed(() => {
  if (step.value < questions.length) return null;
  const longTime = answers.how === '3h+' || answers.how === 'oy';
  const urgentSign = answers.what === 'qon' || answers.what === 'vazn';

  if (answers.doc === 'davo') {
    return {
      tone: 'green',
      title: 'Davolovchi shifokoringiz bilan bog‘laning',
      text: 'Sizda tashxis qo‘yilgan yoki davolanish jarayoni boshlangan. Yangi yoki kuchayayotgan har qanday belgi haqida davolovchi shifokoringizga xabar bering. Belgilangan davolashni o‘zboshimchalik bilan o‘zgartirmang yoki to‘xtatmang.',
      spec: 'onkolog',
      time: ''
    };
  }
  if (answers.doc === 'kutish') {
    return {
      tone: 'green',
      title: 'Tekshiruvlarni oxiriga yetkazing',
      text: 'Natijalar tayyor bo‘lgach, ularni albatta shifokoringizga ko‘rsating. Agar holatingiz shu orada yomonlashsa, natijani kutmasdan shifokorga murojaat qiling. Qo‘shimcha maslahat kerak bo‘lsa, mutaxassis topishda yordam beramiz.',
      spec: 'onkolog',
      time: 'yaqin'
    };
  }
  if (urgentSign || longTime) {
    return {
      tone: 'warn',
      title: 'Yaqin kunlarda shifokorga uchrashing',
      text: urgentSign && !longTime
        ? 'Siz tanlagan belgi kutib turmasdan shifokor ko‘rigini talab qiladi. Bu har doim jiddiy kasallik borligini anglatmaydi, lekin sababini aniqlash muhim.'
        : 'Belgi 3 haftadan ortiq davom etmoqda. Bu har doim jiddiy kasallik borligini anglatmaydi, lekin sababini aniqlash uchun shifokor ko‘rigi kerak.',
      extra: 'Avval terapevt (oilaviy shifokor) qabuliga yoziling — u kerakli tekshiruvlarni belgilaydi va zarur bo‘lsa, tor mutaxassisga yo‘naltiradi.',
      spec: 'terapevt',
      time: 'yaqin'
    };
  }
  return {
    tone: 'green',
    title: 'Holatingizni kuzatib boring',
    text: 'Agar belgi 2–3 hafta ichida o‘tmasa, kuchaysa yoki yangi belgilar qo‘shilsa — shifokorga murojaat qiling. Sizni bezovta qilayotgan bo‘lsa, hozir ham terapevt qabuliga yozilishingiz mumkin.',
    spec: 'terapevt',
    time: ''
  };
});

const specQuery = computed(() => {
  const q = { s: result.value?.spec || '' };
  if (result.value?.time) q.t = result.value.time;
  return q;
});
</script>

<template>
  <div class="container">
    <PageHead
      icon="message"
      title="Sizni nima bezovta qilmoqda?"
      lead="3 ta savolga javob bering — qayerga murojaat qilish bo‘yicha yo‘l-yo‘riq beramiz."
    />

    <div class="alert danger">
      <strong>Shoshilinch holatda kutmang!</strong>
      Kuchli qon ketish, nafas qisishi, ko‘krakda kuchli og‘riq yoki hushdan ketish holatida darhol
      <a href="tel:103"><b>103</b></a> raqamiga qo‘ng‘iroq qiling.
    </div>

    <section v-if="step < questions.length" class="section">
      <p class="muted small" style="margin: 0">Savol {{ step + 1 }} / {{ questions.length }}</p>
      <div class="progress"><span :style="{ width: ((step + 1) / questions.length) * 100 + '%' }" /></div>
      <h2>{{ current.q }}</h2>
      <div class="options" style="margin-top: 14px">
        <button
          v-for="[k, l] in current.options"
          :key="k"
          type="button"
          :class="['option', { on: answers[current.key] === k }]"
          @click="choose(k)"
        >
          {{ l }}
        </button>
      </div>
      <button v-if="step > 0" type="button" class="btn outline small" style="margin-top: 16px" @click="step--">
        <Icon name="left" :size="18" /> Orqaga
      </button>
      <p class="note">Javoblaringiz saqlanmaydi va hech qayerga yuborilmaydi.</p>
    </section>

    <section v-else class="section">
      <div :class="['alert', result.tone === 'green' ? 'green' : '']">
        <strong style="font-size: 18px">{{ result.title }}</strong>
        <p style="margin: 6px 0 0">{{ result.text }}</p>
        <p v-if="result.extra" style="margin: 8px 0 0">{{ result.extra }}</p>
      </div>

      <div class="btn-row" style="margin-top: 16px">
        <router-link :to="{ path: '/mutaxassislar', query: specQuery }" class="btn">
          <Icon name="stethoscope" :size="20" /> Mutaxassis topish
        </router-link>
        <router-link to="/aloqa?m=alomat" class="btn ghost">
          <Icon name="send" :size="20" /> Call-markazdan maslahat olish
        </router-link>
        <button type="button" class="btn outline" @click="restart">Qaytadan boshlash</button>
      </div>

      <p class="note">
        Sayt tashxis qo‘ymaydi va o‘zicha davolanishni tavsiya qilmaydi. Yakuniy xulosani faqat shifokor ko‘rik va
        tekshiruvlar asosida beradi.
      </p>
    </section>

    <CallCard from="alomatlar" />
  </div>
</template>
