import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { projectService } from '../services/projectService'
import LeadForm from '../components/LeadForm'

export default function ProjectDetails() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(0)
  const [showLeadForm, setShowLeadForm] = useState(false)

  useEffect(() => { loadProject() }, [id])

  const loadProject = async () => {
    try {
      setLoading(true)
      const data = await projectService.getPublishedProject(id)
      setProject(data)
    } catch { }
    finally { setLoading(false) }
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

  if (loading) return (
    <div className="page">
      <div className="noise-overlay" />
      <div className="loader"><div className="spinner" /></div>
    </div>
  )

  if (!project) return (
    <div className="page">
      <div className="noise-overlay" />
      <div className="grid-lines">{[...Array(12)].map((_, i) => <div key={i} className="grid-line" />)}</div>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <div><h1 style={{ fontSize: 48, fontWeight: 900 }}>Projeto não encontrado</h1><Link to="/" style={{ color: 'var(--primary)' }}>← Voltar</Link></div>
      </div>
    </div>
  )

  const images = project.imageUrls?.length > 0 ? project.imageUrls : [project.coverImageUrl]

  return (
    <div className="page">
      <div className="noise-overlay" />
      <div className="grid-lines">{[...Array(12)].map((_, i) => <div key={i} className="grid-line" />)}</div>

      <header className="header">
        <div className="header-content">
          <nav className="nav">
            <a href="/#inicio">INÍCIO</a>
            <a href="/#portfolio">PORTFÓLIO</a>
            <a href="/#sobre">SOBRE</a>
          </nav>
          <div className="logo">
            <span className="logo-serif">RP</span>
            <span className="logo-text">PLANEJADOS</span>
          </div>
          <button onClick={() => setShowLeadForm(true)} className="cta-button">ORÇAMENTO</button>
        </div>
      </header>

      <section className="project-detail">
        <div className="project-detail-grid">
          <div className="project-detail-images">
            <div className="project-detail-main">
              <img src={images[selected]} alt={project.title} />
            </div>
            {images.length > 1 && (
              <div className="project-detail-thumbs">
                {images.map((url, i) => (
                  <button key={i} onClick={() => setSelected(i)} className={`project-detail-thumb ${selected === i ? 'active' : ''}`}>
                    <img src={url} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="project-detail-info">
            <Link to="/#portfolio" className="back-link">← VOLTAR AO PORTFÓLIO</Link>
            <span className="project-detail-category">{getCategoryLabel(project.category)}</span>
            <h1 className="project-detail-title">{project.title}</h1>
            <p className="project-detail-desc">{project.description}</p>
            <button onClick={() => setShowLeadForm(true)} className="start-button">
              SOLICITAR ORÇAMENTO
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      <LeadForm isOpen={showLeadForm} onClose={() => setShowLeadForm(false)} projectTitle={project?.title} />

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="footer-rp">RP</span>
            <span className="footer-planejados">PLANEJADOS</span>
          </div>
          <div className="footer-links">
            <a href="/#inicio">INÍCIO</a>
            <a href="/#portfolio">PORTFÓLIO</a>
            <a href="/#sobre">SOBRE</a>
            <a href="/#contato">CONTATO</a>
          </div>
          <div className="footer-contact">
            <p>contato@rpplanejados.com.br</p>
            <p>(11) 99999-9999</p>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="status-indicator">
            <span className="status-pulse" />
            <span className="status-text">SYSTEM OPERATIONAL</span>
          </div>
          <p className="copyright">© {new Date().getFullYear()} RP PLANEJADOS. TODOS OS DIREITOS RESERVADOS.</p>
        </div>
      </footer>

      <button onClick={() => setShowLeadForm(true)} className="whatsapp-float whatsapp-blink">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382C17.208 14.246 16.685 13.92 16.233 13.737C15.78 13.555 15.384 13.443 15.042 13.443C14.352 13.443 13.812 13.627 13.412 13.992C13.012 14.357 12.732 14.886 12.572 15.577L11.817 18.032C11.621 18.768 11.217 19.34 10.605 19.749C9.993 20.157 9.333 20.361 8.625 20.361C7.917 20.361 7.248 20.14 6.618 19.698C5.988 19.256 5.481 18.664 5.098 17.921C4.714 17.179 4.522 16.339 4.522 15.401C4.522 14.463 4.732 13.605 5.152 12.827C5.572 12.05 6.108 11.404 6.76 10.889C7.412 10.375 8.13 10.006 8.915 9.773C9.7 9.541 10.469 9.425 11.222 9.425C11.975 9.425 12.705 9.55 13.41 9.801C14.115 10.052 14.703 10.465 15.175 11.041L16.565 10.037C17.213 9.253 17.617 8.317 17.776 7.229C17.863 6.509 17.824 5.865 17.658 5.297C17.492 4.729 17.224 4.245 16.854 3.845C16.433 3.395 15.944 3.17 15.387 3.17C14.83 3.17 14.341 3.395 13.92 3.845L12.798 4.967C12.577 5.188 12.439 5.465 12.385 5.797C12.331 6.13 12.376 6.443 12.52 6.738C12.801 7.438 13.239 8.252 13.834 9.179C14.43 10.107 15.074 10.989 15.766 11.825C16.458 12.661 17.172 13.432 17.907 14.138C18.641 14.845 19.267 15.417 19.784 15.855C20.301 16.293 20.652 16.673 20.838 16.995C21.023 17.317 21.095 17.631 20.432 18.263L19.2 19.495C18.884 19.811 18.484 20.045 18 20.195C17.516 20.345 17.012 20.42 16.488 20.42C15.964 20.42 15.46 20.345 14.976 20.195C14.492 20.045 14.092 19.811 13.776 19.495C13.567 19.286 13.401 19.034 13.277 18.74C13.154 18.446 13.092 18.16 13.092 17.882C13.092 17.604 13.154 17.318 13.277 17.024C13.401 16.73 13.567 16.478 13.776 16.269C13.985 16.06 14.228 15.894 14.505 15.772C14.782 15.65 15.068 15.588 15.363 15.588C15.658 15.588 15.944 15.65 16.221 15.772C16.498 15.894 16.741 16.06 16.95 16.269L17.472 14.382Z" fill="white"/>
          <path d="M8.557 7.337C8.185 6.965 7.679 6.779 7.038 6.779C6.397 6.779 5.891 6.965 5.519 7.337C5.147 7.709 4.961 8.215 4.961 8.856C4.961 9.497 5.147 10.003 5.519 10.375L6.437 11.293C7.213 11.877 7.989 12.159 8.765 12.159C9.541 12.159 10.317 11.877 11.093 11.313L11.299 11.107C11.643 10.763 11.815 10.337 11.815 9.828C11.815 9.319 11.643 8.893 11.299 8.549C10.955 8.205 10.529 8.033 10.02 8.033C9.511 8.033 9.085 8.205 8.741 8.549L8.557 7.337Z" fill="white"/>
        </svg>
      </button>
    </div>
  )
}