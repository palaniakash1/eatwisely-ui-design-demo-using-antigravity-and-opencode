import { useState } from 'react'

export default function ImageCircleLoader({ src, alt, size = 60 }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div
      className="relative rounded-full overflow-hidden bg-gray-200"
      style={{ width: size, height: size }}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-1/2 w-1/2 border-2 border-[#8fa31e] border-t-transparent" />
        </div>
      )}
      <img
        src={error ? '/placeholder-avatar.png' : src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
