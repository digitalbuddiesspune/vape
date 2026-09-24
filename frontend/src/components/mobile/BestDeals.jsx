import { useEffect, useState } from "react";
import { getProducts } from "../../api/api";
import { useProductCartActions } from "../../hooks/useProductCartActions";
import SectionHeader from "./SectionHeader";
import DealProductCard from "../product/DealProductCard";
import HorizontalScrollRow from "../home/HorizontalScrollRow";

const HOME_PRODUCT_LIMIT = 12;

function BestDeals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getCartQuantity, handleAdd, handleIncrease, handleDecrease } =
    useProductCartActions();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProducts({ limit: HOME_PRODUCT_LIMIT });
        setProducts((data.data || []).slice(0, HOME_PRODUCT_LIMIT));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const cardProps = (product) => ({
    product,
    onAdd: handleAdd,
    onIncrease: handleIncrease,
    onDecrease: handleDecrease,
    cartQuantity: getCartQuantity(product),
    layout: "scroll",
  });

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="store-section-pad bg-white">
      <SectionHeader title="Vape Deals & Offers" viewAllTo="/product" className="mb-2" />

      {loading ? (
        <HorizontalScrollRow>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`deals-skeleton-${index}`}
              className="h-[258px] w-[150px] shrink-0 animate-pulse rounded-xl border border-border-light bg-gray-100 sm:w-[165px]"
            />
          ))}
        </HorizontalScrollRow>
      ) : (
        <HorizontalScrollRow>
          {products.map((product) => (
            <DealProductCard key={product._id} {...cardProps(product)} />
          ))}
        </HorizontalScrollRow>
      )}
    </section>
  );
}

export default BestDeals;
