import type { TOrder } from "../types/Order"

export const mockOrders: TOrder[] = [
  {
    id: 1043,
    status: "received",
    total_amount: "22.00",
    delivery_fee: "2.75",
    discount: "0.00",
    created_at: "2026-07-11T14:50:00Z",
    updated_at: "2026-07-11T14:52:00Z",
    delivery_id: null,
    items: [
      { id: 8, name: "Wrap de pollo", quantity: 2, unit_price: "9.00" },
    ],
  },
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
      { id: 1, name: "Hamburguesa clásica", quantity: 1, unit_price: "12.00" },
      { id: 2, name: "Papas fritas", quantity: 1, unit_price: "4.00", notes: "Extra salsa" },
    ],
  },
  {
    id: 1041,
    status: "preparing",
    total_amount: "24.00",
    delivery_fee: "3.00",
    discount: "1.00",
    created_at: "2026-07-11T13:55:00Z",
    updated_at: "2026-07-11T14:05:00Z",
    delivery_id: null,
    items: [
      { id: 3, name: "Pizza mediana", quantity: 1, unit_price: "18.00" },
      { id: 4, name: "Gaseosa 1L", quantity: 2, unit_price: "2.00" },
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
    items: [{ id: 5, name: "Combo alitas x6", quantity: 1, unit_price: "13.50" }],
  },
  {
    id: 1039,
    status: "completed",
    total_amount: "31.20",
    delivery_fee: "3.20",
    discount: "0.00",
    created_at: "2026-07-11T11:20:00Z",
    updated_at: "2026-07-11T12:15:00Z",
    delivery_id: 300,
    items: [
      { id: 6, name: "Lomo saltado", quantity: 2, unit_price: "14.00" },
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
    items: [{ id: 7, name: "Ensalada César", quantity: 1, unit_price: "7.50" }],
  },
]

export const getMockOrder = (id: number) => mockOrders.find((order) => order.id === id)
