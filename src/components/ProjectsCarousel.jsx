import { useRef } from 'react'
import { Link } from 'react-router-dom'

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
              <img 
                src={project.coverImageUrl || '/placeholder.jpg'} 
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