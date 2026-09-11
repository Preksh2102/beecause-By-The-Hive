import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { submitVolunteerApplication } from "@/lib/forms.functions";

const title = "Volunteer — Beecause by The Hive";
const description =
  "Join the hive. Apply to volunteer with Beecause by The Hive and add your name to the bee's trail.";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VolunteerPage,
});

const INTERESTS = [
  "Workshops",
  "Making & craft",
  "Events",
  "Photography",
  "Outreach",
  "Fundraising",
];

const field =
  "mt-2 w-full rounded-none border border-ink/25 bg-transparent px-4 py-3 text-base text-ink outline-none placeholder:text-ink/35 focus:border-ink";

function VolunteerPage() {
  const [interests, setInterests] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  function toggle(v: string) {
    setInterests((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    setError(null);
    try {
      await submitVolunteerApplication({
        data: {
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          availability: String(form.get("availability") ?? ""),
          message: String(form.get("message") ?? ""),
          interests,
          website: String(form.get("website") ?? ""),
        },
      });
      setState("done");
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <SiteLayout>
      <PageHeader eyebrow="Volunteer" title="Add your name to the trail." intro={description} />
      <section className="bg-warm pb-28">
        <div className="mx-auto grid max-w-[1600px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          <Reveal className="lg:col-span-4">
            <div className="border-t border-ink/15 pt-6">
              <p className="eyebrow text-ink/45">How it works</p>
              <ol className="mt-6 space-y-5 text-base leading-relaxed text-ink/70">
                <li>1. Tell us a little about you and what you&rsquo;d love to do.</li>
                <li>2. We read every application and get back to you.</li>
                <li>3. Once you join, your name blooms in the bee&rsquo;s trail on our site.</li>
              </ol>
            </div>
          </Reveal>

          <Reveal delay={90} className="lg:col-span-7 lg:col-start-6">
            {state === "done" ? (
              <div className="border-t border-ink/15 pt-10">
                <p className="font-display text-2xl tracking-tight text-ink sm:text-3xl">
                  Welcome — your application is in.
                </p>
                <p className="mt-3 text-base text-ink/65">
                  We&rsquo;ll be in touch shortly about next steps.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="border-t border-ink/15 pt-10">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block text-base text-ink/70">
                    Your name
                    <input
                      name="name"
                      required
                      maxLength={120}
                      className={field}
                      placeholder="Name"
                    />
                  </label>
                  <label className="block text-base text-ink/70">
                    Email
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={255}
                      className={field}
                      placeholder="you@example.com"
                    />
                  </label>
                  <label className="block text-base text-ink/70">
                    Phone (optional)
                    <input name="phone" maxLength={40} className={field} placeholder="Phone" />
                  </label>
                  <label className="block text-base text-ink/70">
                    Availability
                    <input
                      name="availability"
                      maxLength={200}
                      className={field}
                      placeholder="e.g. weekends"
                    />
                  </label>
                </div>

                <fieldset className="mt-8">
                  <legend className="text-base text-ink/70">What are you drawn to?</legend>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {INTERESTS.map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggle(i)}
                        aria-pressed={interests.includes(i)}
                        className={`rounded-full border px-4 py-2 text-base transition-colors ${
                          interests.includes(i)
                            ? "border-ink bg-ink text-warm"
                            : "border-ink/25 text-ink/70 hover:border-ink"
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="mt-8 block text-base text-ink/70">
                  Anything else?
                  <textarea
                    name="message"
                    rows={5}
                    maxLength={2000}
                    className={field}
                    placeholder="Tell us about yourself…"
                  />
                </label>

                {error ? <p className="mt-4 text-base text-rose">{error}</p> : null}
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="mt-8 inline-flex items-center rounded-full bg-ink px-7 py-3 text-base font-medium text-warm transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {state === "sending" ? "Sending…" : "Send application"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
