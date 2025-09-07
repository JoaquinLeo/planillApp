export default function ModalAlert({ open, titulo, onOk }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black rounded-lg p-6 max-w-md shadow-lg">
        <h2 className="text-lg text-center font-semibold mb-4">{titulo}</h2>
        <div className="flex justify-around gap-2">
          <button
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-400 transition"
            onClick={onOk}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}