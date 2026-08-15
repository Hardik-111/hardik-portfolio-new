"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

import { projects, sectionCopy, type Project } from "@/content/site";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/layout/section";
import { Reveal } from "@/components/fx/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/fx/magnetic";
import { ProjectVisual } from "@/components/media/project-visual";
import { GithubIcon } from "@/components/icons/brand";

/**
 * Featured work as a horizontally-scrolled reel. GSAP pins the section and
 * converts vertical scroll into horizontal travel on large pointer-driven
 * screens; everywhere else the same panels stack vertically.
 */
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "transform" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" aria-label="Featured projects" className="relative lg:h-[100svh]">
      <div className="relative flex h-full flex-col justify-center overflow-hidden py-section lg:py-0">
        <div className="container shrink-0 lg:pt-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="space-y-5">
              <Reveal>
                <Eyebrow>{sectionCopy.projects.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="max-w-2xl text-display-md text-gradient">
                  {sectionCopy.projects.title}
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.12}>
              <p className="hidden max-w-xs font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.16em] text-ink-faint lg:block">
                {sectionCopy.projects.hint}
              </p>
            </Reveal>
          </div>

          <div className="mt-10 hidden h-px w-full bg-line/10 lg:block">
            <span
              ref={progressRef}
              className="block h-px origin-left scale-x-0 bg-gradient-to-r from-iris to-cyan"
            />
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-12 flex flex-col gap-16 lg:mt-10 lg:w-max lg:flex-row lg:gap-8 lg:pl-[max(1.25rem,calc((100vw-1320px)/2+4rem))] lg:pr-[12vw]"
        >
          {projects.map((project, index) => (
            <ProjectPanel key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className={cn(
        "container lg:w-[86vw] lg:max-w-[1180px] lg:shrink-0 lg:px-0",
        "grid gap-8 lg:grid-cols-12 lg:items-center",
      )}
    >
      <div className="lg:col-span-7">
        <Reveal y={30}>
          <ProjectVisual
            project={project}
            className="h-[420px] w-full sm:h-[480px] lg:h-[min(62vh,540px)]"
          />
        </Reveal>
      </div>

      <div className="flex flex-col gap-6 lg:col-span-5">
        <Reveal delay={0.05}>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-ink-faint">
              {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
            <span aria-hidden className="h-px flex-1 bg-line/10" />
            <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-ink-faint">
              {project.year}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div>
            <h3 className="text-display-sm font-medium tracking-tight text-ink">{project.name}</h3>
            <p className="mt-2 text-lg text-ink-soft">{project.tagline}</p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="text-[0.9375rem] leading-relaxed text-ink-muted">{project.overview}</p>
        </Reveal>

        <Reveal delay={0.16}>
          <dl className="space-y-3.5 border-l border-line/10 pl-5">
            {project.challenges.map((challenge) => (
              <div key={challenge.title}>
                <dt className="text-[0.8125rem] font-medium text-ink-soft">{challenge.title}</dt>
                <dd className="mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-faint">
                  {challenge.body}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <Badge key={tech} variant="mono" size="sm">
                {tech}
              </Badge>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {project.links.github ? (
              <Magnetic strength={0.25}>
                <Button asChild variant="glass" size="sm">
                  <a href={project.links.github} target="_blank" rel="noreferrer noopener">
                    <GithubIcon className="size-3.5" />
                    Source
                  </a>
                </Button>
              </Magnetic>
            ) : null}
            {project.links.demo ? (
              <Magnetic strength={0.25}>
                <Button asChild variant="primary" size="sm" className="group">
                  <a href={project.links.demo} target="_blank" rel="noreferrer noopener">
                    Live demo
                    <ArrowUpRight className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </Button>
              </Magnetic>
            ) : (
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-faint">
                {project.role}
              </span>
            )}
          </div>
        </Reveal>
      </div>
    </article>
  );
}
