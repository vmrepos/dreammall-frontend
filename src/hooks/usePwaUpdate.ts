import { useEffect } from "react"
import { registerSW } from "virtual:pwa-register"

export const usePwaUpdate = () => {
  useEffect(() => {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        void updateSW(true)
      },
    })
  }, [])
}
