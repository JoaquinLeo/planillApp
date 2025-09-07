import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const mensajesError = {
  "Invalid login credentials": "Email o contraseña incorrectas",
  "Email not confirmed": "Debes confirmar tu email antes de iniciar sesión",
  "User already registered": "Usuario ya registrado",
  "Password should be at least 6 characters.": "La contraseña debe tener al menos 6 caracteres",
  "Unable to validate email address: invalid format": "Formato inválido para el email",
  "User not found": "Usuario no encontrado",
  "missing email or phone": "Falta email o contraseña",
};

function traducirError(msg) {
  return mensajesError[msg] || console.log(msg);
}

export function useAuthForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuthAction = async (action, formData) => {
    setLoading(true);
    setError(null);

    try {
      const { email, password, nombre, rol } = formData;
      let response;

      if (action === "login") {
        response = await supabase.auth.signInWithPassword({ email, password });
      } else if (action === "register") {
        if (!nombre || !rol || !email) {
          setError("Por favor completa todos los campos");
          return;
        }
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

        if (signUpError) {
            setError(traducirError(signUpError.message));
            return;
        }

        const user = data.user ?? data.session?.user;
        if (!user) {
            setError("No se pudo obtener el usuario creado.");
            return;
        }

        const { error: insertError } = await supabase
            .from("usuarios")
            .insert([{ id: user.id, nombre, rol, email }]);

        if (insertError) {
            setError(traducirError(insertError.message));
            return;
        }
        
        await supabase.auth.signOut();
        response = { error: null, data: { user } }; // Simula una respuesta exitosa
      }

      if (response.error) {
        setError(traducirError(response.error.message));
      }
      
      return response;

    } catch (err) {
      setError("Ocurrió un error inesperado. Intenta nuevamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleAuthAction, setError };
}
