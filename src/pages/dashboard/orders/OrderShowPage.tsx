import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faClipboardList } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Card, CardHeader } from "../../../components/atoms/Card"
import { ConfirmDialog } from "../../../components/molecules/ConfirmDialog"
import { OrderStatusBadge } from "../../../components/molecules/StatusBadge"
import { DetailRow, OrderItemsTable } from "../../../components/organisms/OrderItemsTable"
import { useOrders } from "../../../context/OrdersContext"
import type { TOrderStatus } from "../../../types/Order"
import { canCancelOrder, getNextOrderStatus, orderStatusConfig } from "../../../utils/status"
import { formatCurrency, formatDate } from "../../../utils/format"

const nextActionLabel: Partial<Record<TOrderStatus, string>> = {
  pending: "Marcar listo",
}

export const OrderShowPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const orderId = Number(id)
  const { getOrder, fetchOrder, updateOrder } = useOrders()
  const order = getOrder(orderId)
  const [loading, setLoading] = useState(!order)
  const [notFound, setNotFound] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setNotFound(false)
      try {
        await fetchOrder(orderId)
      } catch {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [orderId, fetchOrder])

  if (loading && !order) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm text-gray-500">Cargando pedido...</p>
      </div>
    )
  }

  if (notFound || !order) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-bold text-gray-900">Pedido no encontrado</h1>
        <Link to="/orders" className="mt-4 inline-block text-brand hover:underline">
          Volver a pedidos
        </Link>
      </div>
    )
  }

  const nextStatus = getNextOrderStatus(order.status)
  const nextLabel = nextActionLabel[order.status]

  const advanceStatus = () => {
    if (!nextStatus) return
    updateOrder(order.id, (current) => ({
      ...current,
      status: nextStatus,
      updated_at: new Date().toISOString(),
    }))
  }

  const cancelOrder = () => {
    updateOrder(order.id, (current) => ({
      ...current,
      status: "cancelled",
      updated_at: new Date().toISOString(),
    }))
    setShowCancelDialog(false)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="size-4" aria-hidden />
        Volver a pedidos
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-brand">
            <FontAwesomeIcon icon={faClipboardList} className="size-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wide">Pedido #{order.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{orderStatusConfig[order.status].label}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-[15px] text-gray-500">
            Creado el {formatDate(order.created_at)}
          </p>
        </div>

        <div className="flex gap-3">
          {nextLabel && (
            <Button onClick={advanceStatus}>{nextLabel}</Button>
          )}
          {canCancelOrder(order.status) && (
            <Button variant="danger" onClick={() => setShowCancelDialog(true)}>
              Cancelar pedido
            </Button>
          )}
          {order.status === "ready" && (
            <Button variant="secondary" onClick={() => navigate("/deliveries/new")}>
              Crear entrega
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader title="Detalle del pedido" description="Productos incluidos en este pedido" />
            <OrderItemsTable items={order.items} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card padding="md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Resumen</h2>
            <DetailRow label="Subtotal" value={formatCurrency(order.total_amount)} />

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-brand">
                {formatCurrency(Number(order.total_amount))}
              </span>
            </div>
          </Card>

          <Card padding="md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Entrega</h2>
            {order.delivery_id ? (
              <DetailRow
                label="Entrega asociada"
                value={`#${order.delivery_id}`}
                href={`/deliveries/${order.delivery_id}`}
              />
            ) : (
              <p className="text-sm text-gray-500">Sin entrega asociada todavía.</p>
            )}
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showCancelDialog}
        title="Cancelar pedido"
        message="¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer."
        confirmLabel="Sí, cancelar"
        onConfirm={cancelOrder}
        onCancel={() => setShowCancelDialog(false)}
      />
    </div>
  )
}
