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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await clientService.getClients()
      if (Array.isArray(data)) {
        setClients(data)
      } else if (data && typeof data === 'object') {
        setClients(data.clients || data.data || [])
      } else {
        setClients([])
      }
    } catch (err) {
      console.error('Erro ao carregar clientes:', err)
      setError(err.response?.data?.message || err.message || 'Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await clientService.updateClientStatus(id, newStatus)
      setClients(clients.map(c => c.id === id ? { ...c, status: newStatus } : c))
    } catch (err) {
      alert('Erro ao atualizar status')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Excluir este cliente?')) return
    try {
      await clientService.deleteClient(id)
      setClients(clients.filter(c => c.id !== id))
    } catch (err) {
      alert('Erro ao excluir cliente')
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
        <p>Carregando clientes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: 40, fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
        <Link to="/admin/dashboard" style={{ color: '#666', textDecoration: 'none' }}>← Voltar</Link>
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>
          <button onClick={loadClients} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 40, fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
      <div style={{ marginBottom: 30 }}>
        <Link to="/admin/dashboard" style={{ color: '#666', textDecoration: 'none' }}>← Voltar</Link>
      </div>

      <h1>Clientes ({clients.length})</h1>

      {clients.length === 0 ? (
        <p style={{ color: '#666' }}>Nenhum cliente encontrado.</p>
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
                  <p style={{ margin: 5, color: '#666' }}>📞 {client.phone || 'sem telefone'}</p>
                  <p style={{ margin: 5, color: '#666' }}>💬 {client.message || 'sem mensagem'}</p>
                  <p style={{ margin: 10, fontSize: 12, color: '#888' }}>
                    Criado: {client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : 'data não disponível'}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <select
                    value={client.status || 'novo'}
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