import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border transition-colors duration-300 ease-premium",
  {
    variants: {
      variant: {
        default: "border-line/10 bg-white/[0.03] text-ink-soft hover:border-line/20 hover:text-ink",
        mono: "border-line/10 bg-white/[0.02] font-mono text-ink-muted hover:text-ink-soft",
        accent: "border-iris/25 bg-iris/10 text-iris",
        dot: "border-transparent bg-transparent px-0 text-ink-muted",
      },
      size: {
        sm: "px-2.5 py-1 text-[0.6875rem] tracking-wide",
        md: "px-3.5 py-1.5 text-xs",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
