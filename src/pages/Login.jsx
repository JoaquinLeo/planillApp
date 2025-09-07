import { useState, useEffect } from "react";
import { InputField, Button, Alert } from "../components/ui";
import { AuthContainer, AuthMoveLoginReg } from "../components/login-register";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthForm } from "../hooks/useAuthForm";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, handleAuthAction, setError } = useAuthForm();
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  const navigate = useNavigate();
  const { user, usuario, loading: authLoading } = useAuth();

  const handleLogin = async () => {
    const response = await handleAuthAction("login", { email, password });
    if (response && !response.error) {
      setJustLoggedIn(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setJustLoggedIn(false);
    navigate("/login");
  };

  const irADashboard = () => {
    if (usuario?.rol === "dueno") navigate("/dueno");
    else if (usuario?.rol === "chofer") navigate("/chofer");
  };

  useEffect(() => {
    if (!authLoading && justLoggedIn && user && usuario?.rol) {
      navigate(usuario.rol === "dueno" ? "/dueno" : "/chofer", { replace: true });
      setJustLoggedIn(false);
    }
  }, [authLoading, justLoggedIn, user, usuario, navigate]);

  if (authLoading) {
    return <div>Cargando...</div>;
  }

  if (user && usuario) {
    if (justLoggedIn) {
      return <AuthContainer title="Redirigiendo..." />;
    }

    return (
      <AuthContainer title="Sesión activa">
        <p className="mb-4">
          Ya iniciaste sesión como <b>{usuario.nombre}</b>
        </p>
        <Button label="Ir a mi sesión" onClick={irADashboard} />
        <Button label="Cerrar sesión" onClick={handleLogout} className="mt-2" />
      </AuthContainer>
    );
  }

  return (
    <AuthContainer title="Iniciar Sesión">
      <InputField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <InputField
        id="password"
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      {error && <Alert type="error" message={error} />}
      <Button
        label={loading ? "Ingresando..." : "Ingresar"}
        loading={loading}
        onClick={handleLogin}
      />
      <AuthMoveLoginReg
        label="¿No tenés cuenta?"
        linkHref="/register"
        linkText="Registrarse"
      />
    </AuthContainer>
  );
}
