export const SUPPORT_EMAIL = "pedi2soporte@gmail.com"
export const WEBSITE_URL = "https://www.pedi2.com.bo"
export const WEBSITE_LABEL = "www.pedi2.com.bo"
export const DELETE_ACCOUNT_PATH = "/eliminar-cuenta"

const DELETE_SUBJECT = "Solicitud de eliminación de cuenta Pedí2"
const DELETE_BODY = [
  "Quiero solicitar la eliminación de mi cuenta Pedí2 y de los datos asociados.",
  "",
  "Nombre:",
  "Teléfono o correo:",
  "Tipo de cuenta (repartidor / restaurante / cliente):",
].join("\n")

export const deleteAccountMailto = () =>
  `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(DELETE_SUBJECT)}&body=${encodeURIComponent(DELETE_BODY)}`
