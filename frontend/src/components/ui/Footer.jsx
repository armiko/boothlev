import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-text-dark text-white py-10 text-center brutal-border border-t-[6px] border-b-0 border-l-0 border-r-0 border-primary">
      <p className="font-mono text-sm">
        © {new Date().getFullYear()} Boothlev. Open Source Project by{" "}
        <a 
          href="https://poketo.id" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-primary transition-colors hover:underline decoration-primary underline-offset-4 font-bold"
        >
          PT Lembur Demi Waifu
        </a>
        .
      </p>
      <div className="flex items-center justify-center gap-4 mt-4 text-xs font-archivo uppercase opacity-60">
        <Link href="/tos" className="hover:text-primary transition-colors hover:underline decoration-primary underline-offset-4">
          Terms of Service
        </Link>
        <span>•</span>
        <Link href="/privacy" className="hover:text-primary transition-colors hover:underline decoration-primary underline-offset-4">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
