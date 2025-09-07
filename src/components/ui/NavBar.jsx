import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function NavBar({ onLogout, navItems }) { // Accept navItems prop
  
  
  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? "px-1 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium text-white bg-blue-700"
      : "px-1 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium text-gray-300 hover:bg-blue-900 hover:text-white";
  };

  return (
    <nav className="w-full bg-slate-800 text-white px-1 md:px-6 py-3 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-3 sm:gap-8">
        <h1 className="text-xs md:text-lg font-bold">PlanillApp</h1>
        <div className="flex items-center gap-1 sm:gap-4">
          {navItems.map((link) => ( // Use navItems prop
            <NavLink key={link.to} to={link.to} className={getNavLinkClass}>
              {link.text}
            </NavLink>
          ))}
        </div>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-1 md:px-3 py-1 rounded-lg transition"
      >
        <LogOut size={18} />
        <span>Salir</span>
      </button>
    </nav>
  );
}
