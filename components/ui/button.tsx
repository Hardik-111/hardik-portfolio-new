import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[color,background-color,border-color,box-shadow,opacity] duration-300 ease-premium disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-canvas shadow-[0_1px_0_0_hsl(0_0%_100%/0.6)_inset,0_18px_40px_-18px_hsl(0_0%_100%/0.35)] hover:bg-white",
        glass:
          "glass text-ink hover:border-line/20 hover:bg-white/[0.07]",
        outline:
          "border border-line/12 text-ink-soft hover:border-line/25 hover:text-ink",
        ghost: "text-ink-muted hover:text-ink",
        accent:
          "bg-iris/90 text-white shadow-lift hover:bg-iris",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem]",
        md: "h-11 px-6",
        lg: "h-14 px-8 text-[0.9375rem]",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "glass", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
