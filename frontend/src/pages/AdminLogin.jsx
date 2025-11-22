import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { loginAdmin } from '@/utils/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import logo from '@/assets/logo.svg'

function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const response = await loginAdmin({ username, password })

      if (response.success) {
        login(response.admin, response.token)
        toast.success('Login successful!')
        navigate('/admin/dashboard')
      } else {
        toast.error(response.message || 'Invalid credentials')
      }
    } catch (err) {
      toast.error('Error logging in. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 p-6 text-center sm:p-8">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20 sm:mb-4 sm:h-20 sm:w-20">
            <img src={logo} alt="North West Meats" className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
          <CardTitle className="text-xl font-bold sm:text-2xl">Admin Login</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:text-sm"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:text-sm"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="mr-2" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminLogin
