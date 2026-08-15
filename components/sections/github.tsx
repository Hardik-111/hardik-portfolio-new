"use client";

import { ArrowUpRight, GitFork, Star } from "lucide-react";

import { github, sectionCopy } from "@/content/site";
import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/fx/reveal";
import { CountUp } from "@/components/fx/count-up";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/fx/magnetic";
import { GithubIcon } from "@/components/icons/brand";

export function Github() {
  return (
    <Section id="github" label="Open source">
      <SectionHeader
        {...sectionCopy.github}
        action={
          <Magnetic strength={0.25}>
            <Button asChild variant="glass" className="group">
              <a href={github.profileUrl} target="_blank" rel="noreferrer noopener">
                <GithubIcon className="size-4" />
                @{github.username}
                <ArrowUpRight className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Button>
          </Magnetic>
        }
      />

      <Reveal className="mt-16" y={26}>
        <PublicWork />
      </Reveal>

      <RevealGroup className="mt-6 grid gap-5 lg:grid-cols-2" stagger={0.07}>
        {github.repos.map((repo) => (
          <RevealItem key={repo.name}>
            <a
              href={repo.href}
              target="_blank"
              rel="noreferrer noopener"
              className="spotlight-border group flex h-full flex-col gap-4 rounded-3xl border border-line/8 bg-white/[0.015] p-6 transition-colors duration-500 ease-premium hover:border-line/16 hover:bg-white/[0.035]"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-mono text-[0.9375rem] text-ink">
                  <span className="text-ink-faint">{github.username}/</span>
                  {repo.name}
                </h3>
                <ArrowUpRight className="size-4 shrink-0 text-ink-faint transition-all duration-500 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
              </div>

              <p className="text-sm leading-relaxed text-ink-muted">{repo.description}</p>

              <div className="mt-auto flex flex-wrap items-center gap-5 pt-2 font-mono text-[0.6875rem] text-ink-faint">
                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: repo.languageColor }}
                    aria-hidden
                  />
                  {repo.language}
                </span>
                {repo.stars > 0 ? (
                  <span className="flex items-center gap-1.5">
                    <Star className="size-3" aria-hidden />
                    {repo.stars}
                    <span className="sr-only">stars</span>
                  </span>
                ) : null}
                {repo.forks > 0 ? (
                  <span className="flex items-center gap-1.5">
                    <GitFork className="size-3" aria-hidden />
                    {repo.forks}
                    <span className="sr-only">forks</span>
                  </span>
                ) : null}
                <span className="ml-auto">{repo.updated}</span>
              </div>
            </a>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

function PublicWork() {
  const stats = [
    { value: github.stats.publicRepos, label: "Public repositories" },
    { value: github.stats.originalRepos, label: "Written from scratch" },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-line/8 bg-white/[0.015]">
      <p className="max-w-3xl px-6 py-7 text-[0.9375rem] leading-relaxed text-ink-muted sm:px-8">
        {github.note}
      </p>

      <dl className="grid grid-cols-2 gap-px border-t border-line/8 bg-line/8 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-canvas px-5 py-5 sm:px-8">
            <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-faint">
              {stat.label}
            </dt>
            <dd className="mt-1.5 text-xl font-medium tracking-tight text-ink">
              <CountUp value={stat.value} duration={1.4} />
            </dd>
          </div>
        ))}

        <div className="bg-canvas px-5 py-5 max-sm:col-span-2 sm:px-8">
          <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-faint">
            On GitHub since
          </dt>
          <dd className="mt-1.5 text-xl font-medium tracking-tight text-ink">
            {github.stats.memberSince}
          </dd>
        </div>
      </dl>
    </div>
  );
}
