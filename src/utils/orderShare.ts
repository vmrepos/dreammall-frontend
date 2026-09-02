import { customerOrigin } from "./host"

export const publicOrderPath = (publicToken: string) => `/pedido/${publicToken}`

export const restaurantCompletePath = (publicToken: string) =>
  `${publicOrderPath(publicToken)}?from_restaurant=true`

export const publicOrderUrl = (
  publicToken: string,
  options?: { fromRestaurant?: boolean },
) => {
  const origin = options?.fromRestaurant ? window.location.origin : customerOrigin()
  const path = options?.fromRestaurant
    ? restaurantCompletePath(publicToken)
    : publicOrderPath(publicToken)
  return `${origin}${path}`
}

export const copyToClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    const input = document.createElement("textarea")
    input.value = value
    input.setAttribute("readonly", "")
    input.style.position = "fixed"
    input.style.left = "-9999px"
    document.body.appendChild(input)
    input.select()
    const copied = document.execCommand("copy")
    document.body.removeChild(input)
    if (!copied) throw new Error("copy failed")
  }
}

export const copyPublicOrderUrl = async (publicToken: string) => {
  await copyToClipboard(publicOrderUrl(publicToken))
}

export const publicCatalogPath = (orderingToken: string) => `/pedir/${orderingToken}`

export const publicCatalogUrl = (orderingToken: string) =>
  `${customerOrigin()}${publicCatalogPath(orderingToken)}`

const isMobileUa = () => /Android|iPhone|iPad/i.test(navigator.userAgent)

export const whatsAppDigits = (phone: string) => {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 8) return `591${digits}`
  return digits
}

export const whatsAppMessageHref = (phone: string, text: string) => {
  const digits = whatsAppDigits(phone)
  const encoded = encodeURIComponent(text)
  if (!digits) {
    if (isMobileUa()) return `https://wa.me/?text=${encoded}`
    return `https://web.whatsapp.com/send?text=${encoded}`
  }
  if (isMobileUa()) return `https://wa.me/${digits}?text=${encoded}`
  return `https://web.whatsapp.com/send?phone=${digits}&text=${encoded}`
}

const whatsAppHref = (url: string) => whatsAppMessageHref("", url)

export type TShareUrlResult = "shared" | "copied" | "cancelled"

export const shareOrCopyUrl = async (url: string): Promise<TShareUrlResult> => {
  await copyToClipboard(url)

  const anchor = document.createElement("a")
  anchor.href = whatsAppHref(url)
  anchor.target = "_blank"
  anchor.rel = "noopener noreferrer"
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  return "copied"
}

export const sharePublicCatalogUrl = async (orderingToken: string) =>
  shareOrCopyUrl(publicCatalogUrl(orderingToken))
