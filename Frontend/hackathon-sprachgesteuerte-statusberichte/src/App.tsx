import { BrowserRouter, Route, Routes } from "react-router-dom";
import Report from "./pages/Report";
import Construction from "./pages/Construction";
import Header from "./components/Header";
import ReportSingleView from "./pages/ReportSingleView";

export default function App() {
  return (
    <div className="bg-[#F4F8FB] h-[100vh]">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="report" element={<Report reportNumber={1} />} />
          <Route path="report/:id" element={<ReportSingleView />} />
          <Route path="construction" element={<Construction />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
