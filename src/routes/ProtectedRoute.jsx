import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, rol }) {
  const { user, usuario, loading } = useAuth();

  // 🔄 Mientras carga la sesión
  if (loading) {
    return <div>Cargando...</div>;
  }

  // ⛔ No hay usuario logueado
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ⛔ Hay usuario pero no tiene el rol correcto
  if (rol && usuario?.rol !== rol) {
    // 🔥 Redirigir al dashboard correcto según el rol del usuario
    const destino = usuario?.rol === "dueno" ? "/dueno" : "/chofer";
    return <Navigate to={destino} />;
  }

  // ✅ Usuario autorizado → renderiza lo que le pasamos
  return children;
}
