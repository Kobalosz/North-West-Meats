import { Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/context/CartContext'
import { toast } from 'sonner'

function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    if (product.available && product.stock > 0) {
      addToCart(product, 1)
      toast.success(`${product.name} added to cart!`)
    }
  }

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={product.img}
          alt={product.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop'
          }}
        />
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Badge variant="destructive" className="text-base">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{product.name}</CardTitle>
          <span className="text-2xl font-bold text-green-600 dark:text-green-500">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <CardDescription className="line-clamp-2">
          {product.desc || 'Premium quality meat product'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Stock: {product.stock}</span>
          {product.available && product.stock > 0 ? (
            <Badge variant="success">Available</Badge>
          ) : (
            <Badge variant="destructive">Unavailable</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={!product.available || product.stock === 0}
        >
          <Plus className="mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
