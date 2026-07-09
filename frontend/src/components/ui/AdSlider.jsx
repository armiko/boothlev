"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

const ads = [
  {
    id: 1,
    title: "Butuh AI Gateway?",
    desc: "Satu API Key untuk akses ke puluhan model AI (OpenAI, Anthropic, Gemini) anti ribet.",
    link: "https://labs.dahono.com",
    label: "labs.dahono.com",
    bgColor: "bg-[#FF5757]", // vibrant red
  },
  {
    id: 2,
    title: "Link-in-bio, Shortlink, Subdomain Gratis?",
    desc: "Bikin link sekeren mungkin untuk semua sosial mediamu dalam 1 menit.",
    link: "https://ktik.me",
    label: "ktik.me",
    bgColor: "bg-[#FFBD12]", // vibrant yellow
  },
  {
    id: 3,
    title: "Butuh Domain Murah seharga Rp. 6.666?",
    desc: "Dapatkan domain impianmu dengan harga paling tidak masuk akal.",
    link: "https://dash.ktik.me",
    label: "dash.ktik.me",
    bgColor: "bg-[#00C6AE]", // vibrant teal
  }
];

export default function AdSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-bg-light border-y-4 border-black py-16 px-5 md:px-10 overflow-hidden relative">
      <div className="max-w-[1200px] mx-auto relative">
        
        <p className="text-sm font-bold text-accent uppercase tracking-[.1em] mb-4 text-center md:text-left">
          🌟 Sponsor & Iklan
        </p>

        <div className="relative h-[220px] md:h-[180px] w-full">
          {ads.map((ad, index) => (
            <a
              key={ad.id}
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`absolute top-0 left-0 w-full h-full brutal-border p-6 md:p-8 brutal-shadow-lg flex flex-col md:flex-row justify-between items-center group transition-all duration-500 ease-in-out cursor-pointer ${ad.bgColor} ${
                index === currentIndex ? "opacity-100 translate-x-0 z-10" : "opacity-0 translate-x-8 z-0 pointer-events-none"
              }`}
            >
              <div className="flex-1 text-center md:text-left text-black">
                <h3 className="font-archivo text-2xl md:text-3xl uppercase mb-2 group-hover:underline decoration-4 underline-offset-4">
                  {ad.title}
                </h3>
                <p className="text-sm md:text-base font-medium opacity-90 max-w-[500px]">
                  {ad.desc}
                </p>
              </div>
              
              <div className="mt-6 md:mt-0 bg-white text-black brutal-border px-4 py-2 font-black text-sm uppercase tracking-widest brutal-shadow-sm flex items-center gap-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">
                Kunjungi {ad.label}
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-8 gap-3">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 brutal-border transition-all ${
                index === currentIndex ? "w-10 bg-black" : "w-3 bg-white"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
