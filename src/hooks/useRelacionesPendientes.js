import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRelaciones, updateRelacion } from '../lib/api';

export function useRelacionesPendientes() {
  const { usuario } = useAuth();
  const [relaciones, setRelaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarRelaciones = useCallback(async () => {
    if (!usuario) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getRelaciones(usuario.id, 'pendiente');
      setRelaciones(data);
    } catch (err) {
      setError('Error al cargar las relaciones pendientes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [usuario]);

  useEffect(() => {
    cargarRelaciones();
  }, [cargarRelaciones]);

  const handleAction = useCallback(async (idRelacion, nuevoEstado) => {
    try {
      await updateRelacion(idRelacion, nuevoEstado);
      // Refrescar la lista para que la relación desaparezca
      await cargarRelaciones();
    } catch (err) {
      setError(`Error al ${nuevoEstado === 'activa' ? 'aceptar' : 'rechazar'} la relación.`);
      console.error(err);
    }
  }, [cargarRelaciones]);


  const aceptarRelacion = (idRelacion) => handleAction(idRelacion, 'activa');
  const rechazarRelacion = (idRelacion) => handleAction(idRelacion, 'rechazada');
  const cancelarRelacion = (idRelacion) => handleAction(idRelacion, 'eliminada');


  return {
    relaciones,
    loading,
    error,
    aceptarRelacion,
    rechazarRelacion,
    cancelarRelacion,
    currentUserId: usuario?.id,
  };
}
