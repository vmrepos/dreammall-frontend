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
  const [stored, setStored] = useState<TPublicLastOrder | null>(() => readPublicLastOrder())
  const [order, setOrder] = useState<TPublicOrder | null>(null)
  const publicToken = stored?.publicToken
  const orderingToken = stored?.orderingToken

  useEffect(() => {
    if (!publicToken) return
    let cancelled = false

    void apiClient.publicOrders
      .show(publicToken)
      .then((next) => {
        if (cancelled) return
        rememberPublicOrder(next, { orderingToken })
        setStored(readPublicLastOrder())
        setOrder(next)
      })
      .catch((error) => {
        if (cancelled) return
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          clearPublicLastOrder()
          setStored(null)
          setOrder(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [publicToken, orderingToken])

  return { stored, order }
}
