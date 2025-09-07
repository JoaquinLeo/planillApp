import { useConfiguraciones } from '../../hooks/useConfiguraciones';
import { InputField, Button, Alert } from '../ui';
import { useAuth } from '../../context/AuthContext';

export default function Configuraciones() {
  const {
      porcentaje,
      setPorcentaje,
      loading,
      error,
      success,
      handleUpdate,
      setError,
      setSuccess
    } = useConfiguraciones();
  const { usuario } = useAuth();

  return (
    <div className="max-w-md mx-auto">
      <div className="border border-gray-300 shadow-lg rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 md:mb-4">
              Editar Configuracion
            </h3>
            <div> {/* Replaced form with a div */} 
              <InputField
                label="Porcentaje de la Remisería (%)"
                type="number"
                id="porcentaje-remiseria"
                value={porcentaje}
                onChange={(e) => setPorcentaje(e.target.value)}
                placeholder={`porcentaje de la remiseria`}
                disabled={loading}
                className="mb-2 w-full border border-gray-300 shadow-md rounded px-2 py-2"
              />
              {error && (
                <Alert type="error" message={error} onDismiss={() => setError(null)} className="mt-4" />
              )}
              {success && (
                <Alert type="success" message="¡Configuración guardada con éxito!" onDismiss={() => setSuccess(false)} className="mt-4" />
              )}
              <Button
                label={loading ? 'Guardando...' : 'Guardar Cambios'}
                disabled={loading}
                className="w-full"
                onClick={handleUpdate} 
              />
            </div>
            
          </div>
        </div>
  );
}