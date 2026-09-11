import { Link } from "@tanstack/react-router";
import { nav, social } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="bg-warm py-14 sm:py-20">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 border-t border-ink/15 pt-10 sm:grid-cols-12">
          <div className="sm:col-span-5">
            <div className="flex items-center gap-3">
              <img
                src="/images/beecause-logo.png"
                alt="Beecause by The Hive"
                width={56}
                height={56}
                loading="lazy"
                className="h-14 w-14 rounded-full object-cover"
              />
              <p className="font-display text-lg tracking-tight text-ink">Beecause by The Hive</p>
            </div>
            <p className="mt-6 max-w-[32ch] text-base text-ink/55">{social.location}</p>
          </div>

          <nav aria-label="Footer" className="sm:col-span-4">
            <ul className="grid grid-cols-2 gap-y-3 text-base text-ink/70">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="link-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/auth" className="link-underline">
                  Admin
                </Link>
              </li>
            </ul>
          </nav>

          <div className="space-y-3 text-base text-ink/70 sm:col-span-3">
            <p>
              <a
                href={social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline"
              >
                Instagram
              </a>
            </p>
            <p>{social.contactEmail}</p>
            <p>{social.contactPhone}</p>
          </div>
        </div>

        <p className="mt-12 text-base text-ink/40">
          © {new Date().getFullYear()} Beecause by The Hive. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
