import { useEffect } from "react"
import { toast } from "sonner"
import { registerSW } from "virtual:pwa-register"
import { isCustomerHost } from "../utils/host"

export const usePwaUpdate = () => {
  useEffect(() => {
    if (isCustomerHost()) return

    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        toast.info("Hay una nueva versión de Pedi2", {
          duration: Number.POSITIVE_INFINITY,
          action: {
            label: "Actualizar",
            onClick: () => {
              void updateSW(true)
            },
          },
        })
      },
    })
  }, [])
}
