/**
 * Toast (Phase 2, dynamic-site plan §9) — small status notice, e.g. after
 * copying the product page link. `role="status"` so screen readers
 * announce it; auto-dismisses after 3s. Transform/opacity only; the
 * entrance animation is disabled under `prefers-reduced-motion` (see
 * Toast.module.css) so the message simply appears. Rendered only while
 * visible — no hidden live region lingers in the DOM.
 */

"use client";

import { useEffect } from "react";
import styles from "./Toast.module.css";

export default function Toast({
  message,
  visible,
  nonce,
  onClose,
}: {
  message: string;
  visible: boolean;
  /** Increment to re-show / restart the auto-dismiss timer. */
  nonce: number;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timer);
  }, [visible, nonce, onClose]);

  if (!visible) return null;

  return (
    <div role="status" className={styles.toast}>
      {message}
    </div>
  );
}
