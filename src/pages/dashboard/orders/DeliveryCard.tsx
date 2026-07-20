import { DeliveryStatusBadge } from "../../../components/molecules/StatusBadge"
import { DetailRow } from "../../../components/organisms/OrderItemsTable"
import type { TDelivery } from "../../../types/Delivery"
import { formatDate } from "../../../utils/format"

export const DeliveryCard = ({ delivery }: { delivery: TDelivery }) => (
  <div>
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-3">
      <span className="text-sm text-gray-500">Estado</span>
      <DeliveryStatusBadge status={delivery.status} />
    </div>
    <DetailRow
      label="Repartidor"
      value={delivery.driver?.name ?? "Sin asignar"}
    />
    <DetailRow label="Teléfono" value={delivery.driver?.phone_number ?? "Sin asignar"} />
    <DetailRow label="Creada" value={formatDate(delivery.created_at)} />
    <DetailRow label="Actualizada" value={formatDate(delivery.updated_at)} />

    <DetailRow
      label="Detalle"
      value={`Ver entrega`}
      href={`/deliveries/${delivery.id}`}
    />
  </div>
)
