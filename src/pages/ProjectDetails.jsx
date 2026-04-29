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
    </div>
  )
}