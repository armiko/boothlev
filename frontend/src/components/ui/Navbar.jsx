import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white brutal-border border-l-0 border-r-0 border-t-0 flex items-center justify-between px-5 md:px-10 h-[70px] sticky top-0 z-[99]">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary brutal-border brutal-shadow-sm flex items-center justify-center font-archivo text-xl">
          B
        </div>
        <span className="font-archivo text-2xl tracking-tight uppercase">Boothlev</span>
      </Link>
      <div className="hidden md:flex items-center gap-6">
        <span className="bg-secondary text-text-dark brutal-border px-3 py-1 font-black text-xs uppercase tracking-widest brutal-shadow-sm">
          Beta v1.0
        </span>
      </div>
    </nav>
  );
}
