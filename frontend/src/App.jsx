import { BrowserRouter, Routes, Route } from "react-router-dom";
import SportsDashboard from "./components/layout/SportsDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SportsDashboard initialView="inicio" />} />
        <Route path="/socios" element={<SportsDashboard initialView="socios" />} />
        <Route path="/staff" element={<SportsDashboard initialView="staff" />} />
        <Route path="/actividades" element={<SportsDashboard initialView="actividades" />} />
        <Route path="/pagos" element={<SportsDashboard initialView="pagos" />} />
        <Route path="/configuracion" element={<SportsDashboard initialView="configuracion" />} />
      </Routes>
    </BrowserRouter>
  );
}
