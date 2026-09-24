/** Storefront accent palette (icons, small subtitles). Primary buttons use #017474 via theme primary. */

export const BRAND_MAGENTA = "#DA3695";
export const BRAND_LIME = "#D2CB08";
export const BRAND_BLUE = "#3972DB";
export const BRAND_ORANGE = "#FE8140";
export const BRAND_YELLOW = "#FAF83C";

export const BRAND_BUTTON = "#017474";

export const BRAND_ACCENTS = [
  {
    hex: BRAND_MAGENTA,
    text: "text-brand-magenta",
    iconBg: "bg-brand-magenta/12",
    accent: "bg-brand-magenta",
  },
  {
    hex: BRAND_LIME,
    text: "text-brand-lime",
    iconBg: "bg-brand-lime/20",
    accent: "bg-brand-lime",
  },
  {
    hex: BRAND_BLUE,
    text: "text-brand-blue",
    iconBg: "bg-brand-blue/12",
    accent: "bg-brand-blue",
  },
  {
    hex: BRAND_ORANGE,
    text: "text-brand-orange",
    iconBg: "bg-brand-orange/12",
    accent: "bg-brand-orange",
  },
  {
    hex: BRAND_YELLOW,
    text: "text-brand-yellow",
    iconBg: "bg-brand-yellow/25",
    accent: "bg-brand-yellow",
  },
];

export function getBrandAccent(index = 0) {
  const i = ((index % BRAND_ACCENTS.length) + BRAND_ACCENTS.length) % BRAND_ACCENTS.length;
  return BRAND_ACCENTS[i];
}
