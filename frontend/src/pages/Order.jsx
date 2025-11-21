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
      <div className="container flex min-h-[600px] items-center justify-center py-16">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-6 dark:bg-green-950">
              <ShoppingBag className="h-20 w-20 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold">Order Placed Successfully!</h2>
          <p className="mb-4 text-muted-foreground">
            Thank you for your order. We've sent a confirmation email to{' '}
            <strong>{customerEmail}</strong>
          </p>
          <p className="mb-6 text-muted-foreground">
            You will be notified when your order is ready for pickup.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to home page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Order</h1>

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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
                <CardDescription>
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 rounded-lg border p-4"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-20 w-20 rounded object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=80&h=80&fit=crop'
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon-sm"
                        variant="outline"
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleRemoveItem(item._id, item.name)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Checkout</CardTitle>
                <CardDescription>
                  Enter your details to place your order
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmitOrder}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Full Name
                    </label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                    />
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>

                    <Badge className="w-full justify-center py-2" variant="secondary">
                      Payment collected in-store at pickup
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
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
