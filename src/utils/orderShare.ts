export const publicOrderPath = (publicToken: string) => `/pedido/${publicToken}`

export const publicOrderUrl = (publicToken: string) =>
  `${window.location.origin}${publicOrderPath(publicToken)}`
