import { useRef, useState } from 'react'

function Marquee({ items }) {
  const marqueeRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)

  if (!items || items.length === 0) {
    return null
  }

  // Combine all marquee texts with separators
  const marqueeText = items.map(item => item.text).join(' • ')

  return (
    <div className="w-full overflow-hidden bg-primary py-2 text-primary-foreground shadow-soft">
      <div
        ref={marqueeRef}
        className={`flex whitespace-nowrap ${isPaused ? '' : 'animate-marquee'}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Duplicate content for seamless loop */}
        <span className="inline-block px-4 text-sm font-medium sm:text-base">
          {marqueeText}
        </span>
        <span className="inline-block px-4 text-sm font-medium sm:text-base" aria-hidden="true">
          {marqueeText}
        </span>
        <span className="inline-block px-4 text-sm font-medium sm:text-base" aria-hidden="true">
          {marqueeText}
        </span>
      </div>
    </div>
  )
}

export default Marquee
