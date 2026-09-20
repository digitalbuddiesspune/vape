export function getCheckoutLineKey(item) {
  const productId = item?.productId || item?._id || "";
  return `${productId}::${item?.variantName || ""}::${item?.colorName || ""}::${item?.strength || ""}`;
}
