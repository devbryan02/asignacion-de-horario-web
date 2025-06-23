import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { loginUser, registerUser } from "@/feactures/autenticacion/authService";
import { AuthRequest, AuthResponse, RegisterResponse } from "@/feactures/autenticacion/types";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthRequest) => Promise<AuthResponse>;
  register: (userData: AuthRequest) => Promise<RegisterResponse>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem("token");
    if (token) {
      
      setIsAuthenticated(true);
      setUser({ token }); 
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUser(credentials);
      if (response.success) {
        setUser({ token: response.token });
        setIsAuthenticated(true);
      } else {
        setError(response.message || "Login failed");
      }
      setIsLoading(false);
      return response;
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (userData: AuthRequest): Promise<RegisterResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerUser(userData);
      setIsLoading(false);
      return response;
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;