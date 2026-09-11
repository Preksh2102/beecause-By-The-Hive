import { useCallback, useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LoaderCircle, LogOut, Plus, RefreshCw, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  adminDashboard,
  deleteRecord,
  saveProject,
  saveStory,
  saveVolunteer,
  setApplicationStatus,
  setSubmissionStatus,
} from "@/lib/admin.functions";

type Dashboard = Awaited<ReturnType<typeof adminDashboard>>;
type Project = Database["public"]["Tables"]["projects"]["Row"];
type Story = Database["public"]["Tables"]["stories"]["Row"];
type Volunteer = Database["public"]["Tables"]["volunteers"]["Row"];
type Editable = Project | Story | Volunteer;
type EditableKind = "projects" | "stories" | "volunteers";

const emptyProject = {
  slug: "", number: "", title: "", description: "", category: "", year: "", location: "",
  intro: "", cover_image: "", gallery: [], body: [], facts: [], published: true, sort_order: 0,
};
const emptyStory = {
  slug: "", title: "", category: "", excerpt: "", author: "", story_date: "", quote: "",
  cover_image: "", body: [], published: true, sort_order: 0,
};
const emptyVolunteer = {
  name: "", role: "", blurb: "", avatar_url: "", active: true, sort_order: 0,
};

const title = "Admin dashboard — Beecause by The Hive";
const description = "Manage Beecause projects, stories, volunteers, applications and messages.";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ kind: EditableKind; item: Partial<Editable> } | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await adminDashboard());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The dashboard could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  async function signOut() {
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }

  async function remove(table: EditableKind | "volunteer_applications" | "contact_submissions", id: string) {
    if (!window.confirm("Delete this item permanently?")) return;
    try {
      await deleteRecord({ data: { table, id } });
      toast.success("Deleted");
      await refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not delete this item.");
    }
  }

  if (loading && !data) {
    return <div className="grid min-h-screen place-items-center bg-warm text-ink"><LoaderCircle className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <main className="min-h-screen bg-warm text-ink">
      <header className="border-b border-ink/20">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <img src="/images/beecause-logo.png" alt="" className="h-11 w-11 rounded-full" />
            <div><p className="eyebrow text-honey">Beecause</p><h1 className="font-display text-2xl">Admin dashboard</h1></div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => void refresh()} aria-label="Refresh dashboard"><RefreshCw /></Button>
            <Button variant="outline" size="icon" onClick={() => void signOut()} aria-label="Sign out"><LogOut /></Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-12">
        {error ? <div role="alert" className="mb-8 border border-rose p-4 text-base text-rose">{error}</div> : null}
        <Tabs defaultValue="projects">
          <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-none border-b border-ink/20 bg-transparent p-0">
            {(["projects", "stories", "volunteers", "applications", "messages"] as const).map((tab) => (
              <TabsTrigger key={tab} value={tab} className="rounded-none px-4 py-3 capitalize data-[state=active]:bg-ink data-[state=active]:text-warm">{tab}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="projects"><EditableList title="Projects" items={data?.projects ?? []} onAdd={() => setEditor({ kind: "projects", item: emptyProject })} onEdit={(item) => setEditor({ kind: "projects", item })} onDelete={(id) => remove("projects", id)} /></TabsContent>
          <TabsContent value="stories"><EditableList title="Stories" items={data?.stories ?? []} onAdd={() => setEditor({ kind: "stories", item: emptyStory })} onEdit={(item) => setEditor({ kind: "stories", item })} onDelete={(id) => remove("stories", id)} /></TabsContent>
          <TabsContent value="volunteers"><EditableList title="Volunteers" items={data?.volunteers ?? []} onAdd={() => setEditor({ kind: "volunteers", item: emptyVolunteer })} onEdit={(item) => setEditor({ kind: "volunteers", item })} onDelete={(id) => remove("volunteers", id)} /></TabsContent>
          <TabsContent value="applications"><StatusList items={data?.applications ?? []} kind="application" onDelete={(id) => remove("volunteer_applications", id)} onChanged={refresh} /></TabsContent>
          <TabsContent value="messages"><StatusList items={data?.submissions ?? []} kind="message" onDelete={(id) => remove("contact_submissions", id)} onChanged={refresh} /></TabsContent>
        </Tabs>
      </div>
      {editor ? <Editor kind={editor.kind} initial={editor.item} onClose={() => setEditor(null)} onSaved={async () => { setEditor(null); await refresh(); }} /> : null}
    </main>
  );
}

function EditableList({ title, items, onAdd, onEdit, onDelete }: { title: string; items: Editable[]; onAdd: () => void; onEdit: (item: Editable) => void; onDelete: (id: string) => void }) {
  return <section className="pt-8">
    <div className="flex items-center justify-between"><h2 className="font-display text-3xl">{title}</h2><Button onClick={onAdd}><Plus /> Add</Button></div>
    <div className="mt-6 divide-y divide-ink/15 border-y border-ink/15">
      {items.length ? items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-4">
        <div className="min-w-0"><p className="truncate font-medium">{String((item as Record<string, unknown>)['name'] ?? (item as Record<string, unknown>)['title'] ?? "")}</p><p className="mt-1 text-base text-ink/55">{"published" in item ? (item.published ? "Published" : "Draft") : item.active ? "Visible" : "Hidden"}</p></div>
        <div className="flex shrink-0 gap-2"><Button variant="outline" onClick={() => onEdit(item)}>Edit</Button><Button variant="outline" size="icon" aria-label="Delete" onClick={() => onDelete(item.id)}><Trash2 /></Button></div>
      </div>) : <p className="py-8 text-base text-ink/60">No items yet.</p>}
    </div>
  </section>;
}

function Editor({ kind, initial, onClose, onSaved }: { kind: EditableKind; initial: Partial<Editable>; onClose: () => void; onSaved: () => Promise<void> }) {
  const [item, setItem] = useState<Record<string, unknown>>(initial as Record<string, unknown>);
  const [saving, setSaving] = useState(false);
  const set = (key: string, value: unknown) => setItem((current) => ({ ...current, [key]: value }));
  const text = (key: string) => String(item[key] ?? "");
  const number = (key: string) => Number(item[key] ?? 0);
  const checked = (key: string) => Boolean(item[key]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true);
    try {
      if (kind === "projects") await saveProject({ data: item as never });
      if (kind === "stories") await saveStory({ data: item as never });
      if (kind === "volunteers") await saveVolunteer({ data: item as never });
      toast.success("Saved"); await onSaved();
    } catch (caught) { toast.error(caught instanceof Error ? caught.message : "Could not save."); setSaving(false); }
  }

  const fields = kind === "projects"
    ? [["title", "Title"], ["slug", "Slug"], ["number", "Number"], ["category", "Category"], ["year", "Year"], ["location", "Location"], ["cover_image", "Cover image URL"]]
    : kind === "stories"
      ? [["title", "Title"], ["slug", "Slug"], ["category", "Category"], ["author", "Author"], ["story_date", "Date"], ["cover_image", "Cover image URL"]]
      : [["name", "Name"], ["role", "Role"], ["avatar_url", "Photo URL"]];

  return <div className="fixed inset-0 z-[80] overflow-y-auto bg-warm/95 px-5 py-8 backdrop-blur-md">
    <form onSubmit={save} className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between"><h2 className="font-display text-3xl">{item['id'] ? "Edit" : "Add"} {kind.slice(0, -1)}</h2><Button type="button" variant="outline" size="icon" onClick={onClose} aria-label="Close editor"><X /></Button></div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {fields.map(([key, label]) => <label key={key} className="text-base text-ink/70">{label}<Input required={key === "title" || key === "slug" || key === "name"} value={text(String(key))} onChange={(e) => set(String(key), e.target.value)} className="mt-2 h-11 border-ink/30" /></label>)}
        <label className="text-base text-ink/70">Sort order<Input type="number" min={0} value={number("sort_order")} onChange={(e) => set("sort_order", Number(e.target.value))} className="mt-2 h-11 border-ink/30" /></label>
      </div>
      {kind === "projects" ? <>
        <LongField label="Card description" value={text("description")} onChange={(v) => set("description", v)} />
        <LongField label="Introduction" value={text("intro")} onChange={(v) => set("intro", v)} />
        <JsonField label="Body sections (JSON)" value={item['body']} onChange={(v) => set("body", v)} />
        <JsonField label="Facts (JSON)" value={item['facts']} onChange={(v) => set("facts", v)} />
        <JsonField label="Gallery image URLs (JSON)" value={item['gallery']} onChange={(v) => set("gallery", v)} />
      </> : null}
      {kind === "stories" ? <><LongField label="Excerpt" value={text("excerpt")} onChange={(v) => set("excerpt", v)} /><LongField label="Quote" value={text("quote")} onChange={(v) => set("quote", v)} /><JsonField label="Story paragraphs (JSON)" value={item['body']} onChange={(v) => set("body", v)} /></> : null}
      {kind === "volunteers" ? <LongField label="Short biography" value={text("blurb")} onChange={(v) => set("blurb", v)} /> : null}
      <label className="mt-6 flex items-center gap-3 text-base"><Switch checked={kind === "volunteers" ? checked("active") : checked("published")} onCheckedChange={(v) => set(kind === "volunteers" ? "active" : "published", v)} />{kind === "volunteers" ? "Visible on site" : "Published"}</label>
      <div className="mt-8 flex gap-3"><Button type="submit" disabled={saving}><Save />{saving ? "Saving…" : "Save"}</Button><Button type="button" variant="outline" onClick={onClose}>Cancel</Button></div>
    </form>
  </div>;
}

function LongField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="mt-5 block text-base text-ink/70">{label}<Textarea value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 min-h-24 border-ink/30" /></label>;
}

function JsonField({ label, value, onChange }: { label: string; value: unknown; onChange: (value: unknown) => void }) {
  const [raw, setRaw] = useState(JSON.stringify(value ?? [], null, 2));
  const [invalid, setInvalid] = useState(false);
  return <label className="mt-5 block text-base text-ink/70">{label}<Textarea value={raw} onChange={(e) => { setRaw(e.target.value); try { onChange(JSON.parse(e.target.value)); setInvalid(false); } catch { setInvalid(true); } }} className="mt-2 min-h-32 border-ink/30 font-mono text-base" />{invalid ? <span className="mt-1 block text-base text-rose">Enter valid JSON before saving.</span> : null}</label>;
}

function StatusList({ items, kind, onDelete, onChanged }: { items: Dashboard["applications"] | Dashboard["submissions"]; kind: "application" | "message"; onDelete: (id: string) => void; onChanged: () => Promise<void> }) {
  async function change(id: string, status: string) {
    try {
      if (kind === "application") await setApplicationStatus({ data: { id, status } });
      else await setSubmissionStatus({ data: { id, status } });
      toast.success("Status updated"); await onChanged();
    } catch (caught) { toast.error(caught instanceof Error ? caught.message : "Could not update status."); }
  }
  return <section className="pt-8"><h2 className="font-display text-3xl">{kind === "application" ? "Volunteer applications" : "Contact messages"}</h2><div className="mt-6 space-y-4">
    {items.length ? items.map((item) => <article key={item.id} className="border border-ink/20 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="font-display text-xl">{item.name}</h3><a href={`mailto:${item.email}`} className="text-base text-ink/65">{item.email}</a></div><Button variant="outline" size="icon" aria-label="Delete" onClick={() => onDelete(item.id)}><Trash2 /></Button></div>
      {"subject" in item && item.subject ? <p className="mt-4 font-medium">{item.subject}</p> : null}<p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink/70">{item.message}</p>
      {"interests" in item && item.interests.length ? <p className="mt-3 text-base text-ink/55">Interests: {item.interests.join(", ")}</p> : null}
      <div className="mt-5 flex flex-wrap gap-2">{(kind === "application" ? ["pending", "approved", "rejected"] : ["new", "read", "handled"]).map((status) => <Button key={status} type="button" size="sm" variant={item.status === status ? "default" : "outline"} onClick={() => void change(item.id, status)}>{status}</Button>)}</div>
    </article>) : <p className="text-base text-ink/60">Nothing here yet.</p>}
  </div></section>;
}