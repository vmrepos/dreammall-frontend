import { CleanterPrintError, printCleanterJob, type TCleanterBlock, type TCleanterJob } from "../services/cleanter"
import type { TOrder } from "../types/Order"
import type { TOrderItem } from "../types/OrderItem"

const ticketMoney = (value: number) => Number(value).toFixed(2)

const lineAmount = (item: TOrderItem) => Number(item.unit_price) * item.quantity

export const buildOrderTicket = (order: TOrder): TCleanterJob => {
  const content: TCleanterBlock[] = [
    {
      type: "text",
      text: `#${order.id}`,
      align: "center",
      bold: true,
      size: "large",
    },
  ]

  const name = order.customer_name?.trim()
  if (name) {
    content.push({ type: "text", text: name, align: "center" })
  }

  const phone = order.customer_phone?.trim()
  if (phone) {
    content.push({ type: "text", text: phone, align: "center" })
  }

  content.push({ type: "divider" })

  for (const item of order.items ?? []) {
    content.push({
      type: "row",
      left: `${item.quantity}x ${item.product_name}`,
      right: ticketMoney(lineAmount(item)),
    })
    for (const option of item.order_item_options ?? []) {
      content.push({
        type: "text",
        text: `  ${option.option_name}`,
        size: "small",
      })
    }
  }

  content.push({ type: "divider" })
  content.push({
    type: "row",
    left: "Envío",
    right: ticketMoney(Number(order.delivery_fee)),
  })
  const discount = Number(order.discount)
  if (discount > 0) {
    content.push({
      type: "row",
      left: "Descuento",
      right: `-${ticketMoney(discount)}`,
    })
  }
  if (order.coupon && Number(order.coupon.applied_amount) > 0) {
    content.push({
      type: "row",
      left: "Cupón",
      right: `-${ticketMoney(Number(order.coupon.applied_amount))}`,
    })
  }
  content.push({
    type: "row",
    left: "TOTAL",
    right: ticketMoney(Number(order.total_amount)),
    bold: true,
  })
  content.push({ type: "feed", lines: 3 })

  return {
    paperWidth: 58,
    cut: true,
    reference: `Pedido #${order.id}`,
    content,
  }
}

export const printOrderTicket = (order: TOrder) => printCleanterJob(buildOrderTicket(order))

export const kitchenPrintErrorMessage = (error: unknown) =>
  error instanceof CleanterPrintError ? error.message : "No se pudo imprimir el ticket."
