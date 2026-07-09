import fs from 'fs';

let content = fs.readFileSync('src/app/editor/page.js', 'utf8');

// 1. Add MaskEditorModal import
if (!content.includes('MaskEditorModal')) {
  content = content.replace(
    'import { useStore } from "@/store/useStore";',
    'import { useStore } from "@/store/useStore";\nimport MaskEditorModal from "@/components/MaskEditorModal";'
  );
}

// 2. Replace useState for bgColor and stickers
content = content.replace(
  /const \[bgColor, setBgColor\] = useState\([^)]*\);/,
  'const bgColor = useStore((state) => state.bgColor);\n  const setBgColor = useStore((state) => state.setBgColor);'
);
content = content.replace(
  /const \[stickers, setStickers\] = useState\([^)]*\);/,
  'const stickers = useStore((state) => state.stickers);\n  const setStickers = useStore((state) => state.setStickers);'
);

// 3. Add state for MaskEditorModal
if (!content.includes('isMaskEditorOpen')) {
  content = content.replace(
    /const \[customEmoji, setCustomEmoji\] = useState\([^)]*\);/,
    `const [customEmoji, setCustomEmoji] = useState("");
  const [isMaskEditorOpen, setIsMaskEditorOpen] = useState(false);
  const [maskEditorData, setMaskEditorData] = useState({ originalUrl: "", maskUrl: "" });`
  );
}

// 4. Update handleCustomStickerUpload
const oldUploadFnRegex = /const handleCustomStickerUpload = async \(e\) => \{[\s\S]*?finally \{\s*setLoadingStatus\(null\);\s*\}\s*\};/;
const newUploadFn = `const handleCustomStickerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create local object URL for the original image
    const originalUrl = URL.createObjectURL(file);
    
    e.target.value = '';

    setLoadingStatus('Mengirim foto ke Server AI...');
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:4000/api/remove-bg', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Gagal diproses oleh server AI.');
      }

      setLoadingStatus('Memuat hasil...');
      const blob = await response.blob();
      const maskUrl = URL.createObjectURL(blob);

      // Open the mask editor
      setMaskEditorData({ originalUrl, maskUrl });
      setIsMaskEditorOpen(true);
      
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      setLoadingStatus(null);
    }
  };
  
  const handleApplyMask = (editedDataUrl) => {
    setStickers((prev) => [
      ...prev,
      {
        type: 'image',
        url: editedDataUrl,
        x: (template.width / 2) - 100,
        y: (template.height / 2) - 100,
        size: 200, 
      }
    ]);
    setIsMaskEditorOpen(false);
    
    // Cleanup blob URLs to free memory
    URL.revokeObjectURL(maskEditorData.originalUrl);
    URL.revokeObjectURL(maskEditorData.maskUrl);
    setMaskEditorData({ originalUrl: "", maskUrl: "" });
  };`;
content = content.replace(oldUploadFnRegex, newUploadFn);

// 5. Restructure UI: Move "Upload Stiker" below "Warna Frame"
const colorSectionRegex = /(<div className="mb-8">\s*<label className="flex items-center font-black uppercase text-sm mb-3">[\s\S]*?<\/div>\s*<\/div>)/;

const newStickerSection = `
        <div className="mb-8">
          <label className="flex items-center font-black uppercase text-sm mb-3">
            <ImagePlus className="w-4 h-4 mr-2" /> Upload Stiker AI
          </label>
          <p className="text-xs text-gray-500 mb-3 font-medium">Unggah foto (contoh: waifumu, logomu) dan AI akan otomatis menghapus latar belakangnya. Kamu juga bisa mengedit hasil potongannya!</p>
          <button 
            onClick={() => customImageInputRef.current?.click()}
            className="w-full bg-blue-100 border-2 border-blue-500 text-blue-700 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-200 transition-colors brutal-border active:scale-95"
          >
            <ImagePlus className="w-5 h-5" />
            UNGGAH FOTO KE AI
          </button>
        </div>
`;

// Insert the newStickerSection after color section
content = content.replace(colorSectionRegex, `$1\n${newStickerSection}`);

// Remove the old "Upload AI" button from the sticker emoji grid header
const oldStickerHeaderRegex = /<div className="flex items-center gap-3">\s*<button\s*onClick=\{[^}]+\}\s*className="text-xs font-bold text-accent hover:underline uppercase flex items-center gap-1"\s*title="Upload foto waifumu buat dihapus backgroundnya pake AI!"\s*>\s*<ImagePlus className="w-3 h-3" \/> Upload AI\s*<\/button>\s*<input\s*type="file"\s*accept="image\/\*"\s*ref=\{customImageInputRef\}\s*onChange=\{handleCustomStickerUpload\}\s*className="hidden"\s*\/>\s*<button/;

content = content.replace(oldStickerHeaderRegex, `<div className="flex items-center gap-3">
              <input 
                type="file" 
                accept="image/*"
                ref={customImageInputRef}
                onChange={handleCustomStickerUpload}
                className="hidden"
              />
              <button`);


// 6. Inject the MaskEditorModal near the bottom
content = content.replace('</Suspense>', '</Suspense>\n      <MaskEditorModal isOpen={isMaskEditorOpen} onClose={() => setIsMaskEditorOpen(false)} onApply={handleApplyMask} originalImageUrl={maskEditorData.originalUrl} maskImageUrl={maskEditorData.maskUrl} />');

fs.writeFileSync('src/app/editor/page.js', content);
console.log('Patched editor/page.js');
