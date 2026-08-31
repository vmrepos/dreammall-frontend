import { Link } from "react-router-dom"
import type { TDelivery } from "../../../../types/Delivery"

type Props = {
  delivery: TDelivery
}

export const DeliveryStatusBanners = ({ delivery }: Props) => (
  <>
    {delivery.status === "driving_back" && !delivery.driver_returned_at && (
      <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Cliente ausente. Esperando que el repartidor vuelva al local.
      </p>
    )}
    {delivery.status === "returned" && (
      <p className="mb-4 rounded-xl bg-brand-light px-4 py-3 text-sm text-brand">
        {delivery.order_id != null ? (
          <>
            Pedido recibido de vuelta. Puedes reenviar o cancelar el pedido{" "}
            <Link to={`/orders/${delivery.order_id}`} className="font-semibold underline">
              #{delivery.order_id}
            </Link>
            .
          </>
        ) : (
          "Envío recibido de vuelta. Puedes reenviarlo o cancelarlo."
        )}
      </p>
    )}
  </>
)
