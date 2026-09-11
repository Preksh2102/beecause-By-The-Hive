import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { HandArrow, ScribbleUnderline } from "@/components/marks";
import { getProject, type BodySection, type Fact } from "@/lib/content.functions";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const { project, all } = await getProject({ data: { slug: params.slug } });
    if (!project) throw notFound();
    return { project, more: all.filter((p) => p.slug !== params.slug).slice(0, 3) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Project unavailable — Beecause by The Hive" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.project.title} — Beecause by The Hive`;
    const description = loaderData.project.description || loaderData.project.intro;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ProjectNotFound,
  component: ProjectDetail,
});

function ProjectNotFound() {
  return (
    <SiteLayout>
      <main className="mx-auto flex min-h-[70vh] max-w-[1600px] flex-col justify-center px-5 py-32 sm:px-8 lg:px-12">
        <p className="eyebrow text-honey">404</p>
        <h1 className="mt-4 font-display text-4xl tracking-tight text-ink sm:text-6xl">
          We couldn&rsquo;t find that project.
        </h1>
        <Link
          to="/projects"
          className="mt-8 inline-flex items-center gap-3 text-base font-medium text-ink"
        >
          Back to projects
          <HandArrow className="h-4 w-10 text-honey" />
        </Link>
      </main>
    </SiteLayout>
  );
}

function ProjectDetail() {
  const { project, more } = Route.useLoaderData();
  const body = (project.body ?? []) as unknown as BodySection[];
  const facts = (project.facts ?? []) as unknown as Fact[];

  return (
    <SiteLayout>
      <article className="bg-warm pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-3 text-base font-medium text-ink/70 hover:text-ink"
          >
            <HandArrow className="h-4 w-10 rotate-180 text-honey transition-transform duration-500 group-hover:-translate-x-1.5" />
            Projects
          </Link>

          <Reveal className="mt-10">
            <p className="eyebrow text-honey">
              {[project.number, project.category, project.year].filter(Boolean).join(" · ")}
            </p>
            <h1 className="mt-4 max-w-[20ch] font-display text-[clamp(2.25rem,6vw,5rem)] leading-[1] tracking-tighter text-ink">
              {project.title}
            </h1>
            <ScribbleUnderline className="mt-3 h-3 w-44 text-honey" />
          </Reveal>

          {project.cover_image ? (
            <Reveal delay={120} className="mt-12">
              <figure className="overflow-hidden bg-cream">
                <img
                  src={project.cover_image}
                  alt={`${project.title} — documentary photograph`}
                  className="aspect-16/9 w-full object-cover"
                />
              </figure>
            </Reveal>
          ) : null}

          <div className="mt-14 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {project.intro ? (
                <Reveal>
                  <p className="max-w-[58ch] font-display text-xl leading-relaxed text-ink sm:text-2xl">
                    {project.intro}
                  </p>
                </Reveal>
              ) : null}

              {body.map((section, i) => (
                <Reveal key={i} delay={i * 70} className="mt-12">
                  <h2 className="font-display text-2xl tracking-tight text-ink">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((p, j) => (
                    <p
                      key={j}
                      className="mt-4 max-w-[62ch] text-base leading-relaxed text-ink/70 sm:text-lg"
                    >
                      {p}
                    </p>
                  ))}
                </Reveal>
              ))}
            </div>

            {facts.length ? (
              <Reveal delay={100} className="lg:col-span-4 lg:col-start-9">
                <dl className="border-t border-ink/15 pt-6">
                  {facts.map((f, i) => (
                    <div key={i} className="flex flex-col gap-1 border-b border-ink/10 py-4">
                      <dt className="eyebrow text-ink/45">{f.label}</dt>
                      <dd className="text-base text-ink/75">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : null}
          </div>

          {project.gallery?.length ? (
            <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((src, i) => (
                <Reveal key={i} delay={i * 70}>
                  <figure className="overflow-hidden bg-cream">
                    <img
                      src={src}
                      alt={`${project.title} — gallery image ${i + 1}`}
                      loading="lazy"
                      className="aspect-4/3 w-full object-cover"
                    />
                  </figure>
                </Reveal>
              ))}
            </div>
          ) : null}

          {more.length ? (
            <div className="mt-24 border-t border-ink/15 pt-8 sm:mt-32">
              <p className="eyebrow text-ink/45">More projects</p>
              <div className="mt-8 grid gap-10 md:grid-cols-3">
                {more.map((p) => (
                  <Link
                    key={p.slug}
                    to="/projects/$slug"
                    params={{ slug: p.slug }}
                    className="group block"
                  >
                    <figure className="overflow-hidden bg-cream">
                      <img
                        src={p.cover_image || "/images/project-01.jpg"}
                        alt={`${p.title} — documentary photograph`}
                        loading="lazy"
                        className="aspect-3/2 w-full object-cover transition-transform duration-[1.1s] group-hover:scale-[1.03]"
                      />
                    </figure>
                    <h2 className="mt-4 font-display text-2xl tracking-tight text-ink">
                      {p.title}
                    </h2>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </SiteLayout>
  );
}
