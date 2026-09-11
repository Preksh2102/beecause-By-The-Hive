import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Hero, Statement } from "@/components/sections/Hero";
import { FeaturedProjects, Impact } from "@/components/sections/Work";
import { About, FeaturedStories, FinalMoment, Pathways } from "@/components/sections/Stories";
import { VolunteerMeadowSection } from "@/components/VolunteerMeadow";
import { listHomeContent } from "@/lib/content.functions";

const title = "Beecause by The Hive — Creating Change Together";
const description =
  "Beecause by The Hive brings creativity, community and action together to create meaningful change.";

export const Route = createFileRoute("/")({
  loader: () => listHomeContent(),
  component: Index,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Beecause by The Hive",
          description,
          logo: "/images/beecause-logo.png",
        }),
      },
    ],
  }),
});

function Index() {
  const { projects, stories, volunteers } = Route.useLoaderData();
  return (
    <SiteLayout>
      <Hero />
      <Statement />
      <FeaturedProjects projects={projects} />
      <Impact />
      <FeaturedStories stories={stories} />
      <About />
      <VolunteerMeadowSection volunteers={volunteers} />
      <Pathways />
      <FinalMoment />
    </SiteLayout>
  );
}
