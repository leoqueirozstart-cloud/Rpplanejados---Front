import { useState } from 'react'

const WHATSAPP_NUMBER = '5511999999999'

export default function LeadForm({ isOpen, onClose, projectTitle = '' }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      alert('Por favor, preencha nome e telefone')
      return
    }

    try {
      setSending(true)
      
      // Enviar dados para o backend
      const response = await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          message: projectTitle ? `Interesse em: ${projectTitle}` : form.message
        })
      })

      if (!response.ok) throw new Error('Erro ao enviar')
      
      setSent(true)
      
      // Redirecionar para o WhatsApp após 1 segundo
      setTimeout(() => {
        const message = projectTitle 
          ? `Olá! Meu nome é ${form.name}. Gostaria de saber mais sobre o projeto "${projectTitle}".`
          : `Olá! Meu nome é ${form.name}. Gostaria de fazer um orçamento.`
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
        onClose()
        setSent(false)
        setForm({ name: '', email: '', phone: '', message: '' })
      }, 1500)

    } catch (err) {
      alert('Erro ao enviar. Tente novamente.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="lead-modal-overlay" onClick={onClose}>
      <div className="lead-modal" onClick={e => e.stopPropagation()}>
        <button className="lead-modal-close" onClick={onClose}>×</button>
        
        {sent ? (
          <div className="lead-modal-success">
            <div className="lead-success-icon">✓</div>
            <h3>Dados enviados!</h3>
            <p>Em breve entraremos em contato pelo WhatsApp.</p>
          </div>
        ) : (
          <>
            <div className="lead-modal-header">
              <h3>Solicitar Orçamento</h3>
              <p>Deixe seus dados para que possamos entrar em contato</p>
            </div>
            
            <form onSubmit={handleSubmit} className="lead-form">
              <div className="lead-form-group">
                <input
                  type="text"
                  placeholder="Seu nome *"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="lead-form-group">
                <input
                  type="email"
                  placeholder="Seu email (opcional)"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="lead-form-group">
                <input
                  type="tel"
                  placeholder="Seu WhatsApp *"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              <div className="lead-form-group">
                <textarea
                  placeholder="Mensagem (opcional)"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={3}
                />
              </div>
              <button type="submit" className="lead-submit-btn" disabled={sending}>
                {sending ? 'Enviando...' : 'Enviar e ir para WhatsApp'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}