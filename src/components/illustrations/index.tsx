/**
 * Ghamdan (GTS) — Custom Illustrator-style SVG illustrations.
 *
 * One consistent geometric family for empty states, 404, and section
 * ornaments: flat shapes + thin 1.5 linework, brand palette only
 * (blue #0081FB, deep blue #0B70C9, red #E31E24, navy #102B46,
 * sky #DDF5FC, white, light surfaces). No raster images, no loud
 * gradients, no sketch/doodle style — crisp vector geometry, the same
 * visual language as the Design DNA illustration panel (fine line art
 * of solar installations). A short blue + red double stroke echoes the
 * logo ring in every scene.
 *
 * Import (for the components worker):
 *   import { SolarSystemIllustration } from "@/components/illustrations";
 *
 * Contract — every illustration:
 *   ({ className }: { className?: string }) =>
 *     <svg viewBox="0 0 400 300" role="img" className={className}>
 *       <title>…descriptive…</title> …
 *   The root <svg> carries the shared stroke (navy, 1.5, round caps);
 *   individual shapes override stroke/fill where the palette requires.
 */

export type IllustrationProps = {
  className?: string;
};

const NAVY = "#102B46";
const BLUE = "#0081FB";
const DEEP = "#0B70C9";
const RED = "#E31E24";
const SKY = "#DDF5FC";
const WHITE = "#FFFFFF";

/** Shared root props for every illustration in this family. */
function illustrationRootProps(className?: string) {
  return {
    viewBox: "0 0 400 300",
    role: "img" as const,
    fill: "none",
    stroke: NAVY,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
}

/** Small blue sun with eight rays, centred on (cx, cy) with radius r. */
function SunGlyph({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const d = r + 8;
  return (
    <g stroke={BLUE} fill={BLUE}>
      <circle cx={cx} cy={cy} r={r} stroke="none" />
      <path
        d={`M${cx} ${cy - d - 2}v-9M${cx} ${cy + d + 2}v9M${cx - d - 2} ${cy}h-9M${cx + d + 2} ${cy}h9M${cx - d * 0.72} ${cy - d * 0.72}l-6.5-6.5M${cx + d * 0.72} ${cy - d * 0.72}l6.5-6.5M${cx - d * 0.72} ${cy + d * 0.72}l-6.5 6.5M${cx + d * 0.72} ${cy + d * 0.72}l6.5 6.5`}
      />
    </g>
  );
}

/** Two-leaf plant sprout at the ground line (x, groundY). */
function Sprout({ x, groundY }: { x: number; groundY: number }) {
  return (
    <g stroke="none">
      <path d={`M${x} ${groundY}v-26`} stroke={NAVY} strokeWidth={1.5} />
      <path
        d={`M${x} ${groundY - 20}c-9-1-14-7-14-15 9 0 14 6 14 15z`}
        fill={BLUE}
      />
      <path
        d={`M${x} ${groundY - 20}c9-1 14-7 14-15-9 0-14 6-14 15z`}
        fill={DEEP}
      />
    </g>
  );
}

/** Short blue + red double stroke — the logo-ring echo used in every scene. */
function DualStroke({ x, y, blueLen = 70, redLen = 28 }: { x: number; y: number; blueLen?: number; redLen?: number }) {
  return (
    <g>
      <path d={`M${x} ${y}h${blueLen}`} stroke={BLUE} />
      <path d={`M${x + blueLen + 4} ${y}h${redLen}`} stroke={RED} />
    </g>
  );
}

/**
 * House with solar panels on its roof, a ground-mounted panel array,
 * sun, and a dashed red energy-flow line joining them.
 * Use: home / solutions hero ornaments, residential solution page.
 */
export function SolarSystemIllustration({ className }: IllustrationProps) {
  return (
    <svg {...illustrationRootProps(className)} aria-label="منزل بألواح شمسية وشمس وشبكة طاقة">
      <title>منزل بألواح شمسية على السقف ومصفوفة ألواح أرضية وشمس وخط طاقة</title>
      <SunGlyph cx={322} cy={62} r={24} />
      {/* ground */}
      <path d="M30 258h340" />
      <Sprout x={88} groundY={258} />
      {/* house */}
      <rect x="118" y="148" width="150" height="110" fill={WHITE} />
      <path d="M106 150 193 92l87 58" fill={SKY} />
      {/* roof panel on the left slope */}
      <path d="M128 136 158 113l24 13-30 23z" fill={DEEP} />
      <path d="M140 142l30-23M143 124l24 13" stroke={WHITE} />
      {/* door + windows */}
      <rect x="183" y="208" width="24" height="50" fill={DEEP} />
      <rect x="138" y="172" width="30" height="26" fill={SKY} />
      <rect x="228" y="172" width="30" height="26" fill={SKY} />
      <path d="M153 172v26M243 172v26" />
      {/* ground-mounted panel array */}
      <path d="M292 196 356 196l-10-40H282z" fill={WHITE} />
      <path d="M302 156l-4 40M322 156l-4 40M342 156l-4 40M285 176h64" />
      <path d="M302 196v62M342 196v62" />
      {/* energy flow: red bolt + dashed line from array to house */}
      <path
        d="M282 104l-9 15h6l-5 13 13-17h-6l5-11z"
        fill={RED}
        stroke="none"
      />
      <path d="M272 240C282 222 286 214 290 206" stroke={RED} strokeDasharray="4 5" />
      <DualStroke x={150} y={274} />
    </svg>
  );
}

/**
 * Solar water pumping — elevated tank, motor + volute pump, discharge
 * pipe, and curved water flow falling to a sprout. A dashed red line
 * carries sun energy to the motor.
 * Use: pumping / irrigation solution pages, pumps category empty state.
 */
export function PumpIllustration({ className }: IllustrationProps) {
  return (
    <svg {...illustrationRootProps(className)} aria-label="مضخة شمسية وأنابيب وتدفق مياه">
      <title>خزان مياه ومضخة شمسية وأنابيب وتدفق مياه منحني نحو نبتة</title>
      <SunGlyph cx={348} cy={52} r={18} />
      {/* ground */}
      <path d="M30 258h340" />
      {/* water tank */}
      <rect x="86" y="136" width="28" height="14" rx="4" fill={WHITE} />
      <rect x="52" y="150" width="96" height="108" rx="10" fill={SKY} />
      <path d="M52 186h96" stroke={BLUE} />
      <path d="M64 202c6-5 12-5 18 0s12 5 18 0 12-5 18 0" stroke={BLUE} />
      {/* pipe tank -> pump */}
      <path d="M148 210h44a16 16 0 0 1 16 16v14" />
      {/* motor above the volute */}
      <rect x="196" y="118" width="56" height="32" rx="6" fill={WHITE} />
      <path d="M206 118v-8M218 118v-8M230 118v-8M242 118v-8" />
      <path d="M224 150v16" />
      {/* volute pump */}
      <circle cx="224" cy="196" r="30" fill={WHITE} />
      <circle cx="224" cy="196" r="11" />
      <circle cx="224" cy="196" r="3" fill={RED} stroke="none" />
      {/* discharge pipe + falling water */}
      <path d="M254 196h34a16 16 0 0 1 16 16v18" />
      <path
        d="M304 232c4.5 6 7.5 9.5 7.5 13a7.5 7.5 0 1 1-15 0c0-3.5 3-7 7.5-13z"
        fill={BLUE}
        stroke="none"
      />
      <path
        d="M322 222c3 4 5 6.5 5 9a5 5 0 1 1-10 0c0-2.5 2-5 5-9z"
        fill={DEEP}
        stroke="none"
      />
      <Sprout x={352} groundY={258} />
      {/* sun energy to the motor */}
      <path d="M330 72C300 82 280 96 262 118" stroke={RED} strokeDasharray="4 5" />
      <DualStroke x={150} y={274} />
    </svg>
  );
}

/**
 * Battery bank — three battery units with red charge bolts and level
 * bars, under twin blue/red charge arcs.
 * Use: batteries / storage category, systems & bundles pages.
 */
export function BatteryIllustration({ className }: IllustrationProps) {
  return (
    <svg {...illustrationRootProps(className)} aria-label="رزمة بطاريات وأقواس شحن">
      <title>ثلاث بطاريات مع صواعق شحن وأقواس شحن زرقاء وحمراء</title>
      {/* charge arcs */}
      <path d="M52 108a148 74 0 0 1 296 0" stroke={BLUE} />
      <path d="M92 108a108 54 0 0 1 216 0" stroke={RED} />
      <circle cx="52" cy="108" r="4" fill={BLUE} stroke="none" />
      <circle cx="348" cy="108" r="4" fill={BLUE} stroke="none" />
      <circle cx="92" cy="108" r="3.5" fill={RED} stroke="none" />
      <circle cx="308" cy="108" r="3.5" fill={RED} stroke="none" />
      {/* plus sparkles */}
      <path d="M60 60v12M54 66h12M340 60v12M334 66h12" stroke={BLUE} />
      {/* battery 1 */}
      <rect x="100" y="126" width="24" height="12" rx="3" fill={SKY} />
      <rect x="78" y="138" width="68" height="120" rx="8" fill={WHITE} />
      <path d="M116 168l-12 20h8l-6 16 16-22h-8l6-14z" fill={RED} stroke="none" />
      <rect x="90" y="222" width="44" height="6" rx="3" fill={SKY} />
      <rect x="90" y="222" width="30" height="6" rx="3" fill={BLUE} stroke="none" />
      {/* battery 2 */}
      <rect x="187" y="126" width="24" height="12" rx="3" fill={SKY} />
      <rect x="165" y="138" width="68" height="120" rx="8" fill={WHITE} />
      <path d="M203 168l-12 20h8l-6 16 16-22h-8l6-14z" fill={RED} stroke="none" />
      <rect x="177" y="222" width="44" height="6" rx="3" fill={SKY} />
      <rect x="177" y="222" width="44" height="6" rx="3" fill={BLUE} stroke="none" />
      {/* battery 3 */}
      <rect x="274" y="126" width="24" height="12" rx="3" fill={SKY} />
      <rect x="252" y="138" width="68" height="120" rx="8" fill={WHITE} />
      <path d="M290 168l-12 20h8l-6 16 16-22h-8l6-14z" fill={RED} stroke="none" />
      <rect x="264" y="222" width="44" height="6" rx="3" fill={SKY} />
      <rect x="264" y="222" width="20" height="6" rx="3" fill={BLUE} stroke="none" />
      {/* ground */}
      <path d="M30 258h340" />
      <DualStroke x={150} y={274} />
    </svg>
  );
}

/**
 * Power grid — a central hub with a bolt, ringed by connected nodes on
 * a dashed orbit. One node is red, the signature accent.
 * Use: about / why-GTS, systems overview, commercial storage.
 */
export function GridIllustration({ className }: IllustrationProps) {
  return (
    <svg {...illustrationRootProps(className)} aria-label="شبكة طاقة وعقد متصلة">
      <title>عقدة طاقة مركزية متصلة بثماني عقد على مدار متقطع</title>
      {/* dashed orbit */}
      <circle cx="200" cy="150" r="108" strokeDasharray="3 6" />
      {/* perimeter links between outer nodes */}
      <path
        d="M92 62 200 48l108 14 22 88-22 88-108 14-108-14-22-88 22-88z"
        stroke={BLUE}
      />
      {/* spokes hub -> nodes */}
      <g stroke={BLUE}>
        <path d="M200 150 92 62M200 150l108-88M200 150 92 238M200 150l108 88M200 150V48M200 150v102M200 150H70M200 150h130" />
      </g>
      {/* outer nodes */}
      <g fill={WHITE}>
        <circle cx="92" cy="62" r="11" />
        <circle cx="200" cy="48" r="11" />
        <circle cx="92" cy="238" r="11" />
        <circle cx="308" cy="238" r="11" />
        <circle cx="200" cy="252" r="11" />
        <circle cx="70" cy="150" r="11" />
        <circle cx="330" cy="150" r="11" />
      </g>
      <circle cx="308" cy="62" r="11" fill={RED} stroke="none" />
      {/* node cores */}
      <g fill={BLUE} stroke="none">
        <circle cx="92" cy="62" r="3.5" />
        <circle cx="200" cy="48" r="3.5" />
        <circle cx="92" cy="238" r="3.5" />
        <circle cx="308" cy="238" r="3.5" />
        <circle cx="200" cy="252" r="3.5" />
        <circle cx="70" cy="150" r="3.5" />
        <circle cx="330" cy="150" r="3.5" />
      </g>
      <circle cx="308" cy="62" r="3.5" fill={WHITE} stroke="none" />
      {/* central hub with bolt */}
      <circle cx="200" cy="150" r="20" fill={DEEP} stroke="none" />
      <path
        d="M204 138l-10 15h6l-4 11 12-14h-6l4-12z"
        fill={WHITE}
        stroke="none"
      />
      <DualStroke x={150} y={284} />
    </svg>
  );
}

/**
 * 404 — a leaning solar panel and a sun flanking a large geometric
 * "404", joined by a dashed red line: the energy is here, the page
 * is not. The numerals are real SVG <text> (vector, not baked pixels).
 * Use: the 404 / not-found page only.
 */
export function NotFoundIllustration({ className }: IllustrationProps) {
  return (
    <svg {...illustrationRootProps(className)} aria-label="صفحة غير موجودة — لوح شمسي وشمس ورقم 404">
      <title>لوح شمسي وشمس ورقم 404 لصفحة غير موجودة</title>
      <SunGlyph cx={322} cy={58} r={22} />
      {/* leaning solar panel — draws on entry, 900ms, stagger 100ms */}
      <path data-draw data-draw-duration="0.9" data-draw-delay="0" d="M58 236 138 236l-12-44H70z" fill={WHITE} />
      <path data-draw data-draw-duration="0.9" data-draw-delay="0.1" d="M84 192l-6 44M105 192l-6 44M126 192l-6 44M64 214h68" />
      <path data-draw data-draw-duration="0.9" data-draw-delay="0.1" d="M70 236l-8 14M126 236l8 14" />
      {/* 404 numerals — vector text, inherits the page font */}
      <text
        x="205"
        y="185"
        textAnchor="middle"
        fontSize="92"
        fontWeight={800}
        fill={NAVY}
        stroke="none"
        fontFamily="inherit"
      >
        404
      </text>
      {/* dashed link from panel to the numerals — no data-draw: the draw
          tween would overwrite its "4 5" dash pattern with a solid line */}
      <path d="M138 214C160 200 170 190 185 180" stroke={RED} strokeDasharray="4 5" />
      <DualStroke x={140} y={206} blueLen={100} redLen={36} />
      {/* ground */}
      <path data-draw data-draw-duration="0.9" data-draw-delay="0.3" d="M40 258h320" />
    </svg>
  );
}
