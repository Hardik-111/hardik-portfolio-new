import dynamic from "next/dynamic";

import { testimonials } from "@/content/site";
import { Hero } from "@/components/sections/hero";
import { Metrics } from "@/components/sections/metrics";
import { About } from "@/components/sections/about";

/* Everything below the second viewport is code-split. The hero and metrics
   carry the LCP, so only those two ship in the initial chunk. */
const Skills = dynamic(() => import("@/components/sections/skills").then((m) => m.Skills));
const Experience = dynamic(() => import("@/components/sections/experience").then((m) => m.Experience));
const Projects = dynamic(() => import("@/components/sections/projects").then((m) => m.Projects));
const Architecture = dynamic(() =>
  import("@/components/sections/architecture").then((m) => m.Architecture),
);
const TechnicalExpertise = dynamic(() =>
  import("@/components/sections/expertise").then((m) => m.TechnicalExpertise),
);
const Github = dynamic(() => import("@/components/sections/github").then((m) => m.Github));
const Testimonials = dynamic(() =>
  import("@/components/sections/testimonials").then((m) => m.Testimonials),
);
const Contact = dynamic(() => import("@/components/sections/contact").then((m) => m.Contact));

export default function Home() {
  return (
    <>
      <Hero />
      <Metrics />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Architecture />
      <TechnicalExpertise />
      <Github />
      {testimonials.length > 0 ? <Testimonials /> : null}
      <Contact />
    </>
  );
}
