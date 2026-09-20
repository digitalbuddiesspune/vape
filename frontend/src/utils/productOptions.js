export function hasStrengthOptions(product) {
  return (
    Array.isArray(product?.strength) &&
    product.strength.some((item) => String(item).trim())
  );
}
