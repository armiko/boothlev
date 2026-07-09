# Boothlev 📸✨

Boothlev is a privacy-first, client-side only web application that brings the authentic photobooth experience directly to your browser. No app installations, no server uploads, and no hidden data collection. What happens on your device, stays on your device.

Built with **Next.js**, **Zustand**, and **TailwindCSS**.

## 🚀 Features

- 📸 **Webcam Capture** with manual/auto shutter
- 🎨 **Neo-Brutalism UI** that is vibrant, bold, and distinct
- 🧩 **Templates** with automatic resizing and layout positioning
- 🪄 **Drag-and-Drop Editor**: Rearrange photos within slots
- ✨ **Self-Hosted AI Background Removal**: Upload custom images, and the standalone `backend` will remove the background using *transformers.js* (No external API Keys needed!).
- 🖌️ **Interactive Manual Masking**: A powerful built-in mask editor allows you to manually refine the AI background removal by painting parts to keep or remove.
- 📦 **100% Static Frontend**: The `frontend` builds to raw HTML/JS/CSS (`output: "export"`).
- **Advanced Interactive Editor:**
  - **Drag & Drop:** Easily swap photo positions between slots.
  - **Pan & Zoom:** Crop and adjust your photos perfectly within their frames.
  - **Custom Frame Colors:** Change the background color dynamically with a Neo-Brutalism color palette.
  - **Interactive Stickers (Emojis):** Decorate your photobooth results with dozens of emojis. You can freely drag, resize, and delete stickers across the canvas.
  - **Custom Uploaded Stickers:** Upload any image or custom waifu as a sticker and save it to your local storage for future use!
- **High-Res Export:** Uses `html-to-image` to generate high-quality, print-ready PNG files (scaled 3x natively) that preserve all your edits, stickers, and custom fonts.
- **Auto-Save:** Accidentally refreshed the page? No problem. State is persisted in your browser so you won't lose your captured photos.

## 🛠️ Tech Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) with `persist` middleware
- **Image Editing:** `react-easy-crop`
- **Rendering:** `html-to-image`
- **Icons:** `lucide-react`

Boothlev uses a lightweight Monorepo-style architecture separated into two projects:
- **`frontend`**: The main frontend, 100% static React (Next.js) app.
- **`backend`**: The standalone Node.js Express server that handles AI processing locally.

### 1. Setup the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 2. Setup the AI Backend
```bash
cd backend
npm install
node server.js
```
The API server will run on `http://localhost:4000`.

### 3. Deploy to aaPanel (or any VPS)
- For the frontend, run `npm run build` inside `frontend`. Upload the resulting `out` folder as a standard Static HTML website.
- For the backend, setup a Node.js project for `backend` in aaPanel (via PM2) running on your desired port.
- Don't forget to point the frontend `fetch` call in `editor/page.js` to your backend's public domain.

## 🎨 Design Philosophy

Boothlev utilizes a **Neo-Brutalism** design language inspired by modern, playful web trends. It features:
- High contrast colors and thick, stark borders (`brutal-border`).
- Sharp, prominent shadows (`brutal-shadow-lg`).
- Heavy typography (using **Archivo Black** and **Inter**).
- Playful emoji integrations and overlapping elements that embrace a raw, unpolished, yet highly aesthetic feel.

---

<div align="center">
  <b>Boothlev</b> is an Open Source Project proudly brought to you by <b>PT Lembur Demi Waifu</b> 💖
</div>
