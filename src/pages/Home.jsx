import { useState, useEffect } from 'react'
import { projectService } from '../services/projectService'
import ProjectsCarousel from '../components/ProjectsCarousel'
import LeadForm from '../components/LeadForm'

const CATEGORIES = [
  { value: 'all', label: 'TODOS' },
  { value: 'moveis-planejados', label: 'MÓVEIS PLANEJADOS' },
  { value: 'cozinhas', label: 'COZINHAS' },
  { value: 'quartos', label: 'QUARTOS' },
  { value: 'escritorios', label: 'ESCRITÓRIOS' },
  { value: 'paineis', label: 'PAINÉIS' },
  { value: 'decoracao', label: 'DECORAÇÃO' }
]

export default function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [showLeadForm, setShowLeadForm] = useState(false)

  useEffect(() => { loadProjects() }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await projectService.getPublishedProjects()
      setProjects(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const filtered = category === 'all' ? projects : projects.filter(p => p.category === category)

  return (
    <div className="page">
      <div className="noise-overlay" />
      <div className="grid-lines">
        {[...Array(12)].map((_, i) => <div key={i} className="grid-line" />)}
      </div>

      <header className="header">
        <div className="header-content">
          <nav className="nav">
            <a href="#inicio">INÍCIO</a>
            <a href="#portfolio">PORTFÓLIO</a>
            <a href="#sobre">SOBRE</a>
          </nav>
          <div className="logo">
            <span className="logo-serif">RP</span>
            <span className="logo-text">PLANEJADOS</span>
          </div>
          <a href="https://wa.me/5511999999999" className="cta-button">ORÇAMENTO</a>
        </div>
      </header>

      <section id="inicio" className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="status-badge">
              <span className="status-dot" />
              DISPONÍVEL
            </div>
            <h1 className="hero-title">
              <span>MÓVEIS</span>
              <span className="italic">SOB</span>
              <span>MEDIDA</span>
            </h1>
            <p className="hero-desc">Artesania de precisão. Design exclusivo. Transformamos espaços com excelência.</p>
            <a href="#portfolio" className="start-button">
              VER PROJETOS
              <span className="arrow">→</span>
            </a>
          </div>
          <div className="hero-right">
            <div className="hero-image-frame">
              <div className="image-placeholder">
                <span className="rp-large">RP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee">
        <div className="marquee-track">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="marquee-text">
              {i % 2 === 0 ? 'MARCENARIA PREMIUM' : 'DESIGN EXCLUSIVO'} ✦ 
            </span>
          ))}
        </div>
      </div>

      <section id="portfolio" className="portfolio">
        <div className="section-header">
          <span className="section-label">PORTFÓLIO</span>
          <h2 className="section-title">PROJETOS</h2>
        </div>

        <div className="filter">
          {CATEGORIES.map(cat => (
            <button key={cat.value} onClick={() => setCategory(cat.value)}
              className={`filter-btn ${category === cat.value ? 'active' : ''}`}>
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loader">
            <div className="spinner" />
          </div>
        ) : filtered.length > 0 ? (
          <ProjectsCarousel projects={filtered} />
        ) : (
          <p className="empty-message">Nenhum projeto encontrado nesta categoria.</p>
        )}
      </section>

      <section id="sobre" className="about">
        <div className="about-grid">
          <div className="about-left">
            <span className="section-label">SOBRE</span>
            <h2 className="about-title">TRADIÇÃO<br/>EM MARCENARIA</h2>
            <p className="about-text">
              Com mais de 10 anos de experiência, criamos móveis que combinam 
              funcionalidade, durabilidade e design elegante. Cada peça é desenvolvida 
              sob medida para atender às necessidades específicas de cada cliente.
            </p>
            <div className="stats">
              <div className="stat"><span className="stat-number">10+</span><span className="stat-label">ANOS</span></div>
              <div className="stat"><span className="stat-number">500+</span><span className="stat-label">PROJETOS</span></div>
              <div className="stat"><span className="stat-number">100%</span><span className="stat-label">SATISFAÇÃO</span></div>
            </div>
          </div>
          <div className="about-right">
            <div className="about-frame">
              <span className="rp-large">RP</span>
            </div>
          </div>
        </div>
      </section>

      <section id="contato" className="contact">
        <h2 className="contact-title">VAMOS CRIAR<br/>ALGO EXTRAORDINÁRIO?</h2>
        <button onClick={() => setShowLeadForm(true)} className="whatsapp-button">
          <span>FALAR NO WHATSAPP</span>
          <span className="pulse-dot" />
        </button>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="footer-rp">RP</span>
            <span className="footer-planejados">PLANEJADOS</span>
          </div>
          <div className="footer-links">
            <a href="#inicio">INÍCIO</a>
            <a href="#portfolio">PORTFÓLIO</a>
            <a href="#sobre">SOBRE</a>
            <a href="#contato">CONTATO</a>
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

      <button onClick={() => setShowLeadForm(true)} className="whatsapp-float">
        <svg width={24} height={24} fill="white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.445 3.48 8.756-.041 6.391-5.404 10.979-11.985 10.979-3.13-.002-5.682-1.276-7.772-3.48l-6.452 1.677zm13.509-14.34c-.236-1.764-1.745-3.176-3.548-3.176-1.937 0-3.552 1.568-3.552 3.53 0 1.414.775 2.691 1.965 3.425l1.252-1.264c.69-.628 1.682-1.005 2.717-1.005.344 0 .675.028.99.095l3.858-1.538c.315-.115.602-.24.856-.405l-.002-.004c-.252 1.492-1.338 2.666-2.814 3.174l-1.212.508z"/>
        </svg>
      </button>

      <LeadForm isOpen={showLeadForm} onClose={() => setShowLeadForm(false)} />
    </div>
  )
}