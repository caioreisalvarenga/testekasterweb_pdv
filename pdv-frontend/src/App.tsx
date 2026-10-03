import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from "@/pages/login"
import { DashboardPage } from "@/pages/dashboard"
import { PdvPage } from "@/pages/pdv"
import { ProdutosPage } from "@/pages/produtos"
import { HistoricoPage } from "@/pages/historico"
import { AppLayout } from "@/components/app-layout"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pdv" element={<PdvPage />} />
        <Route path="/produtos" element={<ProdutosPage />} />
        <Route path="/historico" element={<HistoricoPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App