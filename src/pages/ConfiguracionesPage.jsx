import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Configuraciones } from '../components/configuraciones';

export default function ConfiguracionesPage() {
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
            {/* Sub-navigation for ConfiguracionesPage if needed */}
            {/* For now, just render the component directly */}
            <NavLink to="/dueno/configuraciones" className={getNavLinkClass}>
              Mis Configuraciones
            </NavLink>
          </div>
        </div>
      </nav>
      <Configuraciones />
    </div>
  );
}
