import { useEffect } from "react"
import { PublicShell } from "../shared/PublicShell"
import { Policy } from "./Policy"

export const Page = () => {
  useEffect(() => {
    document.title = "Privacy Policy · Pedí2"
  }, [])

  return (
    <PublicShell>
      <Policy />
    </PublicShell>
  )
}
