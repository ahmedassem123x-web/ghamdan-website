import Link from "next/link";
import { ui } from "@/lib/ui-copy";

/** 404 page (static export: unknown locales land here via not-found). */
export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-latin text-7xl font-extrabold text-primary" dir="ltr">404</p>
      <h1 className="mt-4 text-h1 font-extrabold text-primary">{ui("notFound.title", "ar")}</h1>
      <p className="mt-3 max-w-md text-body text-text-muted">{ui("notFound.copy", "ar")}</p>
      <Link href="/ar" className="mt-8 inline-flex items-center justify-center gap-2 rounded-[0.625rem] bg-primary-hover px-5 py-2.5 font-bold text-button text-white transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-navy">
        {ui("cta.backHome", "ar")}
      </Link>
    </main>
  );
}
