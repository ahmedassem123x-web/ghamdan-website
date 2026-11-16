"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";

/**
 * Agency flip card (plan §4 — Flip Card).
 *
 * Front: brand wordmark + status badge + published-product count.
 * Back: description + status + link to the agency detail page.
 * Flip on hover (fine pointers only) AND on tap/click + keyboard via a
 * real <button> (aria-expanded). CSS 3D only: preserve-3d +
 * backface-visibility. Transform/opacity only, 300ms ease-out.
 *
 * Accessibility: the turned-away face becomes visibility:hidden at the
 * mid-point of the rotation (150ms delay) so its controls leave the tab
 * order; toggling moves focus to the matching button on the other face.
 * Reduced motion: no flip at all — both faces stack statically, the flip
 * buttons hide, and all content stays visible.
 *
 * Status honesty: only Deye is a confirmed official agent (agencies.ts);
 * every other brand shows its "علامة نوفرها" status + pending-confirmation
 * note, never an official-agent claim.
 */
export type AgencyFlipCardProps = {
  name: string;
  wordmarkClass: string;
  status: string;
  text: string;
  href: string;
  officialAgent: boolean;
  pending: boolean;
  pendingLabel: string;
  productCount: number;
  productLabel: string;
  comingSoonLabel: string;
  detailsLabel: string;
  flipLabel: string;
  flipBackLabel: string;
};

export default function AgencyFlipCard({
  name,
  wordmarkClass,
  status,
  text,
  href,
  officialAgent,
  pending,
  pendingLabel,
  productCount,
  productLabel,
  comingSoonLabel,
  detailsLabel,
  flipLabel,
  flipBackLabel,
}: AgencyFlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const frontBtnRef = useRef<HTMLButtonElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);

  const flipTo = (next: boolean) => {
    setFlipped(next);
    // Move focus with the visible face so keyboard users never land on a
    // hidden control. rAF lets the state commit first.
    requestAnimationFrame(() => {
      if (next) backBtnRef.current?.focus();
      else frontBtnRef.current?.focus();
    });
  };

  const faceBase = officialAgent ? "bg-mesh-navy" : "border border-border bg-white";
  const wordmarkColor = officialAgent ? "text-white" : "text-navy";
  const bodyColor = officialAgent ? "text-sky-100" : "text-text-muted";

  return (
    <div className="agency-flip h-full">
      <div className={`agency-flip__inner${flipped ? " agency-flip__inner--flipped" : ""}`}>
        {/* ---- Front ---- */}
        <div className={`agency-flip__face agency-flip__face--front ${faceBase}`}>
          <div className="flex items-center justify-between gap-3">
            <span className={`font-latin text-3xl ${wordmarkClass} ${wordmarkColor}`} dir="ltr">
              {name}
            </span>
            {officialAgent && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-red-deep px-3 py-1 text-xs font-bold text-white">
                <CheckIcon className="size-3.5" aria-hidden="true" />
                {status}
              </span>
            )}
          </div>
          {!officialAgent && (
            <span className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-navy">{status}</span>
              {pending && (
                <span className="inline-flex w-fit rounded-full border border-warning/60 bg-warning/25 px-3 py-1 text-xs font-bold text-navy">
                  {pendingLabel}
                </span>
              )}
            </span>
          )}
          <p className={`mt-4 text-body-sm font-bold ${officialAgent ? "text-white" : "text-navy"}`}>
            {productCount > 0 ? (
              <>
                <span className="font-latin text-2xl font-extrabold text-brand-red-text" dir="ltr">
                  {productCount}
                </span>{" "}
                {productLabel}
              </>
            ) : (
              <span className="inline-flex rounded-full bg-sky px-3 py-1 text-xs font-bold text-primary-hover">
                {comingSoonLabel}
              </span>
            )}
          </p>
          <button
            ref={frontBtnRef}
            type="button"
            onClick={() => flipTo(true)}
            aria-expanded={flipped}
            aria-label={`${flipLabel} — ${name}`}
            className="agency-flip__flip-btn mt-auto pt-4 text-sm font-bold text-primary-hover underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {flipLabel} ↻
          </button>
        </div>

        {/* ---- Back ---- */}
        <div className={`agency-flip__face agency-flip__face--back ${faceBase}`}>
          <p className={`flex-1 text-body-sm leading-relaxed ${bodyColor}`}>{text}</p>
          <Link
            href={href}
            className={`mt-4 inline-flex items-center gap-1.5 text-sm font-bold ${officialAgent ? "text-white" : "text-primary-hover"} underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
          >
            {detailsLabel}
            <ArrowIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
          </Link>
          <button
            ref={backBtnRef}
            type="button"
            onClick={() => flipTo(false)}
            aria-expanded={flipped}
            aria-label={`${flipBackLabel} — ${name}`}
            className="agency-flip__flip-btn mt-4 text-sm font-bold text-primary-hover underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {flipBackLabel} ↻
          </button>
        </div>
      </div>

      <style>{`
        .agency-flip { perspective: 1200px; }
        .agency-flip__inner {
          display: grid;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 300ms ease-out;
        }
        .agency-flip__inner--flipped { transform: rotateY(180deg); }
        .agency-flip__face {
          grid-area: 1 / 1;
          display: flex;
          flex-direction: column;
          min-height: 15rem;
          backface-visibility: hidden;
          border-radius: var(--radius-card, 1rem);
          padding: 1.5rem;
          box-shadow: var(--shadow-card, 0 1px 3px rgb(0 0 0 / 0.08));
          transition: transform 300ms ease-out, box-shadow 200ms ease-out, visibility 0s linear 150ms;
        }
        .agency-flip__face--back { transform: rotateY(180deg); visibility: hidden; }
        .agency-flip__inner--flipped .agency-flip__face--back { visibility: visible; }
        .agency-flip__inner--flipped .agency-flip__face--front { visibility: hidden; }
        @media (hover: hover) and (prefers-reduced-motion: no-preference) {
          .agency-flip:hover .agency-flip__inner { transform: rotateY(180deg); }
          .agency-flip:hover .agency-flip__face--back { visibility: visible; }
          .agency-flip:hover .agency-flip__face--front { visibility: hidden; }
        }
        @media (prefers-reduced-motion: reduce) {
          .agency-flip { perspective: none; }
          .agency-flip__inner { display: block; transform: none !important; transition: none; }
          .agency-flip__face {
            position: static;
            min-height: 0;
            transform: none !important;
            backface-visibility: visible !important;
            visibility: visible !important;
            transition: none;
          }
          .agency-flip__face--back { margin-top: 0.75rem; border-top: 2px dashed var(--color-border, #e5e7eb); }
          .agency-flip__flip-btn { display: none; }
        }
      `}</style>
    </div>
  );
}
