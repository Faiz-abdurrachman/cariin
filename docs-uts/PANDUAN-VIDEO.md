# PANDUAN PRODUKSI VIDEO YOUTUBE — UTS MOBILE PROGRAMMING

> Panduan lengkap dari persiapan recording sampai upload YouTube. Targetnya: video presentasi profesional 12-15 menit yang jelas dan engaging.

---

## 1. PERSIAPAN SEBELUM RECORDING

### 1.1 Hardware

| Item | Rekomendasi | Alternatif |
|------|-------------|-----------|
| Kamera | Kamera laptop (built-in) atau HP belakang | Webcam external 1080p |
| Mic | Earphone mic (HP earphone juga OK) | Lavalier mic / mic eksternal |
| Lighting | Lampu meja + cahaya jendela alami | Ring light USB |
| Background | Dinding polos / bookshelf | Blur background di Zoom/OBS |
| iPhone (untuk demo) | iPhone dengan Expo Go installed | Simulator Android |
| Laptop | Untuk slide presentasi | — |

### 1.2 Software (Free Tools)

#### Untuk Slide Presentasi
- **Canva** (https://canva.com) — ada template Pitch Deck, paling cepat & cantik. **Recommended.**
- **Google Slides** — free, kolaboratif
- **PowerPoint Online** — kalau punya akses MS 365 kampus
- **Figma Slides** — kalau lo nyaman di Figma

#### Untuk Recording
- **OBS Studio** (https://obsproject.com) — **paling powerful, free, multi-platform**. Recommended.
- **Loom** (https://loom.com) — simple, free up to 25 min/video, auto cloud.
- **QuickTime** (Mac built-in) — record screen + camera secara bersamaan
- **Zoom** — record meeting sendirian (built-in pause/resume)

#### Untuk Editing
- **CapCut Desktop** (free) — paling mudah, banyak template, transisi otomatis. **Recommended pemula.**
- **DaVinci Resolve** — pro-grade gratis tapi steep learning curve
- **Filmora** (trial 30 hari)
- **iMovie** (Mac only)

#### Untuk Mirror iPhone ke Laptop (untuk demo recording)
- **QuickTime + USB cable** (Mac) — paling stabil. Pilih iPhone sebagai camera source.
- **AirPlay ke macOS** (atau ke Apple TV → record TV)
- **Reflector App** (Windows + Mac, $14.99 one-time) — mirror via AirPlay tanpa cable.
- **LonelyScreen** (Windows free) — alternatif murah.
- **Recording langsung di iPhone** lalu transfer file (paling simpel: Control Center → Screen Recording).

### 1.3 Persiapan Slide

Kalau lo pakai Canva:
1. Cari template "Pitch Deck" atau "Presentation"
2. Pilih yang **clean monochrome** atau **tech/modern**
3. Ganti placeholder text dengan content dari `LAPORAN-UTS.md` & `SCRIPT-PRESENTASI.md`
4. Untuk Mermaid diagram (Gantt + ERD), screenshot dari https://mermaid.live, atau export PNG dari VSCode preview
5. Untuk screenshot UI, ambil dari iPhone (Power+Home), kirim ke laptop via AirDrop/Email
6. Export slides as **PDF + PNG per slide** (PNG buat embed di video editing)

**Aturan slide:**
- Maksimal **3-5 bullet point per slide** — jangan padat teks
- Font besar minimal **24pt**
- Konsisten warna sama dengan branding Cari.In (zinc-900 + emerald accent)
- 1 ide utama per slide

### 1.4 Setup Demo

**1 hari sebelum recording:**
- ✅ Cek `.env` Supabase masih valid
- ✅ Login akun `faiz@student.unu-jogja.ac.id` di Expo Go iPhone
- ✅ Pastikan 5 seed reports + 1-2 laporan baru ada di feed (untuk variasi demo)
- ✅ Hapus laporan resolved sebelumnya yang gak relevan (biar laporanku bersih)
- ✅ Pastikan internet WiFi/hotspot stabil (test ping ke supabase.co)
- ✅ Charge iPhone full
- ✅ Restart Expo: `npx expo start --clear` biar fresh

---

## 2. SAAT RECORDING

### 2.1 Setup OBS / Loom

**Profile recommendation OBS:**
- Resolution: **1920×1080 (1080p)**
- FPS: **30**
- Audio bitrate: **128 kbps**
- Sources:
  - Display Capture (untuk slide presentation)
  - Window Capture (untuk demo iPhone via QuickTime)
  - Audio Input (mic)
  - (Optional) Webcam picture-in-picture pojok kanan bawah

### 2.2 Tips Pembawaan

- **Latihan dulu 2-3 kali** dengan stopwatch — biar nyaman, tau pacing.
- **Senyum tipis** sebelum mulai — bikin suara terdengar lebih warm.
- **Bicara LEBIH PELAN** dari kamu mengira normal. Audio recording sering kedengaran terburu-buru.
- **Pause natural** antar poin — 1-2 detik. Editing nanti bisa dipotong kalau kelamaan.
- **Eye contact ke kamera**, bukan ke layar laptop bagian bawah.
- **Kalau salah ngomong** — jangan stop. Bilang "Saya ulang ya" lalu lanjut. Editing akan potong.
- **Energy level 7/10** — bukan robotic, tapi juga gak overhyped.

### 2.3 Alur Recording (recommended)

**Recommended: record per-section, baru di-merge di editing.**

1. **Record slide 1-10 first** (slide presentation) tanpa demo. Stop kalau ada salah, retake bagian itu.
2. **Record demo iPhone secara terpisah** dengan voiceover langsung.
3. **Record closing** terpisah.
4. Di editing nanti, merge semuanya.

### 2.4 Ngomongin Demo iPhone

Saat record demo, **siapkan iPhone di posisi tegak** (pakai stand) dan record mirror via QuickTime di laptop. Tunggu: Mac saja yang bisa pakai pendekatan ini.

**Alternatif Windows/Linux:**
- Record langsung di iPhone (Control Center → Screen Recording dengan mic on)
- Transfer file ke laptop via AirDrop/iCloud
- Edit voiceover di tahap editing (atau sambil record sudah ada audio)

---

## 3. EDITING

### 3.1 CapCut Quick Workflow

1. **Import** semua clip + slide PNG ke CapCut
2. **Susun timeline:** intro → slide 1 → slide 2 → ... → slide 10 → demo → closing
3. **Trim** bagian yang salah ngomong / pause kepanjangan
4. **Add transitions** subtle (Fade, Push) antar slide. Jangan over-effect.
5. **Add text overlay** untuk highlight angka/kata penting (mis. "57% selesai" di slide 6)
6. **Background music**: sangat low volume (-25 dB), pilih instrumental tech/lo-fi. CapCut Library punya banyak yang free.
7. **Captions** (optional tapi BAGUS): CapCut bisa auto-generate caption — review & koreksi typo
8. **Color grade** (optional): pilih preset "Modern" atau "Cinematic"

### 3.2 Audio Cleanup

- **Noise reduction**: di CapCut → Audio → Noise Reduction (slider ke 70-80%)
- **Volume leveling**: pastikan suara konsisten antar clip
- **Add slight fade-in/out** di awal & akhir audio biar gak abrupt

### 3.3 Export Settings

- Format: **MP4 (H.264)**
- Resolution: **1920×1080 (1080p)**
- Frame rate: **30 fps**
- Bitrate: **8-12 Mbps** (sweet spot YouTube)
- Audio: **AAC 128 kbps**

---

## 4. UPLOAD KE YOUTUBE

### 4.1 Persiapan Akun

- Buat akun YouTube kalau belum (akun Google biasa otomatis bisa).
- Verify channel (kirim SMS code) — biar bisa upload video > 15 menit.
- (Optional) Bikin channel branding: profile picture + banner.

### 4.2 Privacy Setting

| Setting | Kapan dipilih |
|---------|--------------|
| **Public** | Kalau lo nyaman semua orang lihat (tambah portfolio juga). **Recommended jika confident.** |
| **Unlisted** | Cuma yang punya link bisa nonton. Aman, tapi tidak muncul di search. **Recommended jika ragu.** |
| **Private** | Cuma lo yang bisa nonton — DOSEN GAK BISA AKSES kecuali invited via email. **JANGAN PILIH INI.** |

### 4.3 Title Template

Pilih salah satu:

```
[UTS Mobile Programming] Cari.In - Aplikasi Lost & Found Kampus | Faiz Abdurrachman UNU Yogyakarta
```

```
Cari.In Mobile - Progress UTS Mobile Programming Semester 4 (Expo + React Native + Supabase)
```

```
Aplikasi Lost & Found Kampus dengan Expo & Supabase | Cari.In - UTS Mobile Programming
```

### 4.4 Description Template

```
Halo, saya Faiz Abdurrachman, mahasiswa Mobile Programming Universitas Nahdlatul Ulama Yogyakarta.

Video ini adalah laporan progress UTS untuk mata kuliah Mobile Programming, di bawah bimbingan dosen Bapak/Ibu Yana Hendriana, ST., M.Eng.

🎯 Project: Cari.In Mobile
📱 Aplikasi mobile lost & found kampus untuk mahasiswa UNU Yogyakarta
🔧 Tech stack: Expo SDK 54, React Native, NativeWind, TypeScript, Supabase

📋 Topik yang dibahas:
0:00 - Pembukaan & Identitas
0:30 - Analisis Permasalahan
1:30 - Solusi: Cari.In
2:00 - Analisis Kebutuhan (Functional & Non-Functional)
3:30 - Survey & Studi Banding
4:30 - Timeline (Gantt Chart)
5:30 - Wireframe (Low-Fidelity)
6:30 - Desain Interface (High-Fidelity)
8:00 - Hasil Coding
9:30 - Database & ERD
10:30 - Live Demo Aplikasi
13:00 - Penutup

🔗 Repository: (link GitHub kamu)

#MobileProgramming #ReactNative #Expo #Supabase #UTS #UNUYogya #Skripsi #LostAndFound #KampusUNU
```

> **Update timestamp** di description sesuai durasi video aktual setelah editing.

### 4.5 Thumbnail

**Tools:** Canva (template "YouTube Thumbnail"), Figma, atau bahkan PowerPoint export PNG.

**Komposisi recommended:**
- **Background:** screenshot Cari.In (HomeScreen atau Detail) di-blur
- **Foreground tengah:** logo Cari.In + tagline pendek (mis. "Lost & Found Kampus")
- **Pojok atas:** badge "UTS Mobile Programming" + "Faiz UNU"
- **Resolusi:** 1280×720 px (16:9 ratio)
- **Format:** JPG atau PNG (kalau JPG, file size < 2 MB)

**Tips warna:**
- Kontras tinggi (background gelap + text terang)
- Maksimal 3 warna utama
- Font tebal & besar (kelihatan jelas di thumbnail kecil)

### 4.6 Tags

Pisah dengan koma, paste di field Tags:
```
mobile programming, react native, expo, supabase, uts, unu yogyakarta, lost and found, kampus, mobile app development, tutorial, milestone report
```

### 4.7 Visibility (Final)

- Pilih **Public** atau **Unlisted** (lihat 4.2)
- Centang "Made for kids" → **No**
- Set kategori → **Education** atau **Science & Technology**
- Klik **PUBLISH**

### 4.8 Setelah Upload

- ✅ Test play video di HP & laptop, pastikan smooth & audio jelas
- ✅ Copy URL video YouTube
- ✅ Paste URL ke laporan (LAPORAN-UTS.md section penutup) atau di slide 1 / 12
- ✅ Submit ke dosen sesuai prosedur (LMS, email, dll)

---

## 5. SUBMISSION KE DOSEN

### 5.1 Dokumen yang Disubmit

Tergantung instruksi dosen, biasanya berikut:

1. **Link video YouTube** (Public atau Unlisted)
2. **Laporan PDF** (export dari `LAPORAN-UTS.md`)
3. **Link repository GitHub** (kalau diminta)

### 5.2 Export Markdown ke PDF

**Cara 1: VSCode Extension (paling cepat)**
1. Install ekstensi **Markdown PDF** (yzane.markdown-pdf)
2. Buka `LAPORAN-UTS.md` di VSCode
3. Right-click di editor → **Markdown PDF: Export (pdf)**
4. PDF akan tersimpan di folder yang sama

**Cara 2: Online Tool**
- https://md-to-pdf.fly.dev → paste isi MD → download PDF
- https://www.markdowntopdf.com → upload file MD → download PDF

**Cara 3: Pandoc CLI** (kalau lo nyaman terminal)
```bash
pandoc docs-uts/LAPORAN-UTS.md -o LAPORAN-UTS.pdf --pdf-engine=xelatex
```

### 5.3 Email Template ke Dosen (kalau perlu)

```
Subject: Submission UTS Mobile Programming - Faiz Abdurrachman

Yth. Bapak/Ibu Yana Hendriana, ST., M.Eng.,

Saya Faiz Abdurrachman, mahasiswa Mobile Programming Semester 4.

Bersama email ini saya menyampaikan submission UTS:

1. Link video presentasi YouTube:
   [URL]

2. Laporan progress (PDF) terlampir.

3. Repository GitHub project:
   [URL]

Project saya berjudul "Cari.In Mobile" — aplikasi lost & found kampus untuk
mahasiswa UNU Yogyakarta. Status saat ini 57% (FASE 1-4 dari 7 fase total)
selesai dan sudah ter-commit di Git.

Mohon masukan dan koreksi dari Bapak/Ibu Dosen.

Terima kasih.

Hormat saya,
Faiz Abdurrachman
NIM: [ISI NIM KAMU]
Mobile Programming Semester 4
Universitas Nahdlatul Ulama Yogyakarta
```

---

## 6. CHECKLIST FINAL

Sebelum submit, pastikan semua check:

### Konten
- [ ] Laporan PDF sudah lengkap mencakup 8 lingkup yang diminta dosen
- [ ] Video presentasi sudah upload ke YouTube
- [ ] Privacy YouTube tidak Private (Unlisted minimal)
- [ ] Video berisi semua 8 lingkup (sesuai struktur slide)
- [ ] Demo aplikasi tampil jelas
- [ ] Audio video jelas dan tidak ada noise

### Teknikal
- [ ] PDF terbuka dengan benar (cek di laptop & HP)
- [ ] Repository GitHub up-to-date dengan commit terakhir
- [ ] Link YouTube bisa diakses dari incognito (tidak Private)

### Administrasi
- [ ] NIM kamu tertulis di email/laporan
- [ ] Tanggal submission sesuai deadline dosen
- [ ] Email/upload ke platform yang ditentukan dosen (LMS / Email / Drive folder)

---

## 7. TROUBLESHOOTING

| Issue | Solusi |
|-------|--------|
| Video gak bisa di-upload (lebih dari 15 menit, akun belum verify) | Verify YouTube channel via SMS code, lalu retry upload |
| File MP4 terlalu besar (>2 GB) | Re-export dengan bitrate lebih kecil, atau split jadi 2 video |
| Suara dari iPhone screen recording tidak ke-record | Saat start recording iPhone, tap-and-hold tombol record dulu, lalu turn ON Microphone |
| QuickTime tidak detect iPhone | Cabut & colok ulang USB, trust device di iPhone, restart QuickTime |
| Mermaid diagram tidak render di PDF | Screenshot dari https://mermaid.live, embed sebagai image |
| Slide tidak konsisten font/warna | Pakai 1 template Canva, jangan campur-campur |
| Audio video terlalu pelan | Boost di CapCut: Audio → Volume → +6 dB |

---

## 8. CONTOH JADWAL EXECUTION (1 minggu)

| Hari | Aktivitas |
|------|-----------|
| **H-7** | Bikin slide presentation di Canva, finalize content |
| **H-6** | Latihan presentasi 2-3 kali sambil time tracking |
| **H-5** | Setup recording (test OBS/Loom, mic, lighting) |
| **H-4** | Record slide presentation (1-10 + closing) |
| **H-3** | Record demo iPhone, transfer ke laptop |
| **H-2** | Editing di CapCut, audio cleanup, transitions |
| **H-1** | Review final, color grade, export, generate thumbnail |
| **H-day** | Upload YouTube, finalize description & tags, publish, submit ke dosen |

---

## SEMANGAT BRO! 🎬

Project lo udah solid dari sisi teknis. **Tinggal eksekusi presentasi dengan percaya diri**.

> "Engineering excellence speaks for itself — your job is to communicate it clearly."

Kalau ada pertanyaan saat produksi (misal stuck di editing atau bingung struktur slide), tinggal balik ke folder `docs-uts/` ini, atau tanya AI (mention "lihat docs-uts/PANDUAN-VIDEO.md") — semua referensi ada di sini.
