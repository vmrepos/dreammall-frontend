import type { TPublicCustomerDraft, TPublicLastOrder, TPublicOrder } from "../types/PublicOrder"

const CUSTOMER_KEY = "pedi2.public.customer"
const LAST_ORDER_KEY = "pedi2.public.lastOrder"

const emptyCustomer = (): TPublicCustomerDraft => ({
  name: "",
  phone: "",
  notes: "",
  latitude: null,
  longitude: null,
})

const readJson = <T>(key: string): T | null => {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

const writeJson = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Private mode / quota — keep the in-memory form working.
  }
}

const isFiniteCoord = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value)

export const toLocalPhone = (value: string) => {
  const digits = value.replace(/\D/g, "")
  if (digits.startsWith("591") && digits.length >= 11) return digits.slice(-8)
  return digits.slice(0, 8)
}

export const readPublicCustomer = (): TPublicCustomerDraft => {
  const stored = readJson<Partial<TPublicCustomerDraft>>(CUSTOMER_KEY)
  if (!stored) return emptyCustomer()
  return {
    name: typeof stored.name === "string" ? stored.name : "",
    phone: typeof stored.phone === "string" ? toLocalPhone(stored.phone) : "",
    notes: typeof stored.notes === "string" ? stored.notes : "",
    latitude: isFiniteCoord(stored.latitude) ? stored.latitude : null,
    longitude: isFiniteCoord(stored.longitude) ? stored.longitude : null,
  }
}

export const writePublicCustomer = (draft: TPublicCustomerDraft) => {
  const next: TPublicCustomerDraft = {
    name: draft.name.trim(),
    phone: toLocalPhone(draft.phone),
    notes: draft.notes.trim(),
    latitude: isFiniteCoord(draft.latitude) ? draft.latitude : null,
    longitude: isFiniteCoord(draft.longitude) ? draft.longitude : null,
  }
  if (!next.name && !next.phone && !next.notes && next.latitude == null && next.longitude == null) {
    return
  }
  writeJson(CUSTOMER_KEY, next)
}

export const readPublicLastOrder = (): TPublicLastOrder | null => {
  const stored = readJson<Partial<TPublicLastOrder>>(LAST_ORDER_KEY)
  if (!stored) return null
  const publicToken = stored.publicToken?.trim()
  if (!publicToken) return null
  return {
    publicToken,
    restaurantName: stored.restaurantName?.trim() || undefined,
    orderId: typeof stored.orderId === "number" ? stored.orderId : undefined,
    orderingToken: stored.orderingToken?.trim() || undefined,
  }
}

export const writePublicLastOrder = (order: TPublicLastOrder) => {
  const publicToken = order.publicToken.trim()
  if (!publicToken) return
  const previous = readPublicLastOrder()
  const sameOrder = previous?.publicToken === publicToken
  writeJson(LAST_ORDER_KEY, {
    publicToken,
    restaurantName: order.restaurantName?.trim() || (sameOrder ? previous?.restaurantName : undefined),
    orderId: order.orderId ?? (sameOrder ? previous?.orderId : undefined),
    orderingToken: order.orderingToken?.trim() || (sameOrder ? previous?.orderingToken : undefined),
  } satisfies TPublicLastOrder)
}

export const clearPublicLastOrder = () => {
  try {
    window.localStorage.removeItem(LAST_ORDER_KEY)
  } catch {
    // Ignore storage failures.
  }
}

export const rememberPublicOrder = (
  order: Pick<TPublicOrder, "public_token" | "id" | "restaurant_name" | "customer_name" | "customer_phone" | "notes">,
  extras?: { orderingToken?: string; customer?: TPublicCustomerDraft },
) => {
  writePublicLastOrder({
    publicToken: order.public_token,
    restaurantName: order.restaurant_name ?? undefined,
    orderId: order.id,
    orderingToken: extras?.orderingToken,
  })

  const customer = extras?.customer
  if (customer) {
    writePublicCustomer(customer)
    return
  }

  const current = readPublicCustomer()
  writePublicCustomer({
    name: order.customer_name?.trim() || current.name,
    phone: order.customer_phone ? toLocalPhone(order.customer_phone) : current.phone,
    notes: order.notes?.trim() || current.notes,
    latitude: current.latitude,
    longitude: current.longitude,
  })
}
