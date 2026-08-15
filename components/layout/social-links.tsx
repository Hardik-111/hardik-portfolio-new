import type { ComponentType } from "react";
import { FileText, Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { socials, type Social } from "@/content/site";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/icons/brand";

const iconFor: Record<Social["icon"], ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  twitter: XIcon,
  mail: Mail,
  resume: FileText,
};

export function SocialLinks({
  className,
  showLabels = false,
}: {
  className?: string;
  showLabels?: boolean;
}) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {socials.map((social) => {
        const Icon = iconFor[social.icon];
        return (
          <li key={social.label}>
            <a
              href={social.href}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel={social.href.startsWith("http") ? "noreferrer noopener" : undefined}
              download={social.icon === "resume" || undefined}
              className={cn(
                "group inline-flex items-center gap-2.5 rounded-full border border-line/10 bg-white/[0.02] px-3.5 py-2 text-ink-muted transition-all duration-300 ease-premium hover:border-line/25 hover:bg-white/[0.05] hover:text-ink",
                showLabels ? "text-sm" : "size-10 justify-center p-0",
              )}
              aria-label={social.label}
            >
              <Icon className="size-4 shrink-0" />
              {showLabels ? <span>{social.handle}</span> : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
