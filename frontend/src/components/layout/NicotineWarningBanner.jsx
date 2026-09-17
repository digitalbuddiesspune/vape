import { NICOTINE_WARNING } from "../../config/site";

function NicotineWarningBanner() {
  return (
    <aside
      aria-label="Nicotine warning"
      className="border-y border-amber-500/30 bg-amber-500/10 px-4 py-3 sm:px-6 lg:px-8"
    >
      <p className="mx-auto max-w-7xl text-center text-xs leading-relaxed text-black sm:text-sm">
        {NICOTINE_WARNING}
      </p>
    </aside>
  );
}

export default NicotineWarningBanner;
