import { Link } from "react-router-dom";
import { SITE_NAME } from "../../config/site";

const VARIANTS = {
  header:
    "text-2xl font-extrabold tracking-tight text-gray-900 transition hover:text-purple-600 lg:text-3xl",
  headerMobile: "text-xl font-extrabold tracking-tight text-gray-900 transition hover:text-purple-600",
  footer: "text-2xl font-extrabold tracking-tight text-white",
  splash: "text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl",
  compact: "text-sm font-extrabold tracking-tight text-primary",
  badge:
    "flex h-full w-full items-center justify-center text-center text-xs font-extrabold leading-none tracking-tight text-primary",
};

export function SiteBrand({ variant = "header", asLink = true, className = "" }) {
  const classes = `${VARIANTS[variant] || VARIANTS.header} ${className}`.trim();
  const label = variant === "badge" ? SITE_NAME.slice(0, 2).toUpperCase() : SITE_NAME;
  const content = <span className={classes}>{label}</span>;

  if (asLink) {
    return (
      <Link to="/" className="inline-flex min-w-0 items-center">
        {content}
      </Link>
    );
  }

  return content;
}

export default SiteBrand;
