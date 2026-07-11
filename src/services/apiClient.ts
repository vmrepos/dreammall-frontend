import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? ""}/api/v1`,
  withCredentials: true,
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<void> | null = null;

const isAuthRequest = (url?: string) =>
  url?.includes("/auth/login") ||
  url?.includes("/auth/logout") ||
  url?.includes("/auth/refresh");

const refreshSession = async () => {
  await axiosInstance.post("/auth/refresh", {
    client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
  });
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthRequest(originalRequest.url)
    ) {
      if (error.response?.status === 401) {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshSession().finally(() => {
        refreshPromise = null;
      });
    }

    try {
      await refreshPromise;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      return Promise.reject(refreshError);
    }
  },
);

export const apiClient = {
  deliveries: {
    list: async () => {
      const response = await axiosInstance.get("/restaurants/deliveries")
      return response.data.data
    },
    show: async (id: number) => {
      const response = await axiosInstance.get(`/restaurants/deliveries/${id}`)
      return response.data.data
    },
  }
}
