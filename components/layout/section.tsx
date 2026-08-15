import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/fx/reveal";

export function Section({
  id,
  children,
  className,
  container = true,
  label,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  container?: boolean;
  label?: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn("relative overflow-x-clip py-section", className)}
      style={{ scrollMarginTop: "6rem" }}
    >
      {container ? <div className="container">{children}</div> : children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>

      <div
        className={cn(
          "flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between",
          align === "center" && "lg:flex-col lg:items-center",
        )}
      >
        <Reveal delay={0.06} className={cn("max-w-3xl", align === "center" && "mx-auto")}>
          <h2 className="text-display-md text-balance text-gradient">{title}</h2>
        </Reveal>
        {action ? <Reveal delay={0.12}>{action}</Reveal> : null}
      </div>

      {description ? (
        <Reveal delay={0.12} className={cn("max-w-2xl", align === "center" && "mx-auto")}>
          <p className="text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-eyebrow uppercase text-ink-faint",
        className,
      )}
    >
      <span aria-hidden className="size-1 rounded-full bg-iris shadow-[0_0_12px_2px_hsl(var(--iris)/0.6)]" />
      {children}
    </span>
  );
}
