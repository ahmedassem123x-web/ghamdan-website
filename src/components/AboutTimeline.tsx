import type { ReactNode } from "react";

/**
 * Company story as an animated vertical timeline (plan §5/§6 — story).
 *
 * Entries reveal on scroll via the existing [data-reveal] system, with the
 * entrance direction following the side the card sits on — mirrored for
 * RTL (in Arabic the inline-start side is the right side, so its card
 * enters from the right). Desktop: alternating sides around a centre
 * line; mobile: single column with the line on the inline-start side.
 *
 * CONTENT RULE: every entry must come from real, verifiable facts in
 * src/data (agency status, counts, categories, address/hours). No dates
 * are shown anywhere — no founding year exists in the data, so entries
 * are dateless milestones, numbered only by order (01, 02, …).
 */
export type TimelineEntry = {
  icon: ReactNode;
  title: string;
  text: string;
};

export default function AboutTimeline({
  locale,
  heading,
  entries,
}: {
  locale: string;
  heading: string;
  entries: TimelineEntry[];
}) {
  const rtl = locale === "ar";
  // Physical reveal direction for a card on a given logical side.
  const revealFor = (side: "start" | "end") =>
    side === "start" ? (rtl ? "right" : "left") : rtl ? "left" : "right";

  return (
    <div className="wrap">
      <div className="text-center">
        <h2 className="text-h2 font-semibold text-navy">{heading}</h2>
      </div>
      <ol className="relative mx-auto mt-12 max-w-4xl">
        {/* Centre line: physical centre on desktop (direction-agnostic),
            inline-start edge on mobile. */}
        <span
          aria-hidden="true"
          className="absolute bottom-2 start-5 top-2 w-px bg-border md:start-auto md:left-1/2"
        />
        {entries.map((entry, i) => {
          const side: "start" | "end" = i % 2 === 0 ? "start" : "end";
          return (
            <li key={entry.title} className="relative pb-10 ps-12 last:pb-0 md:ps-0">
              {/* Node dot on the line */}
              <span
                aria-hidden="true"
                className="absolute start-[11px] top-2 flex size-[18px] items-center justify-center rounded-full border-[3px] border-white bg-brand-red shadow-card md:start-auto md:left-1/2 md:-ml-[9px]"
              />
              <div
                data-reveal={revealFor(side)}
                className={`md:w-[calc(50%-2.5rem)] ${side === "start" ? "md:me-auto" : "md:ms-auto"}`}
              >
                <article className="rounded-card border border-border bg-white p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sky text-primary-hover">
                      {entry.icon}
                    </span>
                    <span className="font-latin text-sm font-extrabold text-brand-red-text" dir="ltr">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-3 text-h4 font-semibold text-navy">{entry.title}</h3>
                  <p className="mt-2 text-body-sm leading-relaxed text-text-muted">{entry.text}</p>
                </article>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
