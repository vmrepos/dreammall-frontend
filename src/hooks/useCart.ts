import type { TOrderItemForm } from "../types/OrderItem"
import type { TProduct } from "../types/Product"

type UseCartArgs = {
  items: TOrderItemForm[]
  setItems: (items: TOrderItemForm[]) => void
}

export const useCart = ({ items, setItems }: UseCartArgs) => {
  const add = (product: TProduct) => {
    const existing = items.find((line) => line.product_id === product.id)
    if (existing) {
      setItems(
        items.map((line) =>
          line.product_id === product.id
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        ),
      )
      return
    }

    setItems([
      ...items,
      {
        product_id: product.id,
        name: product.name,
        unit_price: product.price,
        quantity: 1,
        notes: "",
      },
    ])
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      setItems(items.filter((line) => line.product_id !== productId))
      return
    }

    setItems(
      items.map((line) =>
        line.product_id === productId ? { ...line, quantity } : line,
      ),
    )
  }

  const remove = (productId: number) => {
    setItems(items.filter((line) => line.product_id !== productId))
  }

  const subtotal = items.reduce(
    (sum, line) => sum + line.quantity * Number(line.unit_price),
    0,
  )

  return { items, add, updateQuantity, remove, subtotal }
}
