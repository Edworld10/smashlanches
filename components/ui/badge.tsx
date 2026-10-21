import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold tracking-wider transition-colors uppercase font-bebas",
  {
    variants: {
      variant: {
        default: "bg-[#FF6A00] text-black",
        secondary: "bg-[#1C1C1C] text-[#F3E3C7] border border-[#2A2A2A]",
        destructive: "bg-[#E6391F] text-white",
        outline: "text-[#FF6A00] border border-[#FF6A00]",
        fire: "bg-gradient-to-r from-[#FF6A00] to-[#E6391F] text-white shadow-glow",
        success: "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
