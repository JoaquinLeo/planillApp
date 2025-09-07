export default function ResumenPlanilla({ open, titulo, data, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black rounded-lg p-6 max-w-md shadow-lg">
        <h2 className="text-lg text-center font-semibold mb-4">{titulo}</h2>
        <div className="text-gray-800 text-sm space-y-1 mb-4">
            <div className="flex justify-around">
                <span>Viajes ({data.cantidadViajes})</span>
                <span>${data.totalViajes.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-around">
                <span>Porc ({data.porcentaje}%)</span>
                <span>${data.porcentajeMonto.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-around">
                <span>Gastos ({data.cantidadGastos})</span>
                <span>${data.totalGastos.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-around font-bold">
                <span>Ganancia</span>
                <span>${data.ganancia.toLocaleString('es-AR')}</span>
            </div>
        </div>
        <div className="flex justify-around gap-2">
          <button
            className="w-20 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-400 transition"
            onClick={onConfirm}
          >
            Si
          </button>
          <button
            className="w-20 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-400 transition"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}