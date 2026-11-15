"use client";

import { useEffect } from "react";

/**
 * Root route (/): static export cannot server-redirect, so the client
 * redirects to the default locale /ar. A plain link covers no-JS.
 */
export default function RootPage() {
  useEffect(() => {
    window.location.replace("/ar");
  }, []);
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <p data-reveal className="text-body text-text-muted">
        <a href="/ar" className="font-bold text-primary-hover underline">
          غمدان — GHAMDAN
        </a>
      </p>
    </main>
  );
}
