# Architecture & Directory Structure

## Arsitektur Utama
Aplikasi ini dirancang sebagai **Single Page Application (SPA)** yang sepenuhnya berjalan di sisi klien (Client-Side Rendering/Processing). Tidak ada backend untuk pemrosesan foto, memastikan privasi pengguna (foto tidak pernah diunggah).

## 3. Technology Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, neo-brutalism design language
- **State Management**: Zustand
- **Exporting**: `html-to-image` (Canvas-based rendering)
- **Deployment**: Static Export (`output: "export"`) optimized for Nginx/Vercel
- **AI Backend API**: Node.js + Express + `transformers.js` (Standalone at `boothlev-api`)

## Struktur Folder yang Disarankan

```text
boothlev-web/
│
├── app/                  # (Atau src/ jika menggunakan Vite murni)
├── components/           # Komponen UI Reusable (Button, Modal, CameraView)
│
├── templates/            # Konfigurasi JSON & Asset (Frame Overlay) per template
│   ├── korean-white/
│   ├── film-strip/
│   └── vintage/
│
├── lib/                  # Utilitas inti aplikasi
│   ├── camera/           # Wrapper WebRTC & logika Timer/Flash
│   ├── renderer/         # Logika HTML5 Canvas untuk export High-Res
│   ├── export/           # Fungsi download PNG/JPG
│   └── template-loader/  # Parser konfigurasi template
│
└── public/               # Static assets (suara shutter, icon dasar)
```

1. **Camera Feed:** Menggunakan `navigator.mediaDevices.getUserMedia()` terintegrasi di halaman `/booth`.
2. **Editor & Preview:** Menggunakan DOM + CSS Scale dinamis untuk preview cepat. Fitur Drag-and-Drop native HTML5 digunakan untuk swap posisi foto antar slot.
3. **Stickers & Decor:** SVG Text Overlay digunakan untuk memastikan resolusi emoji tetap tajam (vector) dan ter-skala dengan baik, baik di tampilan editor maupun hasil akhir cetak.
4. **Auto Save:** Menyimpan Base64/DataURL foto ke dalam `localStorage` via Zustand middleware sehingga tidak hilang saat reload. Export ditangani client-side sepenuhnya via library `html-to-image` lalu otomatis di-download.

## Deployment & Version Control

- **GitHub Repository:** `https://github.com/armiko/boothlev.git`
- **Scope:** Hanya folder `boothlev-web/` (yang berisi source code aplikasi Next.js) yang di-push dan di-track di dalam repository ini. Folder root yang berisi dokumen spesifikasi (seperti `docs/`) bersifat lokal dan digunakan sebagai referensi internal (seperti PRD dan Architecture notes).
