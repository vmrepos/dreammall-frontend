import { Input } from "../../../../components/atoms/Input"
import type { TReportDateRange } from "../../../../types/Report"

type Props = {
  value: TReportDateRange
  onChange: (range: TReportDateRange) => void
}

export const DateRangeFilter = ({ value, onChange }: Props) => (
  <div className="mb-4 flex flex-wrap items-end gap-3">
    <label className="flex min-w-[10rem] flex-1 flex-col gap-1.5 sm:max-w-[14rem]">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Desde</span>
      <Input
        type="date"
        value={value.from}
        max={value.to}
        onChange={(e) => onChange({ ...value, from: e.target.value })}
        className="py-2.5"
      />
    </label>
    <label className="flex min-w-[10rem] flex-1 flex-col gap-1.5 sm:max-w-[14rem]">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Hasta</span>
      <Input
        type="date"
        value={value.to}
        min={value.from}
        onChange={(e) => onChange({ ...value, to: e.target.value })}
        className="py-2.5"
      />
    </label>
  </div>
)
