import { BrowserRouter, Route, Routes } from "react-router-dom";
import Report from "./pages/Report";
import Construction from "./pages/ConstructionSite";
import Header from "./components/Header";

export default function App() {
  return (
    <div className="bg-[#F4F8FB] h-[100vh]">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="report" element={<Report reportNumber={1} />} />
          <Route path="construction" element={<Construction />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
