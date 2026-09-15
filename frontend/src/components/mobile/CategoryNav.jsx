import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCategoriesQuery } from "../../hooks/queries/useCategoriesQuery";

function sortCategories(categories) {
  return [...categories].sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" })
  );
}

function isUsableCategoryImage(url) {
  if (!url?.trim()) return false;
  if (url.includes("res.cloudinary.com/demo")) return false;
  return true;
}

function CategoryImage({ src, name }) {
  const [failed, setFailed] = useState(false);

  if (!isUsableCategoryImage(src) || failed) {
    return (
      <span className="flex h-full w-full items-center justify-center rounded-lg bg-neutral-100 text-2xl font-bold uppercase text-neutral-400 transition-transform duration-300 ease-out group-hover:scale-110 sm:text-3xl lg:text-4xl">
        {(name || "?").charAt(0)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className="max-h-full max-w-full object-contain transition-transform duration-300 ease-out group-hover:scale-110"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function CategoryCard({ category, className = "" }) {
  return (
    <Link
      to={`/product?categoryName=${encodeURIComponent(category.name)}`}
      className={`group flex min-h-[260px] flex-col overflow-hidden rounded-xl bg-white transition-colors sm:min-h-[300px] lg:min-h-[360px] ${className}`}
    >
      <div className="flex flex-1 items-center justify-center overflow-hidden px-1 pt-2 sm:px-2 sm:pt-5">
        <div className="flex h-44 w-44 items-center justify-center sm:h-44 sm:w-44 lg:h-52 lg:w-52">
          <CategoryImage src={category.image} name={category.name} />
        </div>
      </div>
      <p className="line-clamp-2 px-1 pb-0.5 text-center text-sm font-extrabold uppercase leading-tight tracking-tight text-neutral-900 transition-colors duration-300 group-hover:text-primary sm:px-2 sm:pb-1 sm:text-base">
        {category.name.replace(/&/g, " / ")}
      </p>
      {Number.isFinite(category.productCount) ? (
        <p className="px-1 pb-2 text-center text-[9px] font-medium text-neutral-500 sm:px-2 sm:pb-3 sm:text-[11px]">
          {Math.max(0, Number(category.productCount))} products
        </p>
      ) : null}
    </Link>
  );
}

function CategoryFlexGrid({ categories }) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.name}
          category={category}
          className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
        />
      ))}
    </div>
  );
}

function CategoryNav() {
  const { data: apiCategories = [] } = useCategoriesQuery();

  const categories = useMemo(() => {
    const filtered = apiCategories.filter(
      (cat) => cat.categoryName?.toLowerCase() !== "most purchase"
    );

    return filtered.map((cat) => ({
      name: cat.categoryName,
      image: isUsableCategoryImage(cat.categoryImage) ? cat.categoryImage : undefined,
      productCount: Number(cat.productCount) || 0,
    }));
  }, [apiCategories]);

  const sortedCategories = useMemo(() => sortCategories(categories), [categories]);

  if (sortedCategories.length === 0) {
    return null;
  }

  return (
    <section className="bg-mobile-bg px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-0 text-center">
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            Shop By Your Choice
          </h2>
        </div>

        <CategoryFlexGrid categories={sortedCategories} />
      </div>
    </section>
  );
}

export default CategoryNav;
