// src/context/AuthContext.tsx

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import authService from "../services/auth.service";
import type { PublicUser } from "../types/user.types";
import { useInactivityLogout } from "../hooks/useInactivityLogout";

interface AuthContextType {
  user: PublicUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: PublicUser) => void;
  logout: () => Promise<void>;
}

const TOKEN_STORAGE_KEY = "token";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(TOKEN_STORAGE_KEY)
  );

  const [loading, setLoading] = useState(true);

  const login = useCallback((jwt: string, currentUser: PublicUser) => {

    localStorage.setItem(TOKEN_STORAGE_KEY, jwt);

    setToken(jwt);
    setUser(currentUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch {
      // Backend is stateless.
      // Local session should still be cleared even if the request fails.
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);

      setToken(null);
      setUser(null);
    }
  }, [token]);
  useInactivityLogout(!!user, logout);

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getCurrentUser();
        setUser(response.user);
      } catch {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [token]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!user && !!token,
      login,
      logout,
    }),
    [user, token, loading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}