import type { TRestaurant, TRestaurantForm } from "../types/Restaurant";
import { axiosInstance } from "./axiosInstance";
import { DirectUploadsAPI } from "./directUploads";

const toProfilePayload = async (profile: TRestaurantForm) => {
  const { payment_qr, ...rest } = profile;
  const payload: Record<string, unknown> = { ...rest };
  delete payload.payment_qr_url;

  if (payment_qr instanceof File) {
    const blob = await DirectUploadsAPI.upload(payment_qr, "uploads");
    payload.payment_qr = blob.signed_id;
  } else if (payment_qr === null) {
    payload.payment_qr = "";
  }

  return payload;
};

export const RestaurantsAPI = {
  updateProfile: async (profile: TRestaurantForm): Promise<TRestaurant> => {
    const payload = await toProfilePayload(profile);
    const response = await axiosInstance.put(`/restaurants/profile`, payload);
    return response.data.data;
  },
  getProfile: async (): Promise<TRestaurant> => {
    const response = await axiosInstance.get(`/restaurants/profile`);
    return response.data.data;
  },
};
