import type { TReportDateRange, TReportPeriodPreset } from "../../../../types/Report"

export const REPORT_PERIOD_OPTIONS: { id: TReportPeriodPreset; label: string }[] = [
  { id: "day", label: "Día" },
  { id: "week", label: "Semana" },
  { id: "month", label: "Mes" },
]

export const periodLabels = (
  period: TReportPeriodPreset,
): { current: string; previous: string; emptyProducts: string } => {
  switch (period) {
    case "day":
      return {
        current: "Hoy",
        previous: "Ayer",
        emptyProducts: "Sin ventas de productos hoy.",
      }
    case "week":
      return {
        current: "Esta semana",
        previous: "Semana anterior",
        emptyProducts: "Sin ventas de productos esta semana.",
      }
    case "month":
    default:
      return {
        current: "Este mes",
        previous: "Mes anterior",
        emptyProducts: "Sin ventas de productos este mes.",
      }
  }
}

const toInputDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/** Default list filter: first day of the current month → today. */
export const defaultDateRange = (): TReportDateRange => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  return { from: toInputDate(start), to: toInputDate(now) }
}
