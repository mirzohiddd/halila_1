// "Saraton haqida" bo‘limi matnlari.
// MUHIM: e’lon qilishdan oldin matnlarni onkolog shifokor tekshirib chiqishi kerak.
// Tekshirgan mutaxassis ma’lumotlarini quyidagi maydonga yozing — sahifada ko‘rsatiladi.
export const review = {
  reviewedBy: '', // masalan: 'Familiya I.O., onkolog, oliy toifali shifokor'
  reviewedAt: '' // masalan: '2026-10-20'
};

export const topics = [
  {
    id: 'nima',
    q: 'Saraton nima?',
    html: `
      <p>Saraton — organizmdagi ayrim hujayralarning nazoratsiz bo‘linib, ko‘payib ketishi natijasida yuzaga keladigan kasalliklar guruhi. Bunday hujayralar atrofdagi to‘qimalarga o‘sib kirishi, qon yoki limfa orqali boshqa a’zolarga tarqalishi mumkin.</p>
      <p>Saratonning yuzdan ortiq turi bor. Har bir tur o‘ziga xos kechadi, turlicha tekshiriladi va davolanadi. Shuning uchun har bir holatni faqat shifokor individual baholaydi.</p>`
  },
  {
    id: 'erta',
    q: 'Nima uchun kasallikni erta aniqlash muhim?',
    html: `
      <p>Ko‘plab saraton turlari erta bosqichda aniqlanganda davolash ancha samaraliroq bo‘ladi, davolash usullari esa ko‘pincha yengilroq va qisqaroq kechadi.</p>
      <p>Ayrim saraton turlari uchun hech qanday belgi bo‘lmagan paytda ham o‘tkaziladigan <b>skrining tekshiruvlari</b> mavjud — masalan, ko‘krak bezi, bachadon bo‘yni va yo‘g‘on ichak saratoni uchun. Qaysi skrining sizga, qaysi yoshda kerakligini shifokoringiz aniqlaydi.</p>`
  },
  {
    id: 'xavf',
    q: 'Qanday xavf omillari mavjud?',
    html: `
      <p>Xavf omili — kasallik ehtimolini oshiradigan holat. Xavf omili borligi kasallik albatta paydo bo‘ladi degani emas, yo‘qligi esa to‘liq kafolat bermaydi.</p>
      <ul>
        <li>Chekish va tamakining har qanday turi (nos, kalyan, elektron sigaret ham)</li>
        <li>Spirtli ichimliklar iste’moli</li>
        <li>Ortiqcha vazn va kam harakatli turmush tarzi</li>
        <li>Sabzavot va mevalar kam, qayta ishlangan go‘sht ko‘p bo‘lgan ovqatlanish</li>
        <li>Quyosh nurlari ta’sirida uzoq qolish</li>
        <li>Ayrim infeksiyalar: odam papillomavirusi (HPV), gepatit B va C, <i>Helicobacter pylori</i></li>
        <li>Yosh ulg‘ayishi va oilada saraton holatlari bo‘lishi</li>
        <li>Ish joyidagi zararli kimyoviy moddalar ta’siri</li>
      </ul>
      <p><b>Xavfni kamaytirish uchun:</b> chekmaslik, spirtli ichimliklarni cheklash, me’yoriy vaznni saqlash, muntazam jismoniy faollik, HPV va gepatit B ga qarshi emlanish hamda shifokor tavsiya qilgan tekshiruvlardan o‘z vaqtida o‘tish.</p>`
  },
  {
    id: 'qachon',
    q: 'Qachon shifokorga murojaat qilish kerak?',
    html: `
      <p>Quyidagi belgilar <b>2–3 haftadan ortiq</b> davom etsa yoki kuchayib borsa, shifokorga uchrashing:</p>
      <ul>
        <li>Sababsiz vazn yo‘qotish, doimiy holsizlik</li>
        <li>Tananing istalgan joyida yangi paydo bo‘lgan yoki kattalashayotgan shish, tugun</li>
        <li>3 haftadan ortiq davom etayotgan yo‘tal yoki ovoz bo‘g‘ilishi</li>
        <li>Ovqat yutishning qiyinlashishi, doimiy jig‘ildon qaynashi</li>
        <li>Ich kelishi yoki siyish odatining uzoq vaqt o‘zgarishi</li>
        <li>Bitmaydigan yara, xolning shakli, rangi yoki o‘lchami o‘zgarishi</li>
      </ul>
      <p><b>Sababsiz qon ketishi</b> (siydik, najas, yo‘tal bilan, hayz oralig‘ida yoki menopauzadan keyin) bo‘lsa — kutmasdan shifokorga murojaat qiling.</p>
      <p>Bu belgilar ko‘pincha saraton bilan bog‘liq bo‘lmagan holatlarda ham uchraydi. Lekin sababini faqat shifokor ko‘rigi va tekshiruvlar aniqlab beradi.</p>`
  },
  {
    id: 'tekshiruv',
    q: 'Saraton qanday tekshiruvlar orqali aniqlanadi?',
    html: `
      <p>Tekshiruvlarni shifokor shikoyat va ko‘rik natijalariga qarab belgilaydi. Odatda quyidagilar qo‘llaniladi:</p>
      <ul>
        <li>Shifokor ko‘rigi va suhbat</li>
        <li>Qon, siydik va boshqa laboratoriya tahlillari</li>
        <li>Ultratovush tekshiruvi (UTT), rentgen, mammografiya</li>
        <li>Kompyuter tomografiyasi (KT) va magnit-rezonans tomografiya (MRT)</li>
        <li>Endoskopik tekshiruvlar (masalan, gastroskopiya, kolonoskopiya)</li>
        <li><b>Biopsiya</b> — to‘qimadan namuna olib, mikroskop ostida tekshirish. Tashxisni aniq tasdiqlaydigan asosiy usul.</li>
      </ul>`
  }
];
