import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { Asterisk, HandArrow } from "@/components/marks";
import { ProjectCard } from "@/components/cards";
import { impactFigures } from "@/data/site";
import type { ProjectRow } from "@/lib/content.functions";

export function FeaturedProjects({ projects }: { projects: ProjectRow[] }) {
  if (projects.length === 0) return null;
  const [p1, ...rest] = projects;

  return (
    <section id="work" className="bg-soft py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-ink/15 pt-6">
            <h2 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">
              Selected work
            </h2>
            <Link to="/projects" className="link-underline eyebrow text-ink/60">
              All projects
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-14 sm:mt-20">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <ProjectCard project={p1!} imageClass="aspect-4/5" />
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-14 sm:mt-24 lg:grid-cols-12 lg:gap-12">
          {rest.map((p, i) => (
            <Reveal key={p.id} delay={i * 120} className="lg:col-span-6">
              <ProjectCard project={p} imageClass="aspect-3/2" />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <Link
            to="/projects"
            className="mt-16 inline-flex items-center gap-3 text-base font-medium text-ink"
          >
            See every project
            <HandArrow className="h-4 w-10 text-honey" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function Impact() {
  return (
    <section id="impact" className="bg-ink py-20 text-warm sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex items-start gap-4">
            <Asterisk className="mt-2 h-6 w-6 text-honey" />
            <h2 className="display-lg max-w-[16ch] text-warm">
              What happens when people show up for each other.
            </h2>
          </div>
        </Reveal>

        <ul className="mt-16 divide-y divide-warm/15 border-y border-warm/15 sm:mt-24">
          {impactFigures.map((item, i) => (
            <Reveal as="li" key={item.id} delay={i * 100}>
              <div className="grid items-baseline gap-3 py-8 sm:grid-cols-12 sm:py-12">
                <span className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-[0.85] tracking-tighter text-warm sm:col-span-6">
                  {item.figure}
                </span>
                <span className="text-base leading-relaxed text-warm/70 sm:col-span-5 sm:col-start-8 sm:text-lg">
                  {item.description}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <p className="mt-10 max-w-[52ch] text-base text-warm/50">
            [IMPACT CONTEXT COPY REQUIRED — figures to be supplied by the client.]
          </p>
        </Reveal>
      </div>
    </section>
  );
}
