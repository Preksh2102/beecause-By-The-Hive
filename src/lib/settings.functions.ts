import { createServerFn } from "@tanstack/react-start";
import { parseSiteSettings, defaultSiteSettings, type SiteSettings } from "./site-settings";

export const getSiteSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteSettings> => {
    try {
      const { createPublicSupabase } = await import("./supabase-public.server");
      const { data } = await createPublicSupabase()
        .from("site_settings")
        .select("data")
        .eq("id", "default")
        .maybeSingle();
      return parseSiteSettings((data as { data?: unknown } | null)?.data);
    } catch {
      return defaultSiteSettings;
    }
  },
);
