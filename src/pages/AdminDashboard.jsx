import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { projectService } from '../services/projectService'

export default function AdminDashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { loadProjects() }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await projectService.getAllProjects()
      setProjects(data)
    } catch (err) {
      console.error('Erro ao carregar projetos:', err)
      setError(err.response?.data?.error || 'Erro ao carregar projetos')
    }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (confirm('Excluir projeto?')) {
      await projectService.deleteProject(id)
      loadProjects()
    }
  }

  const handleToggle = async (id) => {
    await projectService.togglePublish(id)
    loadProjects()
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <header style={{ backgroundColor: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, backgroundColor: '#FF6A4D', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>RP</span>
            </div>
          </Link>
          <span style={{ color: '#888' }}>|</span>
          <nav style={{ display: 'flex', gap: 24 }}>
            <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: '#333', fontWeight: 500 }}>Projetos</Link>
            <Link to="/admin/clientes" style={{ textDecoration: 'none', color: '#888' }}>Clientes</Link>
            <Link to="/admin/testimonials" style={{ textDecoration: 'none', color: '#888' }}>Depoimentos</Link>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, color: '#666' }}>Olá, {user?.name}</span>
          <button onClick={handleLogout} style={{ fontSize: 14, color: '#FF6A4D', background: 'none', border: 'none', cursor: 'pointer' }}>Sair</button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: 32 }}>
        {error && <div style={{ padding: 12, backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 8, marginBottom: 16 }}>{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontFamily: 'Playfair Display, serif' }}>Projetos</h1>
          <Link to="/admin/projetos/novo" style={{ backgroundColor: '#FF6A4D', color: 'white', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>+ Novo Projeto</Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>Carregando...</div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, backgroundColor: 'white', borderRadius: 16 }}>
            <p style={{ color: '#888', marginBottom: 16 }}>Nenhum projeto</p>
            <Link to="/admin/projetos/novo" style={{ backgroundColor: '#FF6A4D', color: 'white', padding: '12px 24px', borderRadius: 8, textDecoration: 'none' }}>Criar primeiro</Link>
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: 14, fontWeight: 500, color: '#666' }}>Projeto</th>
                  <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: 14, fontWeight: 500, color: '#666' }}>Categoria</th>
                  <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: 14, fontWeight: 500, color: '#666' }}>Status</th>
                  <th style={{ textAlign: 'right', padding: '16px 24px', fontSize: 14, fontWeight: 500, color: '#666' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id} style={{ borderTop: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 48, height: 48, backgroundColor: '#eee', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                          {p.coverImageUrl && <img src={p.coverImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 500 }}>{p.title}</p>
                          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>{p.description?.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: 14, color: '#666' }}>{p.category}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 500, backgroundColor: p.published ? '#DCFCE7' : '#F3F4F6', color: p.published ? '#16A34A' : '#666' }}>
                        {p.published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <Link to={`/admin/projetos/editar/${p.id}`} style={{ padding: 8, color: '#888', textDecoration: 'none' }}>✏️</Link>
                        <button onClick={() => handleToggle(p.id)} style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer' }}>👁</button>
                        <button onClick={() => handleDelete(p.id)} style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}