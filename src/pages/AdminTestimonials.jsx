import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { testimonialService } from '../services/testimonialService'

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#F9FAFB' },
  header: { backgroundColor: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  logoContainer: { display: 'flex', alignItems: 'center', gap: 16 },
  logo: { display: 'flex', alignItems: 'center', gap: 8 },
  logoBox: { width: 32, height: 32, backgroundColor: '#FF6A4D', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  divider: { color: '#888' },
  nav: { display: 'flex', gap: 24 },
  navLink: { textDecoration: 'none', fontSize: 14, fontWeight: 500 },
  userSection: { display: 'flex', alignItems: 'center', gap: 16 },
  userName: { fontSize: 14, color: '#666' },
  logoutBtn: { fontSize: 14, color: '#FF6A4D', background: 'none', border: 'none', cursor: 'pointer' },
  main: { maxWidth: 900, margin: '0 auto', padding: 32 },
  pageTitle: { margin: '0 0 8px', fontSize: 24, fontFamily: 'Playfair Display, serif' },
  pageDesc: { color: '#666', fontSize: 14, marginBottom: 24 },
  formCard: { backgroundColor: 'white', borderRadius: 12, padding: 24, marginBottom: 24 },
  formTitle: { margin: '0 0 16px', fontSize: 16, fontWeight: 600 },
  formRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  input: { flex: 1, minWidth: 200, padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14 },
  submitBtn: { padding: '12px 24px', backgroundColor: '#FF6A4D', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 },
  card: { backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  cardImage: { width: '100%', height: 200, objectFit: 'cover', backgroundColor: '#f3f4f6' },
  cardContent: { padding: 16 },
  cardName: { fontSize: 14, fontWeight: 500, color: '#333', marginBottom: 12 },
  deleteBtn: { width: '100%', padding: 8, backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' },
  loading: { textAlign: 'center', padding: 60, color: '#666' },
  empty: { textAlign: 'center', padding: 60, backgroundColor: 'white', borderRadius: 16 }
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [newUrl, setNewUrl] = useState('')
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await testimonialService.getTestimonials()
      setTestimonials(data)
    } catch (err) {
      console.error('Erro:', err)
      setError('Erro ao carregar depoimentos')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newUrl.trim()) return

    setSaving(true)
    try {
      await testimonialService.addTestimonial({ imageUrl: newUrl, name: newName })
      setNewUrl('')
      setNewName('')
      loadTestimonials()
    } catch (err) {
      alert('Erro ao adicionar: ' + (err.response?.data?.error || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Excluir depoimento?')) return
    try {
      await testimonialService.deleteTestimonial(id)
      loadTestimonials()
    } catch (err) {
      alert('Erro ao excluir')
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <Link to="/" style={styles.logo}>
            <div style={styles.logoBox}>
              <span style={styles.logoText}>RP</span>
            </div>
          </Link>
          <span style={styles.divider}>|</span>
          <nav style={styles.nav}>
            <Link to="/admin/dashboard" style={{ ...styles.navLink, color: '#888' }}>Projetos</Link>
            <Link to="/admin/clientes" style={{ ...styles.navLink, color: '#888' }}>Clientes</Link>
            <Link to="/admin/testimonials" style={{ ...styles.navLink, color: '#333', fontWeight: 600 }}>Depoimentos</Link>
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        <h1 style={styles.pageTitle}>Depoimentos</h1>
        <p style={styles.pageDesc}>Adicione imagens de depoimentos do WhatsApp para o carrossel da homepage</p>

        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Adicionar novo depoimento</h3>
          <form onSubmit={handleAdd}>
            <div style={styles.formRow}>
              <input
                type="text"
                placeholder="Nome do cliente (opcional)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={styles.input}
              />
              <input
                type="url"
                placeholder="URL da imagem do depoimento"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                required
                style={styles.input}
              />
              <button type="submit" disabled={saving} style={styles.submitBtn}>
                {saving ? 'Adicionando...' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>

        {error && <div style={{ padding: 12, backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 8, marginBottom: 16 }}>{error}</div>}

        {loading ? (
          <div style={styles.loading}>Carregando...</div>
        ) : testimonials.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ color: '#888', marginBottom: 8 }}>Nenhum depoimento cadastrado</p>
            <p style={{ color: '#999', fontSize: 13 }}>Adicione a URL de uma imagem para criar o primeiro depoimento</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {testimonials.map(t => (
              <div key={t.id} style={styles.card}>
                <img src={t.image_url || t.imageUrl} alt={t.name || 'Depoimento'} style={styles.cardImage} />
                <div style={styles.cardContent}>
                  <div style={styles.cardName}>{t.name || 'Sem nome'}</div>
                  <button onClick={() => handleDelete(t.id)} style={styles.deleteBtn}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}