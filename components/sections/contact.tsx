"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, FileText } from "lucide-react";

import { contact, profile } from "@/content/site";
import { Eyebrow } from "@/components/layout/section";
import { Reveal } from "@/components/fx/reveal";
import { SplitText } from "@/components/fx/split-text";
import { Magnetic } from "@/components/fx/magnetic";
import { Button } from "@/components/ui/button";
import { SocialLinks } from "@/components/layout/social-links";
import { Ambient } from "@/components/fx/ambient";

export function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative overflow-hidden py-section"
      style={{ scrollMarginTop: "6rem" }}
    >
      <Ambient particles={false} intensity={0.7} className="opacity-80" />

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <Eyebrow className="justify-center">{contact.eyebrow}</Eyebrow>
          </Reveal>

          <h2 className="mt-8 text-display-lg font-medium">
            <SplitText text={contact.title} by="word" className="text-gradient" stagger={0.055} />
          </h2>

          <Reveal delay={0.1} className="mt-8">
            <p className="mx-auto max-w-xl text-pretty text-lg leading-relaxed text-ink-muted">
              {contact.body}
            </p>
          </Reveal>

          <Reveal delay={0.16} className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Magnetic strength={0.3}>
                <Button asChild size="lg" variant="primary" className="group">
                  <a href={contact.cta.href}>
                    {contact.cta.label}
                    <ArrowUpRight className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </Button>
              </Magnetic>
              <Magnetic strength={0.26}>
                <Button asChild size="lg" variant="glass">
                  <a href={contact.secondary.href} download>
                    <FileText />
                    {contact.secondary.label}
                  </a>
                </Button>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.22} className="mt-12">
            <EmailCopy email={profile.email} />
          </Reveal>

          <Reveal delay={0.28} className="mt-14">
            <div className="flex flex-col items-center gap-6">
              <SocialLinks />
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-ink-faint">
                {contact.responseTime}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function EmailCopy({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked by permissions; the mailto link still works.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="group inline-flex items-center gap-3 rounded-full border border-line/10 bg-white/[0.02] px-5 py-3 font-mono text-sm text-ink-muted transition-all duration-300 ease-premium hover:border-line/25 hover:text-ink"
    >
      {email}
      <span className="relative grid size-4 place-items-center" aria-hidden>
        {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
      </span>
      <span className="sr-only">{copied ? "Email copied" : "Copy email address"}</span>
    </button>
  );
}
