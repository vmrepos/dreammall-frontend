import type { TUser } from "./User";

export type TRestaurant = {
  id: number;
  name: string;
  address: string;
  whatsapp: string;
  nit: string;
  email: string;
  open_time: string | null;
  close_time: string | null;
  status: string | null;
  score: number | null;
  owner_id: number;
  user: TUser;
  latitude: number;
  longitude: number;
  delivery_radius: number;
  prep_time: number;
  ordering_token?: string | null;
  payment_qr_url?: string | null
  logo_url?: string | null;
  demand?: {
    online: number;
    available: number;
    percentile: number;
  };
};

export type TRestaurantSummary = Pick<TRestaurant, "id" | "name" | "address" | "whatsapp">


export type TRestaurantForm = Partial<TRestaurant> & {
  payment_qr?: File | string | null
  logo?: File | string | null
}