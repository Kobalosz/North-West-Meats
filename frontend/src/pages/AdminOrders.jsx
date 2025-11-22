import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getAllOrders, updateOrderStatus } from '@/utils/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Empty } from '@/components/ui/empty'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, CheckCircle2, Mail, Calendar } from 'lucide-react'
import { toast } from 'sonner'

function AdminOrders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingOrder, setUpdatingOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await getAllOrders(token)
      if (response.success) {
        setOrders(response.data)
      }
    } catch (err) {
      toast.error('Error fetching orders')
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId)
      const response = await updateOrderStatus(orderId, newStatus, token)

      if (response.success) {
        toast.success(`Order marked as ${newStatus}`)
        fetchOrders()
      } else {
        toast.error(response.message || 'Failed to update order status')
      }
    } catch (err) {
      toast.error('Error updating order status')
      console.error('Error updating order status:', err)
    } finally {
      setUpdatingOrder(null)
    }
  }

  const processingOrders = orders.filter((order) => order.status === 'processing')
  const readyOrders = orders.filter((order) => order.status === 'ready')

  const OrderCard = ({ order }) => (
    <Card key={order._id}>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg">{order.customerName}</CardTitle>
            <CardDescription className="flex items-center gap-1 text-xs sm:text-sm">
              <Mail className="h-3 w-3" />
              <span className="truncate">{order.customerEmail}</span>
            </CardDescription>
          </div>
          <Badge variant={order.status === 'processing' ? 'secondary' : 'success'} className="w-fit text-xs">
            {order.status === 'processing' ? (
              <Clock className="mr-1 h-3 w-3" />
            ) : (
              <CheckCircle2 className="mr-1 h-3 w-3" />
            )}
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
        {/* Order Items */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold sm:text-sm">Order Items:</h4>
          <div className="space-y-1">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between text-sm font-semibold sm:text-base">
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Order Date */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          {new Date(order.createdAt).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </div>

        {/* Action Button */}
        {order.status === 'processing' && (
          <Button
            className="w-full text-sm sm:text-base"
            onClick={() => handleStatusUpdate(order._id, 'ready')}
            disabled={updatingOrder === order._id}
          >
            {updatingOrder === order._id ? (
              <>
                <Spinner className="mr-2" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark as Ready
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Order Management</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Track and manage customer orders
        </p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Empty
            title="No orders yet"
            description="Orders will appear here when customers place them"
          />
        </div>
      ) : (
        <Tabs defaultValue="processing">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="processing" className="text-xs sm:text-sm">
              Processing ({processingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="ready" className="text-xs sm:text-sm">
              Ready ({readyOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="processing" className="mt-4 sm:mt-6">
            {processingOrders.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Empty
                  title="No processing orders"
                  description="All orders have been completed"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {processingOrders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ready" className="mt-4 sm:mt-6">
            {readyOrders.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Empty
                  title="No ready orders"
                  description="Orders marked as ready will appear here"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {readyOrders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

export default AdminOrders
