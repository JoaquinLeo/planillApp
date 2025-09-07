import React from 'react';
import { FilaViaje, FilaGasto } from "./";
import { Button } from "../ui";
import { calcularGanancia, calcularTotalGastos, calcularTotalViajes } from "../../utils/planillaUtils.js";

export default function PlanillaTable({ 
    state, 
    handlers, 
    planillaId, 
    loading, 
    selectedDueño 
}) {
    const { viajes, gastos, porcentaje } = state;
    const totalViajes = calcularTotalViajes(viajes);
    const totalGastos = calcularTotalGastos(gastos);
    const ganancia = calcularGanancia(viajes, gastos, porcentaje);
    const porcentajeMonto = parseFloat((totalViajes * porcentaje) / 100) || 0;

    return (
        <div className={`shadow-md rounded-lg ${!selectedDueño ? 'opacity-50 pointer-events-none' : ''}`}>
            <table className="w-full border-collapse border border-gray-400 bg-white">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Viaje / Gasto</th>
                        <th className="border p-2">Monto </th>
                        <th className="border p-2">
                            <Button className="p-0 px-2 m-0 w-fit" label="Limpiar" onClick={handlers.openClearModal} disabled={!planillaId} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={3} className="border p-2 font-bold bg-gray-50">
                            Viajes
                        </td>
                    </tr>
                    {viajes.map((v, i) => (
                        <FilaViaje
                            key={v.id || i}
                            viaje={v}
                            index={i}
                            addViaje={() => handlers.handleAction({ type: "ADD_VIAJE" })}
                            updateViaje={(index, value) => handlers.handleAction({ type: "UPDATE_VIAJE", payload: { index, value } })}
                            openDeleteModal={handlers.openDeleteModal}
                            canDelete={viajes.length > 1}
                        />
                    ))}
                    <tr>
                        <td className="border p-2 text-left font-semibold">Total Viajes</td>
                        <td className="border p-2 text-center font-semibold">
                            {totalViajes.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                        </td>
                        <td className="border"></td>
                    </tr>

                    <tr>
                        <td className="border p-2 items-center gap-2">
                            <span className="text-sm">Porc. (%)</span>
                            <input
                                type="number"
                                id="porcentaje-chofer"
                                name="porcentaje-chofer"
                                placeholder="%"
                                value={porcentaje}
                                onChange={(e) => handlers.handleAction({ type: "SET_PORCENTAJE", payload: e.target.value })}
                                className="w-1/3 border rounded px-2 py-1 ml-2"
                            />
                        </td>
                        <td className="border p-2 text-center font-semibold">
                            {porcentajeMonto.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                        </td>
                        <td className="border"></td>
                    </tr>

                    <tr>
                        <td colSpan={3} className="border p-2 font-bold bg-gray-50">
                            Gastos
                        </td>
                    </tr>
                    {gastos.map((g, i) => (
                        <FilaGasto
                            key={g.id || i}
                            gasto={g}
                            index={i}
                            addGasto={() => handlers.handleAction({ type: "ADD_GASTO" })}
                            updateGasto={(index, field, value) =>
                                handlers.handleAction({ type: "UPDATE_GASTO", payload: { index, field, value } })
                            }
                            openDeleteModal={handlers.openDeleteModal}
                            canDelete={gastos.length > 1}
                        />
                    ))}
                    <tr>
                        <td className="border p-2 text-left font-semibold">Total Gastos</td>
                        <td className="border p-2 text-center font-semibold">
                            {totalGastos.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                        </td>
                        <td className="border"></td>
                    </tr>

                    <tr className="bg-green-100 font-bold">
                        <td className="border p-2">Ganancias</td>
                        <td className="border p-2 text-center">
                            {ganancia.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                        </td>
                        <td className="border p-2 text-center">
                            <Button
                                label={selectedDueño ? "Enviar" : "Seleccionar dueño"}
                                loading={loading}
                                onClick={handlers.openSendModal}
                                disabled={!selectedDueño || !planillaId}
                                className="p-0 px-2 m-0 w-fit"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
