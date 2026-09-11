import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { HandArrow } from "@/components/marks";
import { VolunteerMeadow } from "@/components/VolunteerMeadow";
import { listVolunteers } from "@/lib/content.functions";

const title = "About — Beecause by The Hive";
const description =
  "Who we are, how we work, and why creativity and community sit at the centre of everything Beecause by The Hive makes.";

export const Route = createFileRoute("/about")({
  loader: () => listVolunteers(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    heading: "Made by hand",
    body: "[CLIENT COPY REQUIRED — describe the craft and care behind the work.]",
  },
  {
    heading: "Made together",
    body: "[CLIENT COPY REQUIRED — describe how communities co-create with you.]",
  },
  {
    heading: "Made to last",
    body: "[CLIENT COPY REQUIRED — describe the long-term impact you aim for.]",
  },
];

function AboutPage() {
  const volunteers = Route.useLoaderData();

  return (
    <SiteLayout>
      <PageHeader eyebrow="About" title="A hive of people making change." intro={description} />

      <section className="bg-warm pb-20">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          <Reveal className="lg:col-span-6">
            <figure className="overflow-hidden bg-cream">
              <img
                src="/images/about.jpg"
                alt="Beecause volunteers working together"
                className="aspect-4/5 w-full object-cover"
              />
            </figure>
          </Reveal>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal>
              <p className="font-display text-2xl leading-snug tracking-tight text-ink sm:text-3xl">
                [CLIENT COPY REQUIRED — a short statement about the story of Beecause by The Hive.]
              </p>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-6 text-base leading-relaxed text-ink/70 sm:text-lg">
                [CLIENT COPY REQUIRED — history, founding, and the community you serve.]
              </p>
            </Reveal>
            <Reveal delay={140}>
              <Link
                to="/volunteer"
                className="group mt-8 inline-flex items-center gap-3 text-base font-medium text-ink"
              >
                Join the hive
                <HandArrow className="h-4 w-10 text-honey transition-transform duration-500 group-hover:translate-x-1.5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-warm pb-20">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 border-t border-ink/15 pt-10 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.heading} delay={i * 90}>
                <h2 className="font-display text-xl tracking-tight text-ink sm:text-2xl">
                  {v.heading}
                </h2>
                <p className="mt-3 max-w-[40ch] text-base leading-relaxed text-ink/65">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-warm pb-28">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-ink/15 pt-6">
            <h2 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">
              People involved
            </h2>
            <p className="eyebrow text-ink/50">Our volunteers</p>
          </div>
          <VolunteerMeadow volunteers={volunteers} />
        </div>
      </section>
    </SiteLayout>
  );
}
