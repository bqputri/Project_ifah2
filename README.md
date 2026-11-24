# 🐾 TypePaws - Latihan Mengetik Cepat & Lucu (dengan AI Gemini)

TypePaws adalah aplikasi web latihan mengetik interaktif bertema hewan lucu yang mendukung **Mode Keyboard (10 Jari)** dan **Mode HP (Layar Sentuh/Dua Jempol)**. Sekarang dilengkapi dengan fitur **AI Generator Kalimat Latihan menggunakan Google Gemini API**.

---

## 🌟 Fitur Utama

1. **✨ Buat Teks Latihan Baru dengan AI**:
   - Pengguna dapat mengetik topik bebas (misal: cerita kucing lucu, petualangan luar angkasa, kata-kata motivasi santri, kuliner).
   - Gemini API secara otomatis membuatkan kalimat latihan bahasa Indonesia yang natural, menyenangkan, dan siap diketik.
   - Pilihan panjang kalimat: **Pendek** (1 kalimat), **Sedang** (2-3 kalimat), dan **Panjang** (1 paragraf).

2. **🔒 Backend Server / Serverless Endpoint Aman**:
   - API Key Gemini disimpan di sisi server (`process.env.GEMINI_API_KEY`) dan tidak pernah terekspos ke frontend / browser.
   - Endpoint: `POST /api/generate`.
   - Mendukung deployment sebagai server Express lokal maupun Serverless Function di Vercel / Netlify.

3. **🗺️ Mode Petualangan (10 Level Bertahap)**:
   - Dari pemanasan tombol home row (F & J) hingga kalimat cepat dengan angka dan simbol.

4. **⏱️ Mode Tantangan Waktu (Time Attack)**:
   - Berpacu dengan waktu (15s, 30s, 60s) dengan fitur **On-Fire Mode (2x Poin)** saat mengetik tanpa salah beruntun.

5. **📱 Dual Device Mode**:
   - Mode HP / Layar Sentuh dengan bantuan tombol keyboard ponsel.
   - Mode Keyboard Fisik lengkap dengan panduan keyboard virtual yang menyala mengikuti huruf target.

6. **🎨 Desain Imut & Interaktif**:
   - Pilihan maskot lucu (Mochi si Kucing, Boba si Kelinci, Pudding si Anjing, Oreo si Panda, Kiko si Rubah).
   - Efek suara ketikan memuaskan (Tone.js) dan perayaan konfeti (Canvas-Confetti).

---

## 📁 Struktur Proyek

```text
Aniswatul Latifah/
├── api/
│   └── generate.js         # Serverless function / handler Gemini API
├── .env                    # Variabel environment lokal (API Key - diabaikan Git)
├── .env.example            # Contoh template environment
├── .gitignore              # Memastikan .env & node_modules tidak ter-upload ke Git
├── index.html              # Frontend utama TypePaws + Fitur AI Modal
├── package.json            # Konfigurasi dependensi Node.js
├── server.js               # Server Express backend
├── vercel.json             # Konfigurasi deployment serverless Vercel
└── README.md               # Dokumentasi lengkap proyek
```

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Pasang Dependensi
Buka terminal di folder proyek ini (`Aniswatul Latifah`) dan jalankan:
```bash
npm install
```

### 2. Konfigurasi API Key Gemini
1. Buka file `.env` di text editor.
2. Dapatkan API Key Gemini secara gratis dari [Google AI Studio](https://aistudio.google.com/).
3. Masukkan API Key Anda ke dalam file `.env`:
   ```env
   PORT=3000
   GEMINI_API_KEY=AIzaSy...IsiApiKeyGeminiAndaDisini
   ```

### 3. Jalankan Server
Jalankan perintah:
```bash
npm start
```
Buka browser di alamat:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🛡️ Keamanan API Key & Git

- File `.env` **sudah otomatis didaftarkan ke dalam `.gitignore`**, sehingga ketika Anda melakukan `git add`, `git commit`, dan `git push` ke GitHub, API Key rahasia Anda **tidak akan bocor ke publik**.
- Teman atau pengembang lain yang meng-clone repositori dapat menyalin file `.env.example` menjadi `.env` lalu mengisi API Key mereka masing-masing.

---

## ☁️ Deployment ke Vercel (Opsional)

Proyek ini sudah dilengkapi file `vercel.json` dan folder `api/generate.js`. Anda dapat mendeploynya ke Vercel dengan mudah:
1. Hubungkan repositori GitHub Anda ke [Vercel](https://vercel.com).
2. Di pengaturan proyek Vercel, masuk ke **Settings > Environment Variables**.
3. Tambahkan variabel:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: (API Key Gemini Anda)
4. Klik **Deploy**!
