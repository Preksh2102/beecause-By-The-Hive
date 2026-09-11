import type { ReactNode } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/sections/SiteFooter";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-base focus:text-warm"
      >
        Skip to content
      </a>
      <SiteNav />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="bg-warm pb-14 pt-32 sm:pt-40">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <p className="eyebrow text-honey">{eyebrow}</p>
        <h1 className="display-lg mt-5 max-w-[18ch] text-ink">{title}</h1>
        {intro ? (
          <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-ink/70">{intro}</p>
        ) : null}
      </div>
    </section>
  );
}
