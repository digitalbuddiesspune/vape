/** Shared sizing so SVG strokes and count badges are not clipped in nav/product UI. */

export const ICON_SVG_SM = "block h-4 w-4 shrink-0";
export const ICON_SVG_MD = "block h-5 w-5 shrink-0";
export const ICON_SVG_LG = "block h-6 w-6 shrink-0";

export const ICON_HIT_SM =
  "flex h-8 w-8 shrink-0 items-center justify-center overflow-visible";
export const ICON_HIT_MD =
  "flex h-10 w-10 shrink-0 items-center justify-center overflow-visible";

/** Heart / wishlist icons across nav, profile, and product cards. */
export const WISHLIST_ICON_COLOR = "text-red-600";
export const WISHLIST_ICON_CIRCLE = "bg-red-50 text-red-600";

export function iconCountBadgeClass(compact = false) {
  return `pointer-events-none absolute z-10 flex items-center justify-center rounded-full bg-primary font-bold leading-none text-white ring-2 ring-white ${
    compact
      ? "-right-0.5 -top-0.5 h-4 min-w-4 px-0.5 text-[9px]"
      : "-right-1 -top-1 h-[18px] min-w-[18px] px-1 text-[10px]"
  }`;
}
