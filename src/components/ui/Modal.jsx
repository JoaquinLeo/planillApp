export default function Modal({ open, titulo, texto, opcion1, opcion2, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black rounded-lg p-3 w-9/12 sm:w-1/4 shadow-lg">
        <h2 className="text-lg text-center font-semibold p-2">{titulo}</h2>
        <p className="p-2 text-center">
          {texto}
        </p>
        <div className="flex justify-around p-2 gap-2">
          <button
            className="w-20 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-400 transition"
            onClick={onConfirm}
          >
            {opcion1}
          </button>
          <button
            className="w-20 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-400 transition"
            onClick={onCancel}
          >
            {opcion2}
          </button>
        </div>
      </div>
    </div>
  );
}