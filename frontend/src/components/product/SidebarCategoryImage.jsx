import { useState } from "react";

function GridIcon({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </svg>
  );
}

const SIZE_CLASS = {
  strip: "h-10 w-10",
  default: "h-12 w-12",
};

function SidebarCategoryImage({ image, name, showGrid = false, size = "default" }) {
  const [failed, setFailed] = useState(false);
  const box = SIZE_CLASS[size] || SIZE_CLASS.default;
  const gridIcon = size === "strip" ? "h-5 w-5" : "h-6 w-6";

  if (showGrid || (!image && name === "All Categories")) {
    return (
      <div
        className={`flex ${box} shrink-0 items-center justify-center overflow-visible rounded-lg bg-mobile-surface`}
      >
        <GridIcon className={`${gridIcon} text-text-secondary`} />
      </div>
    );
  }

  if (!image || failed) {
    return (
      <div
        className={`flex ${box} shrink-0 items-center justify-center overflow-visible rounded-lg bg-mobile-surface`}
      >
        <span className="text-xs font-bold uppercase text-text-muted sm:text-sm">
          {name?.charAt(0) || "?"}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${box} shrink-0 items-center justify-center overflow-visible rounded-lg bg-white p-0.5`}>
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

export default SidebarCategoryImage;
