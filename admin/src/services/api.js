import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1",
  withCredentials: true,
  timeout: 15000,
});
let accessToken = "";
export const setAccessToken = (token) => {
  accessToken = token || "";
};
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});
let refreshing;
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original?._retry &&
      !original?.url?.includes("/auth/")
    ) {
      original._retry = true;
      refreshing ??= api
        .post("/auth/refresh")
        .then((r) => {
          setAccessToken(r.data.data.accessToken);
          return r.data.data;
        })
        .finally(() => {
          refreshing = null;
        });
      await refreshing;
      return api(original);
    }
    throw error;
  },
);
export const data = (request) => request.then((r) => r.data.data);
export const apiError = (error) =>
  error.response?.data?.error?.message || "The request could not be completed.";
