"use client";

import { useEffect, useId, useRef, type ComponentType } from "react";
import {
  BatteryCharging,
  CircleDot,
  Cylinder,
  Droplets,
  Home,
  Info,
  PlugZap,
  Settings,
  Sprout,
  Sun,
  Zap,
} from "lucide-react";
import type { Locale } from "@/data";

/**
 * System diagram (§2.11, spec §4.7 / §3.9.5, v15 §10.7 / §11):
 * code-built SVG — never a screenshot of the reference.
 *
 * Phase 6 redraw: each node is an isometric tile (top rhombus + two side
 * faces) with a Lucide icon in a white badge — NO emoji/text glyphs as
 * production icons. The `icon` prop is a semantic key, and the legacy
 * glyphs the callers still pass ("☀", "⚙", "↧", "▮", "⌂", "⚡") are
 * mapped to the same Lucide icons, so the existing callers
 * (pumping solution detail, systems detail) work unchanged.
 *
 * Flow: connectors between tiles carry `data-flow`; MotionProvider draws
 * them with GSAP stroke-dashoffset after successful init (JS-only — the
 * connectors render fully drawn without JS) and then runs a slow dashed
 * drift while the figure is in view. Red SMIL pulses travel each connector
 * so the energy flow is visible even before the draw runs — but only
 * while the diagram is in view: the pulses used to run from page load
 * (begin="0.7s" offsets ticking from load) even when the diagram sat
 * below the fold, burning frames unseen and arriving mid-flight when
 * the user finally scrolled to it. An IntersectionObserver now pauses
 * the SVG timeline (pauseAnimations) off-screen and resumes it in view,
 * same convention as the EnergyFlowStory orbit and the marquee pause.
 * The marker id is per-instance (useId): two diagrams on one page used
 * to share the id "flow-arrow".
 *
 * The diagram is explicitly ILLUSTRATIVE: a conceptual chain, not a scaled
 * engineering drawing and not the internal design of any real branded
 * product. No invented engineering data (no capacities, pressures, depths).
 *
 * Direction: the chain always flows physically left → right, in the order
 * the caller passes the nodes, in every locale. Technical diagrams are
 * not mirrored for RTL (v15 §12.1).
 */
type IconComponent = ComponentType<{
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  color?: string;
  strokeWidth?: number | string;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

const ICONS: Record<string, IconComponent> = {
  // Legacy glyphs (kept so existing callers need no change).
  "☀": Sun,
  "⚙": Settings,
  "↧": Droplets,
  "▮": Cylinder,
  "⌂": Home,
  "⚡": Zap,
  // Semantic keys.
  sun: Sun,
  panels: Sun,
  solar: Sun,
  controller: Settings,
  settings: Settings,
  pump: Droplets,
  water: Droplets,
  tank: Cylinder,
  cylinder: Cylinder,
  home: Home,
  house: Home,
  loads: Home,
  distribution: Home,
  inverter: Zap,
  zap: Zap,
  grid: PlugZap,
  battery: BatteryCharging,
  storage: BatteryCharging,
  irrigation: Sprout,
};

function iconFor(key: string): IconComponent {
  return ICONS[key.trim().toLowerCase()] ?? ICONS[key] ?? CircleDot;
}

/** Public node semantics, shared with the 3D scene (single source of
 * truth for what a node key means — icon + 3D object kind). */
export function diagramIconFor(key: string): IconComponent {
  return iconFor(key);
}

export type DiagramNodeKind = "panels" | "device" | "pump" | "tank" | "battery" | "house";

const KINDS: Record<string, DiagramNodeKind> = {
  "☀": "panels",
  "⚙": "device",
  "↧": "pump",
  "▮": "tank",
  "⌂": "house",
  "⚡": "device",
  sun: "panels",
  panels: "panels",
  solar: "panels",
  controller: "device",
  settings: "device",
  inverter: "device",
  zap: "device",
  grid: "device",
  pump: "pump",
  water: "pump",
  irrigation: "pump",
  tank: "tank",
  cylinder: "tank",
  battery: "battery",
  storage: "battery",
  home: "house",
  house: "house",
  loads: "house",
  distribution: "house",
};

export function diagramKindFor(key: string): DiagramNodeKind {
  return KINDS[key.trim().toLowerCase()] ?? KINDS[key] ?? "device";
}

export const DIAGRAM_NOTE: Record<Locale, string> = {
  ar: "رسم توضيحي — مخطط مفاهيمي وليس رسمًا هندسيًا بمقياس.",
  en: "Illustrative diagram — a conceptual schematic, not a scaled engineering drawing.",
  zh: "示意图——概念示意，非按比例工程图。",
};

/* Isometric tile geometry (viewBox units). */
const TILE_W = 150;
const TILE_HALF = 72;
const GAP = 70;
const PAD = 30;
const TOP_Y = 52; // top vertex of the top rhombus
const MID_Y = 88; // left/right vertices + badge centre
const BOTTOM_Y = 124; // bottom vertex of the top rhombus
const DEPTH = 34; // side-face depth
const LABEL_Y = 202;
const VIEW_H = 240;

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
  const totalW = nodes.length * TILE_W + (nodes.length - 1) * GAP;
  const viewW = Math.max(totalW + PAD * 2, 400);
  const cx = (i: number) => PAD + i * (TILE_W + GAP) + TILE_W / 2;
  // Per-instance marker id (sanitised useId — raw useId contains ":",
  // which breaks url(#...) references).
  const markerId = `flow-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // SMIL pulses: freeze the SVG timeline while the diagram is off-screen
  // so the pulses never run (or start) before the user scrolls to them.
  // Paused from mount, so on first entry they begin from their staggered
  // begin offsets instead of arriving mid-flight. GSAP's [data-flow]
  // draw/drift is unaffected (it is not SMIL). Reduced-motion users get
  // no pulses at all (motion-reduce:hidden on the pulse group).
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof svg.pauseAnimations !== "function") return;
    svg.pauseAnimations();
    if (typeof IntersectionObserver === "undefined") {
      svg.unpauseAnimations();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) svg.unpauseAnimations();
        else svg.pauseAnimations();
      },
      { rootMargin: "100px" },
    );
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  return (
    <figure data-reveal className="overflow-hidden rounded-card border border-border bg-surface p-4 shadow-card" dir={dir}>
      {/* Horizontal scroll on narrow screens — same treatment as spec
          tables: the diagram keeps legible labels instead of shrinking. */}
      <div className="overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewW} ${VIEW_H}`}
          role="img"
          aria-label={nodes.map((n) => n.label).join(" → ")}
          className="min-w-[600px] w-full"
        >
          <title>{nodes.map((n) => n.label).join(" → ")}</title>
          <defs>
            <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="#0081FB" />
            </marker>
          </defs>

          {/* Flow connectors first (behind the tiles), one per gap. */}
          {nodes.slice(0, -1).map((_, i) => (
            <line
              key={`flow-${i}`}
              data-flow
              x1={cx(i) + TILE_HALF}
              y1={MID_Y}
              x2={cx(i + 1) - TILE_HALF - 2}
              y2={MID_Y}
              stroke="#0081FB"
              strokeWidth="2.5"
              markerEnd={`url(#${markerId})`}
            />
          ))}

          {/* Energy pulses — one red dot per connector travelling the flow
              path (SMIL animateMotion, no JS; hidden under reduced motion
              via the motion-reduce variant). The connectors themselves are
              drawn by MotionProvider ([data-flow]: draw-on-entry + dashed
              drift); the pulses are separate elements, so the two never
              fight over one property. Geometry unchanged. */}
          <g aria-hidden="true">
            {nodes.slice(0, -1).map((_, i) => (
              <circle
                key={`pulse-${i}`}
                r="4.5"
                fill="#E31E24"
                opacity="0.9"
                className="motion-reduce:hidden"
              >
                <animateMotion
                  dur="2.2s"
                  begin={`${i * 0.7}s`}
                  repeatCount="indefinite"
                  path={`M ${cx(i) + TILE_HALF} ${MID_Y} L ${cx(i + 1) - TILE_HALF - 2} ${MID_Y}`}
                />
              </circle>
            ))}
          </g>

          {nodes.map((b, i) => {
            const x = cx(i);
            const Icon = iconFor(b.icon);
            return (
              <g key={i}>
                {/* Ground shadow */}
                <ellipse cx={x} cy={TOP_Y + 116} rx="58" ry="7" fill="#102B46" opacity="0.07" />
                {/* Left face */}
                <polygon
                  points={`${x - TILE_HALF},${MID_Y} ${x},${BOTTOM_Y} ${x},${BOTTOM_Y + DEPTH} ${x - TILE_HALF},${MID_Y + DEPTH}`}
                  fill="#DDF5FC"
                  stroke="#0081FB"
                  strokeWidth="1"
                />
                {/* Right face */}
                <polygon
                  points={`${x},${BOTTOM_Y} ${x + TILE_HALF},${MID_Y} ${x + TILE_HALF},${MID_Y + DEPTH} ${x},${BOTTOM_Y + DEPTH}`}
                  fill="#BFE6FB"
                  stroke="#0081FB"
                  strokeWidth="1"
                />
                {/* Top face */}
                <polygon
                  points={`${x},${TOP_Y} ${x + TILE_HALF},${MID_Y} ${x},${BOTTOM_Y} ${x - TILE_HALF},${MID_Y}`}
                  fill="#F6FAFC"
                  stroke="#0081FB"
                  strokeWidth="1.5"
                />
                {/* Icon badge */}
                <circle cx={x} cy={MID_Y} r="27" fill="#FFFFFF" stroke="#0081FB" strokeWidth="1.5" />
                <Icon x={x - 12} y={MID_Y - 12} width={24} height={24} color="#0B70C9" strokeWidth={2} />
                {/* Label */}
                <text x={x} y={LABEL_Y} textAnchor="middle" fontSize="14.5" fontWeight="700" fill="#102B46">
                  {b.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {caption && <figcaption className="mt-2 text-center text-caption text-text-muted">{caption}</figcaption>}
      <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-caption text-text-muted">
        <Info className="size-4 shrink-0 text-primary-hover" aria-hidden="true" />
        <span>{DIAGRAM_NOTE[locale]}</span>
      </p>
    </figure>
  );
}
