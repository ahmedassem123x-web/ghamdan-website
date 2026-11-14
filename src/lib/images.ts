/**
 * Prefer the WebP derivative of a local image when one exists (generated at
 * build-prep time from the JPG originals; heroes target ≤150KB per spec
 * §7.3.9). Falls back to the original path for anything without a .webp.
 */
export function webp(src: string): string {
  if (src.startsWith("/images/") && src.toLowerCase().endsWith(".jpg")) {
    return `${src.slice(0, -4)}.webp`;
  }
  return src;
}
