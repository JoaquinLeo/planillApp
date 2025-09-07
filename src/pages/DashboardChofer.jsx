import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { NavBar, LogoutModal } from "../components/ui";

export default function DashboardChofer() {
  const [modalOpen, setModalOpen] = useState(false);

  const choferNavItems = [
    { to: "planillas", text: "Planillas" }, // Relative path
    { to: "relaciones", text: "Relaciones" }, // Relative path
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavBar onLogout={() => setModalOpen(true)} navItems={choferNavItems} />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <LogoutModal open={modalOpen} onCancel={() => setModalOpen(false)} />
    </div>
  );
}
