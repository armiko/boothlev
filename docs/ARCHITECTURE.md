# Architecture & Directory Structure

## Arsitektur Utama
Aplikasi ini pada dasarnya dirancang sebagai **Frontend (Next.js)** yang meng-handle UI dan editor gambar di sisi klien untuk privasi maksimal, ditambah dengan **AI Backend (Node.js)** terpisah untuk memproses penghapusan latar belakang gambar menggunakan Machine Learning secara on-premise/self-hosted.

## Technology Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, neo-brutalism design language
- **State Management**: Zustand
- **Exporting**: `html-to-image` (Canvas-based rendering)
- **Deployment**: Static Export (`output: "export"`) optimized for Nginx/Vercel
- **AI Backend API**: Node.js + Express + `transformers.js` (Standalone at `backend`)

1. **Camera Feed:** Menggunakan `navigator.mediaDevices.getUserMedia()` terintegrasi di halaman `/booth`.
2. **Editor & Preview:** Menggunakan DOM + CSS Scale dinamis untuk preview cepat. Fitur Drag-and-Drop native HTML5 digunakan untuk swap posisi foto antar slot.
3. **Stickers & Decor:** SVG Text Overlay digunakan untuk memastikan resolusi emoji tetap tajam (vector) dan ter-skala dengan baik, baik di tampilan editor maupun hasil akhir cetak.
4. **Auto Save:** Menyimpan Base64/DataURL foto ke dalam `localStorage` via Zustand middleware sehingga tidak hilang saat reload. Export ditangani client-side sepenuhnya via library `html-to-image` lalu otomatis di-download.