export function getCartLineKey(item) {
  const productId = item?._id || item?.productId || "";
  return `${productId}::${item?.variantName || ""}::${item?.colorName || ""}::${item?.strength || ""}`;
}

export function matchesCartLineOptions(
  item,
  { productId, variantName = "", colorName = "", strength = "" } = {}
) {
  return (
    String(item._id) === String(productId) &&
    (item.variantName || "") === (variantName || "") &&
    (item.colorName || "") === (colorName || "") &&
    (item.strength || "") === (strength || "")
  );
}
