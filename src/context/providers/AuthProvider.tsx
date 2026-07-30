import { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import type { TRestaurant } from "../../types/Restaurant";
import { AuthContext } from "../AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [restaurant, setRestaurant] = useState<TRestaurant | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    const session = await authService.me();
    setRestaurant(session);
    return session;
  };

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
    await loadSession();
  };

  const logout = async () => {
    await authService.logout();
    setRestaurant(null);
  };

  const refreshRestaurant = async () => {
    try {
      return await loadSession();
    } catch {
      setRestaurant(null);
      return null;
    }
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
    <AuthContext.Provider value={{ restaurant, isLoading: loading, login, logout, refreshRestaurant }}>
      {children}
    </AuthContext.Provider>
  );
};
