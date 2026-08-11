import { cn } from "../../../../utils/format"
import { orderStatusFilters, type StatusFilter } from "./statusFilters"

type Props = {
  value: StatusFilter
  counts: Record<StatusFilter, number>
  onChange: (value: StatusFilter) => void
}

export const StatusFilters = ({ value, counts, onChange }: Props) => (
  <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por estado">
    {orderStatusFilters.map((filter) => {
      const active = value === filter.id
      return (
        <button
          key={filter.id}
          type="button"
          role="tab"
          aria-selected={active}
          onClick={() => onChange(filter.id)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
            active
              ? "border-brand bg-brand text-white"
              : "border-gray-200 bg-surface-elevated text-ink-muted hover:border-gray-300 hover:text-ink",
          )}
        >
          {filter.label}
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-xs tabular-nums",
              active ? "bg-white/20 text-white" : "bg-gray-100 text-ink-muted",
            )}
          >
            {counts[filter.id]}
          </span>
        </button>
      )
    })}
  </div>
)
