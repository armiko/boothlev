# Product Requirements Document (PRD): Boothlev

## Overview
Boothlev is a web application that brings the authentic photobooth experience to users' devices. The core editor and image rendering run fully client-side for maximum privacy and performance, while a standalone, self-hosted backend handles advanced AI tasks like background removal.

## Target Audience
Users who want a quick, easy, and privacy-friendly way to create photobooth-style collages without installing an app. Photos are kept local on the device, except when explicitly using the AI Background Removal feature which securely processes the image on a self-hosted backend.

## Features (MVP)
1. **Template Selection**
   - 18 Presets categorized into:
     - **PHOTOSTRIP:** Classic 3, Classic 4, Spaced 3, Rounded 3, Wavy 3, Deco 3
     - **4X6 / 4R:** Landscape Single, Grid 2x2, Left Focus, Triple Columns, Portrait Single, Stacked Double, Top Focus
     - **POLAROID:** Classic Square, Wide, Wavy, Deco, Double Stacked
   - Information displayed: Preview with actual shape styles (wavy, rounded, deco) and layout categories.

2. **Photo Source Selection**
   - **Upload:** Support multi-select, drag & drop, JPG, PNG, HEIC (converted on client).
   - **Camera:** Use WebRTC (`getUserMedia`) for live camera preview.

3. **Photobooth Mode (Camera)**
   - Sequential capture based on template slots.
   - Timer countdown (e.g., 3s / 5s / 10s).
   - Flash animation & shutter sound.
   - Mirror preview (results saved unmirrored to match real camera).
   - Retake last photo option.

4. **Review Mode**
   - Review all captured photos.
   - Retake specific photo or retake all.

5. **Advanced Simple Editor**
   - **Upload & Crop:** Upload new photos for empty slots. Zoom and pan using `react-easy-crop`.
   - **Drag & Drop Reordering:** Reorder photos by dragging slots using the Grip icon.
   - **Delete Photo:** Remove photos from individual slots to replace them.
   - **Custom Frame Colors:** Change frame background dynamically (Neo-Brutalism palette).
   - **Themed Stickers:** Automatic rendering of SVG-scaled emojis overlapping slots.
   - Real-time scaling preview matching print proportions.

6. **Export & Download**
   - High-fidelity export using `html-to-image`.
   - Resolution choices: 3x scaled rendering for print-ready quality.

## Non-Functional Requirements
- **Responsive:** Must be comfortable to use on mobile phones.
- **Auto Save:** Uses IndexedDB or localStorage so state is preserved if the page is accidentally refreshed.
- **High-Quality Rendering:** Preview is low-res for performance, final export is high-res (e.g., 300 DPI).
- **Design Aesthetic:** Neo-Brutalism (Inspired by Poketo.id). Features thick borders, stark contrasts, heavy use of Archivo Black font, sharp shadows, and classic photobooth styling for templates.
