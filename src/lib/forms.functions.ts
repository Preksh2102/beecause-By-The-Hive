import { createServerFn } from "@tanstack/react-start";
import { contactSchema, volunteerSchema } from "./schemas";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const };
    const { createPublicSupabase } = await import("./supabase-public.server");
    const { error } = await createPublicSupabase()
      .from("contact_submissions")
      .insert({
        name: data.name,
        email: data.email,
        subject: data.subject ?? "",
        message: data.message,
      });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const submitVolunteerApplication = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => volunteerSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const };
    const { createPublicSupabase } = await import("./supabase-public.server");
    const { error } = await createPublicSupabase()
      .from("volunteer_applications")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone ?? "",
        interests: data.interests ?? [],
        availability: data.availability ?? "",
        message: data.message ?? "",
      });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
