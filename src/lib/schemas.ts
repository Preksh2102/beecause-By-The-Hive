import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  subject: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(1, "Please write a message").max(4000),
  website: z.string().max(0).optional().default(""), // honeypot
});
export type ContactInput = z.infer<typeof contactSchema>;

export const volunteerSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(40).optional().default(""),
  interests: z.array(z.string().trim().max(60)).max(12).optional().default([]),
  availability: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  website: z.string().max(0).optional().default(""), // honeypot
});
export type VolunteerInput = z.infer<typeof volunteerSchema>;

export const bodySectionSchema = z.object({
  heading: z.string().trim().max(160),
  paragraphs: z.array(z.string().max(4000)),
});

export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  number: z.string().trim().max(8).default(""),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1000).default(""),
  category: z.string().trim().max(80).default(""),
  year: z.string().trim().max(20).default(""),
  location: z.string().trim().max(160).default(""),
  intro: z.string().trim().max(2000).default(""),
  cover_image: z.string().trim().max(500).default(""),
  gallery: z.array(z.string().max(500)).max(24).default([]),
  body: z.array(bodySectionSchema).max(20).default([]),
  facts: z
    .array(z.object({ label: z.string().max(80), value: z.string().max(300) }))
    .max(12)
    .default([]),
  published: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(9999).default(0),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const storySchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  title: z.string().trim().min(1).max(200),
  category: z.string().trim().max(80).default(""),
  excerpt: z.string().trim().max(1000).default(""),
  author: z.string().trim().max(120).default(""),
  story_date: z.string().trim().max(60).default(""),
  quote: z.string().trim().max(600).default(""),
  cover_image: z.string().trim().max(500).default(""),
  body: z.array(z.string().max(6000)).max(60).default([]),
  published: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(9999).default(0),
});
export type StoryInput = z.infer<typeof storySchema>;

export const volunteerRecordSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(120),
  role: z.string().trim().max(120).default(""),
  blurb: z.string().trim().max(600).default(""),
  avatar_url: z.string().trim().max(500).default(""),
  active: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(9999).default(0),
});
export type VolunteerRecordInput = z.infer<typeof volunteerRecordSchema>;
