<script setup>
import { reactive, ref } from 'vue';
import Icon from './Icon.vue';
import { getSource, track } from '../api.js';

const props = defineProps({ initialTopic: { type: String, default: '' } });

const topics = [
  ['saraton', 'Saraton haqida ma’lumot'],
  ['mutaxassis', 'Mutaxassis topish'],
  ['alomat', 'Alomatlar bo‘yicha savol'],
  ['tekshiruv', 'Tekshiruv va diagnostika'],
  ['mahsulot', 'HALILA mahsulotlari'],
  ['boshqa', 'Boshqa masala']
];
const times = [
  ['hozir', 'Imkon qadar tezroq'],
  ['ertalab', 'Ertalab (09:00–12:00)'],
  ['tushdan', 'Tushdan keyin (12:00–17:00)'],
  ['kechqurun', 'Kechqurun (17:00–20:00)']
];

const f = reactive({
  name: '',
  phone: '+998 ',
  topic: topics.some(([k]) => k === props.initialTopic) ? props.initialTopic : '',
  time: '',
  message: '',
  consent: false,
  website: ''
});
const errors = ref({});
const sending = ref(false);
const done = ref(false);
const failed = ref('');

// +998 90 123 45 67 ko‘rinishida formatlash
function onPhone(e) {
  let d = e.target.value.replace(/\D/g, '');
  if (!d.startsWith('998')) d = '998' + d.replace(/^998/, '');
  d = d.slice(0, 12);
  const p = d.slice(3);
  let out = '+998';
  if (p.length) out += ' ' + p.slice(0, 2);
  if (p.length > 2) out += ' ' + p.slice(2, 5);
  if (p.length > 5) out += ' ' + p.slice(5, 7);
  if (p.length > 7) out += ' ' + p.slice(7, 9);
  f.phone = out;
}

function validate() {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Ismingizni kiriting';
  if (f.phone.replace(/\D/g, '').length !== 12) e.phone = 'Telefon raqamini to‘liq kiriting';
  if (!f.topic) e.topic = 'Masalani tanlang';
  if (!f.time) e.time = 'Qulay vaqtni tanlang';
  if (!f.consent) e.consent = 'Davom etish uchun roziligingiz kerak';
  errors.value = e;
  return !Object.keys(e).length;
}

async function submit() {
  failed.value = '';
  if (!validate()) return;
  sending.value = true;
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, source: getSource() })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      done.value = true;
      track('lead', f.topic);
    } else if (data.errors) {
      errors.value = data.errors;
    } else {
      failed.value = data.error || 'Ariza yuborilmadi. Iltimos, qayta urinib ko‘ring.';
    }
  } catch {
    failed.value = 'Internet aloqasini tekshirib, qayta urinib ko‘ring.';
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div v-if="done" class="ok">
    <div class="icon-box lg"><Icon name="check" :size="30" /></div>
    <h3>Arizangiz qabul qilindi</h3>
    <p class="muted">Call-markaz mutaxassisi siz ko‘rsatgan vaqtda qo‘ng‘iroq qiladi. Rahmat!</p>
    <router-link to="/" class="btn ghost">Bosh sahifaga qaytish</router-link>
  </div>

  <form v-else novalidate @submit.prevent="submit">
    <div :class="['field', { err: errors.name }]">
      <label for="lf-name">Ismingiz</label>
      <input id="lf-name" v-model="f.name" class="input" autocomplete="given-name" maxlength="80" placeholder="Masalan: Dilnoza" />
      <span v-if="errors.name" class="err-text">{{ errors.name }}</span>
    </div>

    <div :class="['field', { err: errors.phone }]">
      <label for="lf-phone">Telefon raqamingiz</label>
      <input id="lf-phone" :value="f.phone" class="input" type="tel" inputmode="tel" autocomplete="tel" @input="onPhone" />
      <span v-if="errors.phone" class="err-text">{{ errors.phone }}</span>
    </div>

    <div :class="['field', { err: errors.topic }]">
      <label for="lf-topic">Qaysi masalada yordam kerak?</label>
      <select id="lf-topic" v-model="f.topic" class="select">
        <option value="" disabled>Tanlang</option>
        <option v-for="[k, l] in topics" :key="k" :value="k">{{ l }}</option>
      </select>
      <span v-if="errors.topic" class="err-text">{{ errors.topic }}</span>
    </div>

    <div :class="['field', { err: errors.time }]">
      <label>Sizga qachon qo‘ng‘iroq qilish qulay?</label>
      <div class="chips" role="radiogroup">
        <button
          v-for="[k, l] in times"
          :key="k"
          type="button"
          role="radio"
          :aria-checked="f.time === k"
          :class="['chip', { on: f.time === k }]"
          @click="f.time = k"
        >{{ l }}</button>
      </div>
      <span v-if="errors.time" class="err-text">{{ errors.time }}</span>
    </div>

    <div class="field">
      <label for="lf-msg">Izoh <span class="muted small">(ixtiyoriy)</span></label>
      <textarea id="lf-msg" v-model="f.message" class="textarea" maxlength="500" placeholder="Qisqacha yozib qoldirishingiz mumkin" />
    </div>

    <div class="hp" aria-hidden="true">
      <input v-model="f.website" tabindex="-1" autocomplete="off" />
    </div>

    <div :class="['field', { err: errors.consent }]">
      <label class="check">
        <input v-model="f.consent" type="checkbox" />
        <span>
          Shaxsiy ma’lumotlarim (ism va telefon raqami) faqat men bilan bog‘lanish maqsadida qayta ishlanishiga
          roziman. Ma’lumotlar uchinchi shaxslarga berilmaydi.
        </span>
      </label>
      <span v-if="errors.consent" class="err-text">{{ errors.consent }}</span>
    </div>

    <div v-if="failed" class="alert danger" style="margin-bottom: 14px">{{ failed }}</div>

    <button class="btn block" type="submit" :disabled="sending">
      {{ sending ? 'Yuborilmoqda…' : 'Men bilan bog‘laning' }}
    </button>
  </form>
</template>

<style scoped>
.ok { text-align: center; display: grid; justify-items: center; gap: 8px; padding: 12px 0; }
.ok .icon-box { margin-bottom: 4px; }
</style>
