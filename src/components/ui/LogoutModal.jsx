
import { useState } from "react";
import { Modal } from "./";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function LogoutModal({ open, onCancel }) {
  const navigate = useNavigate();

  const confirmExit = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <Modal
      open={open}
      titulo="Cerrar Sesión"
      texto="¿Desea cerrar su sesión?"
      opcion1="Si"
      opcion2="No"
      onConfirm={confirmExit}
      onCancel={onCancel}
    />
  );
}
