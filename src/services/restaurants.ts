import type { TRestaurant, TRestaurantForm } from "../types/Restaurant";
import { axiosInstance } from "./apiClient";

export const RestaurantsAPI = {
  updateProfile: async (profile: TRestaurantForm): Promise<TRestaurant> => {
    const response = await axiosInstance.put(`/restaurants/profile`, profile);
    return response.data.data;
  },
  getProfile: async (): Promise<TRestaurant> => {
    const response = await axiosInstance.get(`/restaurants/profile`);
    return response.data.data;
  },
};