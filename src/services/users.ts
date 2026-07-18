import type { TUserCreateForm } from "../types/User"
import { axiosInstance } from "./apiClient"

export const UsersAPI = {
  createAccount: async (data: TUserCreateForm) => {
    const response = await axiosInstance.post("/users/create_restaurant_account", data)
    return response.data
  }
}

