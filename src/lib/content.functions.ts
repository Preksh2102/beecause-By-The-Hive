import { createServerFn } from "@tanstack/react-start";
import type { Database } from "@/integrations/supabase/types";

export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type StoryRow = Database["public"]["Tables"]["stories"]["Row"];
export type VolunteerRow = Database["public"]["Tables"]["volunteers"]["Row"];

export type BodySection = { heading: string; paragraphs: string[] };
export type Fact = { label: string; value: string };

export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicSupabase } = await import("./supabase-public.server");
  const { data, error } = await createPublicSupabase()
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as ProjectRow[];
});

export const getProject = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug).slice(0, 120) }))
  .handler(async ({ data }) => {
    const { createPublicSupabase } = await import("./supabase-public.server");
    const supabase = createPublicSupabase();
    const [{ data: project, error }, { data: all }] = await Promise.all([
      supabase
        .from("projects")
        .select("*")
        .eq("slug", data.slug)
        .eq("published", true)
        .maybeSingle(),
      supabase
        .from("projects")
        .select("slug, title, cover_image, number")
        .eq("published", true)
        .order("sort_order", { ascending: true }),
    ]);
    if (error) throw new Error(error.message);
    return { project: (project ?? null) as ProjectRow | null, all: all ?? [] };
  });

export const listStories = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicSupabase } = await import("./supabase-public.server");
  const { data, error } = await createPublicSupabase()
    .from("stories")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as StoryRow[];
});

export const getStory = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug).slice(0, 120) }))
  .handler(async ({ data }) => {
    const { createPublicSupabase } = await import("./supabase-public.server");
    const supabase = createPublicSupabase();
    const [{ data: story, error }, { data: all }] = await Promise.all([
      supabase
        .from("stories")
        .select("*")
        .eq("slug", data.slug)
        .eq("published", true)
        .maybeSingle(),
      supabase
        .from("stories")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true }),
    ]);
    if (error) throw new Error(error.message);
    return { story: (story ?? null) as StoryRow | null, all: (all ?? []) as StoryRow[] };
  });

export const listVolunteers = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicSupabase } = await import("./supabase-public.server");
  const { data, error } = await createPublicSupabase()
    .from("volunteers")
    .select("id, name, role, blurb, avatar_url, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listHomeContent = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicSupabase } = await import("./supabase-public.server");
  const supabase = createPublicSupabase();
  const [projects, stories, volunteers] = await Promise.all([
    supabase.from("projects").select("*").eq("published", true).order("sort_order").limit(3),
    supabase.from("stories").select("*").eq("published", true).order("sort_order").limit(2),
    supabase
      .from("volunteers")
      .select("id, name, role, blurb, avatar_url, sort_order")
      .eq("active", true)
      .order("sort_order"),
  ]);
  return {
    projects: (projects.data ?? []) as ProjectRow[],
    stories: (stories.data ?? []) as StoryRow[],
    volunteers: volunteers.data ?? [],
  };
});
