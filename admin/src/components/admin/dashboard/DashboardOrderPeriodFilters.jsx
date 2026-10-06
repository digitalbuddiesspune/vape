import { DASHBOARD_ORDER_PERIODS } from "../dashboardUtils";

function DashboardOrderPeriodFilters({ value, onChange, disabled = false }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-neutral-600">Orders:</span>
      {DASHBOARD_ORDER_PERIODS.map((period) => {
        const selected = value === period.id;
        return (
          <button
            key={period.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(period.id)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition disabled:opacity-60 ${
              selected
                ? "border-primary bg-primary/10 text-primary"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-primary/40 hover:text-neutral-900"
            }`}
          >
            {period.label}
          </button>
        );
      })}
    </div>
  );
}

export default DashboardOrderPeriodFilters;
