import { useReducer, useState, useEffect, useRef, useCallback } from "react";
import { usePlanilla } from "./usePlanilla.js";
import { useAuth } from "../context/AuthContext";

/**
 * @description Hook personalizado que encapsula toda la lógica de negocio y estado para gestionar la planilla de un chofer.
 * Se encarga de manejar el estado de los viajes y gastos, la comunicación con la base de datos,
 * la gestión de modales y los efectos secundarios como el autoguardado.
 * @param {string} selectedDueño - El ID del dueño seleccionado.
 * @param {string} fecha - La fecha actual de la planilla.
 * @returns Un objeto con el estado de la planilla, el estado de carga, los estados de los modales y los manejadores de eventos.
 */
export function usePlanillaManager(selectedDueño, fecha, onPlanillaCleared) {
  // --- MANEJO DEL ESTADO ---
  // `state` contiene los datos crudos de la planilla (viajes, gastos, porcentaje).
  // `dispatch` es la función para enviar acciones que modifican el estado.
  const [state, dispatch] = useReducer(planillaReducer, initialState);
  
  // El ID de la planilla activa en la base de datos.
  const [planillaId, setPlanillaId] = useState(null);

  // Refs para controlar "cerrojos" de efectos y evitar ejecuciones no deseadas.
  const isInitialMount = useRef(true); // Para evitar el autoguardado en la primera carga.
  const isClearing = useRef(false);     // Para evitar el autoguardado al limpiar la planilla.
  const isCreatingPlanilla = useRef(false); // Para evitar doble creación de planillas.
  const isSending = useRef(false);      // Para evitar autoguardado al enviar la planilla.

  // --- ESTADO DE LOS MODALES ---
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ tipo: "", index: null });
  const [modalSendOpen, setModalSendOpen] = useState(false);
  const [modalSuccessfulSaveOpen, setModalSuccessfulSaveOpen] = useState(false);
  const [modalClearOpen, setModalClearOpen] = useState(false);


  // --- HOOKS EXTERNOS ---
  // Hook para la autenticación del usuario.
  const { usuario } = useAuth();
  // Hook para las operaciones de API (CRUD de planillas).
  const { loading, getPlanillaAbierta, createPlanilla, updatePlanilla, updatePlanillaNow, closePlanilla, archivePlanilla } = usePlanilla(usuario);

  // --- EFECTOS SECUNDARIOS ---

  // Efecto #1: Cargar la planilla existente de un dueño cuando se selecciona.
  useEffect(() => {
    if (!selectedDueño) {
      dispatch({ type: "RESET" });
      setPlanillaId(null);
      return;
    }

    const loadPlanilla = async () => {
      const planilla = await getPlanillaAbierta(selectedDueño);
      if (planilla) {
        // Si hay una planilla abierta, carga sus datos en el estado.
        let loadedViajes = planilla.viajes || [];
        let loadedGastos = planilla.gastos || [];

        if (loadedViajes.length === 0) loadedViajes = [{ monto: "" }];
        if (loadedGastos.length === 0) loadedGastos = [{ descripcion: "", monto: "" }];

        dispatch({ 
            type: "SET_STATE", 
            payload: {
                viajes: loadedViajes.map(v => ({ id: String(v.id), monto: v.monto })),
                gastos: loadedGastos.map(g => ({ id: String(g.id), descripcion: g.descripcion, monto: g.monto })),
                porcentaje: planilla.porcentaje_chofer
            }
        });
        setPlanillaId(planilla.id);
      } else {
        // Si no hay planilla, resetea el estado.
        dispatch({ type: "RESET" });
        setPlanillaId(null);
      }
    };

    loadPlanilla();
  }, [selectedDueño, getPlanillaAbierta]);

  // Efecto #2: Autoguardado de cambios en la planilla.
  useEffect(() => {
    // Se usan los "cerrojos" para evitar el guardado en momentos clave.
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }

    if (isClearing.current) {
        isClearing.current = false;
        return;
    }

    if (isSending.current) {
        isSending.current = false;
        return;
    }

    if (!selectedDueño) {
        return;
    }

    const isInitialEmptyState = (
        state.viajes.length === 1 && state.viajes[0].monto === "" &&
        state.gastos.length === 1 && state.gastos[0].descripcion === "" && state.gastos[0].monto === "" &&
        state.porcentaje === ""
    );

    const saveChanges = async () => {
        let currentPlanillaId = planillaId;

        // Si no hay ID de planilla y el usuario empieza a escribir, se crea una nueva.
        if (!currentPlanillaId && !isInitialEmptyState) {
            if (isCreatingPlanilla.current) return;
            isCreatingPlanilla.current = true;

            const nuevaPlanilla = await createPlanilla(selectedDueño, fecha);
            if (nuevaPlanilla) {
                setPlanillaId(nuevaPlanilla.id);
                currentPlanillaId = nuevaPlanilla.id;
            } else {
                isCreatingPlanilla.current = false;
                return;
            }
            isCreatingPlanilla.current = false;
        }

        // Si ya hay un ID, simplemente actualiza los datos.
        if (currentPlanillaId) {
            updatePlanilla(currentPlanillaId, { 
                viajes: state.viajes,
                gastos: state.gastos,
                porcentaje_chofer: state.porcentaje 
            });
        }
    }

    if (!isInitialEmptyState || planillaId) {
        saveChanges();
    }

  }, [state, selectedDueño, fecha, planillaId, createPlanilla, updatePlanilla]);

  // --- MANEJADORES DE EVENTOS (HANDLERS) ---

  // Función genérica para actualizar el estado a través del reducer.
  const handleAction = (action) => {
    dispatch(action);
  };

  // Funciones para el modal de eliminación.
  const openDeleteModal = (tipo, index) => { 
    setItemToDelete({ tipo, index });
    setModalDeleteOpen(true);
  };

  const confirmDelete = () => {
    handleAction({ type: itemToDelete.tipo === 'viaje' ? 'DELETE_VIAJE' : 'DELETE_GASTO', payload: itemToDelete.index }); 
    setModalDeleteOpen(false);
    setItemToDelete({ tipo: "", index: null }); // Cambiado index a id
  };

  const cancelDelete = () => setModalDeleteOpen(false);

  // Funciones para el modal de envío de planilla.
  const openSendModal = () => {
    updatePlanilla.cancel(); // Cancela cualquier autoguardado pendiente.
    setModalSendOpen(true);
  };

  const confirmSend = async () => {
    isSending.current = true;
    if (!planillaId) {
      isSending.current = false;
      return;
    }
    // Cancela cualquier autoguardado para evitar un doble guardado.
    updatePlanilla.cancel();

    // Forzar un guardado final e inmediato con el estado más reciente.
    const finalSaveSuccess = await updatePlanillaNow(planillaId, {
      viajes: state.viajes,
      gastos: state.gastos,
      porcentaje_chofer: state.porcentaje,
    });

    // Si el guardado final falla, no continuar con el cierre.
    if (!finalSaveSuccess) {
      toast.error("Error crítico: No se pudo guardar el estado final de la planilla.");
      isSending.current = false;
      setModalSendOpen(false);
      return;
    }

    // Si el guardado final fue exitoso, proceder a cerrar la planilla.
    const closeSuccess = await closePlanilla(planillaId);
    setModalSendOpen(false);

    if (closeSuccess) {
      dispatch({ type: "RESET" });
      setPlanillaId(null);
      setModalSuccessfulSaveOpen(true);
      if (onPlanillaCleared) onPlanillaCleared();
    } else {
      isSending.current = false;
    }
  };

  const cancelSend = () => setModalSendOpen(false);
  
  const openClearModal = () => {
    updatePlanilla.cancel();
    setModalClearOpen(true);
  };

  // Funciones para limpiar la planilla.
  const handleClear = async () => {
      isClearing.current = true;
      if(planillaId) {
          await archivePlanilla(planillaId);
      }
      dispatch({ type: "RESET" });
      setPlanillaId(null);
      if (onPlanillaCleared) onPlanillaCleared();
  }

  const confirmClear = () => {
    updatePlanilla.cancel();
    handleClear();
    setModalClearOpen(false);
  };

  const cancelClear = () => setModalClearOpen(false);



  // --- VALOR DE RETORNO DEL HOOK ---
  // Se exponen el estado, el ID de la planilla, el estado de carga,
  // los estados de los modales y todos los manejadores para que el componente UI los utilice.
  return {
    state,
    planillaId,
    loading,
    modalStates: {
      modalDeleteOpen,
      modalSendOpen,
      modalSuccessfulSaveOpen,
      modalClearOpen,
     
    },
    itemToDelete,
    handlers: {
      handleAction,
      openDeleteModal,
      confirmDelete,
      cancelDelete,
      openSendModal,
      confirmSend,
      cancelSend,
      openClearModal,
      confirmClear,
      cancelClear,
      setModalSuccessfulSaveOpen,
    },
  };
}


// --- REDUCER ---
// El reducer es una función pura que calcula el siguiente estado basado en el estado actual y una acción.
// Ayuda a manejar la lógica de estado compleja de forma predecible.
const initialState = {
  viajes: [{ monto: "" }],
  gastos: [{ descripcion: "", monto: "" }],
  porcentaje: "",
};

function planillaReducer(state, action) {
  switch (action.type) {
    case "SET_STATE":
        return action.payload;
    case "ADD_VIAJE":
        return { ...state, viajes: [...state.viajes, {  monto: "" }] }; 
    case "UPDATE_VIAJE":
      return {
        ...state,
        viajes: state.viajes.map((viaje,i) => 
          i === action.payload.index 
            ? { ...viaje, monto: action.payload.value } 
            : viaje
        ),
      };
    case "DELETE_VIAJE":
      return { ...state, viajes: state.viajes.filter((_, index) => index !== action.payload) };
    case "ADD_GASTO":
      return { ...state, gastos: [...state.gastos, { descripcion: "", monto: "" }] };
    case "UPDATE_GASTO":
      return {
        ...state,
        gastos: state.gastos.map((gasto,i) =>
          i === action.payload.index 
            ? { ...gasto, [action.payload.field]: action.payload.value }
            : gasto
        ),
      };
    case "DELETE_GASTO":
      return { ...state, gastos: state.gastos.filter((_, index) => index !== action.payload) };
    case "SET_PORCENTAJE":
      return { ...state, porcentaje: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}
