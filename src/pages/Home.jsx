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
  { name: 'Cozinhas', icon: '🍳', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop' },
  { name: 'Dormitórios', icon: '🛏️', img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=600&fit=crop' },
  { name: 'Closets', icon: '👔', img: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600&h=600&fit=crop' },
  { name: 'Salas', icon: '🛋️', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=600&fit=crop' },
  { name: 'Banheiros', icon: '🚿', img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=600&fit=crop' },
  { name: 'Home Office', icon: '💼', img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop' },
  { name: 'Áreas Gourmet', icon: '🍔', img: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600&h=600&fit=crop' },
  { name: 'Comercial', icon: '🏢', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop' }
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

const WHATSAPP_NUMBER = '5511999999999'

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
          <a href="https://wa.me/5511999999999" className="cta-button">ORÇAMENTO</a>
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
            <div className="about-frame">
              <span className="rp-large">RP</span>
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
              <a href="#" aria-label="Instagram">📷</a>
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

      <button onClick={() => setShowLeadForm(true)} className="whatsapp-float whatsapp-blink">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382C17.208 14.246 16.685 13.92 16.233 13.737C15.78 13.555 15.384 13.443 15.042 13.443C14.352 13.443 13.812 13.627 13.412 13.992C13.012 14.357 12.732 14.886 12.572 15.577L11.817 18.032C11.621 18.768 11.217 19.34 10.605 19.749C9.993 20.157 9.333 20.361 8.625 20.361C7.917 20.361 7.248 20.14 6.618 19.698C5.988 19.256 5.481 18.664 5.098 17.921C4.714 17.179 4.522 16.339 4.522 15.401C4.522 14.463 4.732 13.605 5.152 12.827C5.572 12.05 6.108 11.404 6.76 10.889C7.412 10.375 8.13 10.006 8.915 9.773C9.7 9.541 10.469 9.425 11.222 9.425C11.975 9.425 12.705 9.55 13.41 9.801C14.115 10.052 14.703 10.465 15.175 11.041L16.565 10.037C17.213 9.253 17.617 8.317 17.776 7.229C17.863 6.509 17.824 5.865 17.658 5.297C17.492 4.729 17.224 4.245 16.854 3.845C16.433 3.395 15.944 3.17 15.387 3.17C14.83 3.17 14.341 3.395 13.92 3.845L12.798 4.967C12.577 5.188 12.439 5.465 12.385 5.797C12.331 6.13 12.376 6.443 12.52 6.738C12.801 7.438 13.239 8.252 13.834 9.179C14.43 10.107 15.074 10.989 15.766 11.825C16.458 12.661 17.172 13.432 17.907 14.138C18.641 14.845 19.267 15.417 19.784 15.855C20.301 16.293 20.652 16.673 20.838 16.995C21.023 17.317 21.095 17.631 20.432 18.263L19.2 19.495C18.884 19.811 18.484 20.045 18 20.195C17.516 20.345 17.012 20.42 16.488 20.42C15.964 20.42 15.46 20.345 14.976 20.195C14.492 20.045 14.092 19.811 13.776 19.495C13.567 19.286 13.401 19.034 13.277 18.74C13.154 18.446 13.092 18.16 13.092 17.882C13.092 17.604 13.154 17.318 13.277 17.024C13.401 16.73 13.567 16.478 13.776 16.269C13.985 16.06 14.228 15.894 14.505 15.772C14.782 15.65 15.068 15.588 15.363 15.588C15.658 15.588 15.944 15.65 16.221 15.772C16.498 15.894 16.741 16.06 16.95 16.269L17.472 14.382Z" fill="white" />
          <path d="M8.557 7.337C8.185 6.965 7.679 6.779 7.038 6.779C6.397 6.779 5.891 6.965 5.519 7.337C5.147 7.709 4.961 8.215 4.961 8.856C4.961 9.497 5.147 10.003 5.519 10.375L6.437 11.293C7.213 11.877 7.989 12.159 8.765 12.159C9.541 12.159 10.317 11.877 11.093 11.313L11.299 11.107C11.643 10.763 11.815 10.337 11.815 9.828C11.815 9.319 11.643 8.893 11.299 8.549C10.955 8.205 10.529 8.033 10.02 8.033C9.511 8.033 9.085 8.205 8.741 8.549L8.557 7.337Z" fill="white" />
        </svg>
      </button>

      <LeadForm isOpen={showLeadForm} onClose={() => setShowLeadForm(false)} />
    </div>
  )
}