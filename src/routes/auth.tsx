import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { getAdminStatus } from "@/lib/admin.functions";

const title = "Admin sign in — Beecause by The Hive";
const description = "Secure sign in for Beecause by The Hive administrators.";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "signing-in">("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      if (data.user) {
        try {
          const result = await getAdminStatus();
          if (result.isAdmin) {
            await navigate({ to: "/admin", replace: true });
            return;
          }
          await supabase.auth.signOut();
        } catch {
          await supabase.auth.signOut();
        }
      }
      if (active) setStatus("idle");
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("signing-in");
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("The email or password is incorrect.");
      setStatus("idle");
      return;
    }
    try {
      const result = await getAdminStatus();
      if (!result.isAdmin) {
        await supabase.auth.signOut();
        setError("This account does not have administrator access.");
        setStatus("idle");
        return;
      }
      await navigate({ to: "/admin", replace: true });
    } catch {
      await supabase.auth.signOut();
      setError("We could not verify administrator access. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-warm px-5 py-16 text-ink">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-12 inline-flex items-center gap-2 text-base text-ink/70 hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" /> Home
        </Link>
        <img
          src="/images/beecause-logo.png"
          alt="Beecause by The Hive"
          className="h-20 w-20 rounded-full"
        />
        <p className="eyebrow mt-8 text-honey">Private area</p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Admin sign in</h1>
        <p className="mt-4 text-base leading-relaxed text-ink/65">
          Use your approved administrator account.
        </p>

        <form onSubmit={signIn} className="mt-10 space-y-5 border-t border-ink/20 pt-8">
          <label className="block text-base text-ink/75">
            Email
            <Input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 h-12 border-ink/30 bg-transparent text-ink placeholder:text-ink/35"
            />
          </label>
          <label className="block text-base text-ink/75">
            Password
            <Input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 h-12 border-ink/30 bg-transparent text-ink"
            />
          </label>
          {error ? (
            <p role="alert" className="text-base text-rose">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={status !== "idle"} className="h-12 w-full rounded-full">
            {status !== "idle" ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : null}
            {status === "checking"
              ? "Checking session…"
              : status === "signing-in"
                ? "Signing in…"
                : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
