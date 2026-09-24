import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductFiltersBar from "./ProductFiltersBar";

function buildCategoryUrl(categoryName, params = {}) {
  const search = new URLSearchParams();
  search.set("categoryName", categoryName);
  if (params.subcategory) search.set("subcategory", params.subcategory);
  if (params.brand) search.set("brand", params.brand);
  if (params.sort) search.set("sort", params.sort);
  return `/product?${search.toString()}`;
}

function CategoryHeaderImage({ image, name }) {
  const [failed, setFailed] = useState(false);

  if (!image || failed) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-visible rounded-md bg-mobile-surface sm:h-11 sm:w-11">
        <span className="text-sm font-bold uppercase text-text-muted">
          {name?.charAt(0) || "?"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-visible rounded-md bg-white p-0.5 sm:h-11 sm:w-11">
      <img
        src={image}
        alt={name}
        className="max-h-full max-w-full object-contain"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function ScrollArrow({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll subcategories left" : "Scroll subcategories right"}
      className="flex h-7 w-7 shrink-0 items-center justify-center overflow-visible rounded-full border border-border-light bg-white text-neutral-800 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-100"
    >
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        {direction === "left" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  );
}

function SubcategoryPillScroller({ categoryName, subcategories, activeSubcategory, preservedFilters }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const pills = ["All", ...subcategories];

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [subcategories, updateScrollState]);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({ left: direction * 220, behavior: "smooth" });
    window.setTimeout(updateScrollState, 320);
  };

  return (
    <div className="flex w-full items-center gap-1.5 overflow-visible">
      {canScrollLeft ? <ScrollArrow direction="left" onClick={() => scroll(-1)} /> : null}

      <div className="relative min-w-0 flex-1 overflow-visible">
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className={`hide-scrollbar flex items-center justify-start gap-1.5 overflow-x-auto overflow-y-visible scroll-smooth py-1 ${
            canScrollRight ? "pr-9" : ""
          }`}
        >
          {pills.map((pill) => {
            const isAll = pill === "All";
            const isActive = isAll ? !activeSubcategory : activeSubcategory === pill;
            const to = isAll
              ? buildCategoryUrl(categoryName, preservedFilters)
              : buildCategoryUrl(categoryName, { ...preservedFilters, subcategory: pill });

            return (
              <Link
                key={pill}
                to={to}
                className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-1 text-center text-[10px] font-medium leading-none transition sm:px-3 sm:py-1.5 sm:text-[11px] ${
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-border-light bg-white text-text-primary hover:border-primary/40"
                }`}
              >
                {pill}
              </Link>
            );
          })}
        </div>

        {canScrollRight ? (
          <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2">
            <ScrollArrow direction="right" onClick={() => scroll(1)} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CategoryHeaderSection({
  category,
  categoryName,
  subcategories = [],
  activeSubcategory,
  selectedBrand = "",
  onBrandChange,
  sortBy = "",
  onSortChange,
  onClearFilters,
  hasActiveFilters = false,
}) {
  const [searchParams] = useSearchParams();
  const preservedFilters = {
    brand: searchParams.get("brand")?.trim() || "",
    sort: searchParams.get("sort")?.trim() || "",
  };

  return (
    <section className="overflow-visible rounded-lg border border-border-light bg-white px-2.5 py-2 shadow-sm sm:px-3 sm:py-2.5">
      <div className="flex flex-nowrap items-center justify-between gap-1.5 sm:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2.5">
          <CategoryHeaderImage image={category?.categoryImage} name={categoryName} />
          <h1 className="min-w-0 flex-1 overflow-hidden text-ellipsis text-sm font-bold leading-tight text-text-primary line-clamp-1 sm:text-base lg:line-clamp-none lg:whitespace-normal lg:overflow-visible">
            {categoryName}
          </h1>
        </div>
        <ProductFiltersBar
          embedded
          compact
          selectedBrand={selectedBrand}
          onBrandChange={onBrandChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          onClear={onClearFilters}
          hasActiveFilters={hasActiveFilters}
          className="shrink-0"
        />
      </div>

      {subcategories.length > 0 ? (
        <div className="mt-2 min-w-0 overflow-visible">
          <SubcategoryPillScroller
            categoryName={categoryName}
            subcategories={subcategories}
            activeSubcategory={activeSubcategory}
            preservedFilters={preservedFilters}
          />
        </div>
      ) : null}
    </section>
  );
}

export default CategoryHeaderSection;
