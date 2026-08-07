import { useEffect, useState } from "react"
import { faChartPie } from "@fortawesome/free-solid-svg-icons"
import { PageHeader } from "../../../components/molecules/PageHeader"
import { apiClient } from "../../../services/apiClient"
import type { TReport } from "../../../types/Report"
import { DeliveriesWidget } from "../../../widgets/Deliveries"
import { OrdersWidget } from "../../../widgets/Orders"
import { ProductsWidget } from "../../../widgets/Products"
import { SalesWidget } from "../../../widgets/Sales"
import { WidgetCard } from "./WidgetCard"

export const ReportsPage = () => {
  const [report, setReport] = useState<TReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    apiClient.reports
      .get()
      .then((data) => {
        if (!cancelled) {
          setReport(data)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo cargar el reporte.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-2">
      <PageHeader
        icon={faChartPie}
        section="Analítica"
        title="Reportes"
        description="Resumen del mes actual frente al mes anterior."
      />

      {loading && (
        <p className="text-sm text-ink-muted">Cargando indicadores…</p>
      )}

      {error && (
        <p className="rounded-xl border border-accent-clay/30 bg-accent-clay/10 px-4 py-3 text-sm text-accent-clay">
          {error}
        </p>
      )}

      {report && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <WidgetCard title="Ventas" description="Ingresos de pedidos no cancelados.">
            <SalesWidget sales={report.sales} />
          </WidgetCard>

          <WidgetCard title="Pedidos" description="Volumen y estados del mes.">
            <OrdersWidget orders={report.orders} />
          </WidgetCard>

          <WidgetCard title="Productos" description="Lo más vendido este mes.">
            <ProductsWidget products={report.products} />
          </WidgetCard>

          <WidgetCard
            title="Entregas"
            description="Desempeño y créditos usados."
            className="sm:col-span-2 xl:col-span-3"
          >
            <DeliveriesWidget deliveries={report.deliveries} />
          </WidgetCard>
        </div>
      )}
    </div>
  )
}
