import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { NavBar, LogoutModal } from "../components/ui";

export default function DashboardDueno() {
  const [modalOpen, setModalOpen] = useState(false);

  const duenoNavItems = [
    { to: "planillas", text: "Planillas" }, 
    { to: "relaciones", text: "Relaciones" }, 
    { to: "configuraciones", text: "Configuraciones" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavBar onLogout={() => setModalOpen(true)} navItems={duenoNavItems} />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <LogoutModal open={modalOpen} onCancel={() => setModalOpen(false)} />
    </div>
  );
}
