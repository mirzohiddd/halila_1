# HALILA sayti (Vue.js + Node.js)

Avtobus bekatidagi reklama plakatidan QR-kod orqali kiriladigan, faqat o‘zbek tilidagi mobil sayt.

## Tuzilishi

```
halila/
├── client/                 # Vue 3 + Vite (frontend)
│   └── src/
│       ├── views/          # Sahifalar (bosh sahifa, 4 bo‘lim, mahsulotlar, hujjatlar, aloqa, admin)
│       ├── components/     # Header, pastki panel, ariza formasi va h.k.
│       └── content/        # "Saraton haqida" matnlari (cancer.js)
└── server/                 # Node.js + Express (backend)
    ├── src/index.js        # API: arizalar, statistika, ma’lumotlar
    ├── data/               # Mutaxassislar, mahsulotlar, hujjatlar (JSON)
    └── storage/            # Arizalar va kirishlar shu yerga yoziladi (avtomatik yaratiladi)
```

## Ishga tushirish

Talab: Node.js 18 yoki undan yuqori.

```bash
npm run install:all          # bog‘liqliklarni o‘rnatish
cp server/.env.example server/.env   # sozlamalarni to‘ldiring

# Ishlab chiqish rejimi (ikki terminalda):
npm run dev:server           # http://localhost:3000
npm run dev:client           # http://localhost:5173

# Production:
npm run build                # client/dist ga yig‘ish
npm start                    # server saytni ham, API ni ham beradi (PORT=3000)
```

## Sozlamalar (`server/.env`)

| O‘zgaruvchi | Vazifasi |
|---|---|
| `PORT` | Server porti |
| `ADMIN_TOKEN` | `/admin` statistika sahifasiga kirish kaliti — uzun va maxfiy qiling |
| `CALL_CENTER_PHONE` | Call-markazning tasdiqlangan raqami (bo‘sh bo‘lsa, “tez orada joylashtiriladi” yoziladi) |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Ixtiyoriy: yangi ariza kelganda Telegramga xabar |

## Ma’lumotlarni to‘ldirish

Hozir mutaxassislar, mahsulotlar va hujjatlar **namuna** sifatida turibdi (saytda “Namuna ma’lumot” belgisi bilan ko‘rinadi). Mijozdan haqiqiy ma’lumot kelgach:

- `server/data/specialists.json` — shifokor/klinikalar. `specialty`: `onkolog` | `terapevt` | `diagnostika`; `availability`: `bugun`, `yaqin`, `keyinroq`.
- `server/data/products.json` — mahsulotlar. Rasmni `client/public/images/` ga qo‘yib, `"image": "/images/nomi.jpg"` deb yozing.
- `server/data/documents.json` — sertifikatlar. PDF faylni `client/public/docs/` ga qo‘yib, `"file": "/docs/nomi.pdf"` deb yozing.
- Har bir yozuvdan `"example": true` qatorini olib tashlang.

JSON fayllarni o‘zgartirgandan keyin serverni qayta ishga tushirish shart emas.

**Muhim:** `client/src/content/cancer.js` dagi tibbiy matnlarni e’lon qilishdan oldin onkolog shifokor tekshirishi kerak. Tekshirgan mutaxassis ma’lumotini shu fayldagi `review` maydoniga yozing — sahifada ko‘rsatiladi.

## QR-kodlar va reklama samaradorligi

Har bir bekat uchun alohida havola: `https://sizning-sayt.uz/?src=chilonzor-01`

- `/admin` sahifasida kalit bilan kiring → **QR-kod yaratish** bo‘limida bekat kodini yozib, PNG yuklab oling.
- **Ko‘rsatkichlar**: har bir bekat bo‘yicha kirishlar, noyob tashrif buyuruvchilar, qo‘ng‘iroq tugmasi bosilishi, arizalar va konversiya; qaysi bo‘lim ko‘proq ochilgani.
- **Arizalar**: ro‘yxat va Excel (CSV) ga yuklab olish.

Manba 30 kun eslab qolinadi — odam keyinroq qaytib ariza qoldirsa ham, u qaysi bekatdan kelgani hisoblanadi.

> Eslatma: “Call-markazga nechta murojaat kelgani” sayt tomonidan faqat qo‘ng‘iroq tugmasi bosilishi sifatida o‘lchanadi. Aniq qo‘ng‘iroqlar sonini call-markaz tizimidan olish kerak.

## Xavfsizlik va shaxsiy ma’lumotlar

- Ariza faqat rozilik belgisi qo‘yilganda qabul qilinadi; telefon +998 formatida tekshiriladi.
- Spam’dan himoya: yashirin maydon va bir IP uchun cheklov (10 daqiqada 5 ta ariza).
- “Alomatlar” savolnomasi javoblari serverga yuborilmaydi.
- Production’da saytni albatta HTTPS orqali ishga tushiring (masalan, Nginx + Let’s Encrypt) va `server/storage/` papkasini zaxiralang.
- Trafik ko‘paysa, JSON-fayl omborini PostgreSQL yoki MongoDB ga almashtirish tavsiya etiladi (`server/src/storage.js`).
