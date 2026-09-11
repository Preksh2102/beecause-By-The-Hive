import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { HandArrow, ImperfectCircle, OrganicLine } from "@/components/marks";
import { StoryCard } from "@/components/cards";
import { pathways } from "@/data/site";
import type { StoryRow } from "@/lib/content.functions";

export function FeaturedStories({ stories }: { stories: StoryRow[] }) {
  if (stories.length === 0) return null;

  return (
    <section id="stories" className="bg-warm py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-ink/15 pt-6">
            <h2 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">Stories</h2>
            <Link to="/stories" className="link-underline eyebrow text-ink/60">
              All stories
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-12 sm:mt-16 md:grid-cols-2">
          {stories.map((s, i) => (
            <Reveal key={s.id} delay={i * 120}>
              <StoryCard story={s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="bg-soft py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <figure className="relative">
              <div className="grain overflow-hidden rounded-[54%_46%_58%_42%/44%_56%_44%_56%] bg-cream">
                <img
                  src="/images/about.jpg"
                  alt="Volunteers gathered around a table sharing ideas"
                  loading="lazy"
                  className="aspect-4/5 w-full object-cover"
                />
              </div>
              <ImperfectCircle className="pointer-events-none absolute -bottom-6 -right-6 hidden h-24 w-40 text-honey/60 sm:block" />
            </figure>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-6 lg:pt-10">
            <p className="eyebrow text-honey">About us</p>
            <h2 className="display-lg mt-5 max-w-[16ch] text-ink">
              A hive works because everyone has a part to play.
            </h2>
            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-ink/70">
              [CLIENT ABOUT COPY REQUIRED]
            </p>
            <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-ink/70">
              [CLIENT ABOUT COPY REQUIRED — second paragraph.]
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-3 text-base font-medium text-ink"
            >
              More about the hive
              <HandArrow className="h-4 w-10 text-honey" />
            </Link>
            <OrganicLine className="mt-10 h-8 w-44 text-ink/20" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Pathways() {
  return (
    <section id="get-involved" className="bg-warm py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-ink/15 pt-6">
            <h2 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">
              Get involved
            </h2>
            <p className="eyebrow text-ink/50">Three ways in</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {pathways.map((p, i) => (
            <Reveal key={p.id} delay={i * 110}>
              <div className="flex h-full flex-col border-t border-ink/15 pt-6">
                <h3 className="font-display text-2xl tracking-tight text-ink">{p.title}</h3>
                <p className="mt-3 text-base text-ink/70">{p.line}</p>
                <p className="mt-3 flex-1 text-base leading-relaxed text-ink/55">{p.detail}</p>
                <Link
                  to={p.id === "join" ? "/volunteer" : "/contact"}
                  className="mt-6 inline-flex items-center gap-3 text-base font-medium text-ink"
                >
                  {p.id === "join" ? "Apply to volunteer" : "Talk to us"}
                  <HandArrow className="h-4 w-10 text-honey" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalMoment() {
  return (
    <section className="bg-ink py-24 text-warm sm:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <h2 className="display-lg max-w-[16ch] text-warm">
            Come and be part of something that grows.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <Link
            to="/volunteer"
            className="mt-10 inline-flex min-h-11 items-center rounded-full bg-warm px-7 py-3 text-base font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5"
          >
            Join the hive
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
