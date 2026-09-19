export const SITE_CURRENCY = "GBP";
export const SITE_LOCALE = "en-GB";
export const CURRENCY_SYMBOL = "£";

export function formatSitePrice(
  amount,
  { minimumFractionDigits = 2, maximumFractionDigits = 2 } = {}
) {
  return new Intl.NumberFormat(SITE_LOCALE, {
    style: "currency",
    currency: SITE_CURRENCY,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(Number(amount || 0));
}

export function formatSiteAmount(
  amount,
  { minimumFractionDigits = 0, maximumFractionDigits = 0 } = {}
) {
  return new Intl.NumberFormat(SITE_LOCALE, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(Number(amount || 0));
}
