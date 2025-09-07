import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getConfiguracion, upsertConfiguracion } from '../lib/api';

export function useConfiguraciones() {
  const { usuario } = useAuth();
  const [porcentaje, setPorcentaje] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchConfiguracion = useCallback(async () => {
    if (!usuario?.id) return;
    try {
      setLoading(true);
      setError(null);
      const config = await getConfiguracion(usuario.id);
      if (config) {
        setPorcentaje(config.porcentaje_remisera);
      } else {
        setPorcentaje(20); // Valor por defecto si no hay configuración
      }
    } catch (e) {
      setError('No se pudo cargar la configuración.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [usuario?.id]);

  useEffect(() => {
    fetchConfiguracion();
  }, [fetchConfiguracion]);

  const handleUpdate = async () => {
    if (!usuario?.id) {
      setError('Usuario no autenticado.');
      return;
    }
    
    const numericPorcentaje = parseFloat(porcentaje);
    if (isNaN(numericPorcentaje) || numericPorcentaje < 0 || numericPorcentaje > 100) {
      setError('El porcentaje debe ser un número entre 0 y 100.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await upsertConfiguracion(usuario.id, numericPorcentaje);
      setSuccess(true);
    } catch (e) {
      setError('No se pudo actualizar la configuración.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    porcentaje,
    setPorcentaje,
    loading,
    error,
    success,
    handleUpdate,
    setError,
    setSuccess,
  };
}