import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCategoriesQuery } from "../../hooks/queries/useCategoriesQuery";

function CategoryPill({ name, isActive, compact = false }) {
  return (
    <Link
      to={`/product?categoryName=${encodeURIComponent(name)}`}
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border bg-white text-center font-medium transition-colors hover:border-primary hover:text-primary ${
        compact ? "min-h-6 px-2 py-0.5 text-[10px]" : "min-h-7 px-2.5 py-0.5 text-[11px]"
      } ${
        isActive
          ? "border-primary text-primary"
          : "border-neutral-200 text-neutral-700"
      }`}
    >
      {name}
    </Link>
  );
}

function ScrollArrow({ direction, onClick, compact = false }) {
  const sizeClass = compact ? "h-6 w-6" : "h-7 w-7";
  const iconClass = compact ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll categories left" : "Scroll categories right"}
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-100`}
    >
      <svg
        className={iconClass}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        {direction === "left" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  );
}

function CategoryPillScroller({ categories, activeCategory, compact = false }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    setIsOverflowing(el.scrollWidth > el.clientWidth + 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [categories, updateScrollState]);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction * (compact ? 180 : 260),
      behavior: "smooth",
    });
    window.setTimeout(updateScrollState, 320);
  };

  const arrowSize = compact ? "h-6 w-6" : "h-7 w-7";

  return (
    <div className="flex w-full items-center justify-center gap-2">
      {isOverflowing ? (
        canScrollLeft ? (
          <ScrollArrow direction="left" onClick={() => scroll(-1)} compact={compact} />
        ) : (
          <span className={`${arrowSize} shrink-0`} aria-hidden="true" />
        )
      ) : null}

      <div className="relative min-w-0 w-full max-w-5xl flex-1">
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className={`flex items-center justify-center overflow-x-auto hide-scrollbar scroll-smooth ${
            compact ? "gap-1 py-0.5" : "gap-1.5 py-0.5"
          }`}
        >
          <div
            className={`mx-auto flex w-max max-w-none items-center justify-center ${
              compact ? "gap-1" : "gap-1.5"
            }`}
          >
            {categories.map((category) => {
              const name = category.categoryName;
              const isActive =
                activeCategory.toLowerCase() === String(name || "").toLowerCase();

              return (
                <CategoryPill
                  key={category._id || name}
                  name={name}
                  isActive={isActive}
                  compact={compact}
                />
              );
            })}
          </div>
        </div>

        {isOverflowing && canScrollRight ? (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white via-white/90 to-transparent"
            aria-hidden="true"
          />
        ) : null}
      </div>

      {isOverflowing ? (
        canScrollRight ? (
          <ScrollArrow direction="right" onClick={() => scroll(1)} compact={compact} />
        ) : (
          <span className={`${arrowSize} shrink-0`} aria-hidden="true" />
        )
      ) : null}
    </div>
  );
}

function CategoryNavbar() {
  const { data: allCategories = [] } = useCategoriesQuery();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("categoryName")?.trim() || "";

  const categories = useMemo(
    () =>
      allCategories.filter(
        (cat) => cat.categoryName?.toLowerCase() !== "most purchase"
      ),
    [allCategories]
  );

  if (!categories.length) return null;

  return (
    <nav
      aria-label="Product categories"
      className="hidden bg-white lg:block"
    >
      <div className="mx-auto flex max-w-[1600px] justify-center px-5 pb-1.5 pt-0 xl:px-8">
        <CategoryPillScroller categories={categories} activeCategory={activeCategory} />
      </div>
    </nav>
  );
}

export default CategoryNavbar;
