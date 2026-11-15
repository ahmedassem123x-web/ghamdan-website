/**
 * Ghamdan (GTS) — Custom SVG icon library.
 *
 * Hand-authored line icons in the Design DNA iconography style (thin
 * 1.5 stroke, round caps/joins, geometric, no fill except where noted).
 * No lucide-react is imported anywhere in this file — every glyph below
 * is drawn for Ghamdan, in brand colours only (currentColor at use site).
 *
 * Import (for the components worker):
 *   import { ZapIcon, InverterIcon, categoryIcon } from "@/components/icons";
 *
 * Contract — every icon:
 *   ({ className, strokeWidth }: IconProps) =>
 *     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
 *          strokeWidth={strokeWidth ?? 1.5} strokeLinecap="round"
 *          strokeLinejoin="round" aria-hidden="true" className={className}>
 *   WhatsAppIcon is the only exception: fill="currentColor" stroke="none"
 *   with the simplified WhatsApp mark.
 *
 * Direction: ArrowIcon points LEFT by default — that is "forward" in RTL.
 * In an LTR context add `ltr:rotate-180` (the same convention already used
 * for the ArrowLeft in Cards.tsx).
 */
import type { ComponentType, ReactNode } from "react";

export type IconProps = {
  className?: string;
  strokeWidth?: number;
};

/**
 * Shared 24×24 line-icon shell. Every icon below renders exactly this
 * <svg> with its own paths inside.
 */
function LineIcon({
  className,
  strokeWidth,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Energy — solar, storage, power                                      */
/* ------------------------------------------------------------------ */

/** Lightning bolt — energy, power, speed. */
export function ZapIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M13 2 4.5 13.5H11l-1 8.5L18.5 10.5H12l1-8.5z" />
    </LineIcon>
  );
}

/** Inverter box with a sine wave inside, DC terminals on top. */
export function InverterIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <rect x="3" y="8.5" width="18" height="11" rx="2" />
      <path d="M6.2 14c1.2-2.4 2.4-2.4 3.6 0s2.4 2.4 3.6 0 2.4-2.4 3.6 0" />
      <path d="M8.5 8.5V5.8M15.5 8.5V5.8" />
    </LineIcon>
  );
}

/** Battery with a small lightning bolt inside and a terminal cap. */
export function BatteryIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <rect x="2.5" y="8" width="16.5" height="8.5" rx="2" />
      <path d="M21.5 11v2.5" />
      <path d="M12.7 10.3 10.7 13h2.3l-1.7 2.7" />
    </LineIcon>
  );
}

/** Solar panel, tilted, with cell grid and mounting legs. */
export function PanelIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <g transform="rotate(-8 12 12)">
        <rect x="5.5" y="5" width="13" height="12" rx="1" />
        <path d="M9.8 5v12M14.2 5v12M5.5 9h13M5.5 13h13" />
      </g>
      <path d="M9 18.5 8 21.2M15 18.5l1 2.7" />
    </LineIcon>
  );
}

/** Sun — disc with eight rays. */
export function SunIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </LineIcon>
  );
}

/* ------------------------------------------------------------------ */
/* Water & agriculture                                                 */
/* ------------------------------------------------------------------ */

/** Water droplet with a small inner highlight arc. */
export function DropletIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M12 3c3.4 4.4 5.8 7.6 5.8 10.8a5.8 5.8 0 1 1-11.6 0C6.2 10.6 8.6 7.4 12 3z" />
      <path d="M9.4 13.6a2.9 2.9 0 0 0 2.2 2.8" />
    </LineIcon>
  );
}

/**
 * Solar water pump — centrifugal volute with hub, discharge pipe running
 * up and across, and a droplet falling from the pipe end.
 */
export function PumpIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <circle cx="9.5" cy="14" r="5.5" />
      <circle cx="9.5" cy="14" r="2" />
      <path d="M9.5 8.5V4.5H17" />
      <path d="M17 8.2c1.7 2.2 2.7 3.5 2.7 4.9a2.7 2.7 0 1 1-5.4 0c0-1.4 1-2.7 2.7-4.9z" />
      <path d="M3 20.5h13M6.5 19.5v1M12.5 19.5v1" />
    </LineIcon>
  );
}

/** Leaf — sustainability, irrigation, agriculture. */
export function LeafIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M5 19.5C5 10 10.5 4.5 20 4.5c-.5 9.5-6 15-15 15z" />
      <path d="M5 19.5C9.5 14.5 13.5 10.5 18 6.5" />
    </LineIcon>
  );
}

/* ------------------------------------------------------------------ */
/* Places, people, service                                             */
/* ------------------------------------------------------------------ */

/** House — residential solutions. */
export function HomeIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M4 11.3 12 4l8 7.3" />
      <path d="M6.2 9.8v9.7h11.6V9.8" />
      <path d="M10.2 19.5v-5h3.6v5" />
    </LineIcon>
  );
}

/** Two people — team, customers, community. */
export function UsersIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M3.2 19.5c.7-3.3 2.9-5.2 5.8-5.2s5.1 1.9 5.8 5.2" />
      <circle cx="17" cy="9" r="2.7" />
      <path d="M15.8 14.8c2.3.3 4.1 1.9 4.7 4.4" />
    </LineIcon>
  );
}

/** Cog — settings, configuration. Eight short teeth around a hub. */
/** Settings — gear (lucide "settings"). NOTE: an earlier draft drew a
 * circle + 8 rays here, which reads as a SUN — wrong next to SunIcon. */
export function SettingsIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </LineIcon>
  );
}

/** Wrench — installation, maintenance, technical service. */
export function WrenchIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </LineIcon>
  );
}

/** Headset with microphone boom — support. */
export function HeadsetIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M4.8 14v-1.8a7.2 7.2 0 0 1 14.4 0V14" />
      <rect x="3" y="13.5" width="3.8" height="6" rx="1.9" />
      <rect x="17.2" y="13.5" width="3.8" height="6" rx="1.9" />
      <path d="M21 16.5v2a3.2 3.2 0 0 1-3.2 3.2h-3.3" />
    </LineIcon>
  );
}

/** Gauge / speedometer — performance, monitoring. */
export function GaugeIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M4.5 19a7.5 7.5 0 0 1 15 0" />
      <path d="M12 18.6 15.8 13.8" />
      <circle cx="12" cy="19" r="1.3" />
      <path d="M12 11.2v2.3M6.3 14.6l1.6 1.6M17.7 14.6l-1.6 1.6" />
    </LineIcon>
  );
}

/* ------------------------------------------------------------------ */
/* Status & feedback                                                   */
/* ------------------------------------------------------------------ */

/** Warning triangle with exclamation. */
export function AlertIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M12 3.5 21.5 20h-19L12 3.5z" />
      <path d="M12 10v4.5M12 17.3h.01" />
    </LineIcon>
  );
}

/** Information circle. */
export function InfoIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.8h.01" />
    </LineIcon>
  );
}

/** Magnifier — search. */
export function SearchIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M15.8 15.8 21 21" />
    </LineIcon>
  );
}

/** Check mark — success, confirmation. */
export function CheckIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M4.5 12.5l5 5L19.5 7" />
    </LineIcon>
  );
}

/* ------------------------------------------------------------------ */
/* Contact & navigation                                                */
/* ------------------------------------------------------------------ */

/**
 * WhatsApp mark (simplified). The ONLY filled icon in the set:
 * fill="currentColor" stroke="none". Colour it with text colour
 * (e.g. text-white on the green WhatsApp button, or text-[#25D366]
 * where the brand green is used as a surface, never as a UI token).
 */
export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

/**
 * Forward arrow — points LEFT by default because "forward" in RTL is
 * leftward. In an LTR context add `ltr:rotate-180` to flip it right.
 */
export function ArrowIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M19 12H5" />
      <path d="M11 5.5 4.5 12l6.5 6.5" />
    </LineIcon>
  );
}

/** Envelope — email. */
export function MailIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M4 7.5 12 13.5 20 7.5" />
    </LineIcon>
  );
}

/** Telephone handset. */
export function PhoneIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </LineIcon>
  );
}

/** Map pin with centre dot. */
export function MapPinIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M12 21.2s-7.2-5.8-7.2-11.4a7.2 7.2 0 0 1 14.4 0c0 5.6-7.2 11.4-7.2 11.4z" />
      <circle cx="12" cy="9.8" r="2.6" />
    </LineIcon>
  );
}

/** Hamburger menu — three bars. */
export function MenuIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </LineIcon>
  );
}

/** Close — X. */
export function CloseIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M6 6l12 12M18 6 6 18" />
    </LineIcon>
  );
}

/** Chevron pointing down — accordions, selects, menus. */
export function ChevronDownIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M6 9.5l6 6 6-6" />
    </LineIcon>
  );
}

/* ------------------------------------------------------------------ */
/* Structure & systems                                                 */
/* ------------------------------------------------------------------ */

/** Stacked layers — systems, bundles, solutions. */
export function LayersIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M12 3.2 21 8l-9 4.8L3 8l9-4.8z" />
      <path d="M3.6 12.6 12 17.2l8.4-4.6M3.6 16.8 12 21.4l8.4-4.6" />
    </LineIcon>
  );
}

/** Shipping box — products, packages, catalogue. */
export function PackageIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M3.5 7.8 12 3.2l8.5 4.6v8.4L12 20.8l-8.5-4.6V7.8z" />
      <path d="M3.5 7.8 12 12.4l8.5-4.6M12 12.4v8.4" />
    </LineIcon>
  );
}

/** Database cylinder — data, storage systems, records. */
export function DatabaseIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <ellipse cx="12" cy="5.6" rx="7.6" ry="2.9" />
      <path d="M4.4 5.6v12.8c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9V5.6" />
      <path d="M4.4 12c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9" />
    </LineIcon>
  );
}

/** Camera — monitoring, CCTV, cameras category. */
export function CameraIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M4 8h2.6l2-2.6h6.8L17.4 8H20a1.8 1.8 0 0 1 1.8 1.8v8.4A1.8 1.8 0 0 1 20 20H4a1.8 1.8 0 0 1-1.8-1.8V9.8A1.8 1.8 0 0 1 4 8z" />
      <circle cx="12" cy="13" r="3.4" />
    </LineIcon>
  );
}

/**
 * Horizontal sliders — filters, tuning. Three rows, each with a knob
 * tick; distinct from ControllerIcon (vertical sliders).
 */
export function SlidersIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />
    </LineIcon>
  );
}

/**
 * Vertical sliders / faders — charge controllers, control panels.
 * Knob ticks sit at different heights on the three rails.
 */
export function ControllerIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M6 21v-4.5M6 9.5V4M12 21v-8.5M12 5.5V4M18 21v-1.5M18 12.5V4" />
      <path d="M3.5 13h5M9.5 9h5M15.5 16h5" />
    </LineIcon>
  );
}

/** Building — commercial / industrial, company. */
export function BuildingIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <rect x="5" y="3.5" width="14" height="17" rx="1" />
      <path d="M9 7.5h1.8M13.2 7.5h1.8M9 11h1.8M13.2 11h1.8M9 14.5h1.8M13.2 14.5h1.8" />
      <path d="M10.6 20.5v-3.2h2.8v3.2" />
    </LineIcon>
  );
}

/** Globe — global brands, languages, worldwide. */
export function GlobeIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="8.8" />
      <ellipse cx="12" cy="12" rx="4" ry="8.8" />
      <path d="M3.2 12h17.6" />
    </LineIcon>
  );
}

/** Shield with check — trust, warranty, official agency. */
export function ShieldIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M12 2.5 20 5.5v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10v-6l8-3z" />
      <path d="M8.8 11.8l2.3 2.3 4.3-4.6" />
    </LineIcon>
  );
}

/** Light bulb with filament — innovation, ideas, guidance. */
export function LightbulbIcon({ className, strokeWidth }: IconProps) {
  return (
    <LineIcon className={className} strokeWidth={strokeWidth}>
      <path d="M12 2.8a6.2 6.2 0 0 0-3.5 11c.7.6 1.1 1.3 1.1 2.2h4.8c0-.9.4-1.6 1.1-2.2A6.2 6.2 0 0 0 12 2.8z" />
      <path d="M10.2 13.2c.6-1.2 1.2-2 1.8-2s1.2.8 1.8 2" />
      <path d="M9.9 18.8h4.2M10.5 21.3h3" />
    </LineIcon>
  );
}

/* ------------------------------------------------------------------ */
/* categoryIcon — the mapping the rest of the site imports.            */
/* Drop-in replacement for the lucide-based helper in Cards.tsx:       */
/*   import { categoryIcon } from "@/components/icons";                */
/* Keys are the `icon` strings used in src/data (categories, solutions,*/
/* services). Unknown keys fall back to PackageIcon. Every icon is    */
/* rendered at size-7, exactly as the previous helper did.             */
/* ------------------------------------------------------------------ */

const CATEGORY_ICONS: Record<string, ComponentType<IconProps>> = {
  zap: ZapIcon,
  battery: BatteryIcon,
  sun: SunIcon,
  droplet: DropletIcon,
  sliders: SlidersIcon,
  package: PackageIcon,
  database: DatabaseIcon,
  camera: CameraIcon,
  leaf: LeafIcon,
  home: HomeIcon,
  users: UsersIcon,
  settings: SettingsIcon,
  wrench: WrenchIcon,
  headset: HeadsetIcon,
  alert: AlertIcon,
  gauge: GaugeIcon,
};

export function categoryIcon(name: string): ReactNode {
  const Icon = CATEGORY_ICONS[name] ?? PackageIcon;
  return <Icon className="size-7" />;
}
