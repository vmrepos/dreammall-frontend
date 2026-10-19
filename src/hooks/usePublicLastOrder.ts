import { useEffect, useState } from "react"
import axios from "axios"
import { apiClient } from "../services/apiClient"
import type { TPublicLastOrder, TPublicOrder } from "../types/PublicOrder"
import {
  clearPublicLastOrder,
  readPublicLastOrder,
  rememberPublicOrder,
} from "../utils/publicStorage"

export const usePublicLastOrder = () => {
  const [stored, setStored] = useState<TPublicLastOrder | null>(null)
  const [order, setOrder] = useState<TPublicOrder | null>(null)

  useEffect(() => {
    const initial = readPublicLastOrder()
    if (!initial?.publicToken) return
    let cancelled = false

    void apiClient.publicOrders
      .show(initial.publicToken)
      .then((next) => {
        if (cancelled) return
        if (next.status === "completed") {
          clearPublicLastOrder()
          setStored(null)
          setOrder(null)
          return
        }
        rememberPublicOrder(next, { orderingToken: initial.orderingToken })
        setStored(readPublicLastOrder())
        setOrder(next)
      })
      .catch((error) => {
        if (cancelled) return
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          clearPublicLastOrder()
          setStored(null)
          setOrder(null)
          return
        }
        setStored(initial)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { stored, order }
}
