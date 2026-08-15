# Hardik Kumar Singh — Portfolio

A dark-first, motion-led personal site built as a single scrolling narrative: hero, impact metrics, story, capabilities, experience, selected work with live architecture diagrams, an architecture showcase, technical expertise, open source, and contact.

## Stack

| Concern      | Choice                                        |
| ------------ | --------------------------------------------- |
| Framework    | Next.js 15 (App Router), React 19, TypeScript |
| Styling      | TailwindCSS 3.4 with custom design tokens     |
| Motion       | Framer Motion, GSAP ScrollTrigger, Lenis      |
| 3D           | Three.js (shader gradient mesh, particles)    |
| Icons        | Lucide, plus inline SVG brand marks           |

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # eslint
```

## Editing the content

**Everything readable on the site lives in `content/site.ts`.** No component needs editing to change copy, numbers, links, projects, or section headings. The file is typed, so a missing field is a build error rather than a blank space on the page.

| Export                | Controls                                                    |
| --------------------- | ----------------------------------------------------------- |
| `profile`             | Name, roles, location, email, portrait paths, résumé, domain |
| `hero`                | Headline lines, intro paragraph, call-to-action buttons      |
| `socials`             | The links in the nav, contact section and footer             |
| `metrics`             | The four counting statistics under the hero                  |
| `about`               | Narrative paragraphs, principles, career timeline            |
| `education`           | Degrees and certifications                                   |
| `skillCategories`     | The six capability cards                                     |
| `experience`          | Roles, achievements, per-role stacks                         |
| `projects`            | Case studies, results, and their architecture graphs         |
| `architectureShowcase`| The interactive reference topology                           |
| `expertise`           | The five expandable expertise cards                          |
| `github`              | Username, public-repo counts, featured repositories          |
| `testimonials`        | Quotes (empty by default — see below)                        |
| `contact` / `footer`  | Closing copy                                                 |
| `sectionCopy`         | Eyebrows, titles and descriptions for each section           |
| `navItems`            | Nav and footer index links                                   |

### Things to set before deploying

1. **`profile.siteUrl`** — currently `https://hardiksingh.dev`. This feeds canonical URLs, Open Graph tags, the sitemap and structured data.
2. **`testimonials`** — an empty array. The carousel is skipped entirely while it stays empty, so the site never shows an invented endorsement. Add real quotes and the section reappears.

`github.stats` and `github.repos` are hardcoded from the real account rather than fetched, so the section costs no network requests and cannot fail at runtime. They will drift as you push; refresh them with:

```bash
curl -s https://api.github.com/users/Hardik-111
curl -s "https://api.github.com/users/Hardik-111/repos?per_page=100&sort=updated"
```

### Images

Put files in `public/` and point `profile` at them:

- `portrait.png` — the headshot used in both the hero and the About frame. Because it has a light background it is presented as a framed plate rather than blended into the page; a light photo dissolved into a dark background goes muddy.
- `portrait-dark.jpg` — the alternate dark-background shot. Point `profile.portrait` or `profile.portraitAlt` at it to swap either placement.
- `resume.pdf` — served by the download buttons.

The hero plate is hidden below the `md` breakpoint: a bright card behind the headline destroys readability on a phone, so mobile leads with typography and the portrait appears in the About section instead.

Set `profile.portrait` to `null` to fall back to a generated wireframe composition.

### Architecture diagrams

Each project carries its own `architecture: { nodes, edges }`. Node coordinates are percentages of the diagram box, and the renderer insets them automatically so chips never clip at the edges. Tiers (`edge`, `service`, `data`, `async`) set the colour, and `async: true` on an edge draws it as a flowing dashed line.

## Accessibility and motion

Every animation is gated on `prefers-reduced-motion`; with it enabled the site renders fully static with no parallax, counting, or autoplay. Content is server-rendered, so metrics and copy are present without JavaScript. Navigation is keyboard reachable with a skip link, and the diagrams expose their detail text on focus as well as hover.

## Visual review

`scripts/shoot.mjs` drives system Chrome over the DevTools protocol to capture every section at desktop and mobile widths, and reports document height and horizontal overflow:

```bash
npm start                    # serve on 127.0.0.1:3100 first
node scripts/shoot.mjs       # writes .screens/
```
