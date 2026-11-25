# 🐾 TypePaws - Web Latihan Mengetik Cepat & Lucu (dengan AI Gemini & Multiplayer Race)

TypePaws adalah aplikasi web latihan mengetik modern dan interaktif bertema kucing lucu yang mendukung **Mode Keyboard (10 Jari)** dan **Mode HP (Layar Sentuh/Dua Jempol)**.

---

## 🌟 Fitur-Fitur Utama

### 1. 🌙 Dark Mode (Mode Gelap)
- Tombol toggle 🌙 / ☀️ di bagian header untuk beralih antara Mode Terang dan Mode Gelap.
- Palet warna malam yang dirancang khusus agar nyaman di mata, kontras tinggi, teks dan badge mudah dibaca di malam hari, dan tetap mempertahankan estetika lucu khas TypePaws.
- Preferensi tema otomatis tersimpan di `localStorage` sehingga tidak ter-reset saat browser dibuka kembali.

### 2. 🌐 Multi-bahasa (Bahasa Indonesia & English)
- Pilihan bahasa antarmuka (🇮🇩 ID / 🇬🇧 EN) di header.
- Seluruh teks tombol, judul mode, instruksi, statistik, modal, dan pesan maskot diterjemahkan penuh ke Bahasa Inggris saat mode English aktif.
- Menyediakan kalimat latihan khusus bahasa Inggris untuk level petualangan dan bank kata time attack.
- Generator teks AI Gemini juga dapat membuat teks latihan dalam Bahasa Indonesia maupun English.

### 3. 👤 Sistem Akun & Progres Permanen (Firebase Cloud Sync & Offline Mode)
- **Firebase Authentication**: Mendukung pendaftaran & login akun via **Email/Password** dan **Google Sign-In** satu klik.
- **Penyimpanan Cloud Otomatis**: Setiap selesai bermain (Petualangan, Time Attack, AI, atau Balapan Online), data skor terbaik (WPM tertinggi), rata-rata akurasi, total permainan, level terbuka (1-100), dan riwayat bermain otomatis tersimpan ke cloud via Firebase.
- **Fitur Lihat Kata Sandi**: Ikon mata (👁️) untuk melihat atau menyembunyikan kata sandi saat mendaftar atau masuk akun.
- **Fallback Mode Tamu / Offline**: Jika pengguna belum login atau belum mengisi konfigurasi Firebase, progres tetap tersimpan rapi di browser lokal (`localStorage`).
- **Pencadangan Data**: Fitur **Export JSON** dan **Import JSON** untuk mencadangkan atau memindahkan progres antar-perangkat secara instan tanpa perlu mendaftar akun.

### 4. 🏁 Balapan Mengetik Online Real-Time (Firebase Realtime Database)
- **Multiplayer Antar-Perangkat (Cross-Device)**: Menggunakan Firebase Realtime Database berkecepatan tinggi dengan latensi milidetik via WebSocket, kompatibel penuh dengan arsitektur serverless Vercel.
- **Buat Room (Host)**: Membuat room balapan dengan kode unik 6 karakter (misal: `CAT77X`) dan tombol salin link yang bisa langsung dibagikan ke teman.
- **Gabung Room (Guest)**: Masuk ke room balapan teman via link atau dengan memasukkan kode room. Avatar kucing dan nama pemain seketika muncul di layar lobi semua pemain.
- **Hitung Mundur Sinkron**: Saat host menekan *Mulai Balapan*, hitungan mundur 3-2-1 berjalan serentak di layar seluruh pemain.
- **Lintasan Balap Real-Time**: Posisi avatar kucing setiap pemain bergerak maju secara nyata sesuai persentase kata yang sudah diketik, lengkap dengan badge WPM langsung.
- **Podium Juara & Tanding Ulang (Rematch)**: Peringkat juara 1 (🥇), 2 (🥈), dan 3 (🥉) dihitung secara instan saat melewati garis finis. Host dapat menekan tombol *Tanding Ulang* untuk memulai ronde baru dengan teks acak baru.

### 5. 🗺️ Mode Petualangan 100 Level & ⏱️ Mode Tantangan Waktu
- **100 Level Bertahap**: Mulai dari latihan paling dasar (Home Row keys `asdf jkl;`), penambahan baris atas/bawah, angka, tanda baca, simbol coding, hingga kalimat kompleks dan quotes dunia.
- **Mode Time Attack**: Pilihan durasi 15 detik, 30 detik, dan 60 detik dengan fitur **Mode On-Fire (2x Poin)** saat mengetik tanpa salah beruntun.

### 6. ✨ Buat Teks Latihan Baru dengan AI (Google Gemini API)
- Pengguna dapat mengetik topik bebas (misal: *cerita kucing astronot*, *motivasi belajar*, *petualangan hutan ajaib*).
- Gemini AI membuatkan kalimat latihan mengetik yang natural, menarik, dan siap diketik dalam pilihan bahasa Indonesia atau Inggris.
- API Key tersimpan aman di server backend (`process.env.GEMINI_API_KEY`) dan tidak pernah terekspos ke browser pengguna.

### 7. 📲 Progressive Web App (PWA)
- **Dapat Diinstal di Semua Perangkat**: Mendukung instalasi di HP (Android & iOS Safari) serta laptop/komputer (Chrome, Edge, Windows, Mac).
- **Tampilan Standalone (Layar Penuh)**: Berjalan mandiri tanpa bilah URL browser, memberikan pengalaman selayaknya aplikasi native.
- **Dukungan Offline**: Menggunakan Service Worker (`sw.js`) untuk menyimpan cache aset inti sehingga dapat dimainkan kapan saja meskipun tanpa koneksi internet.
- **Tombol & Banner Install**: Tersedia tombol dan banner "Pasang App" yang muncul otomatis di browser yang mendukung (Chrome/Edge/Android), lengkap dengan panduan untuk pengguna iPhone/iPad.

---

## 📁 Struktur Proyek

```text
Aniswatul Latifah/
├── api/
│   ├── config.js           # Endpoint konfigurasi publik klien (Firebase Web Config)
│   ├── generate.js         # Endpoint Serverless Gemini AI
│   └── rooms.js            # Endpoint Serverless Room Manager Balapan Online (Fallback)
├── icons/
│   ├── icon-192x192.png    # Ikon PWA 192x192
│   ├── icon-512x512.png    # Ikon PWA 512x512
│   ├── icon-apple-touch.png # Ikon Apple Touch
│   └── icon.svg            # Ikon Scalable Vector Graphics
├── levels.js               # Data 100 Level Petualangan TypePaws (Mudah -> Sulit)
├── manifest.json           # Web App Manifest PWA
├── sw.js                   # Service Worker PWA (Cache & Offline Strategy)
├── .env                    # Variabel environment lokal (API Key - diabaikan Git)
├── .env.example            # Template contoh environment
├── .gitignore              # Memastikan .env & node_modules tidak ter-upload ke Git
├── index.html              # Frontend utama TypePaws + Dark Mode, i18n, Profil, & Balapan
├── package.json            # Dependensi Node.js
├── server.js               # Backend Server Express Lokal
├── vercel.json             # Konfigurasi deployment serverless Vercel
└── README.md               # Dokumentasi lengkap proyek
```

---

## 🔑 Langkah Konfigurasi Firebase (Gratis)

Agar fitur **Akun Cloud** dan **Balapan Online Real-Time** dapat digunakan antar-perangkat di Vercel:

1. **Buka Firebase Console**:
   - Masuk ke [https://console.firebase.google.com/](https://console.firebase.google.com/) menggunakan akun Google Anda.
   - Klik **"Add project"** (Tambah proyek), beri nama misalnya `typepaws-game`, lalu selesaikan pembuatan proyek.

2. **Aktifkan Firebase Authentication**:
   - Di menu sebelah kiri, klik **Build > Authentication**.
   - Klik tab **Sign-in method**.
   - Aktifkan provider **Email/Password** (centang Enable lalu Save).
   - *(Opsional)* Aktifkan juga provider **Google** untuk login satu klik.

3. **Buat Firebase Realtime Database**:
   - Di menu sebelah kiri, klik **Build > Realtime Database**.
   - Klik **Create Database**, pilih lokasi server terdekat (misal: `Singapore` atau `United States`).
   - Pada pilihan Security Rules, pilih **"Start in test mode"** (agar dapat membaca dan menulis data permainan) lalu klik **Enable**.

4. **Dapatkan Web App Configuration**:
   - Klik ikon gerigi (⚙️) di kiri atas > pilih **Project settings**.
   - Pada tab **General**, gulir ke bawah ke bagian **"Your apps"**, lalu klik ikon Web (`</>`).
   - Beri nama aplikasi (misal `TypePaws Web`), lalu klik **Register app**.
   - Firebase akan menampilkan kode `firebaseConfig` seperti:
     ```javascript
     const firebaseConfig = {
       apiKey: "AIzaSy...",
       authDomain: "typepaws-game.firebaseapp.com",
       projectId: "typepaws-game",
       storageBucket: "typepaws-game.appspot.com",
       messagingSenderId: "1234567890",
       appId: "1:1234567890:web:abcdef...",
       databaseURL: "https://typepaws-game-default-rtdb.firebaseio.com"
     };
     ```

5. **Salin ke File `.env` Lokal**:
   Buat/perbarui file `.env` di folder proyek Anda:
   ```env
   PORT=3000
   GEMINI_API_KEY=AIzaSy...
   FIREBASE_API_KEY=AIzaSy...
   FIREBASE_AUTH_DOMAIN=typepaws-game.firebaseapp.com
   FIREBASE_PROJECT_ID=typepaws-game
   FIREBASE_STORAGE_BUCKET=typepaws-game.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=1234567890
   FIREBASE_APP_ID=1:1234567890:web:abcdef
   FIREBASE_DATABASE_URL=https://typepaws-game-default-rtdb.firebaseio.com
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

1. Push perubahan kode ke repository GitHub Anda (`git push origin main`).
2. Masuk ke dashboard proyek di [Vercel](https://vercel.com).
3. Buka menu **Settings > Environment Variables**.
4. Tambahkan variabel-variabel berikut:
   - `GEMINI_API_KEY`
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_DATABASE_URL`
5. Lakukan **Redeploy** di Vercel agar environment variable baru diterapkan. Aplikasi TypePaws Anda kini siap dimainkan secara multiplayer online di seluruh dunia! 🎉
