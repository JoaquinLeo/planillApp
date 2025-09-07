import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function PlanillasPage() {
  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? 'px-4 py-2 font-semibold text-blue-600 border-b-2 border-blue-600'
      : 'px-4 py-2 font-semibold text-gray-600 hover:text-blue-500';
  };

  return (
    <div>
      <nav className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            <NavLink to="crear" className={getNavLinkClass}>
              Crear Planilla
            </NavLink>
            <NavLink to="historial" className={getNavLinkClass}>
              Historial
            </NavLink>
          </div>
        </div>
      </nav>
      
      <Outlet />
    </div>
  );
}
