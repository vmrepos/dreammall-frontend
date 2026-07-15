import type { TOrder } from "../types/Order"

export const initialOrders: TOrder[] = [
  {
    id: 1042,
    status: "pending",
    total_amount: "18.50",
    delivery_fee: "2.50",
    discount: "0.00",
    created_at: "2026-07-11T14:32:00Z",
    updated_at: "2026-07-11T14:32:00Z",
    delivery_id: null,
    items: [
      { id: 1, product_id: 1, product_name: "Hamburguesa clásica", quantity: 1, unit_price: "12.00" },
      {
        id: 2,
        product_id: 2,
        product_name: "Papas fritas",
        quantity: 1,
        unit_price: "4.00",
        notes: "Extra salsa",
      },
    ],
  },
  {
    id: 1040,
    status: "ready",
    total_amount: "15.75",
    delivery_fee: "2.25",
    discount: "0.00",
    created_at: "2026-07-11T13:10:00Z",
    updated_at: "2026-07-11T13:40:00Z",
    delivery_id: 301,
    items: [
      { id: 5, product_id: 5, product_name: "Combo alitas x6", quantity: 1, unit_price: "13.50" },
    ],
  },
  {
    id: 1038,
    status: "cancelled",
    total_amount: "9.50",
    delivery_fee: "2.00",
    discount: "0.00",
    created_at: "2026-07-11T10:05:00Z",
    updated_at: "2026-07-11T10:12:00Z",
    delivery_id: null,
    items: [
      { id: 7, product_id: 7, product_name: "Ensalada César", quantity: 1, unit_price: "7.50" },
    ],
  },
]

export const getMockOrder = (id: number, orders: TOrder[] = initialOrders) =>
  orders.find((order) => order.id === id)
