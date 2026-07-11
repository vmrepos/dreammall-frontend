import type { TRestaurant } from "../types/Restaurant"

export const mockRestaurantProfile: TRestaurant = {
  id: 1,
  name: "System Restaurant",
  address: "Calle las frutillas, Santa Cruz",
  whatsapp: "3178422804",
  email: "system@system.com",
  open_time: "08:00",
  close_time: "22:00",
  status: "open",
  score: 4.8,
  owner_id: 1,
  user: {
    id: 1,
    email: "system@system.com",
    first_name: "System",
    last_name: "System",
    username: "system",
  },
}

export const mockSettings = {
  delivery_radius_km: 5,
  prep_time_minutes: 20,
}
