import {
  SITE_CURRENCY,
  SITE_LOCALE,
  CURRENCY_SYMBOL,
  formatSitePrice,
  formatSiteAmount,
} from "@shared/currency/siteCurrency.js";

export {
  SITE_CURRENCY,
  SITE_LOCALE,
  CURRENCY_SYMBOL,
  formatSitePrice,
  formatSiteAmount,
};

export function formatPrice(amount, fractionDigits = 2) {
  return formatSitePrice(amount, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}
