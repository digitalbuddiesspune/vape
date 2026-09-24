import { Link } from "react-router-dom";
import { useBrandsQuery } from "../../hooks/queries/useBrandsQuery";
import SectionHeader from "./SectionHeader";

function BrandCard({ brand }) {
  return (
    <Link
      to={`/product?brandName=${encodeURIComponent(brand.brandName)}`}
      className="flex h-[100px] w-[120px] shrink-0 items-center justify-center rounded-xl border border-border-light bg-white px-4 shadow-sm transition hover:border-primary/30 hover:shadow-md sm:h-[112px] sm:w-[132px] md:h-[124px] md:w-[144px]"
    >
      <img
        src={brand.brandImage}
        alt={brand.brandName}
        className="max-h-14 max-w-full object-contain sm:max-h-16 md:max-h-[72px]"
        loading="lazy"
      />
    </Link>
  );
}

function BrandMarqueeGroup({ brands, groupKey, ariaHidden = false }) {
  return (
    <div className="social-marquee-group" aria-hidden={ariaHidden || undefined}>
      {brands.map((brand) => (
        <BrandCard key={`${groupKey}-${brand._id}`} brand={brand} />
      ))}
    </div>
  );
}

function TopBrandsMobileRows({ brands }) {
  const splitAt = Math.ceil(brands.length / 2);
  const topRow = brands.slice(0, splitAt);
  const bottomRow = brands.slice(splitAt);

  return (
    <div className="hide-scrollbar overflow-x-auto md:hidden">
      <div className="inline-flex min-w-min flex-col gap-3">
        <div className="flex gap-3">
          {topRow.map((brand) => (
            <BrandCard key={`top-${brand._id}`} brand={brand} />
          ))}
        </div>
        {bottomRow.length > 0 ? (
          <div className="flex gap-3">
            {bottomRow.map((brand) => (
              <BrandCard key={`bottom-${brand._id}`} brand={brand} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TopBrands() {
  const { data: brands = [], isLoading: loading } = useBrandsQuery();

  if (loading || brands.length === 0) {
    return null;
  }

  return (
    <section className="store-section-pad bg-white">
      <SectionHeader title="Top Brands" viewAllTo="/product" />
      <TopBrandsMobileRows brands={brands} />
      <div className="social-marquee hide-scrollbar hidden md:block">
        <div className="social-marquee-track">
          <BrandMarqueeGroup brands={brands} groupKey="a" />
          <BrandMarqueeGroup brands={brands} groupKey="b" ariaHidden />
        </div>
      </div>
    </section>
  );
}

export default TopBrands;
