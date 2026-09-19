import { formatSiteAmount } from "./currency.js";

const formatAmount = (amount) => formatSiteAmount(amount);

export function formatCouponHeadline(coupon) {
  if (coupon?.title?.trim()) return coupon.title.trim();

  const min = Number(coupon?.minOrderAmount || 0);
  if (coupon?.discountType === "percentage") {
    return `Flat ${coupon.discountValue}% off on orders above £${formatAmount(min)}`;
  }

  return `Flat £${formatAmount(coupon?.discountValue || 0)} on orders above £${formatAmount(min)}`;
}

export function formatCouponUnlockMessage(coupon) {
  if (coupon?.redemptionBlocked) {
    return coupon.redemptionBlocked;
  }

  if (coupon?.unlocked) {
    return coupon.discountAmount > 0
      ? `You save £${formatAmount(coupon.discountAmount)} on this order`
      : "Unlocked for your cart";
  }

  if (coupon?.amountNeeded > 0) {
    return `Shop for £${formatAmount(coupon.amountNeeded)} more to unlock`;
  }

  return "Add items to your cart to unlock";
}

export function formatCouponValidity(endDate) {
  if (!endDate) return "";
  return new Date(endDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
