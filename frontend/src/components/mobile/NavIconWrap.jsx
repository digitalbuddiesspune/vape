import { iconCountBadgeClass } from "../../utils/iconLayout";

export function NavIconWrap({ children, badge, compact = false }) {
  const count = Number(badge) || 0;

  return (
    <span className="relative inline-flex shrink-0 items-center justify-center overflow-visible">
      {children}
      {count > 0 ? (
        <span className={iconCountBadgeClass(compact)}>{count > 99 ? "99+" : count}</span>
      ) : null}
    </span>
  );
}
