import { useRelacionesPendientes } from '../../hooks/useRelacionesPendientes';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui';

export default function Pendientes() {
  const {
    relaciones,
    loading,
    error,
    aceptarRelacion,
    rechazarRelacion,
    cancelarRelacion,
    currentUserId,
  } = useRelacionesPendientes();

  const { usuario } = useAuth();

  if (loading) {
    return <div>Cargando relaciones pendientes...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const invitacionesRecibidas = relaciones.filter(r => r.usuario_accion_id === currentUserId);
  const invitacionesEnviadas = relaciones.filter(r => r.usuario_accion_id !== currentUserId);

  const getNombre = (relacion) => {
    if (!usuario || !relacion.dueno || !relacion.chofer) return '';
    return usuario.rol === 'chofer' ? relacion.dueno.nombre : relacion.chofer.nombre;
  }
  
  const getEmail = (relacion) => {
    if (!usuario || !relacion.dueno || !relacion.chofer) return '';
    return usuario.rol === 'chofer' ? relacion.dueno.email : relacion.chofer.email;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Invitaciones Recibidas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Invitaciones Recibidas</h3>
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
          {invitacionesRecibidas.length === 0 ? (
            <p className="text-gray-600 text-center p-4">No tenés invitaciones pendientes.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead>
                  <tr className="text-xs md:text-sm bg-gray-400 text-gray-700 uppercase leading-normal">
                    <th className="py-3 px-1 sm:px-6 text-left">De</th>
                    <th className="py-3 px-1 sm:px-6 text-left">Email</th>
                    <th className="py-3 px-1 sm:px-6 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-xs md:text-sm font-light">
                  {invitacionesRecibidas.map((relacion) => (
                    <tr key={relacion.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-1 sm:px-6 text-left whitespace-nowrap">{getNombre(relacion)}</td>
                      <td className="py-3 px-1 sm:px-6 text-left">{getEmail(relacion)}</td>
                      <td className="py-3 px-1 sm:px-6 text-center">
                        <div className="flex items-center justify-center gap-1 md:gap-2">
                          <Button label="Aceptar" onClick={() => aceptarRelacion(relacion.id)} className="py-1 px-2 md:px-3 text-xs md:text-sm bg-green-500 hover:bg-green-700" />
                          <Button label="Rechazar" onClick={() => rechazarRelacion(relacion.id)} className="py-1 px-2 md:px-3 text-xs md:text-sm bg-red-500 hover:bg-red-800" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Invitaciones Enviadas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Invitaciones Enviadas</h3>
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
          {invitacionesEnviadas.length === 0 ? (
            <p className="text-gray-600 text-center p-4">No enviaste ninguna invitación.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead>
                  <tr className="text-xs md:text-sm bg-gray-400 text-gray-700 uppercase leading-normal">
                    <th className="py-3 px-1 sm:px-6 text-left">Para</th>
                    <th className="py-3 px-1 sm:px-6 text-left">Email</th>
                    <th className="py-3 px-1 sm:px-6 text-center">Estado</th>
                    <th className="py-3 px-1 sm:px-6 text-center">Accion</th>
                  </tr>
                </thead>
                <tbody className="text-xs md:text-sm font-light">
                  {invitacionesEnviadas.map((relacion) => (
                    <tr key={relacion.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-1 sm:px-6 text-left whitespace-nowrap">{getNombre(relacion)}</td>
                      <td className="py-3 px-1 sm:px-6 text-left">{getEmail(relacion)}</td>
                      <td className="py-3 px-1 sm:px-6 text-center">
                        <span className="bg-yellow-200 text-yellow-800 py-1 px-2 md:px-3 rounded-full text-xs md:text-sm">Pendiente</span>
                      </td>
                      <td className="py-3 px-1 sm:px-6 text-center">
                        <Button label="Cancelar" onClick={() => cancelarRelacion(relacion.id)} className="py-1 px-2 md:px-3 text-xs md:text-sm bg-gray-500 hover:bg-gray-700" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
