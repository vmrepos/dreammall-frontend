import type { TOrderItemForm, TOrderItemOption } from "../types/OrderItem"
import type { TProduct } from "../types/Product"

type UseCartArgs = {
  items: TOrderItemForm[]
  setItems: (updater: (current: TOrderItemForm[]) => TOrderItemForm[]) => void
}

const optionsKey = (options: TOrderItemOption[]) =>
  [...options]
    .map((option) => `${option.option_group_name}:${option.option_name}:${option.price_modifier}`)
    .sort()
    .join("|")

const unitPriceFor = (product: TProduct, options: TOrderItemOption[]) => {
  const modifiers = options.reduce((sum, option) => sum + Number(option.price_modifier), 0)
  return (Number(product.price) + modifiers).toFixed(2)
}

export const useCart = ({ items, setItems }: UseCartArgs) => {
  const add = (product: TProduct, selectedOptions: TOrderItemOption[] = []) => {
    const options = selectedOptions.map((option) => ({ ...option }))

    setItems((current) => {
      const existing = current.find(
        (line) =>
          line.product_id === product.id &&
          optionsKey(line.order_item_options ?? []) === optionsKey(options),
      )

      if (existing) {
        return current.map((line) =>
          line.clientKey === existing.clientKey
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        )
      }

      return [
        ...current,
        {
          clientKey: crypto.randomUUID(),
          product_id: product.id,
          name: product.name,
          unit_price: unitPriceFor(product, options),
          quantity: 1,
          notes: "",
          order_item_options: options,
        },
      ]
    })
  }

  const updateQuantity = (clientKey: string, quantity: number) => {
    setItems((current) => {
      if (quantity < 1) return current.filter((line) => line.clientKey !== clientKey)

      return current.map((line) =>
        line.clientKey === clientKey ? { ...line, quantity } : line,
      )
    })
  }

  const remove = (clientKey: string) => {
    setItems((current) => current.filter((line) => line.clientKey !== clientKey))
  }

  const subtotal = items.reduce(
    (sum, line) => sum + line.quantity * Number(line.unit_price),
    0,
  )

  return { items, add, updateQuantity, remove, subtotal }
}
