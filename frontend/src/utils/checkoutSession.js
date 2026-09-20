import { getUnitPriceForQuantity } from "./productPricing";

const BUY_NOW_KEY = "bmm_buy_now_checkout";

export function buildBuyNowCheckoutItem(
  product,
  quantity,
  variantName = "",
  colorName = "",
  strength = ""
) {
  const qty = Number(quantity);
  const normalizedVariant = variantName || "";
  const normalizedColor = colorName || "";
  const normalizedStrength = strength || "";
  const unitPrice = getUnitPriceForQuantity(product, qty, normalizedVariant);

  return {
    productId: product._id,
    variantName: normalizedVariant,
    colorName: normalizedColor,
    strength: normalizedStrength,
    quantity: qty,
    name: product.name,
    brandName: product.brandName,
    price: product.price,
    discountedPrice: unitPrice,
    productImages: product.productImages,
    strengthOptions: Array.isArray(product.strength) ? product.strength : [],
  };
}

export function setBuyNowCheckout(item) {
  sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify(item));
}

export function getBuyNowCheckout() {
  const raw = sessionStorage.getItem(BUY_NOW_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearBuyNowCheckout() {
  sessionStorage.removeItem(BUY_NOW_KEY);
}
