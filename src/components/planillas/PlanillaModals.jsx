import React from 'react';
import { ConfirmDeleteModal, ResumenPlanilla } from "./";
import { ModalAlert, Modal } from "../ui";
import { calcularGanancia, calcularTotalGastos, calcularTotalViajes } from "../../utils/planillaUtils.js";

export default function PlanillaModals({ state, modalStates, itemToDelete, handlers }) {
    const { viajes, gastos, porcentaje } = state;
    const totalViajes = calcularTotalViajes(viajes);
    const totalGastos = calcularTotalGastos(gastos);
    const ganancia = calcularGanancia(viajes, gastos, porcentaje);
    const porcentajeMonto = parseFloat((totalViajes * porcentaje) / 100) || 0;
    return (
        <>
            <ConfirmDeleteModal
                key={`delete-${itemToDelete.tipo}-${itemToDelete.id}`}
                open={modalStates.modalDeleteOpen}
                tipo={itemToDelete}
                onConfirm={handlers.confirmDelete}
                onCancel={handlers.cancelDelete}
            />

            <ResumenPlanilla
                open={modalStates.modalSendOpen}
                titulo="¿Seguro que quieres enviar la planilla?"
                data={{
                    cantidadViajes: viajes.length,
                    totalViajes,
                    porcentaje,
                    porcentajeMonto,
                    cantidadGastos: gastos.length,
                    totalGastos,
                    ganancia,
                }}
                onConfirm={handlers.confirmSend}
                onCancel={handlers.cancelSend}
            />

            <ModalAlert
                open={modalStates.modalSuccessfulSaveOpen}
                titulo="¡Planilla enviada con éxito!"
                onOk={() => handlers.setModalSuccessfulSaveOpen(false)}
            />

            <Modal
                open={modalStates.modalClearOpen}
                titulo="Limpiar Planilla"
                texto="¿Seguro de que quiere limpiar la planilla?"
                opcion1="Sí"
                opcion2="No"
                onConfirm={handlers.confirmClear}
                onCancel={handlers.cancelClear}
            />
        </>
    );
}