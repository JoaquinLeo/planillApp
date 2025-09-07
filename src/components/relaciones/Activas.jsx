import { useRelacionesActivas } from "../../hooks/useRelacionesActivas";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui";
import { ConfirmDeleteRelacion } from "./";

export default function Activas(){
    const { relaciones, loading, error, openConfirmDeleteModal, cancelDeleteModal, confirmDeleteModal , modalDeleteOpen, relacionToDelete} = useRelacionesActivas();
    const { usuario } = useAuth();

    // Helper functions to get the other user's name and email based on current user's role
    const getNombre = (relacion) => {
      if (!usuario || !relacion.dueno || !relacion.chofer) return '';
      return usuario.rol === 'chofer' ? relacion.dueno.nombre : relacion.chofer.nombre;
    }
    
    const getEmail = (relacion) => {
      if (!usuario || !relacion.dueno || !relacion.chofer) return '';
      return usuario.rol === 'chofer' ? relacion.dueno.email : relacion.chofer.email;
    }

    if (loading) {
        return(
            <div>Cargando relaciones...</div>
        );
    }
    if (error) {
        return(
            <div className="text-red-500">{error}</div>
        );
    }
    return(
        <div className="max-w-3xl mx-auto">
            <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
                {relaciones.length === 0 ? (
                    <p className="text-gray-600 text-center p-4">No hay relaciones activas.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead>
                            <tr className="text-xs md:text-sm bg-gray-400 text-gray-700 uppercase leading-normal">
                                <th className="py-3 px-1 sm:px-6 text-left">Nombre</th>
                                <th className="py-3 px-1 sm:px-6 text-left">Email</th>
                                <th className="py-3 px-1 sm:px-6 text-center">Accion</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs md:text-sm font-light">
                            {relaciones.map((relacion) => {
                            return (
                                <tr key={relacion.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-1 sm:px-6 text-left whitespace-nowrap">{getNombre(relacion)}</td>
                                    <td className="py-3 px-1 sm:px-6 text-left">{getEmail(relacion)}</td>
                                    <td className="py-3 px-1 sm:px-6 text-center">
                                        <Button label="Eliminar" onClick={() => openConfirmDeleteModal(relacion)} className="w-9/12 md:w-1/2 text-white text-xs md:text-sm rounded disabled:opacity-50  bg-red-500 hover:bg-red-800" />
                                    </td>
                                </tr>
                            );
                            })}
                        </tbody>
                        </table>
                    </div>
                )}
            </div>
            <ConfirmDeleteRelacion 
                open={modalDeleteOpen}
                usuarioRelacion={relacionToDelete ? (usuario.rol === 'chofer' ? relacionToDelete.dueno.nombre : relacionToDelete.chofer.nombre) : ''}
                onConfirm={confirmDeleteModal}
                onCancel={cancelDeleteModal}
            />
        </div>
    ); 
}