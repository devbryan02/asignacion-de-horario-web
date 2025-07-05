import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { loginUser } from "@/feactures/autenticacion/authService";
import { AuthRequest, AuthResponse, RegisterResponse } from "@/feactures/autenticacion/types";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: {token: string, role?: string} | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthRequest) => Promise<AuthResponse>;
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
        
        // Actualizamos el estado
        setUser({ 
          token: response.token, 
          role: response.role 
        });
        setIsAuthenticated(true);

        // Verificación del rol y redirección
        const userRole = response.role?.toUpperCase();
        console.log('Role for redirect:', userRole);

        if (userRole === 'ADMIN' || userRole === 'COORDINADOR') {
          setIsLoading(false); // Importante: desactivar loading antes de redirigir
          console.log('Redirigiendo a admin...');
          router.push('/');
        } else {
          setIsLoading(false);
          console.log('Redirigiendo a dashboard...');
          router.push('/dashboard');
        }

        return response;
      } else {
        setError(response.message || "Error al iniciar sesión");
        setIsLoading(false);
      }
      
      return response;
    } catch (err: any) {
      setError(err.message || "Ocurrió un error durante el inicio de sesión");
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
      value={{ user, isAuthenticated, isLoading, login, logout, error }}
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