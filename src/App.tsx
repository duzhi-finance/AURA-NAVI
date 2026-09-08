import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import RelationHub from "./pages/RelationHub";
import PromptStation from "./pages/PromptStation";
import Archive from "./pages/Archive";
import SoulJournalPage from "./pages/SoulJournalPage";
import TeamDnaPage from "./pages/TeamDnaPage";
import SalesPage from "./pages/SalesPage";
import { ensureSeedProfiles } from "./lib/store";

ensureSeedProfiles();

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SalesPage />} />
        <Route path="team-dna" element={<TeamDnaPage />} />
        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="relations" element={<RelationHub />} />
          <Route path="prompt-station" element={<PromptStation />} />
          <Route path="archive" element={<Archive />} />
          <Route path="journal" element={<SoulJournalPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
