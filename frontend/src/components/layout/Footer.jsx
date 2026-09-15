import { useMemo } from "react";
import { Link } from "react-router-dom";
import { SOCIAL_LINKS } from "../../config/contact";
import { SITE_NAME, SITE_TAGLINE } from "../../config/site";
import { useCategoriesQuery } from "../../hooks/queries/useCategoriesQuery";

const shopLinks = [
  { to: "/product", label: "All Products" },
  { to: "/hot-selling", label: "Hot Selling" },
  { to: "/just-arrived", label: "Just Arrived" },
  { to: "/product", label: "Disposable Vapes" },
  { to: "/product", label: "Accessories" },
];

const legalLinks = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-and-conditions", label: "Terms of Use" },
  { to: "/shipping-details", label: "Shipping Policy" },
  { to: "/support", label: "Support" },
];

const footerSocialLinks = SOCIAL_LINKS.filter((link) =>
  ["instagram", "facebook"].includes(link.platform)
);

function InstagramIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function FooterLinkColumn({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
        {title}
      </h4>
      <ul className="space-y-2.5 text-sm">
        {links.map(({ to, label, key }) => (
          <li key={key || `${title}-${label}`}>
            <Link to={to} className="text-neutral-300 transition hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  const { data: allCategories = [] } = useCategoriesQuery();

  const categoryLinks = useMemo(() => {
    const links = allCategories
      .filter((cat) => cat.categoryName?.toLowerCase() !== "most purchase")
      .slice(0, 8)
      .map((cat) => ({
        key: cat._id,
        label: cat.categoryName,
        to: `/product?categoryName=${encodeURIComponent(cat.categoryName)}`,
      }));

    if (links.length > 0) return links;

    return [{ key: "all-products", label: "All Products", to: "/product" }];
  }, [allCategories]);

  return (
    <footer className="relative border-t border-neutral-800 bg-[#080808] pb-24 text-neutral-400 lg:overflow-hidden lg:pb-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-16 hidden select-none bg-gradient-to-t from-purple-500/15 via-purple-400/8 to-transparent pb-2 pt-16 text-center text-[clamp(4.5rem,20vw,12rem)] font-extrabold uppercase leading-none tracking-tight text-white/[0.14] lg:block lg:bottom-[-0.08em]"
      >
        {SITE_NAME}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-400/50 bg-purple-600/35 text-sm font-extrabold text-white shadow-[0_0_24px_rgba(147,51,234,0.25)]">
                VH
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-[0_0_18px_rgba(168,85,247,0.35)] sm:text-3xl">
                {SITE_NAME}
                <span className="text-purple-400">.</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
              {SITE_TAGLINE}. Your trusted destination for premium vapes, pods, and accessories across India.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {footerSocialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-300 transition hover:border-purple-500/40 hover:text-white"
                >
                  {link.platform === "instagram" ? <InstagramIcon /> : <FacebookIcon />}
                </a>
              ))}
            </div>

          </div>

          <FooterLinkColumn title="Categories" links={categoryLinks} />
          <FooterLinkColumn title="Shop" links={shopLinks} />
          <FooterLinkColumn title="Legal" links={legalLinks} />
        </div>

        <div
          aria-hidden="true"
          className="relative mt-8 px-3 py-2 text-center lg:hidden"
        >
          <p className="select-none bg-gradient-to-t from-purple-500/10 to-transparent pb-1 pt-4 text-[clamp(1.875rem,13vw,4.5rem)] font-extrabold uppercase leading-none tracking-[0.02em] text-white/20">
            {SITE_NAME}
          </p>
        </div>

        <div className="relative mt-8 pt-5 lg:mt-10">
          <div className="flex flex-col gap-2 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
            <p>
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-neutral-300">{SITE_NAME}</span>. All Rights Reserved.
            </p>
            <p>India — Serving nationwide</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
