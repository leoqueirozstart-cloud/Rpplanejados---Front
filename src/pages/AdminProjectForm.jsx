import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { projectService } from '../services/projectService'

function isValidImageUrl(url) {
  if (!url) return false
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false
  return true
}

function ImagePreview({ src, onRemove, isCover }) {
  const [imgError, setImgError] = useState(false)
  
  return (
    <div style={{ position: 'relative', width: isCover ? 200 : 100, height: isCover ? 150 : 100, borderRadius: 8, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
      {imgError ? (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <span style={{ fontSize: 10, color: '#666' }}>Imagem inválida</span>
        </div>
      ) : (
        <img 
          src={src} 
          alt="" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setImgError(true)}
        />
      )}
      <button 
        type="button" 
        onClick={onRemove}
        style={{ 
          position: 'absolute', top: 4, right: 4, 
          width: 24, height: 24, borderRadius: '50%', 
          backgroundColor: '#EF4444', color: 'white', 
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14
        }}
      >
        ×
      </button>
    </div>
  )
}

export default function AdminProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    title: '', description: '', category: 'moveis-planejados', coverImageUrl: '',
    imageUrls: [], published: false, imageUrl: ''
  })

  useEffect(() => {
    if (isEditing) {
      loadProject()
    }
  }, [id])

  const loadProject = async () => {
    try {
      setLoading(true)
      const project = await projectService.getProject(id)
      setData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || 'moveis-planejados',
        coverImageUrl: project.coverImageUrl || '',
        imageUrls: project.imageUrls || [],
        published: project.published || false,
        imageUrl: ''
      })
    } catch (err) {
      console.error('Erro ao carregar projeto:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const addCoverImage = () => {
    const url = data.imageUrl.trim()
    if (!url) return alert('Cole uma URL de imagem primeiro')
    if (!isValidImageUrl(url)) return alert('URL deve começar com http:// ou https://')
    setData({ ...data, coverImageUrl: url, imageUrl: '' })
  }

  const addMultipleImages = () => {
    const input = data.imageUrl.trim()
    if (!input) return alert('Cole as URLs de imagem primeiro')
    
    const urls = input.split(/[,\n]/).map(u => u.trim()).filter(u => u)
    const validUrls = []
    const invalidUrls = []
    
    urls.forEach(url => {
      if (isValidImageUrl(url)) {
        validUrls.push(url)
      } else {
        invalidUrls.push(url)
      }
    })
    
    if (validUrls.length === 0 && invalidUrls.length > 0) {
      return alert('Nenhuma URL válida encontrada. As URLs devem começar com http:// ou https://')
    }
    
    const newUrls = [...data.imageUrls, ...validUrls]
    setData({ ...data, imageUrls: newUrls, imageUrl: '' })
    
    if (invalidUrls.length > 0) {
      alert(`${validUrls.length} imagem(ns) adicionada(s). ${invalidUrls.length} URL(s) inválida(s) ignorada(s).`)
    } else if (validUrls.length > 0) {
      alert(`${validUrls.length} imagem(ns) adicionada(s) à galeria!`)
    }
  }

  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!data.title) return alert('Título é obrigatório')
    try {
      setSaving(true)
      const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        coverImageUrl: data.coverImageUrl,
        published: data.published,
        imageUrls: data.imageUrls
      }
      if (isEditing) await projectService.updateProject(id, payload)
      else await projectService.createProject(payload)
      navigate('/admin/dashboard')
    } catch (err) {
      console.error('Erro ao salvar projeto:', err)
      setError(err.response?.data?.error || 'Erro ao salvar projeto')
    }
    finally { setSaving(false) }
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando...</div>

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <header style={{ backgroundColor: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: '#888' }}>← Voltar</Link>
        <span style={{ color: '#ccc' }}>|</span>
        <span style={{ fontWeight: 500 }}>{isEditing ? 'Editar' : 'Novo'} Projeto</span>
      </header>

      <main style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
        {error && <div style={{ padding: 12, backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 8, marginBottom: 16 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px' }}>Informações</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Título *</label>
              <input name="title" value={data.title} onChange={handleChange} placeholder="Ex: Cozinha Moderna" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 16, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Descrição</label>
              <textarea name="description" value={data.description} onChange={handleChange} rows={4} placeholder="Descrição do projeto..." style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 16, resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Categoria</label>
              <select name="category" value={data.category} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 16, boxSizing: 'border-box' }}>
                <option value="moveis-planejados">Móveis Planejados</option>
                <option value="cozinhas">Cozinhas</option>
                <option value="quartos">Quartos</option>
                <option value="escritorios">Escritórios</option>
                <option value="paineis">Painéis</option>
                <option value="decoracao">Decoração</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input type="checkbox" id="pub" name="published" checked={data.published} onChange={handleChange} />
              <label htmlFor="pub" style={{ fontSize: 14 }}>Publicar agora</label>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px' }}>Imagem de Capa</h3>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
              Cole o link de uma imagem externa (Cloudinary, ImageKit, Google Photos, Instagram, etc)
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <input 
                name="imageUrl" 
                value={data.imageUrl}
                onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
                placeholder="https://... (http:// ou https://)"
                style={{ flex: 1, padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
              />
              <button 
                type="button" 
                onClick={addCoverImage}
                style={{ padding: '12px 24px', backgroundColor: '#E1306C', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
              >
                Definir como Capa
              </button>
            </div>
            {data.coverImageUrl && (
              <div style={{ marginTop: 16, position: 'relative', display: 'inline-block' }}>
                <img src={data.coverImageUrl} alt="Capa" style={{ maxHeight: 200, borderRadius: 8 }} onError={(e) => e.target.style.display = 'none'} />
                <button type="button" onClick={() => setData({ ...data, coverImageUrl: '' })} style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: '50%', backgroundColor: '#EF4444', color: 'white', border: 'none', cursor: 'pointer' }}>x</button>
              </div>
            )}
            <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
              Dica: No Instagram, abra a imagem no navegador, clique com botão direito e selecione "Copiar endereço da imagem"
            </p>
          </div>

          <div style={{ backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px' }}>Galeria de Imagens</h3>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
              Cole várias URLs separadas por vírgula ou nova linha para adicionar múltiplas imagens de uma vez
            </p>
            <textarea
              name="imageUrl" 
              value={data.imageUrl}
              onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
              placeholder="https://exemplo1.jpg&#10;https://exemplo2.png&#10;https://exemplo3.webp"
              rows={4}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', resize: 'vertical', fontFamily: 'monospace' }}
            />
            <button 
              type="button" 
              onClick={addMultipleImages}
              style={{ marginTop: 12, padding: '12px 24px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
            >
              Adicionar Todas as URLs
            </button>
            
            {data.imageUrls.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>
                  {data.imageUrls.length} imagem(ns) na galeria:
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {data.imageUrls.map((url, i) => (
                    <ImagePreview 
                      key={i} 
                      src={url} 
                      onRemove={() => setData({ ...data, imageUrls: data.imageUrls.filter((_, idx) => idx !== i) })}
                      isCover={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Link to="/admin/dashboard" style={{ padding: '14px 24px', border: '1px solid #E5E7EB', borderRadius: 8, textDecoration: 'none', color: '#666' }}>Cancelar</Link>
            <button type="submit" disabled={saving} style={{ padding: '14px 32px', backgroundColor: '#FF6A4D', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}