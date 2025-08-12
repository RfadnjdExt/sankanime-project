# Sankanime - Platform Streaming Anime Gratis

<p align="center">
  <img src="https://cdn.sankavolereii.my.id/planan!me.png" alt="Sankanime Logo" width="150"/>
</p>

<p align="center">
  Sebuah antarmuka web modern yang dibangun dengan React untuk streaming anime, menampilkan pengalaman pengguna yang cepat, responsif, dan kaya fitur.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/lisensi-MIT-blue.svg" alt="Lisensi MIT">
  <img src="https://img.shields.io/badge/React-18.x-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/Vite-5.x-yellowgreen?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-blueviolet?logo=tailwind-css" alt="Tailwind CSS">
</p>

---

![Tangkapan Layar Halaman Utama Sankanime](https://cdn.sankavolereii.my.id/homepage.webp)

## ✨ Fitur Utama

- **Streaming Video Canggih**: Menggunakan **Artplayer.js** untuk pengalaman pemutaran yang mulus dengan dukungan _subtitle_, kontrol kualitas, dan pintasan keyboard.
- **Antarmuka Pengguna Modern**: Dibangun dengan **React** dan **Vite** untuk performa yang cepat dan pengalaman pengembangan yang modern.
- **Desain Responsif**: Didesain dengan **Tailwind CSS** agar terlihat bagus di semua perangkat, dari desktop hingga seluler.
- **Pencarian Cerdas**: Fitur pencarian dengan saran _real-time_ saat pengguna mengetik.
- **Autentikasi Firebase**: Integrasi dengan **Firebase Authentication** untuk login pengguna (termasuk Google Sign-In).
- **Riwayat Tontonan**: Melacak progres tontonan pengguna dan menyimpannya di **Firestore** jika pengguna login, serta di `localStorage` untuk tamu.
- **Carousel Interaktif**: Menggunakan **Swiper.js** untuk menampilkan _spotlight_ dan anime yang sedang tren dengan cara yang menarik.
- **Dukungan Multi-Bahasa**: Konteks bahasa (EN/JP) untuk judul dan deskripsi.
- **Caching Sisi Klien**: Menyimpan data API di `localStorage` untuk mengurangi waktu muat dan penggunaan data.

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Backend & DB**: Firebase (Authentication & Firestore)
- **Pemutar Video**: Artplayer.js
- **Slider/Carousel**: Swiper.js

## 📂 Struktur Proyek

Proyek ini mengikuti struktur standar aplikasi React modern untuk memastikan kode yang bersih dan mudah dikelola.

```bash
/
├── public/                   # Aset statis
├── src/
│   ├── api/                  # Logika pengambilan data dari API & Firebase
│   ├── assets/               # Gambar, font, dll.
│   ├── components/           # Komponen UI yang dapat digunakan kembali
│   │   ├── Carousel/
│   │   └── Player/
│   ├── context/              # React Context untuk state management
│   ├── hooks/                # Custom hooks
│   └── pages/                # Komponen untuk setiap halaman/rute
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Memulai

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

**1. Clone Repositori**

```bash
git clone https://github.com/username/sankanime-project.git
cd sankanime-project
```

**2. Instal Dependensi**

```bash
npm install
```

**3. Konfigurasi Environment Variables**

Buat file `.env` di root proyek dan isi dengan konfigurasi Firebase Anda. Anda bisa menyalin dari `.env.example` jika ada.

```env
# URL base dari API anime
VITE_API_BASE_URL="https://www.sankavollerei.com/sankanime/api"

# Konfigurasi Firebase
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="project-id"
VITE_FIREBASE_STORAGE_BUCKET="project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:12345:web:abcd"
```

**4. Jalankan Server Pengembangan**

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` (atau port lain yang tersedia).

## 📜 Skrip yang Tersedia

- `npm run dev`: Menjalankan aplikasi dalam mode pengembangan.
- `npm run build`: Mem-build aplikasi untuk produksi ke folder `dist`.
- `npm run preview`: Menjalankan aplikasi yang sudah di-build secara lokal.

## 🤝 Kontribusi

Kontribusi sangat kami hargai! Jika Anda ingin berkontribusi, silakan _fork_ repositori ini dan buat _pull request_ dengan perubahan Anda.

1.  Fork repositori ini.
2.  Buat branch baru (`git checkout -b fitur/nama-fitur`).
3.  Lakukan perubahan dan commit (`git commit -m 'Menambahkan fitur X'`).
4.  Push ke branch Anda (`git push origin fitur/nama-fitur`).
5.  Buka _Pull Request_.

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk detailnya.

---

## ⚠️ Penafian (Disclaimer)

Proyek ini dibuat untuk tujuan **pendidikan dan portofolio semata**.

- **Sankanime tidak menghosting file media apa pun di servernya.**
- Semua konten video diambil dari layanan pihak ketiga yang tersedia secara publik di internet.
- Proyek ini hanya berfungsi sebagai antarmuka (frontend) untuk mengakses dan menampilkan konten tersebut dengan cara yang ramah pengguna.
- Pengguna bertanggung jawab penuh atas penggunaan aplikasi ini. Pengembang tidak bertanggung jawab atas pelanggaran hak cipta apa pun.
