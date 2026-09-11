import { useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";

export type MeadowVolunteer = { id: string; name: string; role: string | null };

const PALETTE = [
  "var(--color-rose)",
  "var(--color-flame)",
  "var(--color-amber)",
  "var(--color-berry)",
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

const WIDTH = 1200;
const HEIGHT = 420;

function pointAt(t: number) {
  const x = 70 + (WIDTH - 140) * t;
  const y = HEIGHT / 2 + Math.sin(t * Math.PI * 2.2) * 96;
  const dx = WIDTH - 140;
  const dy = Math.cos(t * Math.PI * 2.2) * 96 * Math.PI * 2.2;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return { x, y, angle };
}

const TRAIL_D = (() => {
  let d = "";
  for (let i = 0; i <= 120; i += 1) {
    const p = pointAt(i / 120);
    d += `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
  }
  return d.trim();
})();

/** The bee flies across the meadow and writes each volunteer's name into its trail. */
export function VolunteerMeadow({ volunteers }: { volunteers: MeadowVolunteer[] }) {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const stops = useMemo(
    () =>
      volunteers.map((v, i) => {
        const t =
          volunteers.length === 1 ? 0.5 : 0.08 + (0.84 * i) / Math.max(volunteers.length - 1, 1);
        return { ...v, t, ...pointAt(t), color: PALETTE[i % PALETTE.length]!, up: i % 2 === 0 };
      }),
    [volunteers],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }
    if (!visible) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      setProgress((p) => {
        const next = p + dt / 9000;
        return next > 1.25 ? 0 : next;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, visible]);

  if (volunteers.length === 0) {
    return (
      <p className="mt-8 text-base text-ink/55">
        Volunteers will appear here as soon as the first applications are approved.
      </p>
    );
  }

  const p = Math.min(progress, 1);
  const bee = pointAt(p);

  return (
    <div ref={containerRef} className="relative mt-12">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="A bee flying across a meadow, writing each volunteer's name into the trail behind it"
      >
        <defs>
          <radialGradient id="meadow-glow" cx="50%" cy="60%" r="70%">
            <stop offset="0%" stopColor="var(--color-rose)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-rose)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill="url(#meadow-glow)" />

        {/* faint full route */}
        <path
          d={TRAIL_D}
          fill="none"
          stroke="var(--color-amber)"
          strokeOpacity="0.15"
          strokeWidth="2"
          strokeDasharray="6 10"
          strokeLinecap="round"
        />
        {/* drawn trail behind the bee */}
        <path
          d={TRAIL_D}
          fill="none"
          stroke="var(--color-amber)"
          strokeOpacity="0.75"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - p}
        />

        {stops.map((s, i) => {
          const passed = p >= s.t;
          const active = hovered === i || passed;
          const labelY = s.up ? s.y - 34 : s.y + 46;
          return (
            <g
              key={s.id}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={s.x - 70}
                y={Math.min(labelY, s.y) - 30}
                width={140}
                height={90}
                fill="transparent"
              />
              {/* small bloom left in the trail */}
              <g
                transform={`translate(${s.x} ${s.y}) scale(${active ? 1 : 0.55})`}
                style={{ transition: "transform .6s cubic-bezier(.22,1,.36,1)" }}
                opacity={active ? 1 : 0.35}
              >
                {[0, 60, 120, 180, 240, 300].map((a) => (
                  <ellipse
                    key={a}
                    cx="0"
                    cy="-9"
                    rx="5.5"
                    ry="9"
                    fill={s.color}
                    fillOpacity={active ? 0.95 : 0.5}
                    transform={`rotate(${a})`}
                  />
                ))}
                <circle r="5" fill="var(--color-amber)" />
              </g>
              {/* the name, written into the trail */}
              <text
                x={s.x}
                y={labelY}
                textAnchor="middle"
                className="font-display"
                fontSize="21"
                fill="var(--color-amber)"
                opacity={active ? 1 : 0}
                style={{ transition: "opacity .6s" }}
              >
                {s.name}
              </text>
              <text
                x={s.x}
                y={labelY + (s.up ? -17 : 18)}
                textAnchor="middle"
                fontSize="12"
                fill="var(--color-amber)"
                opacity={active ? 0.6 : 0}
                style={{ transition: "opacity .6s" }}
              >
                {s.role ?? ""}
              </text>
            </g>
          );
        })}

        {!reduced ? (
          <g transform={`translate(${bee.x} ${bee.y}) rotate(${bee.angle * 0.35})`}>
            <ellipse rx="11" ry="7.5" fill="var(--color-amber)" />
            <path d="M-4 -7 L-4 7 M2 -7 L2 7" stroke="var(--color-indigo)" strokeWidth="3" />
            <ellipse cx="-2" cy="-9" rx="9" ry="5" fill="var(--color-rose)" fillOpacity="0.55" />
            <ellipse cx="4" cy="-9" rx="8" ry="4.5" fill="var(--color-rose)" fillOpacity="0.45" />
          </g>
        ) : null}
      </svg>

      <ul className="sr-only">
        {volunteers.map((v) => (
          <li key={v.id}>
            {v.name} — {v.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function VolunteerMeadowSection({ volunteers }: { volunteers: MeadowVolunteer[] }) {
  return (
    <section id="people" className="bg-warm py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-ink/15 pt-6">
            <h2 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">
              People involved
            </h2>
            <p className="eyebrow text-ink/50">Our volunteers</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <VolunteerMeadow volunteers={volunteers} />
        </Reveal>
      </div>
    </section>
  );
}
