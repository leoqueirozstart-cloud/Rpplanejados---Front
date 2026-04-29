import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className={`navbar ${isHome ? 'py-4' : 'py-3'}`}>
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-serif font-bold text-xl">RP</span>
          </div>
          <div>
            <h1 className="text-lg font-serif font-semibold text-dark">RP Planejados</h1>
            <p className="text-xs text-gray-500 -mt-1">Móveis sob medida</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={`text-sm font-medium transition-colors ${isHome ? 'text-dark' : 'text-gray-600 hover:text-primary'}`}>
            Início
          </Link>
          <a href="#portfolio" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            Portfólio
          </a>
          <a href="#sobre" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            Sobre
          </a>
          <a href="#contato" className="btn btn-primary text-sm">
            Solicitar Orçamento
          </a>
        </nav>

        <button className="md:hidden p-2 text-gray-600" onClick={() => document.getElementById('mobile-menu')?.classList.toggle('hidden')}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div id="mobile-menu" className="hidden md:hidden absolute top-full left-0 right-0 bg-cream border-t shadow-lg">
        <div className="container py-4 space-y-3">
          <Link to="/" className="block py-2 text-gray-700">Início</Link>
          <a href="#portfolio" className="block py-2 text-gray-700">Portfólio</a>
          <a href="#sobre" className="block py-2 text-gray-700">Sobre</a>
          <a href="#contato" className="block py-2 btn btn-primary text-center">Solicitar Orçamento</a>
        </div>
      </div>
    </header>
  );
}

export default Header;