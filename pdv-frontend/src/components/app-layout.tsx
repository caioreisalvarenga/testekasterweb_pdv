import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Store,
  LayoutDashboard,
  ShoppingCart,
  History,
  LogOut,
  Package,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pdv", label: "PDV", icon: ShoppingCart },
  { to: "/produtos", label: "Produtos", icon: Package },
  { to: "/historico", label: "Histórico", icon: History },
]

export function AppLayout() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem("pdv-token")
    localStorage.removeItem("pdv-user")
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-sm">PDV System</p>
            <p className="text-xs text-muted-foreground">Frente de Caixa</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Usuário + Logout */}
        <div className="p-3 border-t space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Operador</p>
              <p className="text-xs text-muted-foreground truncate">
                operador@pdv.com
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Área principal */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <div />
          <ThemeToggle />
        </header>

        {/* Conteúdo */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}