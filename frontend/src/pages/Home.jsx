import { useEffect, useState } from 'react'
import { getAllProducts } from '@/utils/api'
import ProductCard from '@/components/ProductCard'
import { Spinner } from '@/components/ui/spinner'
import { Empty } from '@/components/ui/empty'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAllProducts()
      if (response.success) {
        setProducts(response.data)
      } else {
        setError('Failed to load products')
      }
    } catch (err) {
      setError('Error connecting to server. Please try again later.')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Hero Section */}
      <div className="mb-8 rounded-xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-6 text-center sm:mb-12 sm:rounded-2xl sm:p-8 md:p-12">
        <div className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Premium Quality
            </span>
            <br />
            Meats & More
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg">
            Browse our selection of fresh, high-quality meats sourced from trusted local farms.
            Place your order online and pick it up at our store.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-muted-foreground sm:text-sm">
            <span className="flex items-center gap-1">
              ✓ Fresh Daily
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              ✓ Locally Sourced
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              ✓ Quality Guaranteed
            </span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <Empty
            title="Unable to load products"
            description={error}
            action={{
              label: 'Try Again',
              onClick: fetchProducts,
            }}
          />
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Empty
                title="No products available"
                description="Check back later for new products."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Home
