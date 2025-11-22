import { useState } from 'react'
import { Navigate, Link, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Package, ShoppingBag, BarChart3, MessageSquare, LogOut, Menu, X } from 'lucide-react'
import { toast } from 'sonner'
import logo from '@/assets/logo.svg'

function AdminLayout() {
  const { isAuthenticated, logout, admin } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const navItems = [
    {
      name: 'Products',
      path: '/admin/products',
      icon: Package,
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingBag,
    },
    {
      name: 'Inquiries',
      path: '/admin/inquiries',
      icon: MessageSquare,
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: BarChart3,
    },
  ]

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Mobile Hamburger Button - Positioned in navbar area */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-2 z-50 h-10 w-10 rounded-lg border bg-background shadow-sm sm:top-3 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-background transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col pt-16 lg:pt-0">
          {/* Admin Info */}
          <div className="border-b p-4 space-y-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <img src={logo} alt="Logo" className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Admin Dashboard</h2>
                <p className="text-xs text-muted-foreground">{admin?.username}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path} onClick={closeSidebar}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-sm"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:ml-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
