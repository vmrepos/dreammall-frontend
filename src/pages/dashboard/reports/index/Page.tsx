import { useEffect, useState } from "react"
import { faChartPie } from "@fortawesome/free-solid-svg-icons"
import { Card } from "../../../../components/atoms/Card"
import { PageHeader } from "../../../../components/molecules/PageHeader"
import { apiClient } from "../../../../services/apiClient"
import type {
  TReport,
  TReportDateRange,
  TReportDeliveryRow,
  TReportOrderRow,
  TReportPeriodPreset,
} from "../../../../types/Report"
import { DateRangeFilter } from "../shared/DateRangeFilter"
import { DeliveriesTable } from "../shared/DeliveriesTable"
import { OrdersTable } from "../shared/OrdersTable"
import { OverviewPanel } from "../shared/OverviewPanel"
import { PeriodSelector } from "../shared/PeriodSelector"
import { ReportTabs, type ReportTab } from "../shared/ReportTabs"
import { defaultDateRange } from "../shared/reportPeriod"

const tabDescription: Record<ReportTab, string> = {
  overview: "Indicadores del periodo seleccionado frente al periodo anterior.",
  orders: "Pedidos del rango de fechas elegido.",
  deliveries: "Entregas del rango de fechas elegido.",
}

export const Page = () => {
  const [tab, setTab] = useState<ReportTab>("overview")
  const [period, setPeriod] = useState<TReportPeriodPreset>("month")
  const [dateRange, setDateRange] = useState<TReportDateRange>(defaultDateRange)

  const [report, setReport] = useState<TReport | null>(null)
  const [orders, setOrders] = useState<TReportOrderRow[]>([])
  const [deliveries, setDeliveries] = useState<TReportDeliveryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (tab !== "overview") return

    let cancelled = false
    setLoading(true)
    setError(null)

    apiClient.reports
      .overview({ period })
      .then((data) => {
        if (!cancelled) setReport(data)
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo cargar el resumen.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [tab, period])

  useEffect(() => {
    if (tab !== "orders" && tab !== "deliveries") return

    let cancelled = false
    setLoading(true)
    setError(null)

    const load = async () => {
      try {
        if (tab === "orders") {
          const data = await apiClient.reports.orders(dateRange)
          if (!cancelled) setOrders(data)
        } else {
          const data = await apiClient.reports.deliveries(dateRange)
          if (!cancelled) setDeliveries(data)
        }
      } catch {
        if (!cancelled) {
          setError(
            tab === "orders"
              ? "No se pudieron cargar los pedidos."
              : "No se pudieron cargar las entregas.",
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [tab, dateRange])

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-2">
      <PageHeader
        icon={faChartPie}
        section="Analítica"
        title="Reportes"
        description={tabDescription[tab]}
      />

      <ReportTabs value={tab} onChange={setTab} />

      {tab === "overview" && (
        <PeriodSelector value={period} onChange={setPeriod} />
      )}

      {(tab === "orders" || tab === "deliveries") && (
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      )}

      {loading && (
        <p className="text-sm text-ink-muted">Cargando…</p>
      )}

      {error && (
        <p className="rounded-xl border border-accent-clay/30 bg-accent-clay/10 px-4 py-3 text-sm text-accent-clay">
          {error}
        </p>
      )}

      {!loading && !error && tab === "overview" && report && (
        <OverviewPanel report={report} period={period} />
      )}

      {!loading && !error && tab === "orders" && (
        <Card>
          {orders.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-ink-muted">
              No hay pedidos en este rango de fechas.
            </p>
          ) : (
            <>
              <p className="border-b border-gray-100 px-6 py-3 text-sm text-ink-muted">
                <span className="font-semibold text-ink">{orders.length}</span>{" "}
                {orders.length === 1 ? "pedido" : "pedidos"}
              </p>
              <OrdersTable orders={orders} />
            </>
          )}
        </Card>
      )}

      {!loading && !error && tab === "deliveries" && (
        <Card>
          {deliveries.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-ink-muted">
              No hay entregas en este rango de fechas.
            </p>
          ) : (
            <>
              <p className="border-b border-gray-100 px-6 py-3 text-sm text-ink-muted">
                <span className="font-semibold text-ink">{deliveries.length}</span>{" "}
                {deliveries.length === 1 ? "entrega" : "entregas"}
              </p>
              <DeliveriesTable deliveries={deliveries} />
            </>
          )}
        </Card>
      )}
    </div>
  )
}
