import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { clientService } from '../services/clientService'

const STATUS_CONFIG = {
  novo: { label: 'Novo', className: 'status-novo', icon: '✨' },
  em_contato: { label: 'Em contato', className: 'status-contato', icon: '💬' },
  orcamento_enviado: { label: 'Orçamento enviado', className: 'status-orcamento', icon: '📄' },
  fechado: { label: 'Fechado', className: 'status-fechado', icon: '🎉' },
  perdido: { label: 'Perdido', className: 'status-perdido', icon: '❌' }
}

const STATS_CONFIG = {
  total: { icon: '👥', color: '#6366f1', bg: '#e0e7ff' },
  novo: { icon: '✨', color: '#3b82f6', bg: '#dbeafe' },
  em_contato: { icon: '💬', color: '#f59e0b', bg: '#fef3c7' },
  orcamento_enviado: { icon: '📄', color: '#8b5cf6', bg: '#ede9fe' },
  fechado: { icon: '🎉', color: '#10b981', bg: '#d1fae5' },
  perdido: { icon: '❌', color: '#ef4444', bg: '#fee2e2' }
}

const STATUS_OPTIONS = [
  { value: 'novo', label: 'Novo' },
  { value: 'em_contato', label: 'Em contato' },
  { value: 'orcamento_enviado', label: 'Orçamento enviado' },
  { value: 'fechado', label: 'Fechado' },
  { value: 'perdido', label: 'Perdido' }
]

function ClientModal({ client, onClose, onStatusChange }) {
  const [localStatus, setLocalStatus] = useState(client.status)
  const [updating, setUpdating] = useState(false)

  const handleStatusChange = async (newStatus) => {
    setUpdating(true)
    setLocalStatus(newStatus)
    await onStatusChange(client.id, newStatus)
    setUpdating(false)
  }

  const waLink = getWhatsAppLink(client.phone, client.name)
  const telLink = getTelLink(client.phone)
  const statusInfo = STATUS_CONFIG[localStatus] || STATUS_CONFIG.novo

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>Detalhes do Lead</h2>
          <button onClick={onClose} style={modalStyles.closeButton}>✕</button>
        </div>

        <div style={modalStyles.content}>
          <div style={modalStyles.fieldGroup}>
            <span style={modalStyles.label}>Nome</span>
            <span style={modalStyles.value}>{client.name}</span>
          </div>

          <div style={modalStyles.fieldGroup}>
            <span style={modalStyles.label}>Telefone</span>
            <span style={modalStyles.value}>{client.phone || 'Não informado'}</span>
          </div>

          <div style={modalStyles.fieldGroup}>
            <span style={modalStyles.label}>E-mail</span>
            <span style={modalStyles.value}>{client.email || 'Não informado'}</span>
          </div>

          <div style={modalStyles.fieldGroup}>
            <span style={modalStyles.label}>Status</span>
            <span style={{ ...modalStyles.statusBadge, ...modalStyles[statusInfo.className] }}>
              {statusInfo.label}
            </span>
          </div>

          <div style={modalStyles.fieldGroup}>
            <span style={modalStyles.label}>Mensagem</span>
            <p style={modalStyles.message}>{client.message || 'Sem mensagem'}</p>
          </div>

          <div style={modalStyles.fieldGroup}>
            <span style={modalStyles.label}>Data de criação</span>
            <span style={modalStyles.value}>{formatDate(client.created_at)}</span>
          </div>

          {client.updated_at && (
            <div style={modalStyles.fieldGroup}>
              <span style={modalStyles.label}>Última atualização</span>
              <span style={modalStyles.value}>{formatDate(client.updated_at)}</span>
            </div>
          )}

          <div style={modalStyles.actions}>
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                style={modalStyles.whatsappButton}
              >
                WhatsApp
              </a>
            )}
            {telLink && (
              <a href={telLink} style={modalStyles.callButton}>
                Ligar
              </a>
            )}
          </div>

          <div style={modalStyles.statusSection}>
            <span style={modalStyles.label}>Alterar status</span>
            <select
              value={localStatus || 'novo'}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              style={modalStyles.statusSelect}
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={modalStyles.footer}>
          <button onClick={onClose} style={modalStyles.closeModalButton}>
            Fechar
          </button>
        </div>
      </div>
      <style>{modalGlobalStyles}</style>
    </div>
  )
}

export default function AdminClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [sortBy, setSortBy] = useState('recentes')
  const [updatingId, setUpdatingId] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && selectedClient) {
      setSelectedClient(null)
    }
  }, [selectedClient])

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

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
      setUpdatingId(id)
      await clientService.updateClientStatus(id, newStatus)
      setClients(clients.map(c => c.id === id ? { ...c, status: newStatus } : c))
      if (selectedClient && selectedClient.id === id) {
        setSelectedClient({ ...selectedClient, status: newStatus })
      }
    } catch (err) {
      alert('Erro ao atualizar status')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir este cliente?')) return
    try {
      await clientService.deleteClient(id)
      setClients(clients.filter(c => c.id !== id))
    } catch (err) {
      alert('Erro ao excluir cliente')
    }
  }

  const stats = useMemo(() => {
    return {
      total: clients.length,
      novo: clients.filter(c => c.status === 'novo').length,
      em_contato: clients.filter(c => c.status === 'em_contato').length,
      orcamento_enviado: clients.filter(c => c.status === 'orcamento_enviado').length,
      fechado: clients.filter(c => c.status === 'fechado').length,
      perdido: clients.filter(c => c.status === 'perdido').length
    }
  }, [clients])

  const filteredClients = useMemo(() => {
    let result = [...clients]

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(c =>
        c.name?.toLowerCase().includes(searchLower) ||
        c.email?.toLowerCase().includes(searchLower) ||
        c.phone?.includes(search)
      )
    }

    if (statusFilter !== 'todos') {
      result = result.filter(c => c.status === statusFilter)
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'recentes':
          return new Date(b.created_at) - new Date(a.created_at)
        case 'antigos':
          return new Date(a.created_at) - new Date(b.created_at)
        case 'nome_az':
          return (a.name || '').localeCompare(b.name || '')
        default:
          return 0
      }
    })

    return result
  }, [clients, search, statusFilter, sortBy])

  function formatPhone(phone) {
    if (!phone) return null
    const clean = phone.replace(/\D/g, '')
    return clean.length >= 10 ? clean : null
  }

  function getWhatsAppLink(phone, name) {
    const clean = formatPhone(phone)
    if (!clean) return null
    const message = `Olá, ${name}! Recebemos sua solicitação de orçamento pela RP Planejados. Como posso te ajudar?`
    return `https://wa.me/55${clean}?text=${encodeURIComponent(message)}`
  }

  function getTelLink(phone) {
    const clean = formatPhone(phone)
    return clean ? `tel:${clean}` : null
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'Data não disponível'
    try {
      return new Date(dateStr).toLocaleString('pt-BR')
    } catch {
      return 'Data não disponível'
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <p>Carregando clientes...</p>
        </div>
        <style>{spinnerKeyframes}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorState}>
          <p style={styles.errorText}>{error}</p>
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
        <div>
          <Link to="/admin/dashboard" style={styles.backLink}>← Voltar</Link>
          <h1 style={styles.title}>Clientes</h1>
          <p style={styles.subtitle}>Gerencie os leads recebidos pelo formulário de orçamento</p>
        </div>
        <button onClick={loadClients} style={styles.refreshButton}>
          Atualizar
        </button>
      </div>

      <div className="clients-stats-grid" style={styles.statsGrid}>
        <div className="stat-card-premium" style={{ '--stat-color': STATS_CONFIG.total.color }}>
          <div className="premium-icon" style={{ '--icon-bg': STATS_CONFIG.total.color, '--icon-bg-end': STATS_CONFIG.total.color }}>
            {STATS_CONFIG.total.icon}
          </div>
          <span style={styles.statValue}>{stats.total}</span>
          <span style={styles.statLabel}>Total de leads</span>
        </div>
        <div className="stat-card-premium" style={{ '--stat-color': STATS_CONFIG.novo.color }}>
          <div className="premium-icon" style={{ '--icon-bg': STATS_CONFIG.novo.color, '--icon-bg-end': '#1d4ed8' }}>
            {STATS_CONFIG.novo.icon}
          </div>
          <span style={styles.statValue}>{stats.novo}</span>
          <span style={styles.statLabel}>Novos</span>
        </div>
        <div className="stat-card-premium" style={{ '--stat-color': STATS_CONFIG.em_contato.color }}>
          <div className="premium-icon" style={{ '--icon-bg': STATS_CONFIG.em_contato.color, '--icon-bg-end': '#b45309' }}>
            {STATS_CONFIG.em_contato.icon}
          </div>
          <span style={styles.statValue}>{stats.em_contato}</span>
          <span style={styles.statLabel}>Em contato</span>
        </div>
        <div className="stat-card-premium" style={{ '--stat-color': STATS_CONFIG.orcamento_enviado.color }}>
          <div className="premium-icon" style={{ '--icon-bg': STATS_CONFIG.orcamento_enviado.color, '--icon-bg-end': '#6d28d9' }}>
            {STATS_CONFIG.orcamento_enviado.icon}
          </div>
          <span style={styles.statValue}>{stats.orcamento_enviado}</span>
          <span style={styles.statLabel}>Orçamento enviado</span>
        </div>
        <div className="stat-card-premium" style={{ '--stat-color': STATS_CONFIG.fechado.color }}>
          <div className="premium-icon" style={{ '--icon-bg': STATS_CONFIG.fechado.color, '--icon-bg-end': '#047857' }}>
            {STATS_CONFIG.fechado.icon}
          </div>
          <span style={styles.statValue}>{stats.fechado}</span>
          <span style={styles.statLabel}>Fechados</span>
        </div>
        <div className="stat-card-premium" style={{ '--stat-color': STATS_CONFIG.perdido.color }}>
          <div className="premium-icon" style={{ '--icon-bg': STATS_CONFIG.perdido.color, '--icon-bg-end': '#b91c1c' }}>
            {STATS_CONFIG.perdido.icon}
          </div>
          <span style={styles.statValue}>{stats.perdido}</span>
          <span style={styles.statLabel}>Perdidos</span>
        </div>
      </div>

      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Buscar por nome, e-mail ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-premium"
          style={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select-premium"
          style={styles.select}
        >
          <option value="todos">Todos os status</option>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select-premium"
          style={styles.select}
        >
          <option value="recentes">Mais recentes</option>
          <option value="antigos">Mais antigos</option>
          <option value="nome_az">Nome A-Z</option>
        </select>
      </div>

      {filteredClients.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📋</div>
          <h3 style={styles.emptyTitle}>Nenhum cliente encontrado</h3>
          <p style={styles.emptyText}>Quando alguém preencher o formulário de orçamento, aparecerá aqui.</p>
        </div>
      ) : (
        <div className="clients-grid" style={styles.grid}>
          {filteredClients.map((client, index) => {
            const waLink = getWhatsAppLink(client.phone, client.name)
            const telLink = getTelLink(client.phone)
            const statusInfo = STATUS_CONFIG[client.status] || STATUS_CONFIG.novo
            const initials = client.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?'

            return (
              <div 
                key={client.id} 
                className="client-card"
                style={{ ...styles.card, animationDelay: `${index * 0.05}s` }}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.avatarContainer}>
                    <div className="client-avatar">{initials}</div>
                    <div>
                      <h3 style={styles.clientName}>{client.name}</h3>
                      <span style={styles.dateText}>
                        {formatDate(client.created_at)}
                      </span>
                    </div>
                  </div>
                  <span style={{ ...styles.statusBadge, ...styles[statusInfo.className] }}>
                    {statusInfo.icon} {statusInfo.label}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  {client.phone && (
                    <div style={styles.field}>
                      <span style={styles.fieldLabel}>📱 Telefone:</span>
                      <span style={styles.fieldValue}>{client.phone}</span>
                    </div>
                  )}
                  {client.email && (
                    <div style={styles.field}>
                      <span style={styles.fieldLabel}>✉️ E-mail:</span>
                      <span style={styles.fieldValue}>{client.email}</span>
                    </div>
                  )}
                  {client.message && (
                    <div style={styles.messageContainer}>
                      <span style={styles.fieldLabel}>💬 Mensagem:</span>
                      <p style={styles.message}>
                        {client.message.length > 80
                          ? client.message.substring(0, 80) + '...'
                          : client.message}
                      </p>
                    </div>
                  )}
                </div>

                <div style={styles.cardActions}>
                  {waLink && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-premium btn-whatsapp"
                      style={styles.whatsappButton}
                    >
                      💬 WhatsApp
                    </a>
                  )}
                  {telLink && (
                    <a href={telLink} className="btn-premium btn-call" style={styles.callButton}>
                      📞 Ligar
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedClient(client)}
                    className="btn-premium btn-details"
                    style={styles.detailsButton}
                  >
                    👁️ Ver detalhes
                  </button>
                </div>

                <div style={styles.cardFooter}>
                  <select
                    value={client.status || 'novo'}
                    onChange={(e) => handleStatusChange(client.id, e.target.value)}
                    disabled={updatingId === client.id}
                    className="status-select-premium"
                    style={styles.statusSelect}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="btn-premium btn-delete"
                    style={styles.deleteButton}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedClient && (
        <ClientModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <style>{globalStyles}</style>
    </div>
  )
}

const spinnerKeyframes = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const globalStyles = `
  * {
    box-sizing: border-box;
  }
  .status-novo {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  }
  .status-contato {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
  }
  .status-orcamento {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
  }
  .status-fechado {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  }
  .status-perdido {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  }
  .client-card {
    background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.4s ease-out forwards;
    position: relative;
    overflow: hidden;
  }
  .client-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .client-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: #cbd5e1;
  }
  .client-card:hover::before {
    opacity: 1;
  }
  .stat-card-premium {
    background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .stat-card-premium::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--stat-color, #3b82f6);
  }
  .stat-card-premium:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  .premium-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-bottom: 12px;
    background: linear-gradient(135deg, var(--icon-bg, #3b82f6) 0%, var(--icon-bg-end, #2563eb) 100%);
    color: white;
  }
  .btn-premium {
    padding: 10px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .btn-whatsapp {
    background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
    color: white;
  }
  .btn-whatsapp:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
  }
  .btn-call {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
  }
  .btn-call:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
  .btn-details {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    color: #475569;
    border: 1px solid #cbd5e1;
  }
  .btn-details:hover {
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  }
  .btn-delete {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #dc2626;
    border: 1px solid #fca5a5;
  }
  .btn-delete:hover {
    background: linear-gradient(135deg, #fecaca 0%, #f87171 100%);
    color: white;
  }
  .search-premium {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  }
  .search-premium:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
  .select-premium {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .select-premium:focus {
    outline: none;
    border-color: #3b82f6;
  }
  .status-select-premium {
    flex: 1;
    min-width: 120px;
    padding: 10px 14px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 13px;
    background: white;
    transition: all 0.2s ease;
  }
  .status-select-premium:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  .client-avatar {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 18px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  @media (max-width: 768px) {
    .clients-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
  @media (max-width: 390px) {
    .clients-grid {
      grid-template-columns: 1fr !important;
    }
  }
`

const modalGlobalStyles = `
  .modal-status-novo { background: linear-gradient(135deg, #3b82f6, #2563eb) !important; }
  .modal-status-contato { background: linear-gradient(135deg, #f59e0b, #d97706) !important; }
  .modal-status-orcamento { background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important; }
  .modal-status-fechado { background: linear-gradient(135deg, #10b981, #059669) !important; }
  .modal-status-perdido { background: linear-gradient(135deg, #ef4444, #dc2626) !important; }
`

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e5e7eb'
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  content: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1
  },
  fieldGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  value: {
    fontSize: '15px',
    color: '#111827'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    color: 'white'
  },
  message: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#4b5563',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    backgroundColor: '#f9fafb',
    padding: '12px',
    borderRadius: '8px'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    flexWrap: 'wrap'
  },
  whatsappButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#25D366',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  callButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  statusSection: {
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb'
  },
  statusSelect: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    marginTop: '8px'
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  closeModalButton: {
    padding: '10px 24px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  }
}

const styles = {
  container: {
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  backLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
    transition: 'color 0.2s ease'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.02em'
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    margin: '6px 0 0 0'
  },
  refreshButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    transition: 'all 0.2s ease'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '16px',
    marginBottom: '28px'
  },
  statValue: {
    display: 'block',
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500'
  },
  toolbar: {
    display: 'flex',
    gap: '14px',
    marginBottom: '28px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    minWidth: '250px'
  },
  select: {
    minWidth: '160px'
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '3px solid #e2e8f0',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  errorState: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#fef2f2',
    borderRadius: '16px',
    marginTop: '20px',
    border: '1px solid #fecaca'
  },
  errorText: {
    color: '#dc2626',
    fontSize: '16px',
    marginBottom: '16px'
  },
  retryButton: {
    padding: '12px 24px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '2px dashed #e2e8f0'
  },
  emptyIcon: { fontSize: '56px', marginBottom: '16px' },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#0f172a',
    margin: '0 0 8px 0'
  },
  emptyText: {
    fontSize: '15px',
    color: '#64748b',
    margin: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  clientName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0
  },
  dateText: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '2px',
    display: 'block'
  },
  statusBadge: {
    padding: '6px 14px',
    borderRadius: '24px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    whiteSpace: 'nowrap'
  },
  cardBody: { marginBottom: '20px' },
  field: {
    marginBottom: '10px',
    fontSize: '14px',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  fieldLabel: {
    fontWeight: '500',
    color: '#64748b',
    fontSize: '13px'
  },
  fieldValue: {
    color: '#334155',
    fontWeight: '500'
  },
  messageContainer: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0'
  },
  message: {
    margin: '8px 0 0 0',
    fontSize: '13px',
    color: '#64748b',
    lineHeight: '1.6'
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  whatsappButton: {
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600'
  },
  callButton: {
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600'
  },
  detailsButton: {
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  cardFooter: {
    display: 'flex',
    gap: '12px',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  statusSelect: {
    flex: 1,
    minWidth: '140px'
  },
  deleteButton: {
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none'
  }
}