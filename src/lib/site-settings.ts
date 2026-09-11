import { z } from "zod";
import { getRouteApi } from "@tanstack/react-router";

const hex = z
  .string()
  .trim()
  .regex(/^#[0-9a-fA-F]{6}$/, "Use a colour like #390099");

export const siteSettingsSchema = z.object({
  colors: z
    .object({
      background: hex.default("#390099"),
      text: hex.default("#ffbd00"),
      surface: hex.default("#9e0059"),
      accent: hex.default("#ff0054"),
      highlight: hex.default("#ff5400"),
    })
    .default({}),
  home: z
    .object({
      heroEyebrow: z.string().max(120).default("Creativity · Community · Action"),
      heroTitleBefore: z.string().max(200).default("Good things happen when we"),
      heroTitleHighlight: z.string().max(80).default("do them"),
      heroTitleAfter: z.string().max(200).default("together."),
      heroIntro: z
        .string()
        .max(600)
        .default(
          "Beecause by The Hive brings creativity, community and action together to create meaningful change.",
        ),
      heroImage: z.string().max(500).default("/images/hero.jpg"),
      heroImageAlt: z
        .string()
        .max(300)
        .default("People working together on a collaborative artwork in a community workshop"),
      primaryCtaLabel: z.string().max(60).default("Explore our work"),
      secondaryCtaLabel: z.string().max(60).default("Get involved"),
      statementTitle: z
        .string()
        .max(300)
        .default("A hive works because everyone has a part to play."),
      statementEyebrow: z.string().max(80).default("Our idea"),
      statementBody: z.string().max(1200).default("[CLIENT INTRO COPY REQUIRED]"),
    })
    .default({}),
  contact: z
    .object({
      email: z.string().max(160).default("[CONTACT EMAIL REQUIRED]"),
      phone: z.string().max(60).default("[CONTACT NUMBER REQUIRED]"),
      location: z.string().max(200).default("[LOCATION REQUIRED]"),
      instagram: z.string().max(300).default("https://instagram.com/"),
    })
    .default({}),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const defaultSiteSettings: SiteSettings = siteSettingsSchema.parse({});

export function parseSiteSettings(value: unknown): SiteSettings {
  const result = siteSettingsSchema.safeParse(value ?? {});
  return result.success ? result.data : defaultSiteSettings;
}

/** CSS custom properties that repaint the whole site from the saved colours. */
export function settingsToCssVars(settings: SiteSettings): string {
  const c = settings.colors;
  return `:root{
--color-indigo:${c.background};--color-berry:${c.surface};--color-rose:${c.accent};--color-flame:${c.highlight};--color-amber:${c.text};
--color-warm:${c.background};--color-soft:${c.surface};--color-cream:${c.surface};--color-ink:${c.text};
--color-honey:${c.accent};--color-honey-soft:${c.highlight};--color-sage:${c.highlight};--color-terracotta:${c.highlight};--color-pollen:${c.text};--color-leaf:${c.highlight};--color-plum:${c.surface};--color-azure:${c.accent};
--background:${c.background};--foreground:${c.text};--card:${c.surface};--card-foreground:${c.text};--popover:${c.surface};--popover-foreground:${c.text};--primary:${c.accent};--primary-foreground:${c.text};--secondary:${c.surface};--secondary-foreground:${c.text};--muted:${c.surface};--muted-foreground:${c.text};--accent:${c.highlight};--accent-foreground:${c.background};--destructive:${c.accent};--destructive-foreground:${c.text};--border:${c.surface};--input:${c.surface};--ring:${c.accent};
}`;
}

const rootApi = getRouteApi("__root__");

export function useSiteSettings(): SiteSettings {
  const data = rootApi.useLoaderData() as { settings?: SiteSettings } | undefined;
  return data?.settings ?? defaultSiteSettings;
}
