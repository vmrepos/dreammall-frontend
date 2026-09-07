import { useEffect } from "react"
import { PublicShell } from "../shared/PublicShell"
import { Request } from "./Request"

export const Page = () => {
  useEffect(() => {
    document.title = "Eliminar cuenta · Pedí2"
  }, [])

  return (
    <PublicShell>
      <Request />
    </PublicShell>
  )
}
