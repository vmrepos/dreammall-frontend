import { cn } from "../../../../utils/format"

export type ReportTab = "overview" | "orders" | "deliveries"

const tabs: { id: ReportTab; label: string }[] = [
  { id: "overview", label: "Resumen" },
  { id: "orders", label: "Pedidos" },
  { id: "deliveries", label: "Entregas" },
]

type Props = {
  value: ReportTab
  onChange: (tab: ReportTab) => void
}

export const ReportTabs = ({ value, onChange }: Props) => (
  <div
    className="mb-6 flex gap-1 border-b border-gray-200"
    role="tablist"
    aria-label="Secciones del reporte"
  >
    {tabs.map((tab) => {
      const active = value === tab.id
      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active}
          onClick={() => onChange(tab.id)}
          className={cn(
            "-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition",
            active
              ? "border-brand text-brand"
              : "border-transparent text-ink-muted hover:text-ink",
          )}
        >
          {tab.label}
        </button>
      )
    })}
  </div>
)
