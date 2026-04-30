import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { clientService } from '../services/clientService'

const STATUS_OPTIONS = [
  { value: 'novo', label: 'Novo' },
  { value: 'em_contato', label: 'Em Contato' },
  { value: 'orcamento_enviado', label: 'Orçamento Enviado' },
  { value: 'fechado', label: 'Fechado' },
  { value: 'perdido', label: 'Perdido' }
]

export default function AdminClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await clientService.getClients()
      setClients(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Erro ao carregar clientes:', err)
      setError(err.message || 'Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id, newStatus) {
    await clientService.updateClientStatus(id, newStatus)
    setClients(clients.map(c => c.id === id ? { ...c, status: newStatus } : c))
  }

  async function handleDelete(id) {
    if (!confirm('Excluir?')) return
    await clientService.deleteClient(id)
    setClients(clients.filter(c => c.id !== id))
  }

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <p>Carregando clientes...</p>
    </div>
  )

  if (error) return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>
      <button onClick={loadClients} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Tentar novamente
      </button>
    </div>
  )

  return (
    <div style={{ padding: 40, fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: 30 }}>
        <Link to="/admin/dashboard" style={{ color: '#666', textDecoration: 'none' }}>← Voltar</Link>
      </div>

      <h1>Clientes ({clients.length})</h1>

      {clients.length === 0 ? (
        <p>Nenhum cliente encontrado.</p>
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
                    Criado: {new Date(client.created_at || client.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <select
                    value={client.status}
                    onChange={(e) => handleStatusChange(client.id, e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ddd', fontSize: 14 }}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(client.id)}
                    style={{ background: '#ff4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}