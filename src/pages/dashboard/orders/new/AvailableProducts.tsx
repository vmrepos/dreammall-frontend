import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"
import { Card, CardHeader } from "../../../../components/atoms/Card"
import type { TProduct } from "../../../../types/Product"
import { formatCurrency } from "../../../../utils/format"

type Props = {
  products: TProduct[]
  onAdd: (product: TProduct) => void
}

export const AvailableProducts = ({ products, onAdd }: Props) => (
  <Card className="flex min-h-0 flex-col border-2 !border-brand/50 lg:h-[min(36rem,calc(100svh-12rem))]">
    <CardHeader
      title="Productos disponibles"
      description="Selecciona ítems de tus menús activos"
    />
    {products.length === 0 ? (
      <p className="px-4 pb-4 text-sm text-gray-500">
        No hay productos activos. Activa un menú y sus productos primero.
      </p>
    ) : (
      <div className="min-h-0 flex-1 overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm">
            <tr className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-1.5">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        {(product.product_option_groups?.length ?? 0) > 0 && (
                          <p className="text-[11px] text-gray-500">Personalizable</p>
                        )}
                      </td>
                <td className="px-4 py-1.5 text-sm font-medium tabular-nums text-gray-900">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-4 py-1.5 text-right">
                  <Button
                    type="button"
                    variant="secondary"
                    className="gap-1 rounded-lg px-2.5 py-1 text-xs"
                    onClick={() => onAdd(product)}
                  >
                    <FontAwesomeIcon icon={faPlus} className="size-3" aria-hidden />
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
)
