export const publicOrderPath = (publicToken: string) => `/pedido/${publicToken}`

export const publicOrderUrl = (
  publicToken: string,
  options?: { fromRestaurant?: boolean },
) => {
  const url = `${window.location.origin}${publicOrderPath(publicToken)}`
  if (!options?.fromRestaurant) return url
  return `${url}?from_restaurant=true`
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
  `${window.location.origin}${publicCatalogPath(orderingToken)}`

export const copyPublicCatalogUrl = async (orderingToken: string) => {
  await copyToClipboard(publicCatalogUrl(orderingToken))
}
