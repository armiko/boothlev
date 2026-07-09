"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Camera, RefreshCw, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { templates } from "@/lib/templates";
import { useStore } from "@/store/useStore";

function BoothPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const template = templates.find((t) => t.id === templateId);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("CAMERA"); // 'CAMERA' | 'REVIEW'
  const [countdown, setCountdown] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);
  
  // Local state before saving to global store
  const [localPhotos, setLocalPhotos] = useState([]);
  const setGlobalPhotos = useStore((state) => state.setPhotos);

  useEffect(() => {
    if (!template) {
      router.push("/templates");
      return;
    }

    startCamera();
    return () => stopCamera();
  }, [template, router]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setHasPermission(true);
    } catch (err) {
      setError("Gagal mengakses kamera. Pastikan kamu sudah memberikan izin.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const startSequence = () => {
    if (localPhotos.length >= template.slots) return;
    runCountdown();
  };

  const runCountdown = () => {
    let count = 3;
    setCountdown(count);
    
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        takePhoto();
      }
    }, 1000);
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    // Flash effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas to video actual dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    
    // If it's a front camera, we should probably un-mirror the saved image since the video preview is mirrored via CSS.
    // To match reality, we flip horizontally when drawing to canvas.
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    
    setLocalPhotos((prev) => {
      const updated = [...prev, dataUrl];
      
      if (updated.length < template.slots) {
        // Wait 1.5s then start next photo
        setTimeout(() => runCountdown(), 1500);
      } else {
        // All photos taken, go to review
        setTimeout(() => setMode("REVIEW"), 1000);
      }
      return updated;
    });
  };

  const retakeAll = () => {
    setLocalPhotos([]);
    setMode("CAMERA");
  };

  const proceedToEditor = () => {
    setGlobalPhotos(localPhotos);
    stopCamera();
    router.push(`/editor?template=${templateId}`);
  };

  if (!template) return null;

  return (
    <div className="min-h-[100dvh] bg-gray-100 p-4 md:p-8 flex flex-col">
      <nav className="mb-6 flex justify-between items-center">
        <Link href="/templates" className="font-archivo text-xl hover:underline decoration-4">
          ← Kembali
        </Link>
        <div className="font-archivo text-xl uppercase tracking-tighter">
          BOOTHLEV
        </div>
      </nav>

      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-red-200 border-4 border-black p-6 shadow-[8px_8px_0_#111111] max-w-md text-center">
            <h2 className="font-archivo text-2xl mb-4">KAMERA DITOLAK</h2>
            <p className="font-medium text-red-900 mb-6">{error}</p>
            <Button onClick={startCamera} className="w-full">COBA LAGI</Button>
          </div>
        </div>
      ) : mode === "CAMERA" ? (
        <div className="flex-1 flex flex-col items-center max-w-4xl mx-auto w-full">
          <div className="mb-4 flex items-center justify-between w-full">
            <div className="bg-primary text-black font-black uppercase px-4 py-2 brutal-border text-sm">
              Foto {localPhotos.length} / {template.slots}
            </div>
            <div className="bg-white text-black font-black uppercase px-4 py-2 brutal-border text-sm">
              {template.name}
            </div>
          </div>

          <div className="relative w-full aspect-[3/4] md:aspect-video bg-black brutal-border brutal-shadow overflow-hidden mb-8">
            {/* Camera feed */}
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Countdown overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                <span className="text-white font-archivo text-9xl drop-shadow-md animate-ping">
                  {countdown}
                </span>
              </div>
            )}

            {/* Flash overlay */}
            {isFlashing && (
              <div className="absolute inset-0 bg-white z-20 opacity-100 transition-opacity duration-100"></div>
            )}
          </div>

          {!countdown && localPhotos.length < template.slots && (
            <Button 
              onClick={startSequence}
              className="w-full max-w-sm h-16 text-xl bg-accent text-white hover:bg-black group"
            >
              <Camera className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
              {localPhotos.length === 0 ? "MULAI FOTO" : "LANJUT FOTO"}
            </Button>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
          <h1 className="font-archivo text-4xl uppercase tracking-tighter mb-8 text-center">
            Review Foto
          </h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {localPhotos.map((src, i) => (
              <div key={i} className="relative aspect-[3/4] bg-white brutal-border p-2">
                <div className="absolute top-0 left-0 bg-black text-white px-2 py-1 text-xs font-bold z-10 m-2">
                  #{i + 1}
                </div>
                <img 
                  src={src} 
                  alt={`Foto ${i + 1}`} 
                  className="w-full h-full object-cover border-2 border-black"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button 
              onClick={retakeAll} 
              className="bg-white text-black hover:bg-gray-200 h-14 md:w-64"
            >
              <RefreshCw className="mr-2 w-5 h-5" />
              FOTO ULANG SEMUA
            </Button>
            <Button 
              onClick={proceedToEditor}
              className="bg-primary text-black hover:bg-[#86efac] h-14 md:w-64"
            >
              LANJUT EDITOR
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BoothPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center font-archivo text-2xl uppercase">Loading...</div>}>
      <BoothPageContent />
    </Suspense>
  );
}
