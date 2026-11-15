"use client";

import type { ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";

/**
 * Button — v15 design-system §1 (docs/design-system.md), tokens from
 * docs/design-tokens.md. THE only button implementation in the shell:
 * no one-off button styles elsewhere in Phase 3-owned files.
 *
 * Variants:
 *   primary      fill #0B70C9 (primary-hover token, 5.03:1 AA) — the board
 *                prints #0081FB as the fill, but that is 3.80:1 with white
 *                text (below AA); the documented deviation (ADR-11) is to
 *                fill with #0B70C9 and keep #0081FB for hover accents /
 *                large text. Hover: navy #102B46 + subtle lift, 180–250ms.
 *                Active: navy #102B46.
 *   secondary    white fill, 1.5px navy border, navy text; hover sky tint.
 *   outline      transparent, 1.5px primary border, #0B70C9 text (AA);
 *                hover sky tint.
 *   text         transparent, #0B70C9 text, optional reading-direction
 *                arrow; underline on hover.
 *   icon         44px square, bordered, navy icon; icon-only (aria-label
 *                required — enforced by the `aria-label` prop).
 *   whatsapp     fill #1D9E44, white text. Contrast flag: 3.48:1, below AA
 *                for text — pre-existing live value, no board HEX exists;
 *                kept as the brand WhatsApp colour, never used for small
 *                standalone text (always paired with the WhatsApp glyph).
 *   light        white fill, navy text — ON NAVY (#102B46) panels only.
 *                Pill radius 999px per the boards ("Learn More →",
 *                "Get in Touch →"); the one pill in the system, board-driven.
 *
 * Sizes: sm 40px, md 48px (board height), lg 56px. Radius 12px (pill for
 * `light` only). Focus: 2px #0081FB outline + 2px offset, always visible.
 * Disabled: #E5E7EB fill, #6B7280 text, no pointer. Loading: grey fill +
 * spinner + "Loading…" text, aria-busy, interaction blocked.
 * No letter-spacing on Arabic/Chinese labels (tokens doc §2).
 */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "text"
  | "icon"
  | "whatsapp"
  | "light";

export type ButtonSize = "sm" | "md" | "lg";

const SIZES: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-button",
  lg: "h-14 px-8 text-lg",
};

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-hover text-white shadow-card hover:bg-navy active:bg-navy hover:-translate-y-0.5",
  secondary:
    "bg-surface text-navy border-[1.5px] border-navy hover:bg-sky active:bg-sky",
  outline:
    "bg-transparent text-primary-hover border-[1.5px] border-primary hover:bg-sky active:bg-sky",
  text: "bg-transparent text-primary-hover px-1 hover:underline active:text-navy",
  icon: "bg-surface text-navy border border-border hover:border-primary-hover hover:text-primary-hover active:bg-sky",
  whatsapp:
    "bg-whatsapp text-white shadow-card hover:brightness-95 active:brightness-90 hover:-translate-y-0.5",
  light:
    "bg-white text-navy rounded-full shadow-card hover:bg-sky active:bg-sky",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render as a link (Next Link) instead of a <button>. */
  href?: string;
  /** Show the reading-direction arrow after the label (text/primary). */
  arrow?: boolean;
  loading?: boolean;
  /** Required for variant="icon" (icon-only buttons must be labelled). */
  "aria-label"?: string;
}

export default function Button({
  variant = "primary",
  size = "md",
  href,
  arrow = false,
  loading = false,
  disabled,
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const cls = [
    "inline-flex items-center justify-center gap-2 rounded-button font-semibold",
    "transition-[color,background-color,border-color,transform,box-shadow] duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
    "disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-text disabled:shadow-none disabled:transform-none",
    variant === "icon" ? "size-11 shrink-0 p-0" : SIZES[size],
    VARIANTS[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {loading && (
        <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
      )}
      {children}
      {arrow && !loading && (
        <ArrowLeft
          className="size-4 rtl:rotate-0 ltr:rotate-180"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (href) {
    if (isDisabled) {
      return (
        <span aria-disabled="true" className={cls}>
          {inner}
        </span>
      );
    }
    return (
      <Link href={href} className={cls} aria-busy={loading || undefined}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cls}
      {...rest}
    >
      {inner}
    </button>
  );
}
