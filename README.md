# 🐾 TypePaws - Web Latihan Mengetik Cepat & Lucu (dengan AI Gemini & Multiplayer Race)

TypePaws adalah aplikasi web latihan mengetik modern dan interaktif bertema kucing lucu yang mendukung **Mode Keyboard (10 Jari)** dan **Mode HP (Layar Sentuh/Dua Jempol)**.

---

## 🌟 Fitur-Fitur Utama

### 1. 🌙 Dark Mode (Mode Gelap)
- Tombol toggle 🌙 / ☀️ di bagian header untuk beralih antara Mode Terang dan Mode Gelap.
- Palet warna malam yang dirancang khusus agar nyaman di mata, kontras tinggi, dan tetap mempertahankan estetika lucu khas TypePaws.
- Preferensi tema otomatis tersimpan di `localStorage` sehingga tidak ter-reset saat browser dibuka kembali.

### 2. 🌐 Multi-bahasa (Bahasa Indonesia & English)
- Pilihan bahasa antarmuka (🇮🇩 ID / 🇬🇧 EN) di header.
- Seluruh teks tombol, judul mode, instruksi, statistik, modal, dan pesan maskot diterjemahkan penuh ke Bahasa Inggris saat mode English aktif.
- Menyediakan kalimat latihan khusus bahasa Inggris untuk level petualangan dan bank kata time attack.
- Generator teks AI Gemini juga dapat membuat teks latihan dalam Bahasa Indonesia maupun English.

### 3. 👤 Sistem Akun, Statistik & Penyimpanan Progres
- **Statistik Lengkap**: Melacak total sesi permainan, WPM tertinggi (*Personal Best*), rata-rata akurasi, dan jumlah kemenangan balapan.
- **Sistem Level & XP**: Pemain memperoleh XP dan kenaikan level setiap kali menyelesaikan sesi latihan.
- **8 Lencana Pencapaian (Badges)**: Buka lencana unik seperti *Langkah Pertama*, *Jari Lincah (30+ WPM)*, *Kilat Cahaya (50+ WPM)*, *Mata Elang (100% Akurasi)*, *Mode On-Fire*, *Sahabat AI*, *Juara Balap*, dan *Penjelajah Ulung*.
- **Riwayat Permainan**: Menyimpan 10 riwayat permainan terakhir secara detail.
- **Pencadangan Data**: Fitur **Export JSON** dan **Import JSON** untuk mencadangkan atau memindahkan progres antar-perangkat secara instan tanpa perlu mendaftar akun.
- **Sinkronisasi Cloud (Opsional)**: Mendukung Supabase Auth & Cloud Database untuk sinkronisasi otomatis multi-perangkat.

### 4. 🏁 Balapan Mengetik Online (Multiplayer Typing Race)
- **Buat Room (Host)**: Membuat room balapan dengan kode unik 5 huruf (misal: `PAW88`) yang bisa dibagikan ke teman.
- **Gabung Room**: Masuk ke room balapan teman hanya dengan memasukkan kode room.
- **Lintasan Balap Real-Time**: Avatar maskot setiap pemain bergerak maju secara real-time di jalurnya masing-masing sesuai persentase kata yang sudah diketik beserta indikator WPM langsung.
- **Hitung Mundur & Garis Finis**: Dilengkapi animasi hitung mundur dramatis (3, 2, 1, GO!), podium pemenang (🥇 1st, 🥈 2nd, 🥉 3rd), dan fitur tanding ulang (*Rematch*).
- **Kompatibel Serverless Vercel & Lokal**: Berjalan langsung di server lokal maupun Vercel Serverless Function via endpoint `/api/rooms`, serta mendukung Supabase Realtime Channels.

### 5. ✨ Buat Teks Latihan Baru dengan AI (Google Gemini API)
- Pengguna dapat mengetik topik bebas (misal: *cerita kucing astronot*, *motivasi belajar*, *petualangan hutan ajaib*).
- Gemini AI membuatkan kalimat latihan mengetik yang natural, menarik, dan siap diketik dalam pilihan bahasa Indonesia atau Inggris.
- API Key tersimpan aman di server backend (`process.env.GEMINI_API_KEY`) dan tidak pernah terekspos ke browser pengguna.

### 6. 🗺️ Mode Petualangan & ⏱️ Mode Tantangan Waktu
- 10 Level bertahap dari pemanasan home row hingga kombinasi angka dan tanda baca.
- Mode Time Attack (15s, 30s, 60s) dengan fitur **On-Fire Mode (2x Poin)** saat mengetik tanpa salah beruntun.

---

## 📁 Struktur Proyek

```text
Aniswatul Latifah/
├── api/
│   ├── config.js           # Endpoint konfigurasi publik klien (Supabase, dll)
│   ├── generate.js         # Endpoint Serverless Gemini AI
│   └── rooms.js            # Endpoint Serverless Room Manager Balapan Online
├── .env                    # Variabel environment lokal (API Key - diabaikan Git)
├── .env.example            # Template contoh environment
├── .gitignore              # Memastikan .env & node_modules tidak ter-upload ke Git
├── index.html              # Frontend utama TypePaws + Dark Mode, i18n, Profil, & Balapan
├── package.json            # Dependensi Node.js
├── server.js               # Backend Server Express
├── vercel.json             # Konfigurasi deployment serverless Vercel
└── README.md               # Dokumentasi lengkap proyek
```

---

## 🔑 Variabel Environment (`.env`)

Salin file `.env.example` menjadi `.env` lalu sesuaikan isinya:

```env
# Port Server Lokal
PORT=3000

# Google Gemini API Key (Wajib untuk Fitur AI Generator)
# Dapatkan gratis di https://aistudio.google.com/
GEMINI_API_KEY=AIzaSy...

# Supabase (Opsional - untuk Cloud Auth & Realtime Sync Multi-Perangkat)
# Dapatkan gratis di https://supabase.com/
# Jika dikosongkan, TypePaws tetap berjalan 100% normal dengan penyimpanan lokal (localStorage)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

## 🚀 Cara Menjalankan di Komputer Lokal

1. **Pasang Dependensi**:
   ```bash
   npm install
   ```
2. **Jalankan Server**:
   ```bash
   npm start
   ```
3. **Buka Browser**:
   Buka alamat 👉 **[http://localhost:3000](http://localhost:3000)**

---

## ☁️ Deployment ke Vercel

1. Hubungkan repository GitHub Anda ke [Vercel](https://vercel.com).
2. Di halaman pengaturan proyek Vercel, buka menu **Settings > Environment Variables**.
3. Tambahkan environment variable berikut:
   - `GEMINI_API_KEY`: API Key Gemini Anda.
   - `SUPABASE_URL` *(opsional)*: URL proyek Supabase jika menggunakan cloud sync.
   - `SUPABASE_ANON_KEY` *(opsional)*: Anon key proyek Supabase jika menggunakan cloud sync.
4. Klik **Deploy**.
