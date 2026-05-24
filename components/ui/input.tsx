import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "h-12 w-full rounded-full border border-white/12 bg-white/[0.07] px-5 text-sm text-white outline-none transition duration-300 placeholder:text-white/34 focus:border-purple focus:bg-white/[0.12] focus:shadow-[0_0_0_4px_rgba(184,140,255,0.14),0_0_32px_rgba(184,140,255,0.16)]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
