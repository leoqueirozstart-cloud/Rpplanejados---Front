function WhatsAppButton({ phoneNumber = '5511999999999' }) {
  const message = encodeURIComponent('Olá! Gostaria de solicitar um orçamento para móveis planejados.');
  const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  return (
    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 animate-bounce" aria-label="Falar no WhatsApp">
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.445 3.48 8.756-.041 6.391-5.404 10.979-11.985 10.979-3.13-.002-5.682-1.276-7.772-3.48l-6.452 1.677zm13.509-14.34c-.236-1.764-1.745-3.176-3.548-3.176-1.937 0-3.552 1.568-3.552 3.53 0 1.414.775 2.691 1.965 3.425l1.252-1.264c.69-.628 1.682-1.005 2.717-1.005.344 0 .675.028.99.095l3.858-1.538c.315-.115.602-.24.856-.405l-.002-.004c-.252 1.492-1.338 2.666-2.814 3.174l-1.212.508z"/>
      </svg>
    </a>
  );
}

export default WhatsAppButton;