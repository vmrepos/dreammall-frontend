
import type { TRestaurant } from "../types/Restaurant";
import { createContext, useContext } from "react";

type AuthContextType = {
  restaurant: TRestaurant | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshRestaurant: () => Promise<TRestaurant | null>;
};

export const AuthContext = createContext<AuthContextType>({
  restaurant: null,
  isLoading: true,
  login: async () => { },
  logout: async () => { },
  refreshRestaurant: async () => null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};
