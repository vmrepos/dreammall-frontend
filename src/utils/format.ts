export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))

export const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat("es", { style: "currency", currency: "BOB" }).format(Number(value))

export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ")
