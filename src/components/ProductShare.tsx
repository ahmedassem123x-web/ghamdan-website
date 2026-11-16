/**
 * ProductShare (Phase 2, plan §9 — Toast on copy/share). Copy-link and
 * share buttons for the product page. Copying the page URL shows a
 * Toast ("link copied" in the page locale); sharing uses the native
 * share sheet when available and falls back to copying the link.
 *
 * Copy strings are minimal correct translations (no "copy link" key
 * exists in ui-copy yet): ar "تم نسخ الرابط" / en "Link copied" /
 * zh "链接已复制".
 */

"use client";

import { useCallback, useState } from "react";
import { Link2, Share2 } from "lucide-react";
import Toast from "./Toast";
import type { Locale } from "@/data";

const COPY_MESSAGE: Record<Locale, string> = {
  ar: "تم نسخ الرابط",
  en: "Link copied",
  zh: "链接已复制",
};

const COPY_LABEL: Record<Locale, string> = {
  ar: "نسخ الرابط",
  en: "Copy link",
  zh: "复制链接",
};

const SHARE_LABEL: Record<Locale, string> = {
  ar: "مشاركة",
  en: "Share",
  zh: "分享",
};

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API unavailable (insecure context / denied): fallback.
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

export default function ProductShare({
  locale,
  url,
  name,
}: {
  locale: Locale;
  url: string;
  name: string;
}) {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastNonce, setToastNonce] = useState(0);

  const showToast = useCallback(() => {
    setToastNonce((n) => n + 1);
    setToastVisible(true);
  }, []);

  const copyLink = useCallback(async () => {
    if (await copyText(url)) showToast();
  }, [url, showToast]);

  const share = useCallback(async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: name, url });
        return;
      } catch {
        // User dismissed the sheet (or it failed) — no toast, no error.
        return;
      }
    }
    await copyLink();
  }, [name, url, copyLink]);

  return (
    <>
      <button type="button" onClick={copyLink} className="btn btn-outline inline-flex items-center gap-2">
        <Link2 className="size-4" aria-hidden="true" />
        {COPY_LABEL[locale]}
      </button>
      <button type="button" onClick={share} className="btn btn-outline inline-flex items-center gap-2">
        <Share2 className="size-4" aria-hidden="true" />
        {SHARE_LABEL[locale]}
      </button>
      <Toast
        message={COPY_MESSAGE[locale]}
        visible={toastVisible}
        nonce={toastNonce}
        onClose={() => setToastVisible(false)}
      />
    </>
  );
}
