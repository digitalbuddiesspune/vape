import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { buildProductSearchUrl } from "../../utils/productSearch";

function SearchIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}

function DesktopSearchBar({ className = "" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      navigate("/product");
      return;
    }
    navigate(buildProductSearchUrl(trimmed));
  };

  return (
    <form
      className={`flex h-11 w-full items-center gap-2 rounded-full border border-neutral-200 bg-white pl-4 pr-1.5 shadow-sm transition focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-100 ${className}`}
      onSubmit={handleSubmit}
    >
      <SearchIcon className="h-5 w-5 shrink-0 text-neutral-400" />

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search all products, brands and more..."
        className="min-w-0 flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
      />

      <button
        type="submit"
        className="shrink-0 rounded-full bg-neutral-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-neutral-800"
      >
        Search
      </button>
    </form>
  );
}

export default DesktopSearchBar;
