import { axiosInstance } from "./apiClient";
import type { TRestaurant } from "../types/Restaurant";
import type { TUser } from "../types/User";

type LoginResponse = {
  data: TUser;
};

export type TRestaurantSession = {
  restaurant: TRestaurant | null;
  admin: boolean;
  impersonating: boolean;
};

type RestaurantMeResponse = {
  data: TRestaurant | null;
  meta?: {
    admin?: boolean;
    impersonating?: boolean;
  };
};

const toSession = (payload: RestaurantMeResponse): TRestaurantSession => ({
  restaurant: payload.data,
  admin: payload.meta?.admin === true,
  impersonating: payload.meta?.impersonating === true,
});

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

  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post<{ data: { message: string } }>(
      "/auth/forgot_password",
      { email },
    );
    return response.data.data;
  },

  resetPassword: async (token: string, password: string, passwordConfirmation: string) => {
    const response = await axiosInstance.post<{ data: { message: string } }>(
      "/auth/reset_password",
      {
        token,
        password,
        password_confirmation: passwordConfirmation,
      },
    );
    return response.data.data;
  },

  logout: async () => {
    await axiosInstance.post<void>("/auth/logout");
  },

  me: async () => {
    const response = await axiosInstance.get<RestaurantMeResponse>("/restaurants/me");
    return toSession(response.data);
  },

  impersonate: async (restaurantId: number) => {
    const response = await axiosInstance.post<RestaurantMeResponse>("/restaurants/impersonate", {
      restaurant_id: restaurantId,
    });
    return toSession(response.data);
  },

  stopImpersonating: async () => {
    const response = await axiosInstance.delete<RestaurantMeResponse>("/restaurants/impersonate");
    return toSession(response.data);
  },
};
