import Link from "next/link";
import { Camera, Sparkles, Image as ImageIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AdSlider from "@/components/ui/AdSlider";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] overflow-x-hidden">
      {/* Hero Section */}
      <main className="flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlNWU1ZTUiLz48L3N2Zz4=')]">
        <div className="max-w-[800px] mx-auto px-5 md:px-10 py-20 md:py-32 flex flex-col justify-center">
          
          {/* Hero Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white brutal-border brutal-shadow-sm py-1.5 px-4 mb-6 font-black text-xs uppercase tracking-widest">
              <span className="w-2.5 h-2.5 bg-danger rounded-full animate-pulse"></span>
              100% Client-Side Privacy
            </div>
            
            <h1 className="font-archivo text-5xl md:text-7xl leading-[1.0] tracking-tighter uppercase mb-6">
              STUDIO FOTO <br />
              <span className="inline-block bg-accent text-white brutal-border px-4 -rotate-2 brutal-shadow mt-3 pb-1">DI BROWSER LO.</span>
            </h1>
            
            <p className="text-base md:text-lg leading-relaxed text-gray-700 font-medium max-w-[500px] mb-8">
              Pilih template, jepret pake webcam, atur ulang posisi, warnai frame, dan hias dengan ratusan stiker sesukamu! 100% aman di browser tanpa server.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/templates">
                <Button size="lg" variant="primary" className="gap-2">
                  <Camera className="w-5 h-5" />
                  Mulai Photobooth
                </Button>
              </Link>
              <Link href="#fitur">
                <Button size="lg" variant="outline">
                  Lihat Fitur
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 p-3 bg-yellow-100 brutal-border inline-flex items-center gap-3 text-sm font-medium text-black brutal-shadow-sm max-w-fit">
              <span className="text-xl">💻</span>
              Untuk pengalaman terbaik (Kamera & Editor), sangat disarankan membukanya via PC/Laptop.
            </div>
          </div>

        </div>
      </main>

      {/* Marquee */}
      <div className="bg-primary brutal-border border-l-0 border-r-0 overflow-hidden py-4 flex whitespace-nowrap">
        <div className="animate-marquee flex items-center w-max">
          {[...Array(8)].map((_, i) => (
             <div key={i} className="flex items-center">
               <span className="font-archivo text-sm uppercase tracking-widest px-8 flex items-center gap-3">
                 <Sparkles className="w-4 h-4" /> 
                 100% STATIC FRONTEND
               </span>
               <span className="font-archivo text-sm uppercase tracking-widest px-8 flex items-center gap-3">
                 <Sparkles className="w-4 h-4" /> 
                 AI BACKGROUND REMOVAL
               </span>
               <span className="font-archivo text-sm uppercase tracking-widest px-8 flex items-center gap-3">
                 <Sparkles className="w-4 h-4" /> 
                 HIGH RESOLUTION
               </span>
             </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="fitur" className="py-20 px-5 md:px-10 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-sm font-bold text-accent uppercase tracking-[.1em] mb-2">Fitur Utama</p>
          <h2 className="font-archivo text-4xl md:text-5xl uppercase leading-none tracking-tighter mb-12">
            SIMPEL. <span className="bg-secondary px-2 brutal-border">CEPAT.</span> AMAN.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-bg-light brutal-border p-8 hover:bg-primary transition-colors brutal-shadow-sm brutal-hover cursor-default">
              <div className="w-14 h-14 bg-white brutal-border flex items-center justify-center mb-6">
                 <Camera className="w-7 h-7" />
              </div>
              <h3 className="font-archivo text-xl uppercase mb-3">Live Camera</h3>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                Ambil foto langsung pakai webcam, lengkap dengan timer, mirror, dan efek flash layaknya studio asli.
              </p>
            </div>

            <div className="bg-bg-light brutal-border p-8 hover:bg-secondary transition-colors brutal-shadow-sm brutal-hover cursor-default">
              <div className="w-14 h-14 bg-white brutal-border flex items-center justify-center mb-6">
                 <ImageIcon className="w-7 h-7" />
              </div>
              <h3 className="font-archivo text-xl uppercase mb-3">Drag & Drop Editor</h3>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                Geser (swap) urutan foto antar slot, zoom, dan atur crop foto kamu agar pas di dalam kanvas dengan mudah.
              </p>
            </div>
            
            <div className="bg-bg-light brutal-border p-8 hover:bg-accent hover:text-white transition-colors brutal-shadow-sm brutal-hover cursor-default">
              <div className="w-14 h-14 bg-white text-black brutal-border flex items-center justify-center mb-6">
                 <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-archivo text-xl uppercase mb-3">Self-Hosted AI & Masking</h3>
              <p className="text-sm font-medium leading-relaxed opacity-90">
                Upload foto dari komputermu, server API kami akan menghapus background-nya instan dengan ML. Gunakan fitur Mask Editor untuk memperbaiki background secara manual!
              </p>
            </div>
            
            <div className="bg-bg-light brutal-border p-8 hover:bg-black hover:text-white transition-colors brutal-shadow-sm brutal-hover cursor-default">
              <div className="w-14 h-14 bg-white text-black brutal-border flex items-center justify-center mb-6">
                 <Download className="w-7 h-7" />
              </div>
              <h3 className="font-archivo text-xl uppercase mb-3">High-Res Export</h3>
              <p className="text-sm font-medium leading-relaxed opacity-90">
                Hasil fotomu dirender ulang secara sempurna dengan resolusi ultra tajam yang cocok untuk dicetak.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Ad Slider */}
      <AdSlider />
    </div>
  );
}
