/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { api, data, setAccessToken } from "../services/api";
const Context = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    data(api.post("/auth/refresh"))
      .then(({ user, accessToken }) => {
        setAccessToken(accessToken);
        setUser(user);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  async function login(credentials) {
    const result = await data(api.post("/auth/login", credentials));
    setAccessToken(result.accessToken);
    setUser(result.user);
    return result.user;
  }
  async function logout() {
    await api.post("/auth/logout").catch(() => {});
    setAccessToken("");
    setUser(null);
  }
  return (
    <Context.Provider value={{ user, loading, login, logout }}>
      {children}
    </Context.Provider>
  );
}
export const useAuth = () => useContext(Context);
