import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import {
  getPlanillaAbierta as apiGetPlanillaAbierta,
  createPlanilla as apiCreatePlanilla,
  updatePlanilla as apiUpdatePlanilla,
  closePlanilla as apiClosePlanilla,
  archivePlanilla as apiArchivePlanilla,
} from "../lib/api";

export function usePlanilla(usuario) {
  const [loading, setLoading] = useState(false);

  const getPlanillaAbierta = useCallback(async (dueno_id) => {
    if (!usuario || !dueno_id) return null;
    setLoading(true);
    try {
      return await apiGetPlanillaAbierta(usuario.id, dueno_id);
    } catch (error) {
      console.error("Error buscando planilla abierta:", error);
      toast.error("Error al cargar la planilla.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [usuario]);

  const createPlanilla = useCallback(async (dueno_id, fecha) => {
    if (!usuario || !dueno_id) return null;
    setLoading(true);
    try {
      return await apiCreatePlanilla(usuario.id, dueno_id, fecha);
    } catch (error) {
      console.error("Error creando planilla:", error);
      toast.error("No se pudo crear la planilla borrador.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [usuario]);

  const updatePlanilla = useCallback(
    debounce(async (planillaId, updates) => {
      if (!planillaId) return;
      try {
        await apiUpdatePlanilla(planillaId, updates);
      } catch (error) {
        console.error("Error en autoguardado de planilla:", error);
      }
    }, 3000),
    []
  );

  const updatePlanillaNow = useCallback(async (planillaId, updates) => {
    if (!planillaId) return false;
    try {
      const success = await apiUpdatePlanilla(planillaId, updates);
      if (!success) {
        toast.error("No se pudo guardar la planilla.");
      }
      return success;
    } catch (error) {
      console.error("Error guardando planilla:", error);
      toast.error("Error al guardar la planilla.");
      return false;
    }
  }, []);

  const closePlanilla = useCallback(async (planillaId) => {
    setLoading(true);
    try {
      const success = await apiClosePlanilla(planillaId);
      if (!success) {
        toast.error("Error al enviar la planilla.");
      }
      return success;
    } catch (error) {
      console.error("Error al cerrar planilla:", error);
      toast.error("Error al enviar la planilla.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const archivePlanilla = useCallback(async (planillaId) => {
    setLoading(true);
    try {
      const success = await apiArchivePlanilla(planillaId);
      if (!success) {
        toast.error("No se pudo archivar la planilla.");
      }
      return success;
    } catch (error) {
      console.error("Error al archivar la planilla:", error);
      toast.error("No se pudo archivar la planilla.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    getPlanillaAbierta,
    createPlanilla,
    updatePlanilla, // Debounced for autosave
    updatePlanillaNow, // Immediate for final save
    closePlanilla,
    archivePlanilla,
  };
}
