import { useState } from "react";
import { useAuth } from "@/feactures/autenticacion/hooks/useAuth";
import { useRouter } from "next/navigation";
import { User, Lock, AlertCircle, LogIn } from "lucide-react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    try {
      const response = await login({ username, password });
      if (response.success) {
        router.push("/dashboard");
      } else {
        setErrorMessage(response.message || "Error durante el inicio de sesión");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Ocurrió un error durante el inicio de sesión");
    }
  };

  return (
    <div>
      {errorMessage && (
        <div className="alert alert-error mb-4">
          <AlertCircle className="h-5 w-5" />
          <span>{errorMessage}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Usuario
            </span>
          </label>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" /> Contraseña
            </span>
          </label>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <label className="label justify-end">
            <a href="#" className="label-text-alt link link-hover text-primary">¿Olvidaste tu contraseña?</a>
          </label>
        </div>
        
        <div className="form-control mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <LogIn className="h-5 w-5 mr-2" />
            )}
            {isLoading ? "Iniciando sesión" : "Iniciar Sesión"}
          </button>
        </div>
      </form>
    </div>
  );
}