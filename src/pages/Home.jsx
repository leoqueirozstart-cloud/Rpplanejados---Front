import { useState, useEffect } from 'react'
import { projectService } from '../services/projectService'
import ProjectsCarousel from '../components/ProjectsCarousel'
import LeadForm from '../components/LeadForm'
import Testimonials from '../components/Testimonials'

const CATEGORIES = [
  { value: 'all', label: 'TODOS' },
  { value: 'moveis-planejados', label: 'MÓVEIS PLANEJADOS' },
  { value: 'cozinhas', label: 'COZINHAS' },
  { value: 'quartos', label: 'QUARTOS' },
  { value: 'escritorios', label: 'ESCRITÓRIOS' },
  { value: 'paineis', label: 'PAINÉIS' },
  { value: 'decoracao', label: 'DECORAÇÃO' }
]

const BENEFITS = [
  { icon: '📐', title: 'Planejados com precisão', desc: 'Cada milímetro é calculado para maximizar o espaço e a funcionalidade.' },
  { icon: '✨', title: 'Qualidade em cada detalhe', desc: 'Materiais premium e acabamento impecável em cada peça.' },
  { icon: '🎨', title: 'Projetos personalizados', desc: 'Design exclusivo que reflete seu estilo e atende suas necessidades.' },
  { icon: '🤝', title: 'Atendimento próximo', desc: 'Acompanhamento completo do projeto à instalação.' }
]

const AMBIENTES = [
  { name: 'Cozinhas', icon: '🍳', img: 'https://i.pinimg.com/1200x/cf/05/ba/cf05bac5d6fa97a186542722ff815b36.jpg' },
  { name: 'Dormitórios', icon: '🛏️', img: 'https://i.pinimg.com/736x/15/6a/01/156a010710d99392e2bfb6c2f47c59ed.jpg' },
  { name: 'Closets', icon: '👔', img: 'https://i.pinimg.com/736x/27/64/3a/27643a94f7e51938e8f4993fe7929a3e.jpg' },
  { name: 'Salas', icon: '🛋️', img: 'https://i.pinimg.com/736x/e4/b9/4f/e4b94f982f020e992ada3cba3cd3dd63.jpg' },
  { name: 'Banheiros', icon: '🚿', img: 'https://i.pinimg.com/1200x/c9/8f/65/c98f65e50e717026e053bee02b5aded6.jpg' },
  { name: 'Home Office', icon: '💼', img: 'https://i.pinimg.com/1200x/c2/c6/16/c2c616e0a9524ecea3e534f7871cbf50.jpg' },
  { name: 'Áreas Gourmet', icon: '🍔', img: 'https://i.pinimg.com/736x/1e/33/9f/1e339f0cc49a71b648c5989170c71407.jpg' },
  { name: 'Comercial', icon: '🏢', img: 'https://i.pinimg.com/736x/62/81/31/62813119a608c79e27d62fb829ee08a8.jpg' }
]

const STEPS = [
  { num: '1', title: 'Você solicita', desc: 'Preencha o formulário ou fale conosco pelo WhatsApp.' },
  { num: '2', title: 'Entendemos', desc: 'Analisamos seu espaço, necessidades e preferências.' },
  { num: '3', title: 'Criamos', desc: 'Desenvolvemos o projeto personalizado com orçamento.' },
  { num: '4', title: 'Produzimos', desc: 'Fabricamos seus móveis com matéria-prima de qualidade.' },
  { num: '5', title: 'Instalamos', desc: 'Entregamos e montamos no seu ambiente com precisão.' }
]

const TESTIMONIALS = []

const FAQS = [
  { q: 'Vocês fazem projeto sob medida?', a: 'Sim! Todos os nossos móveis são desenvolvidos sob medida, planejados especificamente para o seu espaço e necessidades.' },
  { q: 'O orçamento é gratuito?', a: 'Sim, oferecemos orçamento sem compromisso. Após uma conversa sobre suas necessidades, fazemos a visita técnica para medir e apresentar a proposta.' },
  { q: 'Quais ambientes vocês atendem?', a: 'Atendemos residências e comerciais: cozinhas, dormitórios, closets, salas, banheiros, home offices, áreas gourmet e muito mais.' },
  { q: 'Como funciona o processo?', a: 'Você entra em contato, entendemos seu espaço, fazemos a medição, apresentamos o projeto e orçamento, e após aprovação, produzimos e instalamos.' },
  { q: 'O prazo depende de quê?', a: 'O prazo varia conforme a complexidade do projeto e tamanho da obra. Após a aprovação, informamos o tempo de produção e instalação.' }
]

const WHATSAPP_NUMBER = '5511998231085'

export default function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    loadProjects()
    loadTestimonials()

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up')
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el)
    })

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      document.querySelectorAll('.scroll-progress-bar').forEach(bar => {
        bar.style.width = `${Math.min(progress, 100)}%`
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await projectService.getPublishedProjects()
      setProjects(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const loadTestimonials = async () => {
    try {
      const API_URL = (import.meta.env.VITE_API_URL || 'https://ricardo-rpplanejados.vercel.app').replace(/\/+$/, '')
      const res = await fetch(`${API_URL}/api/testimonials`)
      if (res.ok) {
        const data = await res.json()
        setTestimonials(data)
      }
    } catch (e) { console.error(e) }
  }

  const filtered = category === 'all' ? projects : projects.filter(p => p.category === category)

  return (
    <div className="page">
      <div className="noise-overlay" />
      <div className="grid-lines">
        {[...Array(12)].map((_, i) => <div key={i} className="grid-line" />)}
      </div>

      <header className="header">
        <div className="scroll-progress-container">
          <div className="scroll-progress-bar" />
        </div>
        <div className="header-content">
          <nav className="nav">
            <a href="#inicio">INÍCIO</a>
            <a href="#portfolio">PORTFÓLIO</a>
            <a href="#depoimentos">DEPOIMENTOS</a>
            <a href="#sobre">SOBRE</a>
          </nav>
          <div className="logo">
            <span className="logo-serif">RP</span>
            <span className="logo-text">PLANEJADOS</span>
          </div>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="cta-button">ORÇAMENTO</a>
        </div>
      </header>

      <section id="inicio" className="hero">
        <div className="hero-accent" />
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
            <p className="hero-desc">Projetos personalizados para cozinhas, quartos, salas, escritórios e ambientes comerciais, feitos para aproveitar cada centímetro com beleza e funcionalidade.</p>
            <div className="hero-buttons">
              <button onClick={() => setShowLeadForm(true)} className="hero-cta-primary">
                SOLICITAR ORÇAMENTO
              </button>
              <a href="#portfolio" className="hero-cta-secondary">
                VER PROJETOS
                <span className="arrow">→</span>
              </a>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-image-frame">
              <img
                src="https://i.ibb.co/rKKgLqpr/Chat-GPT-Image-30-04-2026-02-09-27.png"
                alt="RP Planejados"
                className="hero-logo-img"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="marquee animate-on-scroll">
        <div className="marquee-track">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="marquee-text">
              {i % 2 === 0 ? 'MARCENARIA PREMIUM' : 'DESIGN EXCLUSIVO'} ✦
            </span>
          ))}
        </div>
      </div>

      <section id="portfolio" className="portfolio animate-on-scroll">
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

      <section id="beneficios" className="benefits animate-on-scroll">
        <div className="section-header">
          <span className="section-label">PORQUE NOS ESCOLHER</span>
          <h2 className="section-title">EXCELÊNCIA EM CADA DETALHE</h2>
        </div>
        <div className="benefits-grid">
          {BENEFITS.map((b, i) => (
            <div key={i} className="benefit-card">
              <div className="benefit-icon">{b.icon}</div>
              <h3 className="benefit-title">{b.title}</h3>
              <p className="benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ambientes" className="ambientes animate-on-scroll">
        <div className="section-header">
          <span className="section-label">O QUE FAZEMOS</span>
          <h2 className="section-title">AMBIENTES PLANEJADOS</h2>
        </div>
        <div className="ambientes-grid">
          {AMBIENTES.map((a, i) => (
            <div key={i} className="ambiente-card">
              <img src={a.img} alt={a.name} />
              <div className="ambiente-overlay">
                <span className="ambiente-name">{a.name}</span>
              </div>
              <div className="ambiente-icon">{a.icon}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="como-funciona" className="como-funciona animate-on-scroll">
        <div className="section-header">
          <span className="section-label">NOSSO PROCESSO</span>
          <h2 className="section-title">COMO FUNCIONA</h2>
        </div>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-number">{s.num}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Testimonials testimonials={testimonials} />

      <section id="faq" className="faq animate-on-scroll">
        <div className="section-header">
          <span className="section-label">DÚVIDAS FREQUENTES</span>
          <h2 className="section-title">PERGUNTAS & RESPOSTAS</h2>
        </div>
        <div className="faq-grid">
          {FAQS.map((f, i) => (
            <div key={i} className="faq-item">
              <button className="faq-question" onClick={() => {
                const items = document.querySelectorAll('.faq-item')
                items.forEach((item, idx) => {
                  if (idx !== i) item.classList.remove('open')
                })
                document.querySelectorAll('.faq-item')[i].classList.toggle('open')
              }}>
                <span>{f.q}</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="sobre" className="about">
        <div className="about-grid">
          <div className="about-left">
            <span className="section-label">SOBRE</span>
            <h2 className="about-title">TRADIÇÃO<br />EM MARCENARIA</h2>
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
            <div className="about-photos">
              <img src="https://i.ibb.co/PGz6fmss/download-8.png" alt="Foto 1" className="about-photo photo-1" />
              <img src="https://i.ibb.co/WWDYrJV5/download-6.png" alt="Foto 2" className="about-photo photo-2" />
            </div>
          </div>
        </div>
      </section>

      <section id="contato" className="cta-section animate-on-scroll">
        <div className="cta-content">
          <h2 className="cta-title">Solicite seu orçamento personalizado</h2>
          <p className="cta-subtitle">Conte qual ambiente você deseja planejar e entraremos em contato pelo WhatsApp.</p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Gostaria de fazer um orçamento.`} className="cta-button-large">
            💬 FALAR NO WHATSAPP
          </a>
          <p className="cta-note">Resposta em até 24h • Orçamento gratuito</p>
        </div>
      </section>

      <footer className="footer-main">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <span className="logo-serif">RP</span>
              <span className="logo-text">PLANEJADOS</span>
            </div>
            <p>Transformamos espaços com móveis planejados de alta qualidade, design exclusivo e atendimento personalizado.</p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="footer-whatsapp">
              💬 Falar no WhatsApp
            </a>
          </div>
          <div className="footer-column">
            <h4>NAVEGAÇÃO</h4>
            <a href="#inicio">Início</a>
            <a href="#portfolio">Portfólio</a>
            <a href="#depoimentos">Depoimentos</a>
            <a href="#beneficios">Benefícios</a>
            <a href="#ambientes">Ambientes</a>
          </div>
          <div className="footer-column">
            <h4>CONTATO</h4>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`}>WhatsApp</a>
            <a href="mailto:contato@rpplanejados.com.br">E-mail</a>
            <a href="#contato">Solicitar orçamento</a>
          </div>
          <div className="footer-column">
            <h4>SIGA-NOS</h4>
            <div className="footer-social">
              <a href="https://www.instagram.com/_rplanejados/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="footer-social-icon-link">
                <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Pinterest">📌</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom-bar">
          <p className="copyright">© {new Date().getFullYear()} RP PLANEJADOS. TODOS OS DIREITOS RESERVADOS.</p>
          <p className="footer-areas">📍 Atendemos São Paulo e região</p>
        </div>
      </footer>

      <div className="whatsapp-container">
        <span className="whatsapp-bubble">Solicite seu orçamento</span>
        <button onClick={() => setShowLeadForm(true)} className="whatsapp-btn">
          📞
        </button>
      </div>

      <LeadForm isOpen={showLeadForm} onClose={() => setShowLeadForm(false)} />
    </div>
  )
}