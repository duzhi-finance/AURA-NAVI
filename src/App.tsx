import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import RelationHub from "./pages/RelationHub";
import PromptStation from "./pages/PromptStation";
import Archive from "./pages/Archive";
import { ensureSeedProfiles } from "./lib/store";

ensureSeedProfiles();

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="relations" element={<RelationHub />} />
          <Route path="prompt-station" element={<PromptStation />} />
          <Route path="archive" element={<Archive />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
