import { HashRouter, Route, Routes } from "react-router-dom";
import SoulManual from "./pages/SoulManual";
import TeamDnaPage from "./pages/TeamDnaPage";
import SalesPage from "./pages/SalesPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SalesPage />} />
        <Route path="team-dna" element={<TeamDnaPage />} />
        <Route path="app" element={<SoulManual />} />
      </Routes>
    </HashRouter>
  );
}
