import { useState, useEffect } from "react";
import { authService, type TRestaurantSession } from "../../services/authService";
import type { TRestaurant } from "../../types/Restaurant";
import { AuthContext } from "../AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [restaurant, setRestaurant] = useState<TRestaurant | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [impersonating, setImpersonating] = useState(false);
  const [loading, setLoading] = useState(true);

  const applySession = (session: TRestaurantSession) => {
    setRestaurant(session.restaurant);
    setIsAdmin(session.admin);
    setImpersonating(session.impersonating);
    return session.restaurant;
  };

  const loadSession = async () => {
    const session = await authService.me();
    return applySession(session);
  };

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password);
    setIsAdmin(user.admin === true);
    await loadSession();
  };

  const logout = async () => {
    await authService.logout();
    setRestaurant(null);
    setIsAdmin(false);
    setImpersonating(false);
  };

  const refreshRestaurant = async () => {
    try {
      return await loadSession();
    } catch {
      setRestaurant(null);
      setIsAdmin(false);
      setImpersonating(false);
      return null;
    }
  };

  const impersonate = async (restaurantId: number) => {
    applySession(await authService.impersonate(restaurantId));
  };

  const stopImpersonating = async () => {
    applySession(await authService.stopImpersonating());
  };

  useEffect(() => {
    loadSession()
      .catch(() => {
        setRestaurant(null);
        setIsAdmin(false);
        setImpersonating(false);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setRestaurant(null);
      setIsAdmin(false);
      setImpersonating(false);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        restaurant,
        isAdmin,
        impersonating,
        isLoading: loading,
        login,
        logout,
        refreshRestaurant,
        impersonate,
        stopImpersonating,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
