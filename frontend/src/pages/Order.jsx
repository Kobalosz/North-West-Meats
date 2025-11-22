import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { createOrder } from '@/utils/api'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Empty } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'

function Order() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId)
    toast.success(`${productName} removed from cart`)
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    if (!customerName.trim() || !customerEmail.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const orderData = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
      }

      const response = await createOrder(orderData)

      if (response.success) {
        setSuccess(true)
        clearCart()
        toast.success('Order placed successfully!')
        setTimeout(() => {
          navigate('/')
        }, 3000)
      } else {
        toast.error(response.message || 'Failed to create order')
      }
    } catch (err) {
      toast.error('Error creating order. Please try again.')
      console.error('Error creating order:', err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container mx-auto flex min-h-[600px] items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-4 dark:bg-green-950 sm:p-6">
              <ShoppingBag className="h-16 w-16 text-green-600 dark:text-green-400 sm:h-20 sm:w-20" />
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Order Placed Successfully!</h2>
          <p className="mb-4 text-sm text-muted-foreground sm:text-base">
            Thank you for your order. We've sent a confirmation email to{' '}
            <strong>{customerEmail}</strong>
          </p>
          <p className="mb-6 text-sm text-muted-foreground sm:text-base">
            You will be notified when your order is ready for pickup.
          </p>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Redirecting to home page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">Your Order</h1>

      {cartItems.length === 0 ? (
        <div className="flex min-h-[500px] items-center justify-center">
          <Empty
            title="Your cart is empty"
            description="Add some products to your cart to place an order"
            action={{
              label: 'Browse Products',
              onClick: () => navigate('/'),
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Cart Items</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-16 w-16 rounded object-cover sm:h-20 sm:w-20"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=80&h=80&fit=crop'
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold sm:text-base">{item.name}</h3>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 sm:justify-start">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center text-sm font-medium sm:w-12">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right sm:ml-4">
                        <p className="text-sm font-bold sm:text-base">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleRemoveItem(item._id, item.name)}
                        className="h-8 w-8 sm:h-10 sm:w-10 sm:ml-2"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Checkout</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Enter your details to place your order
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmitOrder}>
                <CardContent className="space-y-4 p-4 sm:p-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:text-sm"
                    >
                      Full Name
                    </label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:text-sm"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-3 border-t pt-4 sm:space-y-4">
                    <div className="flex justify-between text-base font-bold sm:text-lg">
                      <span>Total:</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>

                    <Badge className="w-full justify-center py-2 text-xs sm:text-sm" variant="secondary">
                      Payment collected in-store at pickup
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter className="p-4 sm:p-6">
                  <Button
                    type="submit"
                    className="w-full text-sm sm:text-base"
                    disabled={loading || cartItems.length === 0}
                  >
                    {loading ? (
                      <>
                        <Spinner className="mr-2" />
                        Placing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default Order
