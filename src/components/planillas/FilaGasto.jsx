import { Minus, Plus } from "lucide-react";
import InputNumber from "../ui/InputNumber";

export default function FilaGasto({ gasto, index, addGasto, updateGasto, openDeleteModal, canDelete }) {
  return (
    <tr>
      <td className="border p-2">
        <input
          type="text"
          id={`gasto-descripcion-${index}`}
          name={`gasto-descripcion-${index}`}
          placeholder="Descripción"
          value={gasto.descripcion}
          onChange={(e) => updateGasto(index, "descripcion", e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </td>
      <td className="border p-2 text-center">
        <InputNumber
          id={`gasto-monto-${index}`}
          name={`gasto-monto-${index}`}
          placeholder="Monto"
          value={gasto.monto}
          onChange={(e) => updateGasto(index, "monto", e.target.value)}
          className="w-full text-center border rounded px-2 py-1"
        />
      </td>
      <td className="border p-2 text-center">
        <div className="flex gap-2 justify-center">
          <button onClick={addGasto} className="bg-green-600 text-white px-2 py-1 rounded">
            <Plus size={16} />
          </button>
          {canDelete && (
            <button
              onClick={() => openDeleteModal("gasto", index)}
              className="bg-red-600 text-white px-2 py-1 rounded"
            >
              <Minus size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
