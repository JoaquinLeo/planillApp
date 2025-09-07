import { Minus, Plus } from "lucide-react";
import InputNumber from "../ui/InputNumber";

export default function FilaViaje({ viaje, index, addViaje, updateViaje, openDeleteModal, canDelete }) {
  return (
    <tr>
      <td className="border p-2">Viaje {index + 1}</td>
      <td className="border p-2 text-center">
        <InputNumber
          id={`viaje-monto-${index}`}
          name={`viaje-monto-${index}`}
          placeholder="Monto"
          value={viaje.monto}
          onChange={(e) => updateViaje(index, e.target.value)}
          className="w-full text-center border rounded px-2 py-1"
        />
      </td>
      <td className="border p-2 text-center">
        <div className="flex gap-2 justify-center">
          <button onClick={addViaje} className="bg-green-500 text-white px-2 py-1 rounded">
            <Plus size={16} />
          </button>
          {canDelete && (
            <button
              onClick={() => openDeleteModal("viaje", index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              <Minus size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
