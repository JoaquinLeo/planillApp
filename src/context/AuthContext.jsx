import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // usuario de Supabase
  const [usuario, setUsuario] = useState(null); // registro en tu tabla "usuarios"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar sesión al inicio
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        loadUsuario(session.user.id); // sin await para no bloquear
      }
      setLoading(false);
    };

    getSession();

    // Escuchar cambios en la sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          loadUsuario(session.user.id); // sin await
        } else {
          setUser(null);
          setUsuario(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe(); // ✅ ahora sí funciona
    };
  }, []);

  // Cargar registro de la tabla "usuarios"
  const loadUsuario = async (userId) => {
    let { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (!error) {
      setUsuario(data);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,               // datos básicos del auth
        usuario,            // datos de la tabla usuarios
        rol: usuario?.rol,  // rol (dueño o chofer)
        isDueno: usuario?.rol === "dueno",
        isChofer: usuario?.rol === "chofer",
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
