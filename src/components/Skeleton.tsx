import styles from "./Skeleton.module.css";

/**
 * Skeleton loaders (Phase 3 §13): placeholder product cards shown while
 * search results or a filtered grid swap in. Same silhouette as
 * ProductCard (image + title + lines + actions) so the swap causes no
 * layout shift. Shimmer is a CSS gradient only (see Skeleton.module.css);
 * reduced motion renders static placeholders. aria-hidden: the grid
 * container carries the loading announcement via `label`.
 */
export function ProductCardSkeleton({ layout = "grid" }: { layout?: "grid" | "list" }) {
  return (
    <div
      aria-hidden="true"
      className={`flex flex-col overflow-hidden rounded-card border border-border bg-white shadow-card ${
        layout === "list" ? "sm:flex-row" : ""
      }`}
    >
      <div
        className={`${styles.shimmer} aspect-[4/3] w-full ${
          layout === "list" ? "sm:aspect-auto sm:w-60 sm:shrink-0" : ""
        }`}
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className={`${styles.shimmer} h-5 w-3/4 rounded`} />
        <div className={`${styles.shimmer} h-3 w-full rounded`} />
        <div className={`${styles.shimmer} h-3 w-2/3 rounded`} />
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4">
          <div className={`${styles.shimmer} h-4 w-16 rounded`} />
          <div className={`${styles.shimmer} h-9 w-24 rounded-full`} />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 8,
  layout = "grid",
  className = "",
  label,
}: {
  count?: number;
  layout?: "grid" | "list";
  className?: string;
  label?: string;
}) {
  return (
    <div className={className} aria-busy="true">
      {label && <span className="sr-only">{label}</span>}
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} layout={layout} />
      ))}
    </div>
  );
}
