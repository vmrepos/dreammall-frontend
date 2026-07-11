import { authService } from "../services/authService";
import type { TRestaurant } from "../types/Restaurant";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  restaurant: TRestaurant | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  restaurant: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [restaurant, setRestaurant] = useState<TRestaurant | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    const session = await authService.me();
    setRestaurant(session);
  };

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
    await loadSession();
  };

  const logout = async () => {
    await authService.logout();
    setRestaurant(null);
  };

  useEffect(() => {
    loadSession()
      .catch(() => setRestaurant(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => setRestaurant(null);

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  return (
    <AuthContext.Provider value={{ restaurant, isLoading: loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
