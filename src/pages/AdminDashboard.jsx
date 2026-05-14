import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { projectService } from '../services/projectService'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableProjectItem({ project, onEdit, onToggle, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: project.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <button
        {...attributes}
        {...listeners}
        style={{
          padding: 8,
          background: 'none',
          border: 'none',
          cursor: 'grab',
          color: '#888',
          fontSize: 18,
          marginRight: 8,
          touchAction: 'none'
        }}
        title="Arrastar para reordenar"
      >
        ☰
      </button>
      <div style={{
        width: 48,
        height: 48,
        backgroundColor: '#eee',
        borderRadius: 8,
        overflow: 'hidden',
        flexShrink: 0,
        marginRight: 12
      }}>
        {project.coverImageUrl && (
          <img
            src={project.coverImageUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 500, color: '#333' }}>{project.title}</p>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {project.description?.substring(0, 50)}...
        </p>
      </div>
      <div style={{ padding: '0 16px', fontSize: 14, color: '#666', display: 'none' }}>{project.category}</div>
      <div style={{ padding: '0 16px' }}>
        <span style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 500,
          backgroundColor: project.published ? '#DCFCE7' : '#F3F4F6',
          color: project.published ? '#16A34A' : '#666'
        }}>
          {project.published ? 'Publicado' : 'Rascunho'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link
          to={`/admin/projetos/editar/${project.id}`}
          style={{ padding: 8, color: '#888', textDecoration: 'none' }}
          title="Editar"
        >
          ✏️
        </Link>
        <button
          onClick={() => onToggle(project.id)}
          style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer' }}
          title={project.published ? 'Despublicar' : 'Publicar'}
        >
          👁
        </button>
        <button
          onClick={() => onDelete(project.id)}
          style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}
          title="Excluir"
        >
          🗑
        </button>
      </div>
    </div>
  )
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      padding: '16px 24px',
      borderRadius: 12,
      backgroundColor: type === 'success' ? '#16A34A' : '#DC2626',
      color: 'white',
      fontWeight: 500,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      animation: 'slideIn 0.3s ease'
    }}>
      {message}
    </div>
  )
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => { loadProjects() }, [])

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await projectService.getAllProjects()
      setProjects(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar projetos')
      showToast('Erro ao carregar projetos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        
        saveNewOrder(newItems)
        
        return newItems
      })
    }
  }

  const saveNewOrder = async (reorderedItems) => {
    try {
      setSaving(true)
      const order = reorderedItems.map((item, index) => ({
        id: item.id,
        displayOrder: index + 1
      }))
      await projectService.reorderProjects(order)
      showToast('Ordem salva com sucesso!')
    } catch (err) {
      showToast('Erro ao salvar ordem', 'error')
      loadProjects()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Excluir projeto?')) {
      try {
        await projectService.deleteProject(id)
        showToast('Projeto excluído!')
        loadProjects()
      } catch (err) {
        showToast('Erro ao excluir projeto', 'error')
      }
    }
  }

  const handleToggle = async (id) => {
    try {
      await projectService.togglePublish(id)
      showToast('Status atualizado!')
      loadProjects()
    } catch (err) {
      showToast('Erro ao atualizar status', 'error')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const activeProject = activeId ? projects.find(p => p.id === activeId) : null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <header style={{
        backgroundColor: 'white',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{
              width: 32,
              height: 32,
              backgroundColor: '#FF6A4D',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
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
          {saving && (
            <span style={{ fontSize: 13, color: '#888' }}>Salvando...</span>
          )}
          <span style={{ fontSize: 14, color: '#666' }}>Olá, {user?.name}</span>
          <button
            onClick={handleLogout}
            style={{ fontSize: 14, color: '#FF6A4D', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Sair
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: 32 }}>
        {error && (
          <div style={{
            padding: 12,
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            borderRadius: 8,
            marginBottom: 16
          }}>
            {error}
          </div>
        )}
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontFamily: 'Playfair Display, serif' }}>Projetos</h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#888' }}>
              Arraste os itens para reorganizar a ordem de exibição
            </p>
          </div>
          <Link
            to="/admin/projetos/novo"
            style={{
              backgroundColor: '#FF6A4D',
              color: 'white',
              padding: '12px 24px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14
            }}
          >
            + Novo Projeto
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, animation: 'fadeIn 0.3s ease' }}>
            Carregando...
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, backgroundColor: 'white', borderRadius: 16, animation: 'fadeIn 0.3s ease' }}>
            <p style={{ color: '#888', marginBottom: 16 }}>Nenhum projeto</p>
            <Link
              to="/admin/projetos/novo"
              style={{
                backgroundColor: '#FF6A4D',
                color: 'white',
                padding: '12px 24px',
                borderRadius: 8,
                textDecoration: 'none'
              }}
            >
              Criar primeiro
            </Link>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{
              backgroundColor: '#F9FAFB',
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid #E5E7EB'
            }}>
              <div style={{ width: 32, marginRight: 8 }}></div>
              <div style={{ flex: 1 }}>Projeto</div>
              <div style={{ padding: '0 16px' }}>Status</div>
              <div style={{ width: 120 }}>Ações</div>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={projects.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                {projects.map((project) => (
                  <SortableProjectItem
                    key={project.id}
                    project={project}
                    onEdit={(id) => navigate(`/admin/projetos/editar/${id}`)}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </SortableContext>

              <DragOverlay>
                {activeProject ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 24px',
                    backgroundColor: 'white',
                    borderRadius: 8,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    cursor: 'grabbing'
                  }}>
                    <div style={{
                      padding: 8,
                      marginRight: 8,
                      color: '#FF6A4D',
                      fontSize: 18
                    }}>
                      ☰
                    </div>
                    <div style={{
                      width: 48,
                      height: 48,
                      backgroundColor: '#eee',
                      borderRadius: 8,
                      overflow: 'hidden',
                      flexShrink: 0,
                      marginRight: 12
                    }}>
                      {activeProject.coverImageUrl && (
                        <img
                          src={activeProject.coverImageUrl}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 500 }}>{activeProject.title}</p>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        )}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}