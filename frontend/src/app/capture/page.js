"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { templates } from "@/lib/templates";

function CapturePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("template");
  const template = templates.find(t => t.id === templateId) || templates[0];
  
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photos, setPhotos] = useState([]); // Base64 images
  const [countdown, setCountdown] = useState(null);
  const [isFlash, setIsFlash] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(1);
  const [sessionDone, setSessionDone] = useState(false);

  // Setup Camera
  useEffect(() => {
    async function initCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Failed to access camera", err);
        alert("Gagal mengakses kamera. Pastikan browser lo dikasih izin!");
      }
    }
    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    
    // Draw mirrored if front camera (usually preferred for preview and result)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL("image/png");
    return dataUrl;
  };

  const startSession = () => {
    takePhotoSequence(currentSlot);
  };

  const takePhotoSequence = (slotIndex) => {
    if (slotIndex > template.slots) {
      setSessionDone(true);
      return;
    }

    let count = 3;
    setCountdown(count);
    
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(timer);
        setCountdown(null);
        
        // Flash Effect
        setIsFlash(true);
        setTimeout(() => setIsFlash(false), 150);
        
        // Snap!
        const photo = capturePhoto();
        setPhotos(prev => [...prev, photo]);
        
        // Next slot after delay
        setTimeout(() => {
          setCurrentSlot(slotIndex + 1);
          takePhotoSequence(slotIndex + 1);
        }, 1500); // 1.5s delay between shots
      }
    }, 1000);
  };

  if (sessionDone) {
    return (
      <div className="min-h-[100dvh] p-6 md:p-12 flex flex-col items-center justify-center">
        <h1 className="font-archivo text-4xl uppercase mb-8">Hasil Jepretan</h1>
        <div className="flex gap-4 flex-wrap justify-center max-w-4xl mb-12">
           {photos.map((p, i) => (
             <div key={i} className="bg-white brutal-border brutal-shadow-sm p-2 w-[150px] aspect-[3/4]">
               <img src={p} alt={`Photo ${i+1}`} className="w-full h-full object-cover" />
             </div>
           ))}
        </div>
        <div className="flex gap-4">
           <Button variant="outline" onClick={() => { setPhotos([]); setCurrentSlot(1); setSessionDone(false); }}>
             <RefreshCw className="w-4 h-4 mr-2" /> Ulang Semua
           </Button>
           <Link href={`/editor?template=${template.id}`}>
             {/* Note: In real app, we should pass photos to global store (Zustand) here */}
             <Button variant="primary">
               Lanjut ke Editor <ArrowRight className="w-4 h-4 ml-2" />
             </Button>
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 relative">
       {/* Flash Overlay */}
       {isFlash && <div className="absolute inset-0 bg-white z-[999]" />}
       
       <div className="w-full max-w-3xl flex items-center justify-between mb-4">
          <Link href="/templates" className="font-archivo uppercase text-sm hover:underline">← Batal</Link>
          <div className="font-mono text-sm font-bold bg-white brutal-border px-3 py-1 brutal-shadow-sm">
            FOTO {currentSlot} / {template.slots}
          </div>
       </div>

       {/* Camera Viewfinder */}
       <div className="w-full max-w-3xl aspect-[4/3] bg-black brutal-border brutal-shadow-lg relative overflow-hidden flex items-center justify-center">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover -scale-x-100" 
          />
          
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20">
              <span className="font-archivo text-9xl text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] animate-pulse">
                {countdown}
              </span>
            </div>
          )}
       </div>

       <div className="mt-8">
         {currentSlot === 1 && photos.length === 0 && countdown === null ? (
           <Button size="lg" onClick={startSession} className="bg-danger hover:bg-red-600 text-white gap-2">
             <Camera className="w-5 h-5" /> Mulai Sesi Foto
           </Button>
         ) : (
           <p className="font-archivo text-xl animate-pulse uppercase tracking-widest text-danger">Bersiap...</p>
         )}
       </div>
    </div>
  );
}

export default function CapturePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center font-archivo text-2xl uppercase">Loading...</div>}>
      <CapturePageContent />
    </Suspense>
  );
}
