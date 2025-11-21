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
    <div className="container py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Premium Quality Meats
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Browse our selection of fresh, high-quality meats. Place your order online
          and pick it up at our store location.
        </p>
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
