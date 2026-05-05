import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

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

function ProjectsCarousel({ projects }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -340 : 340, behavior: 'smooth' })
    }
  }

  const getCategoryLabel = (category) => {
    const labels = {
      'moveis-planejados': 'MÓVEIS PLANEJADOS',
      'cozinhas': 'COZINHAS',
      'quartos': 'QUARTOS',
      'escritorios': 'ESCRITÓRIOS',
      'paineis': 'PAINÉIS',
      'decoracao': 'DECORAÇÃO'
    }
    return labels[category] || category
  }

  return (
    <div className="drops-section">
      <div className="drops-header">
        <h3 className="drops-title">NEW DROPS</h3>
        <div className="drops-nav">
          <button onClick={() => scroll('left')} className="drops-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button onClick={() => scroll('right')} className="drops-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
      <div className="drops-container" ref={scrollRef}>
        {projects.map((project) => (
          <Link key={project.id} to={`/projeto/${project.id}`} className="drop-card">
            <div className="drop-image-container">
              <ImageWithFallback 
                src={project.coverImageUrl} 
                alt={project.title}
                className={`drop-image ${project.soldOut ? 'sold-out' : ''}`} 
              />
              {project.soldOut && <span className="sold-out-badge">SOLD OUT</span>}
            </div>
            <div className="drop-info">
              <span className="drop-category">{getCategoryLabel(project.category)}</span>
              <h4 className="drop-name">{project.title}</h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProjectsCarousel