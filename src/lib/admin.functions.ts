import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { projectSchema, storySchema, volunteerRecordSchema } from "./schemas";

const auth = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]);
const authGet = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]);

type AdminContext = {
  supabase: {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
  };
  userId: string;
};

async function assertAdmin(context: AdminContext) {
  // 1. Fallback: If context.userId is dropped by the router, retrieve it securely from the active Supabase token
  const resolvedUserId =
    context.userId || (await (context.supabase as any).auth.getUser()).data.user?.id;

  if (!resolvedUserId) {
    throw new Error("Administrator access required: No active session found.");
  }

  // 2. Query your fixed, clean database RPC function using the accurate user UUID
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: resolvedUserId,
    _role: "admin",
  });

  if (error || !data) {
    throw new Error("Administrator access required");
  }
}

export const getAdminStatus = authGet.handler(async ({ context }) => {
  const { data } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  return { isAdmin: Boolean(data) };
});

export const adminDashboard = authGet.handler(async ({ context }) => {
  await assertAdmin(context as never);
  const s = context.supabase;
  const [projects, stories, volunteers, applications, submissions] = await Promise.all([
    s.from("projects").select("*").order("sort_order"),
    s.from("stories").select("*").order("sort_order"),
    s.from("volunteers").select("*").order("sort_order"),
    s.from("volunteer_applications").select("*").order("created_at", { ascending: false }),
    s.from("contact_submissions").select("*").order("created_at", { ascending: false }),
  ]);
  return {
    projects: projects.data ?? [],
    stories: stories.data ?? [],
    volunteers: volunteers.data ?? [],
    applications: applications.data ?? [],
    submissions: submissions.data ?? [],
  };
});

export const saveProject = auth
  .inputValidator((data: unknown) => projectSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase.from("projects").upsert(data as never, {
      onConflict: "id",
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const saveStory = auth
  .inputValidator((data: unknown) => storySchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase.from("stories").upsert(data as never, {
      onConflict: "id",
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const saveVolunteer = auth
  .inputValidator((data: unknown) => volunteerRecordSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase.from("volunteers").upsert(data as never, {
      onConflict: "id",
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const deleteInput = (data: unknown) => {
  const d = data as { table: string; id: string };
  const table = [
    "projects",
    "stories",
    "volunteers",
    "volunteer_applications",
    "contact_submissions",
  ].includes(d.table)
    ? d.table
    : null;
  if (!table) throw new Error("Unknown table");
  return { table: table as "projects", id: String(d.id) };
};

export const deleteRecord = auth.inputValidator(deleteInput).handler(async ({ data, context }) => {
  await assertAdmin(context as never);
  const { error } = await context.supabase.from(data.table).delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return { ok: true as const };
});

export const setApplicationStatus = auth
  .inputValidator((data: unknown) => {
    const d = data as { id: string; status: string };
    const status = ["pending", "approved", "rejected"].includes(d.status) ? d.status : "pending";
    return { id: String(d.id), status };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const s = context.supabase;
    const { data: application, error } = await s
      .from("volunteer_applications")
      .update({ status: data.status, reviewed_at: new Date().toISOString() })
      .eq("id", data.id)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);

    if (data.status === "approved" && application) {
      const { data: existing } = await s
        .from("volunteers")
        .select("id")
        .eq("application_id", application.id)
        .maybeSingle();
      if (!existing) {
        await s.from("volunteers").insert({
          name: application.name,
          role: "Volunteer",
          blurb: "",
          avatar_url: "",
          active: true,
          application_id: application.id,
        });
      }
    }
    return { ok: true as const };
  });

export const setSubmissionStatus = auth
  .inputValidator((data: unknown) => {
    const d = data as { id: string; status: string };
    const status = ["new", "read", "handled"].includes(d.status) ? d.status : "new";
    return { id: String(d.id), status };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase
      .from("contact_submissions")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
