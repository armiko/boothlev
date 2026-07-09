import { useState, useRef, useEffect } from 'react';
import { X, Eraser, PenTool, Check } from 'lucide-react';

export default function MaskEditorModal({ isOpen, onClose, onApply, originalImageUrl, maskImageUrl }) {
  const [brushSize, setBrushSize] = useState(20);
  const [mode, setMode] = useState('erase'); // 'erase' or 'restore'
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Create offscreen canvases to hold the images
  const originalImgRef = useRef(null);
  const maskImgRef = useRef(null);
  const maskCanvasRef = useRef(null); // This holds the current alpha mask (grayscale)
  
  useEffect(() => {
    if (!isOpen) return;
    
    // Load images
    const loadImages = async () => {
      const origImg = new Image();
      origImg.crossOrigin = "Anonymous";
      origImg.src = originalImageUrl;
      
      const maskImg = new Image();
      maskImg.crossOrigin = "Anonymous";
      maskImg.src = maskImageUrl;
      
      await Promise.all([
        new Promise(res => { origImg.onload = res; }),
        new Promise(res => { maskImg.onload = res; })
      ]);
      
      originalImgRef.current = origImg;
      maskImgRef.current = maskImg;
      
      // Initialize mask canvas
      const canvas = document.createElement('canvas');
      canvas.width = origImg.width;
      canvas.height = origImg.height;
      const ctx = canvas.getContext('2d');
      
      // Draw the mask image (the transparent PNG from AI)
      ctx.drawImage(maskImg, 0, 0);
      maskCanvasRef.current = canvas;
      
      renderMainCanvas();
    };
    
    loadImages();
  }, [isOpen, originalImageUrl, maskImageUrl]);
  
  const renderMainCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImgRef.current || !maskCanvasRef.current) return;
    
    const origImg = originalImgRef.current;
    
    // Adjust canvas size to fit container but keep aspect ratio
    const container = containerRef.current;
    const maxWidth = container.clientWidth - 40;
    const maxHeight = container.clientHeight - 40;
    
    const scale = Math.min(maxWidth / origImg.width, maxHeight / origImg.height);
    const displayWidth = origImg.width * scale;
    const displayHeight = origImg.height * scale;
    
    canvas.width = origImg.width;
    canvas.height = origImg.height;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the current state by compositing original image with the mask canvas
    // First, draw the mask canvas
    ctx.drawImage(maskCanvasRef.current, 0, 0);
    
    // Then, use source-in to only keep the pixels of the original image that overlap with the mask
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(origImg, 0, 0);
    
    // Reset
    ctx.globalCompositeOperation = 'source-over';
  };
  
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };
  
  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    draw(e);
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (maskCtx) {
      maskCtx.beginPath(); // Reset path
    }
  };
  
  const draw = (e) => {
    if (!isDrawing || !maskCanvasRef.current) return;
    e.preventDefault();
    
    const { x, y } = getCoordinates(e);
    const maskCtx = maskCanvasRef.current.getContext('2d');
    
    maskCtx.lineWidth = brushSize;
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    
    if (mode === 'erase') {
      maskCtx.globalCompositeOperation = 'destination-out';
      maskCtx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      maskCtx.globalCompositeOperation = 'source-over';
      // To restore, we draw fully opaque white, which will reveal the original image
      maskCtx.strokeStyle = 'white';
    }
    
    maskCtx.lineTo(x, y);
    maskCtx.stroke();
    maskCtx.beginPath();
    maskCtx.moveTo(x, y);
    
    renderMainCanvas();
  };
  
  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // We already have the composited image on the main canvas!
    const dataUrl = canvas.toDataURL('image/png');
    onApply(dataUrl);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black">
        <h2 className="text-white font-bold text-lg">Edit Mask (Hapus/Kembalikan)</h2>
        <button onClick={onClose} className="text-white/70 hover:text-white p-2 bg-zinc-800 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-zinc-900 border-b border-white/10">
        <div className="flex bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setMode('erase')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${mode === 'erase' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Eraser className="w-5 h-5" /> Hapus (Erase)
          </button>
          <button
            onClick={() => setMode('restore')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${mode === 'restore' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <PenTool className="w-5 h-5" /> Kembalikan (Restore)
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-white flex-1 w-full sm:w-auto px-4">
          <span className="text-sm text-gray-400 whitespace-nowrap">Ukuran Brush:</span>
          <input
            type="range"
            min="5"
            max="150"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="flex-1 accent-blue-500 min-w-[100px]"
          />
          <span className="text-sm font-mono w-10 text-right">{brushSize}px</span>
        </div>
        
        <button 
          onClick={handleApply}
          className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Check className="w-5 h-5" /> Terapkan
        </button>
      </div>
      
      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 relative flex items-center justify-center p-4 overflow-hidden bg-[#1a1a1a]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #2a2a2a 25%, transparent 25%, transparent 75%, #2a2a2a 75%, #2a2a2a), repeating-linear-gradient(45deg, #2a2a2a 25%, #1a1a1a 25%, #1a1a1a 75%, #2a2a2a 75%, #2a2a2a)',
          backgroundPosition: '0 0, 10px 10px',
          backgroundSize: '20px 20px'
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          className="cursor-crosshair border border-white/20 shadow-2xl rounded"
          style={{ touchAction: 'none' }} // Prevent scrolling while drawing
        />
      </div>
    </div>
  );
}
