import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import App from "@/App"
import { AuthProvider } from "@/auth"
import { ContactPage } from "@/pages/contact-page"
import { LoginPage } from "@/pages/login-page"
import { SectionPage } from "@/pages/section-page"
import { SectionsProvider } from "@/sections"
import "@/index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SectionsProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<App />}>
              <Route index element={<SectionPage slug="anasayfa" />} />
              <Route path="giris" element={<LoginPage />} />
              <Route path="iletisim" element={<ContactPage />} />
              <Route path=":slug" element={<SectionPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SectionsProvider>
    </AuthProvider>
  </StrictMode>,
)
