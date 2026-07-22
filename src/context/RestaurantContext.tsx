import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { TRestaurant, TRestaurantForm } from "../types/Restaurant"
import { apiClient } from "../services/apiClient"
import { useAuth } from "./AuthContext"

type RestaurantContextType = {
  restaurant: TRestaurant | null
  loading: boolean
  fetchRestaurant: () => Promise<void>
  updateRestaurant: (restaurant: TRestaurantForm) => Promise<TRestaurant>
}

const RestaurantContext = createContext<RestaurantContextType | null>(null)

export const RestaurantProvider = ({ children }: { children: ReactNode }) => {
  const { refreshRestaurant } = useAuth()
  const [restaurant, setRestaurant] = useState<TRestaurant | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchRestaurant = useCallback(async () => {
    const response = await apiClient.restaurants.getProfile()
    setRestaurant(response)
  }, [])

  const updateRestaurant = useCallback(async (input: TRestaurantForm) => {
    const response = await apiClient.restaurants.updateProfile(input)
    setRestaurant(response)
    await refreshRestaurant()
    return response
  }, [refreshRestaurant])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        await fetchRestaurant()
      } catch {
        if (!cancelled) setRestaurant(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [fetchRestaurant])

  const value = useMemo(
    () => ({ restaurant, loading, fetchRestaurant, updateRestaurant }),
    [restaurant, loading, fetchRestaurant, updateRestaurant],
  )

  return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>
}

export const useRestaurant = () => {
  const context = useContext(RestaurantContext)
  if (!context) {
    throw new Error("useRestaurant must be used within RestaurantProvider")
  }
  return context
}
