import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { HandArrow, ScribbleUnderline } from "@/components/marks";
import { StoryCard } from "@/components/cards";
import { getStory } from "@/lib/content.functions";

export const Route = createFileRoute("/stories/$slug")({
  loader: async ({ params }) => {
    const { story, all } = await getStory({ data: { slug: params.slug } });
    if (!story) throw notFound();
    return { story, more: all.filter((s) => s.slug !== params.slug).slice(0, 3) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Story not found — Beecause by The Hive" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.story.title} — Beecause by The Hive`;
    const description = loaderData.story.excerpt ?? "";
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
  notFoundComponent: StoryNotFound,
  component: StoryDetail,
});

function StoryNotFound() {
  return (
    <SiteLayout>
      <div className="mx-auto flex min-h-[70vh] max-w-[1600px] flex-col justify-center px-5 py-32 sm:px-8 lg:px-12">
        <p className="eyebrow text-honey">404</p>
        <h1 className="mt-4 font-display text-4xl tracking-tight text-ink sm:text-6xl">
          We couldn&rsquo;t find that story.
        </h1>
        <Link
          to="/stories"
          className="mt-8 inline-flex items-center gap-3 text-base font-medium text-ink"
        >
          All stories
          <HandArrow className="h-4 w-10 text-honey" />
        </Link>
      </div>
    </SiteLayout>
  );
}

function StoryDetail() {
  const { story, more } = Route.useLoaderData();
  const body = (story.body ?? []) as string[];

  return (
    <SiteLayout>
      <article className="bg-warm pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <Link
            to="/stories"
            className="group inline-flex items-center gap-3 text-base font-medium text-ink/70 hover:text-ink"
          >
            <HandArrow className="h-4 w-10 rotate-180 text-honey transition-transform duration-500 group-hover:-translate-x-1.5" />
            Stories
          </Link>

          <Reveal className="mt-10 max-w-[22ch]">
            <p className="eyebrow text-honey">{story.category}</p>
            <h1 className="mt-4 font-display text-[clamp(2.25rem,6vw,5rem)] leading-[1] tracking-tighter text-ink">
              {story.title}
            </h1>
            <ScribbleUnderline className="mt-3 h-3 w-44 text-honey" />
          </Reveal>

          <Reveal delay={80} className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-base text-ink/50">
            <span>{story.author}</span>
            <span>{story.story_date}</span>
          </Reveal>

          {story.cover_image ? (
            <Reveal delay={120} className="mt-12">
              <figure className="overflow-hidden bg-cream">
                <img
                  src={story.cover_image}
                  alt={`${story.title} — documentary photograph`}
                  className="aspect-16/9 w-full object-cover"
                />
              </figure>
            </Reveal>
          ) : null}

          <div className="mt-14 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7 lg:col-start-3">
              {story.excerpt ? (
                <Reveal>
                  <p className="max-w-[58ch] font-display text-xl leading-relaxed text-ink sm:text-2xl">
                    {story.excerpt}
                  </p>
                </Reveal>
              ) : null}
              {body.map((p, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-ink/70 sm:text-lg">
                    {p}
                  </p>
                </Reveal>
              ))}
              {story.quote ? (
                <Reveal delay={80}>
                  <blockquote className="mt-12 border-l-2 border-honey pl-6">
                    <p className="max-w-[36ch] font-display text-2xl leading-snug tracking-tight text-ink sm:text-3xl">
                      {story.quote}
                    </p>
                  </blockquote>
                </Reveal>
              ) : null}
            </div>
          </div>

          {more.length > 0 ? (
            <div className="mt-24 border-t border-ink/15 pt-8 sm:mt-32">
              <p className="eyebrow text-ink/45">More stories</p>
              <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {more.map((s, i) => (
                  <Reveal key={s.id} delay={i * 100}>
                    <StoryCard story={s} />
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </SiteLayout>
  );
}
