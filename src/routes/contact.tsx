import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { submitContact } from "@/lib/forms.functions";
import { social } from "@/data/site";

const title = "Contact — Beecause by The Hive";
const description = "Get in touch with Beecause by The Hive about projects, partnerships or press.";

export const Route = createFileRoute("/contact")({
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
  component: ContactPage,
});

const field =
  "mt-2 w-full rounded-none border border-ink/25 bg-transparent px-4 py-3 text-base text-ink outline-none placeholder:text-ink/35 focus:border-ink";

function ContactPage() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    setError(null);
    try {
      await submitContact({
        data: {
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          subject: String(form.get("subject") ?? ""),
          message: String(form.get("message") ?? ""),
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
      <PageHeader eyebrow="Contact" title="Say hello to the hive." intro={description} />
      <section className="bg-warm pb-28">
        <div className="mx-auto grid max-w-[1600px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          <Reveal className="lg:col-span-4">
            <div className="border-t border-ink/15 pt-6 text-base text-ink/70">
              <p className="eyebrow text-ink/45">Details</p>
              <p className="mt-5">{social.contactEmail}</p>
              <p className="mt-2">{social.contactPhone}</p>
              <p className="mt-2">{social.location}</p>
            </div>
          </Reveal>

          <Reveal delay={90} className="lg:col-span-7 lg:col-start-6">
            {state === "done" ? (
              <div className="border-t border-ink/15 pt-10">
                <p className="font-display text-2xl tracking-tight text-ink sm:text-3xl">
                  Thank you — your message is with us.
                </p>
                <p className="mt-3 text-base text-ink/65">We&rsquo;ll be in touch soon.</p>
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
                </div>
                <label className="mt-6 block text-base text-ink/70">
                  Subject
                  <input
                    name="subject"
                    maxLength={160}
                    className={field}
                    placeholder="What is this about?"
                  />
                </label>
                <label className="mt-6 block text-base text-ink/70">
                  Message
                  <textarea
                    name="message"
                    required
                    rows={6}
                    maxLength={4000}
                    className={field}
                    placeholder="Tell us more…"
                  />
                </label>
                {error ? <p className="mt-4 text-base text-rose">{error}</p> : null}
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="mt-8 inline-flex items-center rounded-full bg-ink px-7 py-3 text-base font-medium text-warm transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {state === "sending" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
