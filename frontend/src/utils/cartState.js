import { getUnitPriceForQuantity, getVariantStock } from "./productPricing";
import { matchesCartLineOptions } from "./cartLine";

export function matchesCartLine(
  item,
  productId,
  variantName = "",
  colorName = "",
  strength = ""
) {
  return matchesCartLineOptions(item, {
    productId,
    variantName,
    colorName,
    strength,
  });
}

export function findCartLine(
  items,
  productId,
  variantName = "",
  colorName = "",
  strength = ""
) {
  return (
    items.find((item) =>
      matchesCartLine(item, productId, variantName, colorName, strength)
    ) || null
  );
}

export function mapCartItems(cart) {
  if (!cart?.items?.length) return [];

  return cart.items
    .filter((item) => item.product && item.product.isActive !== false)
    .map((item) => {
      const variantName = item.variantName || "";
      const unitPrice = getUnitPriceForQuantity(item.product, item.quantity, variantName);

      return {
        _id: item.product._id,
        variantName,
        colorName: item.colorName || "",
        strength: item.strength || "",
        strengthOptions: Array.isArray(item.product.strength) ? item.product.strength : [],
        name: item.product.name,
        brandName: item.product.brandName,
        price: item.product.price,
        discountedPrice: unitPrice,
        pricingType: item.product.pricingType,
        bulkPricing: item.product.bulkPricing,
        variantType: item.product.variantType,
        variants: item.product.variants,
        minOrderQuantity: item.product.minOrderQuantity,
        stepByQuantity: item.product.stepByQuantity,
        productImages: item.product.productImages,
        stock: getVariantStock(item.product, variantName),
        quantity: item.quantity,
      };
    });
}

function pricingFromLine(item) {
  return {
    price: item.price,
    discountedPrice: item.discountedPrice,
    pricingType: item.pricingType,
    bulkPricing: item.bulkPricing,
    variantType: item.variantType,
    variants: item.variants,
    minOrderQuantity: item.minOrderQuantity,
    stepByQuantity: item.stepByQuantity,
  };
}

export function buildCartLine(
  product,
  quantity,
  variantName = "",
  colorName = "",
  strength = ""
) {
  const qty = Number(quantity) || 0;

  return {
    _id: product._id,
    variantName: variantName || "",
    colorName: colorName || "",
    strength: strength || "",
    strengthOptions: Array.isArray(product.strength) ? product.strength : [],
    name: product.name,
    brandName: product.brandName,
    price: product.price,
    discountedPrice: getUnitPriceForQuantity(product, qty, variantName),
    pricingType: product.pricingType,
    bulkPricing: product.bulkPricing,
    variantType: product.variantType,
    variants: product.variants,
    minOrderQuantity: product.minOrderQuantity,
    stepByQuantity: product.stepByQuantity,
    productImages: product.productImages,
    stock: getVariantStock(product, variantName || ""),
    quantity: qty,
  };
}

export function removeLine(
  items,
  productId,
  variantName = "",
  colorName = "",
  strength = ""
) {
  return items.filter(
    (item) => !matchesCartLine(item, productId, variantName, colorName, strength)
  );
}

export function setLineQuantity(
  items,
  productId,
  variantName,
  colorName,
  strength,
  quantity
) {
  const qty = Number(quantity);

  if (!Number.isFinite(qty) || qty < 1) {
    return removeLine(items, productId, variantName, colorName, strength);
  }

  return items.map((item) => {
    if (!matchesCartLine(item, productId, variantName, colorName, strength)) return item;

    const pricing = pricingFromLine(item);
    return {
      ...item,
      quantity: qty,
      discountedPrice: getUnitPriceForQuantity(pricing, qty, variantName),
    };
  });
}

export function addOrMergeLine(
  items,
  product,
  quantity,
  variantName = "",
  colorName = "",
  strength = ""
) {
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty < 1) return items;

  const existing = findCartLine(items, product._id, variantName, colorName, strength);
  if (existing) {
    return setLineQuantity(
      items,
      product._id,
      variantName,
      colorName,
      strength,
      existing.quantity + qty
    );
  }

  return [...items, buildCartLine(product, qty, variantName, colorName, strength)];
}
