import type { Locale } from "@/data";

/**
 * System diagram (§2.11, spec §4.7 / §3.9.5): code-built SVG — never a
 * screenshot of the reference. Nodes are configurable: the default is the
 * solar home system (panels → inverter → battery → loads); the pumping page
 * passes its own chain (panels → controller → pump → tank → distribution).
 */
export default function SystemDiagram({
  locale,
  nodes,
  caption,
}: {
  locale: Locale;
  nodes: { label: string; icon: string }[];
  caption?: string;
}) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  const W = 170;
  const GAP = 60;
  const totalW = nodes.length * W + (nodes.length - 1) * GAP;
  const viewW = Math.max(totalW + 40, 400);
  return (
    <figure className="overflow-hidden rounded-card border border-border bg-surface p-4" dir={dir}>
      <svg
        viewBox={`0 0 ${viewW} 180`}
        role="img"
        aria-label={nodes.map((n) => n.label).join(" → ")}
        className="w-full"
      >
        {nodes.map((b, i) => {
          const x = 20 + i * (W + GAP);
          return (
            <g key={i}>
              <rect x={x} y="45" width={W} height="90" rx="12" fill="#EAF3FC" stroke="#1E8FE8" strokeWidth="1.5" />
              <text x={x + W / 2} y="85" textAnchor="middle" fontSize="26" fill="#0F2E4D">
                {b.icon}
              </text>
              <text x={x + W / 2} y="118" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0F2E4D">
                {b.label}
              </text>
              {i < nodes.length - 1 && (
                <g stroke="#1E8FE8" strokeWidth="2" fill="none">
                  <line x1={x + W} y1="90" x2={x + W + GAP} y2="90" />
                  <polygon
                    points={`${x + W + GAP},90 ${x + W + GAP - 10},84 ${x + W + GAP - 10},96`}
                    fill="#1E8FE8"
                    stroke="none"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {caption && <figcaption className="mt-2 text-center text-caption text-text-muted">{caption}</figcaption>}
    </figure>
  );
}
