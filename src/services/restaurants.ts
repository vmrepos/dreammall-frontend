import type { TRestaurant, TRestaurantForm, TRestaurantSummary } from "../types/Restaurant";
import { axiosInstance } from "./axiosInstance";
import { DirectUploadsAPI, type TDirectUploadFolder } from "./directUploads";

const toSignedUpload = async (
  file: File | string | null | undefined,
  folder: TDirectUploadFolder,
) => {
  if (file instanceof File) {
    const blob = await DirectUploadsAPI.upload(file, folder)
    return blob.signed_id
  }
  if (file === null) return ""
  return undefined
}

const toProfilePayload = async (profile: TRestaurantForm) => {
  const { payment_qr, logo, ...rest } = profile;
  const payload: Record<string, unknown> = { ...rest };
  delete payload.payment_qr_url;
  delete payload.logo_url;

  const [paymentQrId, logoId] = await Promise.all([
    toSignedUpload(payment_qr, "uploads"),
    toSignedUpload(logo, "logos"),
  ])
  if (paymentQrId !== undefined) payload.payment_qr = paymentQrId
  if (logoId !== undefined) payload.logo = logoId

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
  expandMapsUrl: async (url: string): Promise<string> => {
    const response = await axiosInstance.post("/restaurants/expand_maps_url", { url })
    return (response.data.data as { url: string }).url
  },
  listImpersonatable: async (): Promise<TRestaurantSummary[]> => {
    const response = await axiosInstance.get<{ data: TRestaurantSummary[] }>("/restaurants/impersonatable");
    return response.data.data;
  },
};
