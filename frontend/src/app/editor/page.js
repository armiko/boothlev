"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Download, ImagePlus, Palette, ArrowLeft, Trash2, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { templates } from "@/lib/templates";
import { useStore } from "@/store/useStore";
import MaskEditorModal from "@/components/MaskEditorModal";
import Cropper from "react-easy-crop";
import * as htmlToImage from "html-to-image";

const getContrastColor = (hex) => {
  if (!hex) return "#111111";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#111111' : '#FFFFFF';
};

function DraggableSticker({ sticker, index, scaleFactor, updateStickerPosition, onUpdateSize, onDelete }) {
  const stickerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialStickerX = sticker.x;
    const initialStickerY = sticker.y;

    const handlePointerMove = (moveEvent) => {
      const deltaX = (moveEvent.clientX - startX) / scaleFactor;
      const deltaY = (moveEvent.clientY - startY) / scaleFactor;
      updateStickerPosition(index, initialStickerX + deltaX, initialStickerY + deltaY);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div
      ref={stickerRef}
      onPointerDown={handlePointerDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute z-30 cursor-grab active:cursor-grabbing drop-shadow-md select-none touch-none leading-none ${isHovered ? 'ring-4 ring-dashed ring-blue-500 bg-white/20 rounded-lg' : ''}`}
      style={{
        left: sticker.x,
        top: sticker.y,
        fontSize: sticker.type !== 'image' ? sticker.size : undefined,
      }}
    >
      {sticker.type === 'image' ? (
        <img src={sticker.url} alt="Custom" style={{ width: sticker.size, height: 'auto', pointerEvents: 'none' }} />
      ) : (
        sticker.emoji
      )}
      
      
      {isHovered && (
        <>
          <button
            onPointerDown={(e) => {
              e.stopPropagation();
              onDelete(index);
            }}
            className="absolute -top-8 -right-8 bg-red-500 text-white rounded-full p-3 z-40 brutal-border hover:bg-red-600 scale-100"
            title="Hapus Stiker"
          >
            <Trash2 className="w-8 h-8" />
          </button>
          
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center bg-white brutal-border rounded-full p-2 z-40 scale-100 text-4xl">
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                onUpdateSize(index, Math.max(50, sticker.size - 20));
              }}
              className="w-14 h-14 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 font-black"
            >
              -
            </button>
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                onUpdateSize(index, Math.min(600, sticker.size + 20));
              }}
              className="w-14 h-14 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 font-black ml-2"
            >
              +
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function SlotEditor({ index, image, shape, onUpload, onDelete, onSwap }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragReady, setIsDragReady] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        onUpload(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-gray-200 flex items-center justify-center overflow-hidden group"
      draggable={isDragReady}
      onDragStart={(e) => {
        e.dataTransfer.setData("slotIndex", index);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => {
        e.preventDefault();
        const srcIndex = e.dataTransfer.getData("slotIndex");
        if (srcIndex && srcIndex !== index.toString()) {
          onSwap(parseInt(srcIndex), index);
        }
        setIsDragReady(false);
      }}
      onDragEnd={() => setIsDragReady(false)}
      style={{
        borderRadius: shape === 'rounded' ? '24px' : shape === 'deco' ? '0px 40px 0px 40px' : '0px',
        border: shape === 'wavy' ? '4px dashed rgba(0,0,0,0.2)' : 'none',
      }}
    >
      {image ? (
        <>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={undefined} // Free aspect, fills container
            onCropChange={setCrop}
            onZoomChange={setZoom}
            showGrid={false}
            style={{
              containerStyle: { width: '100%', height: '100%', backgroundColor: 'transparent' },
              cropAreaStyle: { border: 'none', boxShadow: 'none' }
            }}
          />
          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-red-500 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all brutal-border shadow-md"
            title="Hapus Foto"
          >
            <Trash2 className="w-6 h-6" />
          </button>
          
          {/* Drag Handle */}
          <div 
            onMouseDown={() => setIsDragReady(true)}
            onMouseUp={() => setIsDragReady(false)}
            onMouseLeave={() => setIsDragReady(false)}
            className="absolute top-4 left-4 z-50 bg-black/60 hover:bg-blue-500 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-all brutal-border shadow-md"
            title="Tahan untuk menukar posisi foto"
          >
            <GripHorizontal className="w-6 h-6" />
          </div>
        </>
      ) : (
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors z-10"
        >
          <ImagePlus className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-xs font-bold uppercase tracking-wider opacity-70">Klik Upload</span>
        </button>
      )}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
    </div>
  );
}

function EditorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const template = templates.find((t) => t.id === templateId);

  const globalPhotos = useStore((state) => state.photos);
  const replacePhoto = useStore((state) => state.replacePhoto);
  
  const [photos, setPhotos] = useState([]);
  const bgColor = useStore((state) => state.bgColor);
  const setBgColor = useStore((state) => state.setBgColor);
  const stickers = useStore((state) => state.stickers);
  const setStickers = useStore((state) => state.setStickers);
  const [customEmoji, setCustomEmoji] = useState("");
  const [isMaskEditorOpen, setIsMaskEditorOpen] = useState(false);
  const [maskEditorData, setMaskEditorData] = useState({ originalUrl: "", maskUrl: "" });
  const [isExporting, setIsExporting] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(0.4);
  const [loadingStatus, setLoadingStatus] = useState(null);
  
  const templateRef = useRef(null);
  const containerRef = useRef(null);
  const customImageInputRef = useRef(null);

  useEffect(() => {
    if (!template) return;
    
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 32; // 32px padding
        const containerHeight = containerRef.current.clientHeight - 32;
        
        const scaleX = containerWidth / template.width;
        const scaleY = containerHeight / template.height;
        
        setScaleFactor(Math.min(scaleX, scaleY, 1)); // Don't scale up beyond 1
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [template]);



  useEffect(() => {
    if (!template) {
      router.push("/templates");
      return;
    }
    // Initialize photos array to match template slots
    const initialPhotos = Array.from({ length: template.slots }).map((_, i) => globalPhotos[i] || null);
    setPhotos(initialPhotos);
    setBgColor(template.frameColor);
    setStickers(template.stickers ? [...template.stickers] : []);
  }, [template, globalPhotos, router]);

  const handleUpload = (index, dataUrl) => {
    const newPhotos = [...photos];
    newPhotos[index] = dataUrl;
    setPhotos(newPhotos);
  };

  const handleDelete = (index) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const handleSwap = (indexA, indexB) => {
    const newPhotos = [...photos];
    const temp = newPhotos[indexA];
    newPhotos[indexA] = newPhotos[indexB];
    newPhotos[indexB] = temp;
    setPhotos(newPhotos);
  };

  const updateStickerPosition = (index, newX, newY) => {
    setStickers((prev) => {
      const newStickers = [...prev];
      newStickers[index] = { ...newStickers[index], x: newX, y: newY };
      return newStickers;
    });
  };

  const updateStickerSize = (index, newSize) => {
    setStickers((prev) => {
      const newStickers = [...prev];
      newStickers[index] = { ...newStickers[index], size: newSize };
      return newStickers;
    });
  };

  const handleDeleteSticker = (index) => {
    setStickers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSticker = (emojiStr) => {
    if (!emojiStr.trim()) return;
    setStickers((prev) => [
      ...prev,
      {
        type: 'text',
        emoji: emojiStr,
        x: (template.width / 2) - 75,
        y: (template.height / 2) - 75,
        size: 150,
      }
    ]);
  };

  const handleResetStickers = () => {
    setStickers(template.stickers ? [...template.stickers] : []);
  };

  const handleCustomStickerUpload = async (e) => {
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
  };

  const handleExport = async () => {
    if (!templateRef.current) return;
    
    // Check if all slots are filled
    if (photos.some(p => p === null)) {
      alert("Harap isi semua slot foto sebelum download!");
      return;
    }

    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(templateRef.current, {
        pixelRatio: 3, // High-res for print quality
      });

      const link = document.createElement("a");
      link.download = `boothlev-${template.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Gagal mengunduh foto.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!template) return null;

  return (
    <div className="min-h-[100dvh] bg-gray-100 flex flex-col md:flex-row relative">
      {/* Loading Overlay for AI */}
      {loadingStatus && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex flex-col items-center justify-center text-white backdrop-blur-sm">
          <div className="w-12 h-12 mb-4 border-4 border-white border-t-accent rounded-full animate-spin"></div>
          <h2 className="font-archivo text-2xl uppercase mb-2">Memproses AI...</h2>
          <p className="font-bold uppercase tracking-widest text-sm opacity-80">{loadingStatus}</p>
          <p className="text-xs opacity-50 mt-4 max-w-xs text-center">Tergantung kecepatan internet dan performa server backend.</p>
        </div>
      )}

      {/* Sidebar Controls */}
      <div className="w-full md:w-80 bg-white brutal-border-r p-6 flex flex-col z-20 brutal-shadow-lg md:h-[100dvh] overflow-y-auto">
        <nav className="mb-8">
          <Link href="/templates" className="inline-flex items-center font-archivo text-xl hover:underline decoration-4">
            <ArrowLeft className="mr-2" />
            KEMBALI
          </Link>
        </nav>
        
        <h1 className="font-archivo text-3xl uppercase tracking-tighter mb-2">Editor</h1>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-8">
          {template.name}
        </p>

        <div className="mb-8">
          <label className="flex items-center font-black uppercase text-sm mb-3">
            <Palette className="w-4 h-4 mr-2" /> Warna Frame
          </label>
          <div className="flex flex-wrap gap-2">
            {["#111111", "#FFFFFF", "#F9A8D4", "#FCD34D", "#86EFAC", "#93C5FD", "#C4B5FD"].map((color) => (
              <button
                key={color}
                onClick={() => setBgColor(color)}
                className={`w-10 h-10 rounded-full brutal-border transition-transform active:scale-90 ${bgColor === color ? 'ring-4 ring-black ring-offset-2' : ''}`}
                style={{ backgroundColor: color }}
              />
            ))}
            <input 
              type="color" 
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-10 rounded-full cursor-pointer opacity-0 absolute pointer-events-none" 
              id="colorPicker"
            />
            <label 
              htmlFor="colorPicker" 
              className="w-10 h-10 rounded-full brutal-border bg-[conic-gradient(red,yellow,green,blue,magenta,red)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
            >
            </label>
          </div>
        </div>

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


        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="font-black uppercase text-sm">
              ✨ Tambahkan Stiker
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="file" 
                accept="image/*"
                ref={customImageInputRef}
                onChange={handleCustomStickerUpload}
                className="hidden"
              />
              <button 
                onClick={handleResetStickers}
                className="text-xs font-bold text-red-500 hover:underline uppercase"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 scrollbar-hide">
            {[
              "✨", "🔥", "🎀", "🍒", "⭐", "🎸", "🕹️", "🌈",
              "⚡", "🎈", "🧸", "🌸", "👑", "💎", "🦋", "🍄",
              "🍔", "🍟", "🥤", "🍕", "😎", "👾", "🛹", "🎬",
              "📻", "📼", "💿", "💖", "💯", "🧨", "🚀", "🪐",
              "💅", "💄", "💋", "🍿", "🎟️", "🎥", "🥂", "🏆"
            ].map((emoji, idx) => (
              <button
                key={`${emoji}-${idx}`}
                onClick={() => handleAddSticker(emoji)}
                className="aspect-square rounded-md brutal-border bg-gray-50 flex items-center justify-center text-xl hover:bg-yellow-200 transition-colors active:scale-90"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-auto">
          <p className="text-xs font-bold text-gray-500 mb-2">TIPS:</p>
          <ul className="text-sm list-disc pl-4 space-y-2 opacity-80">
            <li>Klik slot kosong untuk upload foto.</li>
            <li>Geser (drag) foto untuk mengatur posisi.</li>
            <li>Gunakan scroll / cubit untuk memperbesar (zoom).</li>
          </ul>
        </div>

        <div className="mt-8">
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="w-full h-16 bg-accent text-white hover:bg-black text-xl"
          >
            {isExporting ? "RENDERING..." : (
              <>
                <Download className="mr-2" /> DOWNLOAD
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 md:p-8 bg-[url('/checkers.svg')] bg-repeat relative overflow-hidden"
      >
        {/* Wrapper to maintain scaled layout space and prevent overflow */}
        <div 
          className="relative shadow-2xl transition-all duration-300"
          style={{
             width: template.width * scaleFactor,
             height: template.height * scaleFactor,
          }}
        >
          {/* The actual scaled DOM element */}
          <div 
            style={{
               width: template.width,
               height: template.height,
               transform: `scale(${scaleFactor})`,
               transformOrigin: 'top left'
            }}
            className="absolute top-0 left-0"
          >
            {/* This is the actual DOM element that html-to-image will capture */}
            <div 
              ref={templateRef}
              className="w-full h-full relative overflow-hidden flex flex-col items-center bg-white"
              style={{ backgroundColor: bgColor }}
            >
               {/* Dynamic Layout Slots */}
               <div className="absolute inset-0 w-full h-full">
                  {template.layout.map((slot, i) => (
                    <div 
                      key={i}
                      className="absolute"
                      style={{
                        left: slot.x,
                        top: slot.y,
                        width: slot.w,
                        height: slot.h,
                      }}
                    >
                      <SlotEditor 
                        index={i}
                        image={photos[i]} 
                        shape={template.slotShape}
                        onUpload={(dataUrl) => handleUpload(i, dataUrl)}
                        onDelete={() => handleDelete(i)}
                        onSwap={handleSwap}
                      />
                    </div>
                  ))}
               </div>

               {/* Decorative Stickers */}
               {stickers.map((sticker, i) => (
                 <DraggableSticker 
                   key={`sticker-${i}`}
                   index={i}
                   sticker={sticker}
                   scaleFactor={scaleFactor}
                   updateStickerPosition={updateStickerPosition}
                   onUpdateSize={updateStickerSize}
                   onDelete={handleDeleteSticker}
                 />
               ))}

               {/* Footer Text */}
               <div 
                 className="absolute bottom-8 w-full text-center font-inter tracking-widest z-10 flex flex-col items-center justify-center"
                 style={{ color: getContrastColor(bgColor) }}
               >
                 <span className="font-archivo text-[50px] uppercase font-bold leading-none">BOOTHLEV</span>
                 <span className="text-sm font-bold mt-1">booth.ktik.me</span>
               </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Mask Editor Modal */}
      <MaskEditorModal 
        isOpen={isMaskEditorOpen} 
        onClose={() => setIsMaskEditorOpen(false)} 
        onApply={handleApplyMask} 
        originalImageUrl={maskEditorData.originalUrl} 
        maskImageUrl={maskEditorData.maskUrl} 
      />
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-gray-100 flex items-center justify-center font-archivo text-2xl uppercase">Loading...</div>}>
      <EditorPageContent />
    </Suspense>
  );
}
