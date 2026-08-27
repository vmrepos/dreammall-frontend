const CUSTOMER_APEX = "customer.pedi2.com.bo"

const hostname = () => window.location.hostname.toLowerCase()

export const isCustomerHost = (host = hostname()) =>
  host === CUSTOMER_APEX || host.startsWith("customer.")

/** Origin for WhatsApp / copy links. Kitchen “Completar aquí” stays on the current host. */
export const customerOrigin = () => {
  const fromEnv = String(import.meta.env.VITE_CUSTOMER_ORIGIN ?? "")
    .trim()
    .replace(/\/$/, "")
  if (fromEnv) return fromEnv

  const host = hostname()
  if (isCustomerHost(host)) return window.location.origin
  if (host === "pedi2.com.bo" || host.endsWith(".pedi2.com.bo")) {
    return `${window.location.protocol}//${CUSTOMER_APEX}`
  }
  return window.location.origin
}
