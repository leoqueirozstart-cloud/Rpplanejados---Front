import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clientService } from '../services/clientService'

const API_URL = import.meta.env.VITE_API_URL || 'https://ricardo-rpplanejados.vercel.app'

function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [newUrl, setNewUrl] = useState('')
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/testimonials`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setTestimonials(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newUrl.trim()) return

    setSaving(true)
    try {
      console.log('Enviando para:', `${API_URL}/api/admin/testimonials`)
      const res = await fetch(`${API_URL}/api/admin/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrl: newUrl, name: newName })
      })
      console.log('Response:', res.status)
      if (res.ok) {
        setNewUrl('')
        setNewName('')
        loadTestimonials()
      } else {
        const err = await res.json()
        alert('Erro: ' + (err.error || 'Erro ao adicionar'))
      }
    } catch (e) {
      console.error(e)
      alert('Erro de conexão')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Excluir este depoimento?')) return
    try {
      const res = await fetch(`${API_URL}/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        loadTestimonials()
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <span className="logo-serif">RP</span>
            <span className="logo-text">PLANEJADOS</span>
          </div>
          <nav className="admin-nav">
            <Link to="/admin/dashboard">Projetos</Link>
            <Link to="/admin/clientes">Clientes</Link>
            <Link to="/admin/testimonials" className="active">Depoimentos</Link>
            <button onClick={() => {
              localStorage.removeItem('token')
              navigate('/admin/login')
            }} className="logout-btn">Sair</button>
          </nav>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-content">
          <div className="page-header">
            <h1>Depoimentos</h1>
            <p>Gerencie as imagens de depoimentos que aparecem no carrossel da homepage</p>
          </div>

          <form onSubmit={handleAdd} className="add-form">
            <input
              type="text"
              placeholder="Nome do cliente (opcional)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="form-input"
            />
            <input
              type="url"
              placeholder="URL da imagem do depoimento"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              required
              className="form-input"
            />
            <button type="submit" disabled={saving} className="submit-btn">
              {saving ? 'Adicionando...' : 'Adicionar Depoimento'}
            </button>
          </form>

          {loading ? (
            <div className="loading">Carregando...</div>
          ) : testimonials.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum depoimento cadastrado</p>
              <p className="hint">Adicione a URL de uma imagem para criar o primeiro depoimento</p>
            </div>
          ) : (
            <div className="testimonials-grid">
              {testimonials.map(t => (
                <div key={t.id} className="testimonial-card">
                  <img src={t.image_url || t.imageUrl} alt={t.name || 'Depoimento'} className="testimonial-img" />
                  <div className="testimonial-info">
                    <span className="testimonial-name">{t.name || 'Sem nome'}</span>
                  </div>
                  <button onClick={() => handleDelete(t.id)} className="delete-btn">
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <style>{`
        .admin-page {
          min-height: 100vh;
          background: #f5f5f5;
        }

        .admin-header {
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .admin-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .admin-logo {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .logo-serif {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #FF6A4D;
        }

        .logo-text {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 2px;
          color: #3B3B3B;
        }

        .admin-nav {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .admin-nav a {
          color: #666;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          padding: 8px 0;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .admin-nav a:hover, .admin-nav a.active {
          color: #FF6A4D;
          border-bottom-color: #FF6A4D;
        }

        .logout-btn {
          background: none;
          border: none;
          color: #666;
          font-size: 14px;
          cursor: pointer;
          padding: 8px 0;
        }

        .logout-btn:hover {
          color: #FF6A4D;
        }

        .admin-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .admin-content {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .page-header {
          margin-bottom: 32px;
        }

        .page-header h1 {
          font-size: 28px;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .page-header p {
          color: #666;
          font-size: 14px;
        }

        .add-form {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .form-input {
          flex: 1;
          min-width: 200px;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-input:focus {
          outline: none;
          border-color: #FF6A4D;
        }

        .submit-btn {
          padding: 12px 24px;
          background: #FF6A4D;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #e55a3d;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading {
          text-align: center;
          padding: 48px;
          color: #666;
        }

        .empty-state {
          text-align: center;
          padding: 48px;
          color: #666;
        }

        .empty-state .hint {
          font-size: 13px;
          color: #999;
          margin-top: 8px;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .testimonial-card {
          background: #f9f9f9;
          border-radius: 12px;
          overflow: hidden;
          padding: 12px;
        }

        .testimonial-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .testimonial-info {
          padding: 0 4px;
        }

        .testimonial-name {
          font-size: 14px;
          color: #333;
          font-weight: 500;
        }

        .delete-btn {
          margin-top: 12px;
          width: 100%;
          padding: 8px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .delete-btn:hover {
          background: #fecaca;
        }
      `}</style>
    </div>
  )
}

export default TestimonialsManager