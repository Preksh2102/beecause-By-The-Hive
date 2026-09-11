import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { ProjectCard } from "@/components/cards";
import { Reveal } from "@/components/Reveal";
import { listProjects } from "@/lib/content.functions";

const title = "Projects — Beecause by The Hive";
const description =
  "Community projects made with creativity and care by Beecause by The Hive and the people around us.";

export const Route = createFileRoute("/projects/")({
  loader: () => listProjects(),
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
  component: ProjectsPage,
});

function ProjectsPage() {
  const projects = Route.useLoaderData();
  const [filter, setFilter] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))],
    [projects],
  );
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <SiteLayout>
      <PageHeader eyebrow="Our work" title="Projects made together." intro={description} />
      <section className="bg-warm pb-28">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap gap-3 border-t border-ink/15 pt-6">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={`rounded-full border px-4 py-2 text-base transition-colors ${
                  filter === c
                    ? "border-ink bg-ink text-warm"
                    : "border-ink/25 text-ink/70 hover:border-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <p className="mt-14 text-base text-ink/60">No projects published yet.</p>
          ) : (
            <div className="mt-14 grid gap-14 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <ProjectCard project={p} imageClass="aspect-4/5" />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
