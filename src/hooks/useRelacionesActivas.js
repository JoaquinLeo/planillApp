import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getRelaciones , deleteRelacion } from "../lib/api"; 

export function useRelacionesActivas() {
  const { usuario } = useAuth();
  const [relaciones, setRelaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [relacionToDelete, setRelacionToDelete] = useState(null);

  useEffect(() => {
    if (!usuario) {
      setRelaciones([]);
      return;
    }

    const cargarRelaciones = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRelaciones(usuario.id, 'activa');
        setRelaciones(data);
      } catch (err) {
        setError("Error al cargar las relaciones activas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarRelaciones();
  }, [usuario]);

  const eliminarRelacion = useCallback(async (idRelacion) => {
    try {
      const success = await deleteRelacion(idRelacion);
      if (success) {
        setRelaciones(prevRelaciones => prevRelaciones.filter(relacion => relacion.id !== idRelacion));
      }
    } catch (err) {
      setError("Error al eliminar la relación.");
      console.error(err);
    }
  }, []);

  const openConfirmDeleteModal = useCallback((relacion) => {
    setModalDeleteOpen(true);
    setRelacionToDelete(relacion);
  }, []);

  const cancelDeleteModal = useCallback(() => {
    setModalDeleteOpen(false);
    setRelacionToDelete(null);
  }, []);

  const confirmDeleteModal = useCallback(async () => { 
    if (relacionToDelete) { 
      try {
        await eliminarRelacion(relacionToDelete.id); // <-- Pasa el ID y espera la eliminación
      } finally {
        setModalDeleteOpen(false);
        setRelacionToDelete(null);
      }
    }
  }, [relacionToDelete, eliminarRelacion]);

  return { 
    relaciones, 
    loading, 
    error, 
    openConfirmDeleteModal,
    modalDeleteOpen, 
    cancelDeleteModal, 
    confirmDeleteModal,
    relacionToDelete,
  };
}

