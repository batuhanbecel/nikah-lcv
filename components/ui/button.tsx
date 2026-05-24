import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium shadow-[0_14px_36px_rgba(184,140,255,0.16)] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple focus-visible:shadow-[0_0_0_4px_rgba(184,140,255,0.16),0_0_24px_rgba(184,140,255,0.28)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-purple hover:text-white hover:shadow-[0_0_22px_rgba(184,140,255,0.32),0_18px_46px_rgba(184,140,255,0.2)]",
        outline: "border border-white/22 bg-white/8 text-white backdrop-blur-xl hover:border-purple hover:bg-purple/20 hover:shadow-[0_0_20px_rgba(184,140,255,0.26),0_18px_46px_rgba(0,0,0,0.26)]",
        ghost: "text-white hover:bg-white/10 hover:shadow-[0_0_24px_rgba(255,255,255,0.16)]"
      },
      size: {
        default: "h-12 px-6",
        icon: "h-12 w-12 px-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
