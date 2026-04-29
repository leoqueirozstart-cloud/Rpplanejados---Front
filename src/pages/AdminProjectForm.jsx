import { useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { projectService } from '../services/projectService'

export default function AdminProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id
  const fileRef = useRef()
  const imagesRef = useRef()

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showInstagramHelp, setShowInstagramHelp] = useState(false)
  const [data, setData] = useState({
    title: '', description: '', category: 'moveis-planejados', coverImageUrl: '',
    imageUrls: [], published: false, imageUrl: ''
  })

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const handleCover = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      setUploading(true)
      const url = await projectService.uploadFile(file)
      setData({ ...data, coverImageUrl: url })
    } catch { }
    finally { setUploading(false) }
  }

  const handleImages = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    try {
      setUploading(true)
      const urls = await projectService.uploadFiles(files)
      setData({ ...data, imageUrls: [...data.imageUrls, ...urls] })
    } catch { }
    finally { setUploading(false) }
  }

  const processInstagramEmbed = async () => {
    if (!data.instagramEmbed) return alert('Cole o código embed primeiro')
    if (data.instagramEmbed.length < 50) return alert('O código embed parece estar incompleto. Cole o código completo do embed.')
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/admin/parse-embed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ embedCode: data.instagramEmbed })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao processar embed')
      }
      
      if (result.images && result.images.length > 0) {
        if (!data.coverImageUrl) {
          setData({ ...data, coverImageUrl: result.images[0], imageUrls: result.images, instagramEmbed: '' })
        } else {
          setData({ ...data, imageUrls: [...data.imageUrls, ...result.images], instagramEmbed: '' })
        }
        alert('Imagem importada com sucesso!')
      }
    } catch (err) {
      alert(err.message || 'Erro ao processar embed. Tente usar o método de salvar na galeria.')
    }
  }

  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!data.title) return alert('Título é obrigatório')
    try {
      setSaving(true)
      if (isEditing) await projectService.updateProject(id, data)
      else await projectService.createProject(data)
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
            <h3 style={{ margin: '0 0 16px' }}>URL da Imagem</h3>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
              Cole o link de uma imagem diretamente (do Instagram, Google Photos, etc)
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <input 
                name="imageUrl" 
                value={data.imageUrl}
                onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
                placeholder="https://... .jpg ou .png"
                style={{ flex: 1, padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
              />
              <button 
                type="button" 
                onClick={() => {
                  const url = data.imageUrl
                  if (!url) return alert('Cole uma URL primeiro')
                  if (!url.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i)) {
                    return alert('URL deve terminar em .jpg, .jpeg, .png, .webp ou .gif')
                  }
                  if (!data.coverImageUrl) {
                    setData({ ...data, coverImageUrl: url, imageUrls: [url], imageUrl: '' })
                    alert('Imagem adicionada como capa!')
                  } else {
                    setData({ ...data, imageUrls: [...data.imageUrls, url], imageUrl: '' })
                    alert('Imagem adicionada a galeria!')
                  }
                }}
                style={{ padding: '12px 24px', backgroundColor: '#E1306C', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
              >
                Adicionar
              </button>
            </div>
            <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
              Dica: No Instagram, abra a imagem no navegador, clique com botão direito e selecione "Copiar endereço da imagem"
            </p>
          </div>

          <div style={{ backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px' }}>Imagem de Capa</h3>
            <input type="file" ref={fileRef} onChange={handleCover} accept="image/*" style={{ display: 'none' }} />
            {data.coverImageUrl ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={data.coverImageUrl} alt="" style={{ maxHeight: 200, borderRadius: 8 }} />
                <button type="button" onClick={() => setData({ ...data, coverImageUrl: '' })} style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: '50%', backgroundColor: '#EF4444', color: 'white', border: 'none', cursor: 'pointer' }}>x</button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ padding: '12px 24px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                {uploading ? 'Enviando...' : 'Selecionar Imagem'}
              </button>
            )}
          </div>

          <div style={{ backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px' }}>Galeria de Imagens</h3>
            <input type="file" ref={imagesRef} multiple onChange={handleImages} accept="image/*" style={{ display: 'none' }} />
            <button type="button" onClick={() => imagesRef.current?.click()} disabled={uploading} style={{ padding: '12px 24px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              {uploading ? 'Enviando...' : 'Adicionar Imagens'}
            </button>
            {data.imageUrls.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                {data.imageUrls.map((url, i) => (
                  <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                    <button type="button" onClick={() => setData({ ...data, imageUrls: data.imageUrls.filter((_, idx) => idx !== i) })} style={{ position: 'absolute', top: -8, right: -8, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#EF4444', color: 'white', border: 'none', cursor: 'pointer', fontSize: 12 }}>x</button>
                  </div>
                ))}
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