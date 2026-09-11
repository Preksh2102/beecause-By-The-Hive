import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { StoryCard } from "@/components/cards";
import { Reveal } from "@/components/Reveal";
import { listStories } from "@/lib/content.functions";

const title = "Stories — Beecause by The Hive";
const description =
  "Voices from the hive: stories from the people, places and projects we work with.";

export const Route = createFileRoute("/stories/")({
  loader: () => listStories(),
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
  component: StoriesPage,
});

function StoriesPage() {
  const stories = Route.useLoaderData();
  return (
    <SiteLayout>
      <PageHeader eyebrow="Stories" title="Voices from the hive." intro={description} />
      <section className="bg-warm pb-28">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          {stories.length === 0 ? (
            <p className="border-t border-ink/15 pt-8 text-base text-ink/60">
              No stories published yet.
            </p>
          ) : (
            <div className="grid gap-14 border-t border-ink/15 pt-12 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((s, i) => (
                <Reveal key={s.id} delay={i * 80}>
                  <StoryCard story={s} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
