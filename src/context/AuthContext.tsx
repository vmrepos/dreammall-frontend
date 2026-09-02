
import type { TRestaurant } from "../types/Restaurant";
import { createContext, useContext } from "react";

type AuthContextType = {
  restaurant: TRestaurant | null;
  isAdmin: boolean;
  impersonating: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshRestaurant: () => Promise<TRestaurant | null>;
  impersonate: (restaurantId: number) => Promise<void>;
  stopImpersonating: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  restaurant: null,
  isAdmin: false,
  impersonating: false,
  isLoading: true,
  login: async () => { },
  logout: async () => { },
  refreshRestaurant: async () => null,
  impersonate: async () => { },
  stopImpersonating: async () => { },
});

export const useAuth = () => {
  return useContext(AuthContext);
};
