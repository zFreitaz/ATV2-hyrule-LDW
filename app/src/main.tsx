import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import AppLayout from "@/layouts/AppLayout"
import Home from "@/pages/Home"
import Dashboard from "@/pages/Dashboard"
import Melodias from "@/pages/Melodias"
import Sobre from "@/pages/Sobre"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explorar" element={<Dashboard />} />
          <Route path="/melodias" element={<Melodias />} />
          <Route path="/sobre" element={<Sobre />} />
        </Route>
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  </StrictMode>
)