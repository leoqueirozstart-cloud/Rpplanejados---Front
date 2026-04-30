import { useState } from 'react'
import { clientService } from '../services/clientService'

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

      console.log('Enviando lead:', { ...form, projectTitle })

      await clientService.createClient({
        ...form,
        projectTitle
      })

      console.log('Lead enviado com sucesso')
      setSent(true)
      
      setTimeout(() => {
        const message = projectTitle 
          ? `Olá! Meu nome é ${form.name}. Gostaria de saber mais sobre o projeto "${projectTitle}".`
          : `Olá! Meu nome é ${form.name}. Gostaria de fazer um orçamento.`
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
        onClose()
        setSent(false)
        setForm({ name: '', email: '', phone: '', message: '' })
      }, 2000)

    } catch (err) {
      console.error('Erro ao enviar lead:', err)
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao enviar. Tente novamente.'
      alert(errorMessage)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="lead-modal-overlay premium-modal-overlay" onClick={onClose}>
      <div className="lead-modal premium-modal" onClick={e => e.stopPropagation()}>
        <button className="lead-modal-close premium-modal-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="premium-modal-decoration" />
        
        {sent ? (
          <div className="lead-modal-success premium-success">
            <div className="success-icon-wrapper">
              <div className="success-checkmark">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div className="success-ring" />
            </div>
            <h3>Solicitação Enviada!</h3>
            <p>Em breve você receberá uma mensagem no WhatsApp com as informações do seu orçamento.</p>
            <div className="success-footer">
              <span>Aguardamos seu contato ✨</span>
            </div>
          </div>
        ) : (
          <>
            <div className="lead-modal-header premium-modal-header">
              <div className="premium-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Solicite seu Orçamento</h3>
              <p>Preencha os dados abaixo e retornaremos pelo WhatsApp</p>
            </div>
            
            <form onSubmit={handleSubmit} className="lead-form premium-form">
              <div className="lead-form-group premium-group">
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="lead-form-group premium-group">
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Seu e-mail (opcional)"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              
              <div className="lead-form-group premium-group">
                <div className="input-icon whatsapp-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.162-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.974 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <input
                  type="tel"
                  placeholder="Seu WhatsApp"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              
              <div className="lead-form-group premium-group premium-textarea">
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <textarea
                  placeholder="Qual ambiente você deseja planejar? (opicional)"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={2}
                />
              </div>
              
              <button type="submit" className="lead-submit-btn premium-submit" disabled={sending}>
                {sending ? (
                  <>
                    <span className="spinner-small" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.162-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.974 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Solicitar Orçamento
                  </>
                )}
              </button>
            </form>
            
            <div className="premium-footer">
              <span>🔒 Seus dados estão seguros</span>
              <span>⚡ Respondemos em até 24h</span>
            </div>
          </>
        )}
      </div>
      <style>{premiumModalStyles}</style>
    </div>
  )
}

const premiumModalStyles = `
  .premium-modal-overlay {
    animation: modalFadeIn 0.3s ease-out;
  }
  
  @keyframes modalFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .premium-modal {
    background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 24px;
    max-width: 480px;
    width: 100%;
    padding: 0;
    position: relative;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 106, 77, 0.1);
    animation: modalSlideUp 0.4s ease-out;
    overflow: hidden;
  }
  
  @keyframes modalSlideUp {
    from { 
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .premium-modal-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #FF6A4D, #ff8f75, #FF6A4D);
    background-size: 200% 100%;
    animation: gradientMove 3s ease infinite;
  }
  
  @keyframes gradientMove {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  .premium-modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
    border: none;
    background: #f1f5f9;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    z-index: 10;
    transition: all 0.2s;
  }
  
  .premium-modal-close:hover {
    background: #e2e8f0;
    color: #334155;
  }
  
  .premium-modal-header {
    text-align: center;
    padding: 40px 32px 24px;
    background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%);
  }
  
  .premium-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #FF6A4D 0%, #e55a3d 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    color: white;
    box-shadow: 0 8px 20px rgba(255, 106, 77, 0.3);
  }
  
  .premium-modal-header h3 {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px;
  }
  
  .premium-modal-header p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }
  
  .premium-form {
    padding: 0 32px 24px;
  }
  
  .premium-group {
    position: relative;
    margin-bottom: 16px;
  }
  
  .premium-group .input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    z-index: 1;
  }
  
  .premium-group.whatsapp-icon .input-icon {
    color: #25D366;
  }
  
  .premium-group input,
  .premium-group textarea {
    width: 100%;
    padding: 16px 16px 16px 48px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 15px;
    transition: all 0.3s;
    background: #f8fafc;
  }
  
  .premium-group input:focus,
  .premium-group textarea:focus {
    outline: none;
    border-color: #FF6A4D;
    background: white;
    box-shadow: 0 0 0 4px rgba(255, 106, 77, 0.1);
  }
  
  .premium-textarea textarea {
    padding-top: 16px;
  }
  
  .premium-submit {
    width: 100%;
    padding: 18px;
    background: linear-gradient(135deg, #FF6A4D 0%, #e55a3d 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 8px 20px rgba(255, 106, 77, 0.3);
    margin-top: 8px;
  }
  
  .premium-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(255, 106, 77, 0.4);
  }
  
  .premium-submit:active {
    transform: translateY(0);
  }
  
  .premium-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  .spinner-small {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  .premium-footer {
    padding: 16px 32px 24px;
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  
  .premium-footer span {
    font-size: 12px;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .premium-success {
    text-align: center;
    padding: 48px 32px;
  }
  
  .success-icon-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
  }
  
  .success-checkmark {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    animation: scaleIn 0.5s ease-out;
    box-shadow: 0 12px 30px rgba(16, 185, 129, 0.3);
  }
  
  @keyframes scaleIn {
    0% { transform: scale(0); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  .success-ring {
    position: absolute;
    inset: -8px;
    border: 3px solid #10b981;
    border-radius: 50%;
    opacity: 0;
    animation: ringExpand 1s ease-out 0.3s forwards;
  }
  
  @keyframes ringExpand {
    0% { 
      opacity: 1;
      transform: scale(0.8);
    }
    100% { 
      opacity: 0;
      transform: scale(1.5);
    }
  }
  
  .premium-success h3 {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 12px;
  }
  
  .premium-success p {
    font-size: 15px;
    color: #64748b;
    margin: 0 0 24px;
    line-height: 1.6;
  }
  
  .success-footer {
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
  }
  
  .success-footer span {
    font-size: 14px;
    color: #FF6A4D;
    font-weight: 500;
  }
  
  @media (max-width: 480px) {
    .premium-modal {
      margin: 16px;
      max-width: calc(100% - 32px);
    }
    
    .premium-modal-header {
      padding: 32px 24px 20px;
    }
    
    .premium-form {
      padding: 0 24px 20px;
    }
    
    .premium-footer {
      padding: 12px 24px 20px;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
  }
`