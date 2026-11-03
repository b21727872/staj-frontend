import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/auth"
import { CONTACT_PATH, NAV_ITEMS, sectionPath } from "@/nav"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const { isAuthenticated, logout } = useAuth()
  const [open, setOpen] = useState(false)

  function closeMenu() {
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex min-w-0 items-center gap-3" onClick={closeMenu}>
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary font-heading text-lg text-primary-foreground">
            P
          </span>
          <span className="min-w-0">
            <span className="block truncate font-heading text-lg leading-none tracking-tight text-foreground">
              Proje Portalı
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">Proje sayfaları</span>
          </span>
        </NavLink>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X /> : <Menu />}
          <span className="sr-only">{open ? "Menüyü kapat" : "Menüyü aç"}</span>
        </Button>

        <SiteNav
          isAuthenticated={isAuthenticated}
          onNavigate={closeMenu}
          onLogout={() => {
            logout()
            closeMenu()
          }}
          className="hidden lg:flex"
        />
      </div>
      {open && (
        <div className="border-t border-border px-4 py-3 lg:hidden">
          <SiteNav
            id="site-nav"
            isAuthenticated={isAuthenticated}
            onNavigate={closeMenu}
            onLogout={() => {
              logout()
              closeMenu()
            }}
            className="flex"
          />
        </div>
      )}
    </header>
  )
}

function navLinkClass(isActive: boolean) {
  return cn(
    "block rounded-lg px-3 py-2 text-sm transition-colors",
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  )
}

function SiteNav({
  id,
  className,
  isAuthenticated,
  onNavigate,
  onLogout,
}: {
  id?: string
  className?: string
  isAuthenticated: boolean
  onNavigate: () => void
  onLogout: () => void
}) {
  return (
    <nav id={id} aria-label="Ana menü" className={cn("flex-col gap-1 md:flex-row md:items-center", className)}>
      <ul className="flex flex-col gap-1 md:flex-row md:items-center">
        {NAV_ITEMS.map((item) => (
          <li key={item.slug}>
            <NavLink
              to={sectionPath(item.slug)}
              end={item.slug === "anasayfa"}
              onClick={onNavigate}
              className={({ isActive }) => navLinkClass(isActive)}
            >
              {item.title}
            </NavLink>
          </li>
        ))}
        <li>
          <NavLink
            to={CONTACT_PATH}
            onClick={onNavigate}
            className={({ isActive }) => navLinkClass(isActive)}
          >
            İletişim
          </NavLink>
        </li>
      </ul>
      <div className="mt-2 border-t border-border pt-2 md:mt-0 md:ml-2 md:border-0 md:pt-0">
        {isAuthenticated ? (
          <Button type="button" variant="outline" className="h-9 w-full px-3 md:w-auto" onClick={onLogout}>
            Çıkış
          </Button>
        ) : (
          <NavLink
            to="/giris"
            onClick={onNavigate}
            className={({ isActive }) => cn(navLinkClass(isActive), "text-center md:text-left")}
          >
            Giriş
          </NavLink>
        )}
      </div>
    </nav>
  )
}
