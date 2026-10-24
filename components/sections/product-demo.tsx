"use client";

import { useCallback, useRef, useState } from "react";
import { Check, Copy, Play } from "lucide-react";

import { absoluteSectionQueryLink, productDemo, profile, projects, sectionQueryLink } from "@/content/site";
import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/fx/reveal";
import { GlowField } from "@/components/fx/ambient";

export function ProductDemo() {
  const project = projects.find((item) => item.slug === productDemo.slug);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const permalink = absoluteSectionQueryLink(profile.siteUrl, productDemo.queryValue);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(permalink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }, [permalink]);

  if (!project?.video) return null;

  return (
    <Section id={productDemo.sectionId} label="Product demo">
      <GlowField className="left-1/2 top-1/3 size-[600px] -translate-x-1/2" />

      <SectionHeader
        eyebrow={`${productDemo.eyebrow} · ${project.name}`}
        title={productDemo.title}
        description={productDemo.description}
      />

      <Reveal className="mt-16" y={30}>
        <div className="spotlight-border relative overflow-hidden rounded-[28px] border border-line/10 bg-canvas-sunken/70 backdrop-blur-sm">
          <div className="relative aspect-video w-full bg-black">
            {/* No poster image: the video's own first frame is the thumbnail. */}
            <video
              ref={videoRef}
              src={project.video}
              controls={playing}
              playsInline
              preload="metadata"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className="size-full object-contain"
            >
              Your browser does not support embedded video.
            </video>

            {!playing ? (
              <button
                type="button"
                onClick={() => videoRef.current?.play()}
                className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-500 ease-premium hover:bg-black/25"
                aria-label={`Play the ${project.name} demo`}
              >
                <span className="grid size-20 place-items-center rounded-full border border-white/25 bg-black/40 backdrop-blur-md transition-transform duration-500 ease-premium hover:scale-110 sm:size-24">
                  <Play className="size-8 translate-x-0.5 fill-white text-white" aria-hidden />
                </span>
              </button>
            ) : null}
          </div>

          <div className="relative flex flex-wrap items-center justify-between gap-4 border-t border-line/8 px-6 py-4">
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-faint">
              {project.role} · {project.year}
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={sectionQueryLink(productDemo.queryValue)}
                className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-iris transition-colors hover:text-ink"
              >
                Direct link
              </a>
              <button
                type="button"
                onClick={() => void copyLink()}
                className="inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-faint transition-colors hover:text-ink"
                aria-label={copied ? "Link copied" : "Copy demo link"}
              >
                {copied ? <Check className="size-3 text-emerald-400" aria-hidden /> : <Copy className="size-3" aria-hidden />}
                <span className="max-w-[min(100%,14rem)] truncate normal-case tracking-normal text-ink-muted sm:max-w-xs">
                  {permalink}
                </span>
              </button>
              {project.links.github ? (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-faint transition-colors hover:text-ink"
                >
                  View source →
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
