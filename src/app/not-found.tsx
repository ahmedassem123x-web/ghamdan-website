import Link from "next/link";
import { NotFoundIllustration } from "@/components/illustrations";
import { ui } from "@/lib/ui-copy";

/** 404 page (static export: unknown locales land here via not-found). */
export default function NotFound() {
  return (
    <main>
      {/* Quiet light mesh: illustration + giant numeral */}
      <div className="bg-mesh-light">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-4 pt-16 text-center">
          <div data-reveal="scale" aria-hidden="true">
            <NotFoundIllustration className="w-full max-w-md" />
          </div>
          <p data-reveal="fade" className="mt-6 font-latin text-7xl font-extrabold text-navy" dir="ltr">404</p>
        </div>
      </div>
      {/* LOUD navy mesh: title + copy + way home */}
      <div className="bg-mesh-navy">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-16 pt-10 text-center">
          <div data-reveal="fade" className="mb-4 flex justify-center">
            <span className="section-marker" aria-hidden="true" />
          </div>
          <h1 data-reveal="up" className="text-h2 font-extrabold text-white">
            <span lang="ar">{ui("notFound.title", "ar")}</span>
            {" · "}
            <span lang="en">{ui("notFound.title", "en")}</span>
            {" · "}
            <span lang="zh">{ui("notFound.title", "zh")}</span>
          </h1>
          <p data-reveal="fade" className="mt-3 max-w-md text-body text-sky-100">{ui("notFound.copy", "ar")}</p>
          <Link href="/" className="mt-8 inline-flex items-center justify-center gap-2 rounded-[0.625rem] bg-white px-5 py-2.5 font-bold text-button text-navy transition-transform duration-200 hover:-translate-y-0.5">
            {ui("cta.backHome", "ar")}
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-sm font-bold">
            <Link href="/ar/products" className="text-sky-100 underline underline-offset-4 transition-colors hover:text-white">
              {ui("nav.products", "ar")}
            </Link>
            <Link href="/ar/contact" className="text-sky-100 underline underline-offset-4 transition-colors hover:text-white">
              {ui("cta.contactUs", "ar")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
