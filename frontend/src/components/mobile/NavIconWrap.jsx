export function NavIconWrap({ children, badge, compact = false }) {
  const count = Number(badge) || 0;

  return (
    <span className="relative inline-flex shrink-0 overflow-visible">
      {children}
      {count > 0 ? (
        <span
          className={`pointer-events-none absolute z-10 flex items-center justify-center rounded-full border-2 border-white bg-primary font-bold leading-none text-white ${
            compact
              ? "-right-1.5 -top-1.5 h-4 min-w-4 px-0.5 text-[9px]"
              : "-right-2 -top-2 h-[18px] min-w-[18px] px-1 text-[10px]"
          }`}
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </span>
  );
}
