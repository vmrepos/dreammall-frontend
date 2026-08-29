const hostname = () => window.location.hostname.toLowerCase()

const configuredOrigin = () =>
  String(import.meta.env.VITE_CUSTOMER_ORIGIN ?? "")
    .trim()
    .replace(/\/$/, "")

const configuredHostname = () => {
  const origin = configuredOrigin()
  if (!origin) return ""
  try {
    return new URL(origin).hostname.toLowerCase()
  } catch {
    return ""
  }
}

export const isCustomerHost = (host = hostname()) => {
  const configured = configuredHostname()
  if (configured && host === configured) return true
  return host.startsWith("customer.")
}

/** Origin for WhatsApp / copy links. Kitchen “Completar aquí” stays on the current host. */
export const customerOrigin = () => {
  if (isCustomerHost()) return window.location.origin
  return configuredOrigin() || window.location.origin
}
