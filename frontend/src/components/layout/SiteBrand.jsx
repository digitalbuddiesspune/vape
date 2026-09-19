import { Link } from "react-router-dom";
import { SITE_LAUNCHER_URL, SITE_LOGO_URL, SITE_NAME } from "../../config/site";

const IMAGE_VARIANTS = {
  header:
    "h-11 w-auto max-w-[180px] object-contain sm:h-12 lg:h-14 lg:max-w-[220px]",
  headerMobile: "h-10 w-auto max-w-[150px] object-contain sm:h-11 sm:max-w-[170px]",
  footer: "h-12 w-auto max-w-[180px] object-contain sm:h-14 sm:max-w-[200px]",
  splash: "h-24 w-24 object-contain sm:h-32 sm:w-32",
  compact: "h-7 w-auto max-w-[100px] object-contain",
  badge: "h-10 w-10 object-contain",
};

const LAUNCHER_VARIANTS = new Set(["badge", "splash"]);

export function SiteBrand({ variant = "header", asLink = true, className = "" }) {
  const imgClass = `${IMAGE_VARIANTS[variant] || IMAGE_VARIANTS.header} ${className}`.trim();
  const imageSrc = LAUNCHER_VARIANTS.has(variant) ? SITE_LAUNCHER_URL : SITE_LOGO_URL;
  const content = (
    <img
      src={imageSrc}
      alt={SITE_NAME}
      className={imgClass}
      loading={variant === "splash" ? "eager" : "lazy"}
      decoding="async"
    />
  );

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
