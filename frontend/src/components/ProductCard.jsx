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

      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight sm:text-xl">{product.name}</CardTitle>
          <span className="text-lg font-bold text-green-600 dark:text-green-500 sm:text-2xl">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <CardDescription className="line-clamp-2 text-xs sm:text-sm">
          {product.desc || 'Premium quality meat product'}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-muted-foreground">Stock: {product.stock}</span>
          {product.available && product.stock > 0 ? (
            <Badge variant="success" className="text-xs">Available</Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">Unavailable</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-6">
        <Button
          className="w-full text-sm sm:text-base"
          onClick={handleAddToCart}
          disabled={!product.available || product.stock === 0}
        >
          <Plus className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
