import { inputClass, labelClass } from "./adminStyles";

function StringListField({ label, items, onAdd, onUpdate, onRemove, placeholder }) {
  return (
    <div className="space-y-2">
      <label className={labelClass}>{label}</label>
      {items.length === 0 ? (
        <p className="text-xs text-text-muted">No entries yet.</p>
      ) : null}
      {items.map((value, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onUpdate(index, e.target.value)}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="shrink-0 rounded-lg border border-border-light px-3 py-2 text-sm text-red-600 transition hover:border-red-300 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="text-sm font-semibold text-accent hover:underline"
      >
        + Add {label.toLowerCase()}
      </button>
    </div>
  );
}

export default StringListField;
