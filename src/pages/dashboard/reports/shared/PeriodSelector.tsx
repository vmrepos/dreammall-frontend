import type { TReportPeriodPreset } from "../../../../types/Report"
import { cn } from "../../../../utils/format"
import { REPORT_PERIOD_OPTIONS } from "./reportPeriod"

type Props = {
  value: TReportPeriodPreset
  onChange: (period: TReportPeriodPreset) => void
}

export const PeriodSelector = ({ value, onChange }: Props) => (
  <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Periodo del resumen">
    {REPORT_PERIOD_OPTIONS.map((option) => {
      const active = value === option.id
      return (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={cn(
            "inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
            active
              ? "border-brand bg-brand text-white"
              : "border-gray-200 bg-surface-elevated text-ink-muted hover:border-gray-300 hover:text-ink",
          )}
        >
          {option.label}
        </button>
      )
    })}
  </div>
)
