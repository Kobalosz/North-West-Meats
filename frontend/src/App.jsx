import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import AdminLayout from '@/components/AdminLayout'
import Home from '@/pages/Home'
import Order from '@/pages/Order'
import Contact from '@/pages/Contact'
import AdminLogin from '@/pages/AdminLogin'
import AdminProducts from '@/pages/AdminProducts'
import AdminOrders from '@/pages/AdminOrders'
import AdminInquiries from '@/pages/AdminInquiries'
import AdminAnalytics from '@/pages/AdminAnalytics'
import AdminCarousel from '@/pages/AdminCarousel'
import AdminMarquee from '@/pages/AdminMarquee'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<Order />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/products" replace />} />
              <Route path="dashboard" element={<Navigate to="/admin/products" replace />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="carousel" element={<AdminCarousel />} />
              <Route path="marquee" element={<AdminMarquee />} />
            </Route>
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
