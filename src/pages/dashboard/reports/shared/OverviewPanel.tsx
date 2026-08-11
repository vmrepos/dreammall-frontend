import type { TReport, TReportPeriodPreset } from "../../../../types/Report"
import { DeliveriesWidget } from "../../../../widgets/Deliveries"
import { OrdersWidget } from "../../../../widgets/Orders"
import { ProductsWidget } from "../../../../widgets/Products"
import { SalesWidget } from "../../../../widgets/Sales"
import { periodLabels } from "./reportPeriod"
import { WidgetCard } from "./WidgetCard"

type Props = {
  report: TReport
  period: TReportPeriodPreset
}

export const OverviewPanel = ({ report, period }: Props) => {
  const labels = periodLabels(period)

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <WidgetCard title="Ventas" description="Ingresos de pedidos no cancelados.">
        <SalesWidget
          sales={report.sales}
          currentLabel={labels.current}
          previousLabel={labels.previous}
        />
      </WidgetCard>

      <WidgetCard title="Pedidos" description="Volumen y estados del periodo.">
        <OrdersWidget orders={report.orders} periodLabel={labels.current} />
      </WidgetCard>

      <WidgetCard title="Productos" description="Lo más vendido en el periodo.">
        <ProductsWidget products={report.products} emptyMessage={labels.emptyProducts} />
      </WidgetCard>

      <WidgetCard
        title="Entregas"
        description="Desempeño y créditos usados."
        className="sm:col-span-2 xl:col-span-3"
      >
        <DeliveriesWidget deliveries={report.deliveries} periodLabel={labels.current} />
      </WidgetCard>
    </div>
  )
}
