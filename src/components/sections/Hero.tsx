import { Reveal } from "@/components/Reveal";
import { HandArrow, ImperfectCircle, OrganicLine, ScribbleUnderline } from "@/components/marks";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-warm pt-28 sm:pt-32 lg:pt-40">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 lg:pb-10">
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-3 text-ink/55">
                <span>Creativity · Community · Action</span>
                <HandArrow className="h-4 w-10 text-honey" />
              </p>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="display-xl max-w-[16ch] text-ink">
                Good things happen when we{" "}
                <span className="relative inline-block">
                  do them
                  <ScribbleUnderline className="absolute -bottom-1 left-0 h-3 w-full text-honey sm:-bottom-2 sm:h-4" />
                </span>{" "}
                together.
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-8 max-w-[46ch] text-base leading-relaxed text-ink/70 sm:text-lg">
                Beecause by The Hive brings creativity, community and action together to create
                meaningful change.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#work"
                  className="inline-flex min-h-11 items-center rounded-full bg-ink px-7 py-3 text-base font-medium text-warm transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Explore our work
                </a>
                <a
                  href="#get-involved"
                  className="link-underline inline-flex min-h-11 items-center py-3 text-base font-medium text-ink"
                >
                  Get involved
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="lg:col-span-5">
            <figure className="relative">
              <div className="grain overflow-hidden rounded-[42%_58%_46%_54%/54%_44%_56%_46%] bg-cream">
                <img
                  src="/images/hero.jpg"
                  alt="People working together on a collaborative artwork in a community workshop"
                  width={1600}
                  height={1100}
                  className="aspect-4/5 w-full scale-105 object-cover object-[60%_40%] transition-transform duration-[1.2s] hover:scale-100"
                />
              </div>
              <ImperfectCircle className="pointer-events-none absolute -left-8 -top-8 hidden h-28 w-44 text-terracotta/60 sm:block" />
            </figure>
          </Reveal>
        </div>

        <OrganicLine className="mt-16 h-10 w-full text-ink/15 sm:mt-24" />
      </div>
    </section>
  );
}

export function Statement() {
  return (
    <section className="bg-warm py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <h2 className="display-lg max-w-[18ch] text-ink">
              A hive works because everyone has a part to play.
            </h2>
          </Reveal>
          <Reveal delay={140} className="lg:col-span-4 lg:pt-4">
            <p className="eyebrow mb-4 text-honey">Our idea</p>
            <p className="max-w-[42ch] text-base leading-relaxed text-ink/70">
              [CLIENT INTRO COPY REQUIRED]
            </p>
            <OrganicLine className="mt-8 h-8 w-40 text-sage" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
