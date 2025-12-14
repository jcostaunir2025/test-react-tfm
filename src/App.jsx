import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import EvaluacionesPage from "./pages/EvaluacionesPage";
import ReportesPage from "./pages/ReportesPage";
import ConfiguracionPage from "./pages/ConfiguracionPage";
import AyudaPage from "./pages/AyudaPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <Menu />
          <main className="flex-grow p-6">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/evaluaciones" element={<ProtectedRoute><EvaluacionesPage /></ProtectedRoute>} />
              <Route path="/reportes" element={<ProtectedRoute><ReportesPage /></ProtectedRoute>} />
              <Route path="/configuracion" element={<ProtectedRoute><ConfiguracionPage /></ProtectedRoute>} />
              <Route path="/ayuda" element={<ProtectedRoute><AyudaPage /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}