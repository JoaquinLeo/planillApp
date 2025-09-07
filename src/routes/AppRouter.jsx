import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  Login,
  Register,
  DashboardDueno,
  DashboardChofer,
  PlanillasPage,
  RelacionesPage,
  PlanillasDuenoPage, // New import
  ConfiguracionesPage, // New import
} from "../pages";
import { Planilla, HistorialPlanillas } from "../components/planillas";
import { Activas, Invitar, Pendientes } from "../components/relaciones";
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dueño */}
        <Route
          path="/dueno"
          element={
            <ProtectedRoute rol="dueno">
              <DashboardDueno />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="planillas" replace />} /> {/* Default to planillas */}
          <Route path="planillas" element={<PlanillasDuenoPage />} /> {/* New Planillas for Dueno */}
          <Route path="relaciones" element={<RelacionesPage />}>
            <Route index element={<Navigate to="activas" replace />} />
            <Route path="activas" element={<Activas />} />
            <Route path="invitar" element={<Invitar />} />
            <Route path="pendientes" element={<Pendientes />} />
          </Route>
          <Route path="configuraciones" element={<ConfiguracionesPage />} /> {/* New Configuraciones */}
        </Route>
        {/* Chofer */}
        <Route
          path="/chofer"
          element={
            <ProtectedRoute rol="chofer">
              <DashboardChofer />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="planillas" replace />} />
          <Route path="planillas" element={<PlanillasPage />}>
            <Route index element={<Navigate to="crear" replace />} />
            <Route path="crear" element={<Planilla />} />
            <Route path="historial" element={<HistorialPlanillas />} />
          </Route>
          
          {/* Aquí irá la futura ruta de relaciones */}
          <Route path="relaciones" element={<RelacionesPage />}>
            <Route index element={<Navigate to="activas" replace />} />
            <Route path="activas" element={<Activas />} />
            <Route path="invitar" element={<Invitar />} />
            <Route path="pendientes" element={<Pendientes />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
