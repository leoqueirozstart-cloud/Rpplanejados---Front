import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { clientService } from '../services/clientService'

const STATUS_OPTIONS = [
  { value: 'novo', label: 'Novo' },
  { value: 'em_contato', label: 'Em contato' },
  { value: 'orcamento_enviado', label: 'Orçamento enviado' },
  { value: 'fechado', label: 'Fechado' },
  { value: 'perdido', label: 'Perdido' }
]

const STATUS_COLORS = {
  novo: '#3B82F6',
  em_contato: '#F59E0B',
  orcamento_enviado: '#8B5CF6',
  fechado: '#10B981',
  perdido: '#EF4444'
}

export default function AdminClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    loadClients()
  }, [])

  async function loadClients() {
    try {
      setLoading(true)
      setError(null)

      console.log('Carregando clientes...')

      const result = await clientService.getClients()

      console.log('Resposta clientes:', result)

      let clientsArray = []

      if (Array.isArray(result)) {
        clientsArray = result
      } else if (result && typeof result === 'object') {
        clientsArray = result.clients || result.data || []
      }

      setClients(clientsArray || [])
    } catch (err) {
      console.error('Erro ao carregar clientes:', err)
      setError(err.response?.data?.error || err.message || 'Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      setUpdatingId(id)
      await clientService.updateClientStatus(id, newStatus)
      setClients(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
    } catch (err) {
      console.error('Erro ao alterar status:', err)
      alert('Erro ao alterar status: ' + (err.message || 'Tente novamente'))
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return

    try {
      setDeletingId(id)
      await clientService.deleteClient(id)
      setClients(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Erro ao excluir:', err)
      alert('Erro ao excluir: ' + (err.message || 'Tente novamente'))
    } finally {
      setDeletingId(null)
    }
  }

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const searchLower = search.toLowerCase()
      const matchesSearch = !search ||
        client.name?.toLowerCase().includes(searchLower) ||
        client.email?.toLowerCase().includes(searchLower) ||
        client.phone?.includes(search)

      const matchesStatus = statusFilter === 'todos' || client.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [clients, search, statusFilter])

  function formatPhone(phone) {
    if (!phone) return null
    const clean = phone.replace(/\D/g, '')
    if (clean.length >= 10) {
      return `https://wa.me/55${clean}`
    }
    return null
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'Data não disponível'
    try {
      return new Date(dateStr).toLocaleString('pt-BR')
    } catch {
      return 'Data não disponível'
    }
  }

  function getStatusLabel(status) {
    return STATUS_OPTIONS.find(s => s.value === status)?.label || status
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Carregando clientes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>Erro</h2>
          <p>{error}</p>
          <button onClick={loadClients} style={styles.retryButton}>
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/admin/dashboard" style={styles.backLink}>← Voltar</Link>
        <div>
          <h1 style={styles.title}>Clientes</h1>
          <p style={styles.subtitle}>Leads recebidos pelo formulário de orçamento</p>
        </div>
        <button onClick={loadClients} style={styles.refreshButton}>
          Atualizar
        </button>
      </div>

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Buscar por nome, email ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="todos">Todos os status</option>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {filteredClients.length === 0 ? (
        <div style={styles.empty}>
          <p>Nenhum cliente encontrado.</p>
          {search || statusFilter !== 'todos' ? (
            <button
              onClick={() => { setSearch(''); setStatusFilter('todos') }}
              style={styles.clearButton}
            >
              Limpar filtros
            </button>
          ) : null}
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredClients.map(client => {
            const waLink = formatPhone(client.phone)
            return (
              <div key={client.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.clientName}>{client.name}</h3>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: STATUS_COLORS[client.status] || '#666'
                  }}>
                    {getStatusLabel(client.status)}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  {client.phone && (
                    <div style={styles.field}>
                      <strong>Telefone:</strong> {client.phone}
                      {waLink && (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.whatsappButton}
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  )}
                  {client.email && (
                    <div style={styles.field}>
                      <strong>Email:</strong> {client.email}
                    </div>
                  )}
                  {client.message && (
                    <div style={styles.field}>
                      <strong>Mensagem:</strong>
                      <p style={styles.message}>{client.message}</p>
                    </div>
                  )}
                  <div style={styles.field}>
                    <strong>Data:</strong> {formatDate(client.created_at)}
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <select
                    value={client.status}
                    onChange={(e) => handleStatusChange(client.id, e.target.value)}
                    disabled={updatingId === client.id}
                    style={styles.statusSelect}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(client.id)}
                    disabled={deletingId === client.id}
                    style={styles.deleteButton}
                  >
                    {deletingId === client.id ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .admin-clients-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f9fafb',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  backLink: {
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '14px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '4px 0 0 0'
  },
  refreshButton: {
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px'
  },
  select: {
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white'
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e5e7eb',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px'
  },
  error: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#fef2f2',
    borderRadius: '8px'
  },
  retryButton: {
    padding: '10px 20px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280'
  },
  clearButton: {
    marginTop: '12px',
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '16px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '8px'
  },
  clientName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    color: 'white'
  },
  cardBody: {
    marginBottom: '16px'
  },
  field: {
    marginBottom: '8px',
    fontSize: '14px',
    color: '#4b5563'
  },
  message: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: '#6b7280',
    whiteSpace: 'pre-wrap'
  },
  cardFooter: {
    display: 'flex',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb'
  },
  statusSelect: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white'
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  whatsappButton: {
    display: 'inline-block',
    marginLeft: '8px',
    padding: '4px 10px',
    backgroundColor: '#25D366',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  }
}