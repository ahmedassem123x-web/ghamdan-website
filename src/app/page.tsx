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
    <main className="flex min-h-screen items-center justify-center bg-bg">
      <p className="text-body text-text-muted">
        <a href="/ar" className="font-bold text-accent underline">
          غمدان — GHAMDAN
        </a>
      </p>
    </main>
  );
}
