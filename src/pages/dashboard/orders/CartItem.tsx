import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "../../../components/atoms/Button"

import type { TOrderItemForm } from "../../../types/OrderItem"
import { formatCurrency } from "../../../utils/format"

type Props = {
  line: TOrderItemForm
  updateQuantity: (productId: number, quantity: number) => void
  removeFromCart: (productId: number) => void
}
export const CartItem: React.FC<Props> = ({ line, updateQuantity, removeFromCart }) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
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

    </div>
  )
}