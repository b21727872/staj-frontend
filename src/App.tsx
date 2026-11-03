import { Outlet } from "react-router-dom"
import { SiteHeader } from "@/components/site-header"

export default function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="h-1.5 bg-primary" />
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Outlet />
      </main>
    </div>
  )
}
