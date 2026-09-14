import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCategoriesQuery } from "../../hooks/queries/useCategoriesQuery";

const DEFAULT_CATEGORIES = [
  { name: "Chargers", icon: "charger" },
  { name: "Earphones", icon: "earphone" },
  { name: "Cables", icon: "cable" },
  { name: "Neckbands", icon: "neckband" },
  { name: "Power Banks", icon: "powerbank" },
  { name: "Smart Watches", icon: "watch" },
  { name: "Bluetooth Speakers", icon: "speaker" },
  { name: "Mobile Covers", icon: "cover" },
  { name: "Tempered Glass", icon: "glass" },
  { name: "Adapters", icon: "adapter" },
];

const ICON_TYPES = [
  "charger",
  "earphone",
  "cable",
  "neckband",
  "powerbank",
  "watch",
  "speaker",
  "cover",
  "glass",
  "adapter",
];

function sortCategories(categories) {
  return [...categories].sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" })
  );
}

function CategoryIcon({ type, className = "h-10 w-10" }) {
  const icons = {
    charger: (
      <>
        <rect x="8" y="3" width="8" height="5" rx="1" />
        <rect x="10" y="8" width="4" height="3" />
        <rect x="9" y="11" width="6" height="8" rx="1" />
        <rect x="11" y="14" width="2" height="3" rx="0.5" />
      </>
    ),
    earphone: (
      <>
        <path d="M7 10a5 5 0 0110 0v4a2.5 2.5 0 01-2.5 2.5h-.5v3h-3v-3H9A2.5 2.5 0 016.5 14V10z" />
        <circle cx="9" cy="9" r="1.5" />
        <circle cx="15" cy="9" r="1.5" />
      </>
    ),
    cable: (
      <>
        <rect x="4" y="9" width="4" height="6" rx="1" />
        <rect x="16" y="9" width="4" height="6" rx="1" />
        <path d="M8 12h8" stroke="currentColor" strokeWidth="2" fill="none" />
      </>
    ),
    neckband: (
      <>
        <path d="M6 11a6 6 0 0112 0v3a2 2 0 01-2 2h-1.5v2h-3v-2H8a2 2 0 01-2-2v-3z" />
        <rect x="5" y="10" width="3" height="4" rx="1.5" />
        <rect x="16" y="10" width="3" height="4" rx="1.5" />
      </>
    ),
    powerbank: (
      <>
        <rect x="7" y="5" width="10" height="14" rx="2" />
        <rect x="17" y="9" width="2" height="6" rx="0.5" />
      </>
    ),
    watch: (
      <>
        <rect x="8" y="6" width="8" height="12" rx="2" />
        <rect x="10" y="4" width="4" height="2" rx="0.5" />
        <rect x="10" y="18" width="4" height="2" rx="0.5" />
        <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
    speaker: (
      <>
        <rect x="7" y="8" width="6" height="10" rx="3" />
        <rect x="13" y="10" width="4" height="6" rx="1" />
      </>
    ),
    cover: (
      <>
        <rect x="8" y="4" width="8" height="16" rx="2" />
        <circle cx="12" cy="17" r="1" />
      </>
    ),
    glass: (
      <>
        <rect x="8" y="4" width="8" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 7h6M9 10h6" stroke="currentColor" strokeWidth="1" fill="none" />
      </>
    ),
    adapter: (
      <>
        <rect x="5" y="9" width="14" height="8" rx="1.5" />
        <rect x="7" y="6" width="3" height="3" rx="0.5" />
        <rect x="11.5" y="6" width="3" height="3" rx="0.5" />
        <rect x="16" y="6" width="3" height="3" rx="0.5" />
      </>
    ),
    default: <circle cx="12" cy="12" r="7" />,
  };

  return (
    <svg
      className={`text-text-primary ${className}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {icons[type] || icons.default}
    </svg>
  );
}

function isUsableCategoryImage(url) {
  if (!url?.trim()) return false;
  if (url.includes("res.cloudinary.com/demo")) return false;
  return true;
}

function CategoryImage({ src, name, icon, className = "h-10 w-10" }) {
  const [failed, setFailed] = useState(false);

  if (!isUsableCategoryImage(src) || failed) {
    return (
      <CategoryIcon
        type={icon}
        className={`${className} transition-transform duration-300 ease-out group-hover:scale-110`}
      />
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
      className={`group flex min-h-[180px] flex-col overflow-hidden rounded-xl bg-white transition-colors sm:min-h-[260px] lg:min-h-[300px] ${className}`}
    >
      <div className="flex flex-1 items-center justify-center overflow-hidden px-1 pt-3 sm:px-2 sm:pt-5">
        <div className="flex h-24 w-24 items-center justify-center sm:h-36 sm:w-36 lg:h-44 lg:w-44">
          <CategoryImage
            src={category.image}
            name={category.name}
            icon={category.icon}
            className="h-20 w-20 sm:h-32 sm:w-32 lg:h-40 lg:w-40"
          />
        </div>
      </div>
      <p className="line-clamp-2 px-1 pb-0.5 text-center text-[10px] font-extrabold uppercase leading-tight tracking-tight text-neutral-900 transition-colors duration-300 group-hover:text-primary sm:px-2 sm:pb-1 sm:text-sm">
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

    if (filtered.length === 0) {
      return DEFAULT_CATEGORIES;
    }

    return filtered.map((cat, index) => ({
      name: cat.categoryName,
      image: isUsableCategoryImage(cat.categoryImage) ? cat.categoryImage : undefined,
      icon: ICON_TYPES[index % ICON_TYPES.length],
      productCount: Number(cat.productCount) || 0,
    }));
  }, [apiCategories]);

  const sortedCategories = useMemo(() => sortCategories(categories), [categories]);

  return (
    <section className="bg-mobile-bg px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="relative mb-5 flex items-center justify-center sm:mb-6">
          <h2 className="text-center text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            Shop By Your Choice
          </h2>
          <Link
            to="/product"
            className="absolute right-0 shrink-0 text-sm font-semibold text-primary transition hover:underline"
          >
            View All
          </Link>
        </div>

        <CategoryFlexGrid categories={sortedCategories} />
      </div>
    </section>
  );
}

export default CategoryNav;
