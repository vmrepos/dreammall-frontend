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
};


export type TRestaurantForm = Partial<TRestaurant> 