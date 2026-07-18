import type { TRestaurantForm } from "./Restaurant";

export type TUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;

}

export type TUserForm = Partial<TUser> & {
  password: string;
  password_confirmation: string;
}

export type TUserCreateForm = {
  user: TUserForm;
  restaurant: TRestaurantForm;

}

