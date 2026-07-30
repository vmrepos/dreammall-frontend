import { createContext, useContext } from "react"
import type { TRestaurant, TRestaurantForm } from "../types/Restaurant"

type RestaurantContextType = {
  restaurant: TRestaurant | null
  loading: boolean
  fetchRestaurant: () => Promise<void>
  updateRestaurant: (restaurant: TRestaurantForm) => Promise<TRestaurant>
}

export const RestaurantContext = createContext<RestaurantContextType | null>(null)


export const useRestaurant = () => {
  const context = useContext(RestaurantContext)
  if (!context) {
    throw new Error("useRestaurant must be used within RestaurantProvider")
  }
  return context
}
