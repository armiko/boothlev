import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Button = forwardRef(({ className, variant = "primary", size = "default", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-widest brutal-border transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-text-dark brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_#111111]",
    secondary: "bg-secondary text-text-dark brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_#111111]",
    accent: "bg-accent text-white brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_#111111]",
    outline: "bg-white text-text-dark brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_#111111]",
    ghost: "border-transparent shadow-none hover:bg-black/5 active:bg-black/10 text-text-dark",
  };
  
  const sizes = {
    default: "h-12 py-2 px-6 text-sm",
    sm: "h-10 px-4 text-xs",
    lg: "h-14 px-8 text-base",
    icon: "h-12 w-12",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";

export { Button };
