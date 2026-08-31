import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { cn } from "../../../../utils/format"
import { orderStatusFilters, type StatusFilter } from "./statusFilters"

type Props = {
  value: StatusFilter
  counts: Record<StatusFilter, number>
  onChange: (value: StatusFilter) => void
}

export const StatusFilters = ({ value, counts, onChange }: Props) => (
  <div className="mb-4">
    <div className="flex flex-wrap gap-2 phone-portrait:hidden" role="tablist" aria-label="Filtrar por estado">
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

    <label className="relative hidden phone-portrait:flex">
      <span className="sr-only">Filtrar por estado</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as StatusFilter)}
        className="w-full appearance-none rounded-xl border border-gray-200 bg-surface-elevated py-2.5 pl-3.5 pr-10 text-sm font-semibold text-ink shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      >
        {orderStatusFilters.map((filter) => (
          <option key={filter.id} value={filter.id}>
            {filter.label} ({counts[filter.id]})
          </option>
        ))}
      </select>
      <FontAwesomeIcon
        icon={faChevronDown}
        className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-ink-muted"
        aria-hidden
      />
    </label>
  </div>
)
