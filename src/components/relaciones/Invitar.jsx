import { useInvitacion } from '../../hooks/useInvitacion';
import { useAuth } from '../../context/AuthContext';
import { InputField, Button, Alert } from '../ui';

export default function Invitar() {
  const {
    email,
    setEmail,
    loading,
    error,
    success,
    handleInvite,
    setError,
    setSuccess
  } = useInvitacion();
  
  const { usuario } = useAuth();
  const rolAInvitar = usuario.rol === 'chofer' ? 'dueño' : 'chofer';

  return (
    <div className="max-w-md mx-auto">
      <div className="border border-gray-300 shadow-lg rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 md:mb-4">
          Invitar a un {rolAInvitar}
        </h3>
        <div className='mb-2 w-full'>
          <InputField
            label={`Email del ${rolAInvitar}`}
            type="email"
            id="email-invitacion"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={`email@ejemplo.com`}
            disabled={loading}
            className="mb-2 w-full border border-gray-300 shadow-md rounded px-2 py-2"
          />
          {error && (
            <Alert type="error" message={error} onDismiss={() => setError(null)} className="mt-4" />
          )}
          {success && (
            <Alert type="success" message="¡Invitación enviada con éxito!" onDismiss={() => setSuccess(false)} className="mt-4" />
          )}
          <Button
            label={loading ? 'Enviando...' : 'Enviar Invitación'}
            disabled={loading}
            className="w-full"
            onClick={handleInvite} 
          />
        </div>
        
      </div>
    </div>
  );
}
