import { useEffect, useState } from 'react'
import { getAllProducts, getActiveCarouselSlides, getActiveMarqueeItems } from '@/utils/api'
import ProductCard from '@/components/ProductCard'
import AutoCarousel from '@/components/AutoCarousel'
import Marquee from '@/components/Marquee'
import { Spinner } from '@/components/ui/spinner'
import { Empty } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

function Home() {
  const [products, setProducts] = useState([])
  const [carouselSlides, setCarouselSlides] = useState([])
  const [marqueeItems, setMarqueeItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all data in parallel
      const [productsRes, carouselRes, marqueeRes] = await Promise.all([
        getAllProducts(),
        getActiveCarouselSlides(),
        getActiveMarqueeItems(),
      ])

      if (productsRes.success) {
        setProducts(productsRes.data)
      } else {
        setError('Failed to load products')
      }

      if (carouselRes.success) {
        setCarouselSlides(carouselRes.data)
      }

      if (marqueeRes.success) {
        setMarqueeItems(marqueeRes.data)
      }
    } catch (err) {
      setError('Error connecting to server. Please try again later.')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    if (!searchQuery.trim()) return true

    const query = searchQuery.toLowerCase()
    const nameMatch = product.name.toLowerCase().includes(query)
    const descMatch = product.desc?.toLowerCase().includes(query)

    return nameMatch || descMatch
  })

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Carousel Section */}
      {carouselSlides.length > 0 && (
        <div className="mb-8 animate-fade-in-up sm:mb-12">
          <AutoCarousel slides={carouselSlides} />
        </div>
      )}

      {/* Marquee Section */}
      {marqueeItems.length > 0 && (
        <div className="mb-8 -mx-4 sm:-mx-6 sm:mb-12 lg:-mx-8">
          <Marquee items={marqueeItems} />
        </div>
      )}

      {/* Hero Section */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 text-center shadow-soft animate-fade-in-up sm:mb-12 sm:rounded-3xl sm:p-8 md:p-12 lg:p-16">
        <div className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="text-gradient">
              Premium Quality
            </span>
            <br />
            <span className="text-foreground">Meats & More</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg">
            Browse our selection of fresh, high-quality meats sourced from trusted local farms.
            Place your order online and pick it up at our store.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-medium text-primary/80 sm:gap-3 sm:text-sm">
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 transition-smooth-fast hover:bg-primary/15">
              ✓ Fresh Daily
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 transition-smooth-fast hover:bg-primary/15">
              ✓ Locally Sourced
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 transition-smooth-fast hover:bg-primary/15">
              ✓ Quality Guaranteed
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {!loading && !error && products.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 text-sm sm:text-base"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

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
              onClick: fetchData,
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
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Empty
                title="No products found"
                description={`No products match "${searchQuery}". Try a different search term.`}
                action={{
                  label: 'Clear Search',
                  onClick: clearSearch,
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {filteredProducts.map((product) => (
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
