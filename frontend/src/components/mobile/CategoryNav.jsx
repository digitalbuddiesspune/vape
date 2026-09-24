import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCategoriesQuery } from "../../hooks/queries/useCategoriesQuery";

function sortCategories(categories) {
  return [...categories].sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" })
  );
}

function normalizeCategoryName(name) {
  return (name || "").trim().toLowerCase().replace(/\s+/g, " ");
}

/** Categories hidden from home “Shop By Your Choice” only (still on /product). */
function isHiddenHomeCategory(categoryName) {
  const key = normalizeCategoryName(categoryName);
  if (key === "most purchase") return true;
  if (key === "vape accessories" || key === "vape accessory") return true;
  if (/^vape\s+acces?sor/i.test(key)) return true;
  return false;
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
      <span className="flex h-full w-full items-center justify-center rounded-lg bg-neutral-100 text-lg font-bold uppercase text-neutral-400 transition-transform duration-300 ease-out group-hover:scale-110 sm:text-2xl lg:text-4xl">
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
      className={`group flex min-h-[168px] flex-col overflow-hidden rounded-xl bg-white transition-colors sm:min-h-[192px] lg:min-h-[200px] ${className}`}
    >
      <div className="flex flex-1 items-center justify-center overflow-hidden px-0.5 pt-2 sm:px-1 sm:pt-3 lg:px-1 lg:pt-3 lg:pb-1">
        <div className="flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28 lg:h-36 lg:w-36">
          <CategoryImage src={category.image} name={category.name} />
        </div>
      </div>
      <p className="line-clamp-2 px-0.5 pb-2 text-center text-[10px] font-extrabold uppercase leading-tight tracking-tight text-text-primary transition-colors duration-300 group-hover:text-brand-magenta sm:px-1 sm:pb-2.5 sm:text-xs lg:px-1 lg:pb-2 lg:text-xs lg:leading-snug">
        {category.name.replace(/&/g, " / ")}
      </p>
    </Link>
  );
}

function CategoryFlexGrid({ categories }) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:flex-nowrap lg:justify-center lg:gap-4 xl:gap-5">
      {categories.map((category) => (
        <CategoryCard
          key={category.name}
          category={category}
          className="w-[calc((100%-1rem)/3)] sm:w-[calc((100%-1.5rem)/3)] lg:min-w-0 lg:flex-1 lg:basis-0 lg:w-auto"
        />
      ))}
    </div>
  );
}

function CategoryNav() {
  const { data: apiCategories = [] } = useCategoriesQuery();

  const categories = useMemo(() => {
    const filtered = apiCategories.filter(
      (cat) => !isHiddenHomeCategory(cat.categoryName)
    );

    return filtered.map((cat) => ({
      name: cat.categoryName,
      image: isUsableCategoryImage(cat.categoryImage) ? cat.categoryImage : undefined,
    }));
  }, [apiCategories]);

  const sortedCategories = useMemo(() => sortCategories(categories), [categories]);

  if (sortedCategories.length === 0) {
    return null;
  }

  return (
    <section className="store-section-pad bg-mobile-bg">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-4 py-0 text-center sm:mb-5 lg:mb-6">
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
