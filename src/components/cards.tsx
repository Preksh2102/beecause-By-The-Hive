import { Link } from "@tanstack/react-router";
import { HandArrow } from "@/components/marks";

type ProjectCardData = {
  slug: string;
  number?: string;
  title: string;
  description?: string;
  category?: string;
  year?: string;
  cover_image?: string;
};

export function ProjectCard({
  project,
  imageClass = "aspect-4/5",
}: {
  project: ProjectCardData;
  imageClass?: string;
}) {
  return (
    <Link to="/projects/$slug" params={{ slug: project.slug }} className="group block">
      <figure className="overflow-hidden bg-cream">
        <img
          src={project.cover_image || "/images/project-01.jpg"}
          alt={`${project.title} — documentary photograph`}
          loading="lazy"
          className={`${imageClass} w-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.04]`}
        />
      </figure>
      <div className="pt-6">
        <div className="flex items-baseline gap-4">
          {project.number ? (
            <span className="font-display text-4xl leading-none text-honey sm:text-5xl">
              {project.number}
            </span>
          ) : null}
          <span className="eyebrow text-ink/50">
            {[project.category, project.year].filter(Boolean).join(" · ")}
          </span>
        </div>
        <h3 className="mt-4 font-display text-2xl tracking-tight text-ink sm:text-3xl">
          {project.title}
        </h3>
        {project.description ? (
          <p className="mt-3 max-w-[44ch] text-base leading-relaxed text-ink/65">
            {project.description}
          </p>
        ) : null}
        <span className="mt-5 inline-flex items-center gap-3 text-base font-medium text-ink">
          View project
          <HandArrow className="h-4 w-10 text-honey transition-transform duration-500 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}

type StoryCardData = {
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  author?: string;
  story_date?: string;
  cover_image?: string;
};

export function StoryCard({ story }: { story: StoryCardData }) {
  return (
    <Link to="/stories/$slug" params={{ slug: story.slug }} className="group block">
      <figure className="overflow-hidden bg-cream">
        <img
          src={story.cover_image || "/images/story-01.jpg"}
          alt={`${story.title} — story photograph`}
          loading="lazy"
          className="aspect-3/2 w-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.04]"
        />
      </figure>
      <p className="eyebrow mt-5 text-ink/50">
        {[story.category, story.story_date].filter(Boolean).join(" · ")}
      </p>
      <h3 className="mt-3 font-display text-2xl tracking-tight text-ink">{story.title}</h3>
      {story.excerpt ? (
        <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-ink/65">{story.excerpt}</p>
      ) : null}
      <span className="mt-4 inline-flex items-center gap-3 text-base font-medium text-ink">
        Read story
        <HandArrow className="h-4 w-10 text-honey transition-transform duration-500 group-hover:translate-x-1.5" />
      </span>
    </Link>
  );
}
