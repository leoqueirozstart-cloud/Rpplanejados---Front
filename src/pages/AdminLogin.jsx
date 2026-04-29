import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Preencha todos os campos')
    try {
      setLoading(true)
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F0E6', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400, backgroundColor: 'white', borderRadius: 16, padding: 40, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24, textDecoration: 'none' }}>
            <div style={{ width: 48, height: 48, backgroundColor: '#FF6A4D', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: 24, fontFamily: 'Playfair Display, serif' }}>RP</span>
            </div>
          </Link>
          <h1 style={{ margin: 0, fontSize: 24, fontFamily: 'Playfair Display, serif', color: '#3B3B3B' }}>Área Administrativa</h1>
          <p style={{ margin: '8px 0 0', color: '#888' }}>Faça login para gerenciar</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#374151' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" disabled={loading}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 16, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#374151' }}>Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" disabled={loading}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 16, boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '14px', backgroundColor: '#FF6A4D', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link to="/" style={{ fontSize: 14, color: '#FF6A4D', textDecoration: 'none' }}>← Voltar ao site</Link>
        </div>
      </div>
    </div>
  )
}