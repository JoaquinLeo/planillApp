import { useState } from "react";
import { InputField, Button, Alert } from "../components/ui";
import { AuthContainer, AuthMoveLoginReg, SelectRole } from "../components/login-register";
import { useAuthForm } from "../hooks/useAuthForm";
import toast from "react-hot-toast";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const { loading, error, handleAuthAction } = useAuthForm();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegister = async () => {
    const response = await handleAuthAction("register", { email, password, nombre, rol });
    if (response && !response.error) {
      setNombre("");
      setEmail("");
      setPassword("");
      setRol("");
      toast.success("✅ Registro exitoso. Por favor confirma tu email e inicia sesión.");
      setRegistrationSuccess(true);
    }
  };

  return (
    <AuthContainer title="Registro">
      {registrationSuccess ? (
        <div className="text-center">
          <Alert type="success" message="¡Registro exitoso!" />
          <p className="mt-4">Revisa tu correo electrónico para confirmar tu cuenta y poder iniciar sesión.</p>
          <AuthMoveLoginReg label="¿Ya confirmaste tu email?" linkHref="/login" linkText="Iniciar sesión" />
        </div>
      ) : (
        <>
          <InputField id="nombre" label="Nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" />
          <InputField id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <InputField id="password" label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          <SelectRole value={rol} onChange={(e) => setRol(e.target.value)} />
          {error && <Alert type="error" message={error} />}
          <Button label={loading ? "Registrando..." : "Registrarse"} loading={loading} onClick={handleRegister} />
          <AuthMoveLoginReg label="¿Ya tenés cuenta?" linkHref="/login" linkText="Iniciar sesion" />
        </>
      )}
    </AuthContainer>
  );
}
