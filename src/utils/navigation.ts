/** Relative app paths only — blocks open redirects via `next`. */
export const safeInternalPath = (value: string | null | undefined): string | null => {
  if (!value) return null
  if (!value.startsWith("/")) return null
  if (value.startsWith("//")) return null
  if (value.includes("://")) return null
  return value
}

/** Restaurant panel lives under `/r`. Public catalog stays at `/pedir` and `/pedido`. */
export const RESTAURANT_BASE = "/r"

const RESTAURANT_SEGMENTS = new Set([
  "login",
  "register",
  "forgot-password",
  "reset-password",
  "pos",
  "orders",
  "deliveries",
  "profile",
  "settings",
  "reports",
  "menu",
  "subscription",
])

const splitPath = (path: string) => {
  const hashIndex = path.indexOf("#")
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : ""
  const withoutHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path
  const queryIndex = withoutHash.indexOf("?")
  const pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash
  const search = queryIndex >= 0 ? withoutHash.slice(queryIndex) : ""
  return { pathname, search, hash }
}

/** `/orders` → `/r/orders`. Already-prefixed paths and `/` stay correct. */
export const restaurantPath = (path: string) => {
  const { pathname, search, hash } = splitPath(path)
  let prefixed = RESTAURANT_BASE
  if (pathname && pathname !== "/") {
    if (pathname === RESTAURANT_BASE || pathname.startsWith(`${RESTAURANT_BASE}/`)) {
      prefixed = pathname
    } else {
      prefixed = pathname.startsWith("/") ? `${RESTAURANT_BASE}${pathname}` : `${RESTAURANT_BASE}/${pathname}`
    }
  }
  return `${prefixed}${search}${hash}`
}

const firstSegment = (pathname: string) => pathname.replace(/^\//, "").split("/")[0] ?? ""

/** `?next=` from old bookmarks (`/orders/1`) or current ones (`/r/orders/1`). */
export const restaurantInternalPath = (value: string | null | undefined): string | null => {
  const path = safeInternalPath(value)
  if (!path) return null
  const { pathname } = splitPath(path)
  if (pathname === RESTAURANT_BASE || pathname.startsWith(`${RESTAURANT_BASE}/`)) return path
  if (RESTAURANT_SEGMENTS.has(firstSegment(pathname))) return restaurantPath(path)
  return path
}

export const isLegacyRestaurantPath = (pathname: string) => {
  const segment = firstSegment(pathname)
  return RESTAURANT_SEGMENTS.has(segment)
}
