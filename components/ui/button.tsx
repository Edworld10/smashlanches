import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#FF6A00] text-white hover:bg-[#E55F00] shadow-glow font-bold",
        destructive: "bg-[#E6391F] text-white hover:bg-[#CC321B]",
        outline: "border border-[#2A2A2A] bg-transparent text-[#F3E3C7] hover:bg-[#1C1C1C] hover:text-white",
        secondary: "bg-[#1C1C1C] text-[#F3E3C7] hover:bg-[#262626] border border-[#2A2A2A]",
        ghost: "hover:bg-[#1C1C1C] text-[#F3E3C7] hover:text-white",
        link: "text-[#FF6A00] underline-offset-4 hover:underline",
        whatsapp: "bg-[#25D366] text-white hover:bg-[#1EBE5D] font-bold shadow-lg",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-13 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
