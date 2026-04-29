import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function AdminClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    fetch('http://localhost:3000/api/admin/clients', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (!res.ok) throw new Error('Erro: ' + res.status)
      return res.json()
    })
    .then(data => {
      setClients(data)
      setLoading(false)
    })
    .catch(err => {
      setError(err.message)
      setLoading(false)
    })
  }, [])

  function handleDelete(id) {
    if (!confirm('Excluir?')) return
    const token = localStorage.getItem('token')
    fetch(`http://localhost:3000/api/admin/clients/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => setClients(clients.filter(c => c.id !== id)))
  }

  if (loading) return <div style={{ padding: 40 }}>Carregando...</div>
  if (error) return <div style={{ padding: 40 }}>Erro: {error}</div>

  return (
    <div style={{ padding: 40, fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: 30 }}>
        <Link to="/admin/dashboard" style={{ color: '#666', textDecoration: 'none' }}>← Voltar</Link>
      </div>
      
      <h1>Clientes ({clients.length})</h1>
      
      {clients.length === 0 ? (
        <p>Nenhum cliente ainda.</p>
      ) : (
        <div style={{ display: 'grid', gap: 15 }}>
          {clients.map(client => (
            <div key={client.id} style={{ 
              border: '1px solid #ddd', 
              padding: 20, 
              borderRadius: 8,
              backgroundColor: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px' }}>{client.name}</h3>
                  <p style={{ margin: 5, color: '#666' }}>📧 {client.email || 'sem email'}</p>
                  <p style={{ margin: 5, color: '#666' }}>📞 {client.phone}</p>
                  <p style={{ margin: 5, color: '#666' }}>💬 {client.message || 'sem mensagem'}</p>
                  <p style={{ margin: 10, fontSize: 12, color: '#888' }}>
                    Status: <strong>{client.status}</strong> | Criado: {new Date(client.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  onClick={() => handleDelete(client.id)}
                  style={{ background: '#ff4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}