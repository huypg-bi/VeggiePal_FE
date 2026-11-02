import { cn } from "@/lib/utils";

// Chip lọc theo trạng thái; options: [{ value, label }], value "" = tất cả.
export default function ContentStatusFilter({ options, value, onChange }) {
  return (
    <div role="group" aria-label="Lọc theo trạng thái" className="flex flex-wrap items-center gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
            value === option.value ? "bg-brand text-brand-foreground" : "bg-surface text-subtle hover:text-ink"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
