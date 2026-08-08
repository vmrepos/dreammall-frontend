import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "../../../components/atoms/Button"

import type { TOrderItemForm } from "../../../types/OrderItem"
import { formatCurrency } from "../../../utils/format"

type Props = {
  line: TOrderItemForm
  updateQuantity: (clientKey: string, quantity: number) => void
  removeFromCart: (clientKey: string) => void
}

export const CartItem: React.FC<Props> = ({ line, updateQuantity, removeFromCart }) => {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">{line.name}</p>
        {line.order_item_options.map((option) => (
          <p key={`${option.option_group_name}-${option.option_name}`} className="truncate text-xs text-gray-500">
            {option.option_group_name}: {option.option_name}
          </p>
        ))}
        <p className="text-xs tabular-nums text-gray-500">
          {formatCurrency(line.unit_price)} c/u
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="secondary"
          className="size-7 rounded-lg p-0"
          onClick={() => updateQuantity(line.clientKey, line.quantity - 1)}
        >
          <FontAwesomeIcon icon={faMinus} className="size-2.5" aria-hidden />
        </Button>
        <span className="min-w-6 text-center text-sm font-semibold tabular-nums text-gray-900">
          {line.quantity}
        </span>
        <Button
          type="button"
          variant="secondary"
          className="size-7 rounded-lg p-0"
          onClick={() => updateQuantity(line.clientKey, line.quantity + 1)}
        >
          <FontAwesomeIcon icon={faPlus} className="size-2.5" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="size-7 rounded-lg p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => removeFromCart(line.clientKey)}
        >
          <FontAwesomeIcon icon={faTrash} className="size-3" aria-hidden />
        </Button>
      </div>
    </div>
  )
}
