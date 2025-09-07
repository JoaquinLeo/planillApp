import { calcularTotalViajes , calcularTotalGastos , calcularGanancia } from "../../utils/planillaUtils.js";

export default function PlanillaDetalle({ planilla, vista = 'chofer' }){   
    
    const totalViajes = calcularTotalViajes(planilla.viajes);
    const ganancia = calcularGanancia(planilla.viajes,planilla.gastos,planilla.porcentaje_chofer);
    const porcentajeMonto = parseFloat((totalViajes * planilla.porcentaje_chofer) / 100) || 0;

    if (!planilla) {
        return (
            <p className="text-gray-600 text-center p-4">No se ha encontrado la planilla seleccionada</p>
        );
    }
        return (
        <>
            <div className="text-sm text-gray-600 space-y-1 mb-2">
                <p>
                    <span className="font-semibold">Fecha:</span> {planilla.fecha}
                </p>
                {vista === 'chofer' && planilla.dueno && (
                    <p>
                        <span className="font-semibold">Para:</span> {planilla.dueno.nombre}
                    </p>
                )}
                {vista === 'dueno' && planilla.chofer && (
                    <p>
                        <span className="font-semibold">De:</span> {planilla.chofer.nombre}
                    </p>
                )}
            </div>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                        <th className="py-2 px-1 sm:px-2 text-center">Nº Viaje</th>
                        <th className="py-2 px-1 sm:px-2 text-center">Monto</th>
                    </tr>
                </thead>
                <tbody className=" text-sm font-light">
                    {planilla.viajes.map((viaje, index) => {
                    return (
                        <tr key={`viaje-${index}`} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-2 px-1 sm:px-2 text-center">Viaje { index + 1 }</td>
                            <td className="py-2 px-1 sm:px-2 text-center">
                                {typeof viaje.monto === 'number' 
                                    ? viaje.monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
                                    : '$0.00'
                                }
                            </td>
                        </tr>
                    );
                    })}
                    <tr key="total-viajes">
                        <td className="py-2 px-1 sm:px-2 text-center font-semibold">Total</td>
                        <td className="py-2 px-1 sm:px-2 text-center font-semibold">
                            { totalViajes.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }
                        </td>
                    </tr>
                    <tr key="porcentaje">
                        <td className="py-2 px-1 sm:px-2 text-center">Porc. ({planilla.porcentaje_chofer}%)</td>
                        <td className="py-2 px-1 sm:px-2 text-center">
                            { porcentajeMonto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }
                        </td>
                    </tr>
                    {planilla.gastos.map((gasto, index) => {
                    return (
                        <tr key={`gasto-${index}`} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-2 px-1 sm:px-2 text-center">{ gasto.descripcion }</td>
                            <td className="py-2 px-1 sm:px-2 text-center">
                                {typeof gasto.monto === 'number' 
                                    ? gasto.monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
                                    : '$0.00'
                                }
                            </td>
                        </tr>
                    );
                    })}
                    <tr key="ganancia">
                        <td className="py-2 px-1 sm:px-2 text-center font-semibold">Ganancia</td>
                        <td className="py-2 px-1 sm:px-2 text-center font-semibold">
                            { ganancia.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}