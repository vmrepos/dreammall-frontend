import { axiosInstance } from "./apiClient";
import type { TRestaurant } from "../types/Restaurant";
import type { TUser } from "../types/User";

type LoginResponse = {
  data: TUser;
};

type RestaurantMeResponse = {
  data: TRestaurant;
};

export const authService = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post<LoginResponse>("/auth/login", {
      email,
      password,
      client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
    });
    return response.data.data;
  },

  refresh: async () => {
    await axiosInstance.post<void>("/auth/refresh", {
      client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
    });
  },

  logout: async () => {
    await axiosInstance.post<void>("/auth/logout");
  },

  // Restaurant app session — owner + restaurant data
  me: async () => {
    const response = await axiosInstance.get<RestaurantMeResponse>("/restaurants/me");
    return response.data.data;
  },
};
