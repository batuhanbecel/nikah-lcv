import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "h-12 w-full rounded-full border border-black/10 bg-white/75 px-5 text-sm outline-none transition duration-300 placeholder:text-black/35 focus:border-purple focus:bg-white focus:shadow-[0_0_0_4px_rgba(111,61,197,0.12)]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
