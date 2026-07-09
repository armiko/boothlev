# UI Design & Templates Guidelines

## 1. Design Aesthetic: Neo-Brutalism
Boothlev adopts a **Neo-Brutalism** visual identity heavily inspired by modern photobooth platforms (such as Poketo.id). This aesthetic is chosen to make the app feel bold, expressive, and fun—matching the physical photobooth experience.

### Key Characteristics:
- **Typography:** 
  - `Archivo Black` for thick, uppercase, impactful headings.
  - `JetBrains Mono` for accents or technical-looking subtexts.
  - `Inter` for highly readable body paragraphs.
- **Colors & Borders:** 
  - Thick, stark black borders (`border-3`, `border-4`).
  - Solid, offset shadow drops (`shadow-[4px_4px_0_#111111]`) instead of soft blurs.
  - Vibrant pastel-like accent colors (Pink, Yellow, Green, Indigo) contrasted with pure Black and White.
- **Micro-animations:** 
  - Interactive elements "push down" when clicked (`active:translate-y-1`, `active:shadow-none`).
  - Hover states shift elements up and left (`hover:translate-x-[2px]`, `hover:-translate-y-[2px]`).

## 2. Template System
Boothlev offers a comprehensive template system representing classic physical photobooth prints. Currently, 16 distinct templates are implemented across three primary categories.

### Category 1: PHOTOSTRIP (2R)
Vertical strips typically featuring 3 to 4 square photos.
- `strip-3`: Classic 3 vertical photos, black frame.
- `strip-4`: Classic 4 vertical photos, white frame.
- `strip-3-spaced`: 3 photos with wide vertical gaps.
- `strip-3-rounded`: 3 photos with distinct rounded corners.
- `strip-3-wavy`: 3 photos with a zigzag/wavy border effect.
- `strip-3-deco`: 3 photos with decorative classic frame edges.

### Category 2: 4X6 / 4R (Landscape/Grid)
Large formats used for collages or wide prints.
- `4r-single-h`: 1 large landscape photo.
- `4r-grid-4`: 4 photos in a 2x2 grid.
- `4r-left-large`: 1 large vertical photo on the left, 2 small on the right.
- `4r-single-v`: 1 large portrait photo.
- `4r-2-stacked`: 2 wide horizontal photos stacked vertically.

### Category 3: POLAROID
Classic polaroid-style frames, characterized by a thick bottom margin for text.
- `polaroid-sq`: 1 large square photo.
- `polaroid-h`: 1 large wide photo.
- `polaroid-wavy`: 1 square photo with a wavy inner border.
- `polaroid-deco`: 1 square photo with decorative corners.
- `polaroid-2-stacked`: 2 stacked landscape photos in a tall polaroid frame.

## 3. Template Rendering Engine
Templates are rendered dynamically in the UI (e.g., `src/app/templates/page.js`) using CSS Grid and Flexbox:
- **Shape Logic:** The `slotShape` property determines the inner `border-radius` or `border-style` to simulate real cutouts (rounded, wavy, deco).
- **CSS Grid:** Used for complex 4R layouts (like 2x2 grids, or mixed sizes where `gridRow: span 2` is applied).
- **Color Customization (Future):** The `frameColor` acts as a default preset, but the editor will allow users to customize this background color before exporting the final image.
