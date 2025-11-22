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
    <Card className="group overflow-hidden shadow-soft hover-lift animate-scale-in">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={product.img}
          alt={product.name}
          className="h-full w-full object-cover transition-smooth group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop'
          }}
        />
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <Badge variant="destructive" className="text-base shadow-lg">
              Out of Stock
            </Badge>
          </div>
        )}
        {product.available && product.stock > 0 && product.stock <= 5 && (
          <div className="absolute right-2 top-2">
            <Badge variant="secondary" className="bg-accent/90 text-xs backdrop-blur-sm">
              Only {product.stock} left
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight transition-smooth group-hover:text-primary sm:text-xl">
            {product.name}
          </CardTitle>
          <span className="rounded-lg bg-primary/10 px-2 py-1 text-base font-bold text-primary sm:text-xl">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <CardDescription className="line-clamp-2 text-xs leading-relaxed sm:text-sm">
          {product.desc || 'Premium quality meat product'}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs sm:text-sm">
          <span className="font-medium text-muted-foreground">Stock: {product.stock}</span>
          {product.available && product.stock > 0 ? (
            <Badge variant="success" className="text-xs shadow-sm">Available</Badge>
          ) : (
            <Badge variant="destructive" className="text-xs shadow-sm">Unavailable</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-6">
        <Button
          className="w-full text-sm shadow-sm transition-smooth sm:text-base"
          onClick={handleAddToCart}
          disabled={!product.available || product.stock === 0}
        >
          <Plus className="mr-1 h-4 w-4 transition-smooth group-hover:scale-110 sm:mr-2 sm:h-5 sm:w-5" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
