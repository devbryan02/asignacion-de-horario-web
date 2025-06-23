import { useState } from "react";
import { useAuth } from "@/feactures/autenticacion/hooks/useAuth";
import { User, Lock, AlertCircle, CheckCircle, UserPlus, Key, Shield } from "lucide-react";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }
    
    try {
      const response = await register({ username, password });
      if (response.success) {
        setSuccessMessage("Registro exitoso. Puedes iniciar sesión ahora.");
        // Clear form
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(response.message || "Error durante el registro");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Ocurrió un error durante el registro");
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
      
      {successMessage && (
        <div className="alert alert-success mb-4">
          <CheckCircle className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <User className="h-4 w-4 text-secondary" /> Usuario
            </span>
          </label>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Crea tu nombre de usuario"
              required
            />
          </div>
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <Key className="h-4 w-4 text-secondary" /> Contraseña
            </span>
          </label>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Crea tu contraseña"
              required
            />
          </div>
          <label className="label">
            <span className="label-text-alt text-neutral-500">Mínimo 8 caracteres, incluye letras y números</span>
          </label>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <Shield className="h-4 w-4 text-secondary" /> Confirmar Contraseña
            </span>
          </label>
          <div className="input-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Confirma tu contraseña"
              required
            />
          </div>
        </div>
        
        <div className="form-control mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-secondary w-full"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <UserPlus className="h-5 w-5 mr-2" />
            )}
            {isLoading ? "Registrando..." : "Crear cuenta"}
          </button>
        </div>
      </form>
    </div>
  );
}