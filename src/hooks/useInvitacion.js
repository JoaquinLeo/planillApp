import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createRelacion } from '../lib/api';

export function useInvitacion() {
  const { usuario } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInvite = async () => {
    if (!email) {
      setError('Por favor, ingresá un email.');
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresá un formato de email válido.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createRelacion(usuario.id, email, usuario.rol);
      setSuccess(true);
      setEmail(''); // Clear email input on success
    } catch (err) {
      setError(err.message);

      const expectedErrorMessages = [
        'No se encontró ningún usuario con ese email.',
        'Ya existe una relación activa o pendiente con este usuario.',
        'No podés invitarte a vos mismo.',
      ];

      // Check if the error message is one of the expected ones
      const isExpectedError = expectedErrorMessages.includes(err.message) ||
                              err.message.startsWith('No podés invitar a otro');

      if (!isExpectedError) {
        console.error(err); // Only log unexpected errors
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    error,
    success,
    handleInvite,
    setError,
    setSuccess
  };
}
