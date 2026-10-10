import { HashRouter, Route, Routes } from "react-router-dom";
import AppDashboard from "./pages/AppDashboard";
import DomainPage from "./pages/DomainPage";
import TeamDnaPage from "./pages/TeamDnaPage";
import SalesPage from "./pages/SalesPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SalesPage />} />
        <Route path="team-dna" element={<TeamDnaPage />} />
        <Route path="app" element={<AppDashboard />} />
        <Route path="app/:domainId" element={<DomainPage />} />
      </Routes>
    </HashRouter>
  );
}
