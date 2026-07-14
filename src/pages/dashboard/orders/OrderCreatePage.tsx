import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faClipboardList,
  faMinus,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Card, CardHeader } from "../../../components/atoms/Card"
import { Input } from "../../../components/atoms/Input"
import { Label } from "../../../components/atoms/Label"
import { useMenuCatalog } from "../../../context/MenuCatalogContext"
import { useOrders } from "../../../context/OrdersContext"
import { apiClient } from "../../../services/apiClient"
import type { TProduct } from "../../../types/Product"
import type { TOrderItemForm } from "../../../types/OrderItem"
import { parseCoordinates } from "../../../utils/coordinates"
import { formatCurrency } from "../../../utils/format"

export const OrderCreatePage = () => {
  const navigate = useNavigate()
  const { menus } = useMenuCatalog()
  const { createOrder } = useOrders()
  const [cart, setCart] = useState<TOrderItemForm[]>([])
  const [coordinatesInput, setCoordinatesInput] = useState("")
  const [deliveryFee, setDeliveryFee] = useState("0.00")
  const [distanceKm, setDistanceKm] = useState<string | null>(null)
  const [routeSource, setRouteSource] = useState<string | null>(null)
  const [discount, setDiscount] = useState("0.00")
  const [coordsError, setCoordsError] = useState("")
  const [previewError, setPreviewError] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)

  const availableProducts = useMemo(
    () =>
      menus
        .filter((menu) => menu.active)
        .flatMap((menu) =>
          menu.products
            ?.filter((product) => product.active)
            .map((product) => ({ ...product, menuName: menu.name })) ?? [],
        ),
    [menus],
  )

  const subtotal = cart.reduce(
    (sum, line) => sum + line.quantity * Number(line.unit_price),
    0,
  )

  const total = subtotal + Number(deliveryFee) - Number(discount)

  const addToCart = (product: TProduct) => {
    setCart((current) => {
      const existing = current.find((line) => line.product_id === product.id)
      if (existing) {
        return current.map((line) =>
          line.product_id === product.id
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        )
      }

      return [
        ...current,
        {
          product_id: product.id,
          name: product.name,
          unit_price: product.price,
          quantity: 1,
          notes: "",
        },
      ]
    })
  }

  const updateQuantity = (product_id: number, quantity: number) => {
    if (quantity < 1) {
      setCart((current) => current.filter((line) => line.product_id !== product_id))
      return
    }

    setCart((current) =>
      current.map((line) => (line.product_id === product_id ? { ...line, quantity } : line)),
    )
  }

  const updateNotes = (product_id: number, notes: string) => {
    setCart((current) =>
      current.map((line) => (line.product_id === product_id ? { ...line, notes } : line)),
    )
  }

  const removeFromCart = (product_id: number) => {
    setCart((current) => current.filter((line) => line.product_id !== product_id))
  }

  const calculateDeliveryQuote = async () => {
    setCoordsError("")
    setPreviewError("")

    const parsed = parseCoordinates(coordinatesInput)
    if (!parsed) {
      setCoordsError("Usa el formato latitud, longitud. Ej. -17.741364, -63.190680")
      setDeliveryFee("0.00")
      setDistanceKm(null)
      return
    }

    setIsCalculating(true)
    try {
      const preview = await apiClient.deliveries.preview(parsed.latitude, parsed.longitude)
      const fee = Number(preview.fee).toFixed(2)
      const distance = Number(preview.distance_km).toFixed(2)
      setDeliveryFee(fee)
      setDistanceKm(distance)
    } catch {
      setPreviewError("No se pudo calcular la tarifa. Revisa las coordenadas e intenta de nuevo.")
      setDeliveryFee("0.00")
      setDistanceKm(null)
    } finally {
      setIsCalculating(false)
    }
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (cart.length === 0 || !distanceKm) return

    const order = await createOrder({
      items_attributes: cart,
      delivery_fee: deliveryFee,
      discount,
      total_amount: total.toFixed(2),
    })

    navigate(`/orders/${order.id}`)
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Link
        to="/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="size-4" aria-hidden />
        Volver a pedidos
      </Link>

      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-brand">
          <FontAwesomeIcon icon={faClipboardList} className="size-5" aria-hidden />
          <span className="text-sm font-semibold uppercase tracking-wide">Nuevo pedido</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Crear pedido</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          Agrega productos del menú activo para registrar un pedido manual.
        </p>
      </div>

      <form className="grid grid-cols-2 items-start gap-6" onSubmit={handleSubmit}>
        <Card className="min-h-[32rem]">
          <CardHeader
            title="Productos disponibles"
            description="Selecciona ítems de tus menús activos"
          />
          {availableProducts.length === 0 ? (
            <p className="px-6 pb-6 text-sm text-gray-500">
              No hay productos activos. Activa un menú y sus productos primero.
            </p>
          ) : (
            <div className="max-h-[calc(32rem-5rem)] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm">
                  <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-6 py-3">Producto</th>
                    <th className="px-6 py-3">Precio</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {availableProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/60">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="mt-1 text-xs text-gray-500">{product.menuName}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          type="button"
                          variant="secondary"
                          className="px-3 py-2"
                          onClick={() => addToCart(product)}
                        >
                          <FontAwesomeIcon icon={faPlus} className="size-4" aria-hidden />
                          Agregar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="min-h-[20rem]">
            <CardHeader title="Ítems del pedido" description="Ajusta cantidades y notas" />
            {cart.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-gray-500">
                Agrega al menos un producto para continuar.
              </p>
            ) : (
              <div className="max-h-[20rem] space-y-4 overflow-y-auto px-6 pb-6">
                {cart.map((line) => (
                  <div
                    key={line.product_id}
                    className="rounded-xl border border-gray-100 bg-gray-50/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{line.name}</p>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatCurrency(line.unit_price)} c/u
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          className="px-3 py-2"
                          onClick={() => updateQuantity(line.product_id, line.quantity - 1)}
                        >
                          <FontAwesomeIcon icon={faMinus} className="size-3" aria-hidden />
                        </Button>
                        <span className="min-w-8 text-center font-semibold text-gray-900">
                          {line.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="secondary"
                          className="px-3 py-2"
                          onClick={() => updateQuantity(line.product_id, line.quantity + 1)}
                        >
                          <FontAwesomeIcon icon={faPlus} className="size-3" aria-hidden />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => removeFromCart(line.product_id)}
                        >
                          <FontAwesomeIcon icon={faTrash} className="size-4" aria-hidden />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor={`notes-${line.product_id}`}>Notas</Label>
                      <Input
                        id={`notes-${line.product_id}`}
                        className="mt-2"
                        value={line.notes}
                        onChange={(ev) => updateNotes(line.product_id, ev.target.value)}
                        placeholder="Opcional"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card padding="md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Resumen</h2>

            <div>
              <Label htmlFor="coordinates">Ubicación (lat, lng)</Label>
              <Input
                id="coordinates"
                className="mt-2"
                value={coordinatesInput}
                onChange={(ev) => {
                  setCoordinatesInput(ev.target.value)
                  setCoordsError("")
                  setPreviewError("")
                  setDistanceKm(null)
                  setDeliveryFee("0.00")
                }}
                placeholder="-17.74136401150216, -63.190680077296854"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Pega las coordenadas compartidas por WhatsApp o Maps.
              </p>
              {coordsError && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {coordsError}
                </p>
              )}
              {previewError && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {previewError}
                </p>
              )}
              <Button
                type="button"
                variant="secondary"
                className="mt-3"
                onClick={calculateDeliveryQuote}
                disabled={!coordinatesInput.trim() || isCalculating}
              >
                {isCalculating ? "Calculando..." : "Calcular envío"}
              </Button>
            </div>

            {distanceKm && (
              <div className="mt-4 rounded-xl bg-brand-light p-4">
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-gray-500">Distancia</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{distanceKm} km</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Costo de envío</dt>
                    <dd className="mt-1 text-lg font-semibold text-brand">
                      {formatCurrency(deliveryFee)}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            <div className="mt-4">
              <Label htmlFor="discount">Descuento</Label>
              <Input
                id="discount"
                className="mt-2"
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(ev) => setDiscount(ev.target.value)}
              />
            </div>

            <dl className="mt-6 space-y-3 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-medium text-gray-900">{formatCurrency(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Envío</dt>
                <dd className="font-medium text-gray-900">{formatCurrency(deliveryFee)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Descuento</dt>
                <dd className="font-medium text-gray-900">-{formatCurrency(discount)}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3">
                <dt className="font-semibold text-gray-900">Total</dt>
                <dd className="text-lg font-bold text-brand">{formatCurrency(total)}</dd>
              </div>
            </dl>
            <div className="mt-6 flex gap-3">
              <Button
                type="submit"
                disabled={cart.length === 0 || !distanceKm || isCalculating}
                className="flex-1"
              >
                Crear pedido
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate("/orders")}>
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  )
}
