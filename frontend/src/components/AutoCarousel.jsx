import { useEffect, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

function AutoCarousel({ slides }) {
  const [api, setApi] = useState(null)

  useEffect(() => {
    if (!api) return

    // Scroll to first slide on mount
    api.scrollTo(0)
  }, [api])

  if (!slides || slides.length === 0) {
    return null
  }

  return (
    <Carousel
      setApi={setApi}
      className="w-full"
      opts={{
        align: 'start',
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
        }),
      ]}
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide._id}>
            <div className="relative h-[300px] overflow-hidden rounded-2xl shadow-soft sm:h-[400px] md:h-[500px]">
              {/* Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover transition-smooth group-hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1200&h=500&fit=crop'
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-8 md:p-12">
                <div className="max-w-3xl space-y-2 sm:space-y-3">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                    {slide.title}
                  </h2>
                  {slide.description && (
                    <p className="text-sm text-white/90 sm:text-base md:text-lg">
                      {slide.description}
                    </p>
                  )}
                  {slide.link && (
                    <a
                      href={slide.link}
                      className="inline-block mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-smooth hover:bg-primary/90 hover:shadow-md sm:px-6 sm:py-3 sm:text-base"
                    >
                      Learn More
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {slides.length > 1 && (
        <>
          <CarouselPrevious className="left-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" />
          <CarouselNext className="right-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" />
        </>
      )}
    </Carousel>
  )
}

export default AutoCarousel
