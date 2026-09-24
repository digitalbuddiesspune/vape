/** Primary storefront actions (neutral, matches Add to Cart). */

const BASE =
  "bg-neutral-900 font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed";

export const STORE_BTN_PRIMARY_LG = `rounded-lg ${BASE} px-8 py-3 text-sm tracking-wide`;

export const STORE_BTN_PRIMARY_MD = `rounded-lg ${BASE} px-5 py-2.5 text-sm`;

export const STORE_BTN_PRIMARY_FULL = `mt-4 flex w-full items-center justify-center rounded-md ${BASE} px-3 py-2.5 text-xs sm:text-sm`;

export const STORE_BTN_PLACE_ORDER = `flex w-full items-center justify-center gap-2 rounded-lg ${BASE} px-4 py-2.5 text-sm sm:px-6 sm:py-3.5`;
