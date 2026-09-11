import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { nav, social } from "@/data/site";

function Logo({ size = 52 }: { size?: number }) {
  return (
    <img
      src="/images/beecause-logo.png"
      alt="Beecause by The Hive"
      width={size}
      height={size}
      className="rounded-full"
      style={{ width: size, height: size, objectFit: "cover" }}
    />
  );
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-border bg-warm/90 py-2 backdrop-blur-md"
            : "bg-transparent py-4 sm:py-6"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link to="/" className="flex items-center gap-3" aria-label="Beecause by The Hive — home">
            <Logo size={scrolled ? 40 : 52} />
            <span className="sr-only">Beecause by The Hive</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-ink" }}
                className="link-underline text-[0.9rem] tracking-tight text-ink/80 transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <a
              href={social.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="link-underline text-[0.9rem] text-ink/70 hover:text-ink"
            >
              Instagram
            </a>
            <Link
              to="/volunteer"
              className="rounded-full border border-ink px-5 py-2 text-[0.85rem] font-medium text-ink transition-colors duration-300 hover:bg-ink hover:text-warm"
            >
              Join the hive
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex min-h-11 min-w-11 items-center justify-center lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <span className="relative block h-3 w-7">
              <span className="absolute left-0 top-0 h-px w-full bg-ink" />
              <span className="absolute bottom-0 left-0 h-px w-2/3 bg-ink" />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu — kept outside the header so the header's
          backdrop-blur doesn't trap this fixed overlay in a containing block */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-cream transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-5 py-4 sm:px-8">
          <Logo size={46} />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex min-h-11 min-w-11 items-center justify-center text-ink"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
              <path
                d="M5 5l14 14M19 5 5 19"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-2 px-5 sm:px-8">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="font-display text-4xl tracking-tight text-ink sm:text-5xl"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-5 pb-10 text-base text-ink/70 sm:px-8">
          <a href={social.instagram} target="_blank" rel="noreferrer noopener">
            Instagram
          </a>
        </div>
      </div>
    </>
  );
}
