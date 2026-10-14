<script setup>
import { computed, onMounted, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import PageHead from '../components/PageHead.vue';
import CallCard from '../components/CallCard.vue';
import Icon from '../components/Icon.vue';
import { getJSON, telHref, track } from '../api.js';

const route = useRoute();

const specialties = [
  ['', 'Barchasi'],
  ['onkolog', 'Onkolog'],
  ['terapevt', 'Terapevt'],
  ['diagnostika', 'Diagnostika markazi']
];
const districts = [
  'Bektemir tumani', 'Chilonzor tumani', 'Mirobod tumani', 'Mirzo Ulug‘bek tumani',
  'Olmazor tumani', 'Sergeli tumani', 'Shayxontohur tumani', 'Uchtepa tumani',
  'Yakkasaroy tumani', 'Yangihayot tumani', 'Yashnobod tumani', 'Yunusobod tumani'
];
const times = [
  ['', 'Farqi yo‘q'],
  ['bugun', 'Bugun'],
  ['yaqin', 'Yaqin kunlarda'],
  ['keyinroq', 'Keyinroq']
];
const specLabel = Object.fromEntries(specialties);

const filter = reactive({
  specialty: specialties.some(([k]) => k === route.query.s) ? route.query.s : '',
  district: '',
  time: times.some(([k]) => k === route.query.t) ? route.query.t : ''
});

const list = ref([]);
const loading = ref(true);
const error = ref(false);

onMounted(async () => {
  try {
    list.value = await getJSON('/api/specialists');
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
});

const results = computed(() =>
  list.value.filter(
    (s) =>
      (!filter.specialty || s.specialty === filter.specialty) &&
      (!filter.district || s.district === filter.district) &&
      (!filter.time || (s.availability || []).includes(filter.time))
  )
);
</script>

<template>
  <div class="container">
    <PageHead
      icon="stethoscope"
      title="Sizga mos mutaxassisni toping"
      lead="Mutaxassislik, hudud va qulay vaqtni tanlang."
    />

    <div class="card filters">
      <div class="field">
        <label>Mutaxassislik</label>
        <div class="chips">
          <button
            v-for="[k, l] in specialties"
            :key="k"
            type="button"
            :class="['chip', { on: filter.specialty === k }]"
            @click="filter.specialty = k"
          >{{ l }}</button>
        </div>
      </div>
      <div class="field">
        <label for="sp-d">Hudud</label>
        <select id="sp-d" v-model="filter.district" class="select">
          <option value="">Toshkent shahri — barcha tumanlar</option>
          <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
      <div class="field" style="margin-bottom: 0">
        <label>Murojaat qilish vaqti</label>
        <div class="chips">
          <button
            v-for="[k, l] in times"
            :key="k"
            type="button"
            :class="['chip', { on: filter.time === k }]"
            @click="filter.time = k"
          >{{ l }}</button>
        </div>
      </div>
    </div>

    <div class="section">
      <div v-if="loading" class="spinner" />
      <div v-else-if="error" class="alert danger">Ma’lumotlarni yuklab bo‘lmadi. Sahifani yangilab ko‘ring.</div>
      <template v-else>
        <p class="muted small">Topildi: {{ results.length }}</p>
        <article v-for="s in results" :key="s.id" class="card">
          <div class="top">
            <span class="badge green">{{ specLabel[s.specialty] || s.specialty }}</span>
            <span v-if="s.example" class="badge">Namuna ma’lumot</span>
          </div>
          <h3>{{ s.name }}</h3>
          <p class="muted" style="margin: 0">{{ s.qualification }}</p>
          <dl class="kv">
            <div><dt>Klinika</dt><dd>{{ s.clinic }}</dd></div>
            <div><dt>Manzil</dt><dd>{{ s.district }}, {{ s.address }}</dd></div>
          </dl>
          <div class="btn-row two" style="margin-top: 14px">
            <a v-if="s.phone" :href="telHref(s.phone)" class="btn small ghost" @click="track('section', 'specialist_call')">
              <Icon name="phone" :size="18" /> {{ s.phone }}
            </a>
            <router-link to="/aloqa?m=mutaxassis" class="btn small outline">Yozilishda yordam</router-link>
          </div>
        </article>
        <div v-if="!results.length" class="empty">
          <p>Tanlangan shartlar bo‘yicha mutaxassis topilmadi.</p>
          <p>Call-markazimiz sizga mos mutaxassisni topishda yordam beradi.</p>
        </div>
      </template>
      <p class="note">Ro‘yxatga faqat tekshirilgan ma’lumotlar joylashtiriladi.</p>
    </div>

    <CallCard
      from="mutaxassislar"
      title="Mutaxassis tanlashda yordam kerakmi?"
      text="Call-markaz operatori sizga mos shifokor yoki markazni topishga yordam beradi."
    />
  </div>
</template>

<style scoped>
.top { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
.filters { margin-bottom: 4px; }
</style>
