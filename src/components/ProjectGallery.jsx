import { useState } from 'react'

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3EImagem não disponível%3C/text%3E%3C/svg%3E"

function ImageWithFallback({ src, alt, className }) {
  const [imgError, setImgError] = useState(false)
  return (
    <img 
      src={imgError || !src ? FALLBACK_IMG : src} 
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgError(true)}
    />
  )
}

function ProjectGallery({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">Sem imagens disponíveis</p>
      </div>
    )
  }

  return (
    <div className="gallery">
      <div className="gallery-main">
        <ImageWithFallback src={images[selectedIndex]} alt={`Imagem ${selectedIndex + 1}`} />
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`gallery-thumb ${index === selectedIndex ? 'active' : ''}`}
            >
              <ImageWithFallback src={image} alt={`Thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectGallery;