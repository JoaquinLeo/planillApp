import { useEffect } from 'react';

export default function ModalGenerico({ isOpen, onClose, title, children }) {
  // Efecto para bloquear/desbloquear el scroll del body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    // Función de limpieza: se ejecuta cuando el componente se desmonta o isOpen cambia
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]); // Este efecto depende del estado de 'isOpen'

  if (!isOpen) {
    return null;
  }

  return (
    // Capa de fondo oscuro. Si se hace clic en ella, se cierra el modal.
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/* Contenedor con tus estilos + altura máxima */}
      <div className="bg-white border-2 border-black px-4 py-2 rounded-lg shadow-xl relative flex flex-col w-9/12 sm:w-1/4 max-w-2xl max-h-[90vh]">
        {/* Encabezado con título a la izquierda y botón a la derecha */}
        <div className="flex justify-between items-center border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
                {title}
            </h3>
            <button 
                onClick={onClose}
                className="text-2xl text-gray-500 hover:text-gray-800"
            >
                &times; {/* Esto es una 'X' bonita */}
            </button>
        </div>
        
        {/* Contenido principal con scroll automático */}
        <div className="overflow-y-auto">
             {/* Aquí es donde se renderiza CUALQUIER contenido que le pases */}
            {children}
        </div>
      </div>
    </div>
  );
}