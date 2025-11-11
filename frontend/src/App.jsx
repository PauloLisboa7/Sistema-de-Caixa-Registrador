import React, { useState } from 'react'
import Products from './pages/Products'
import Checkout from './pages/Checkout'
import History from './pages/History'
import Admin from './pages/Admin'
import './styles/tailwind.css'
import './styles/global.css'
import './styles/admin.css'

export default function App() {
  const [page, setPage] = useState('products')

  const renderContent = () => {
    switch (page) {
      case 'products':
        return <Products />
      case 'checkout':
        return <Checkout />
      case 'history':
        return <History />
      case 'admin':
        return <Admin />
      default:
        return <Products />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-light via-meat-50 to-gold-50">
      {/* Header Premium */}
      <header className="sticky top-0 z-50 bg-white shadow-meat">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🏪</div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Caixa Registrador</h1>
                  <p className="text-sm text-meat-600 font-medium">Premium Açougue & Vendas</p>
                </div>
              </div>
            </div>

            {/* Navegação */}
            <nav className="flex gap-2 flex-wrap">
              <button
                onClick={() => setPage('products')}
                className={`px-5 py-2.5 rounded-meat font-semibold transition-all duration-200 ${
                  page === 'products'
                    ? 'bg-meat-600 text-white shadow-meat'
                    : 'bg-meat-100 text-meat-700 hover:bg-meat-200'
                }`}
              >
                📦 Produtos
              </button>
              <button
                onClick={() => setPage('checkout')}
                className={`px-5 py-2.5 rounded-meat font-semibold transition-all duration-200 ${
                  page === 'checkout'
                    ? 'bg-meat-600 text-white shadow-meat'
                    : 'bg-meat-100 text-meat-700 hover:bg-meat-200'
                }`}
              >
                🛒 Caixa
              </button>
              <button
                onClick={() => setPage('history')}
                className={`px-5 py-2.5 rounded-meat font-semibold transition-all duration-200 ${
                  page === 'history'
                    ? 'bg-meat-600 text-white shadow-meat'
                    : 'bg-meat-100 text-meat-700 hover:bg-meat-200'
                }`}
              >
                📊 Histórico
              </button>
              <button
                onClick={() => setPage('admin')}
                className={`ml-auto px-5 py-2.5 rounded-meat font-semibold transition-all duration-200 ${
                  page === 'admin'
                    ? 'bg-gold-500 text-premium-dark shadow-gold'
                    : 'bg-gold-100 text-gold-800 hover:bg-gold-200'
                }`}
              >
                👑 Admin
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-meat-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-2">🏪 Caixa Registrador</h3>
              <p className="text-meat-100 text-sm">Sistema completo para gestão de vendas em açougues e mercados</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-gold-400">Funcionalidades</h4>
              <ul className="space-y-2 text-meat-100 text-sm">
                <li>✓ Gestão de Produtos</li>
                <li>✓ Caixa em Tempo Real</li>
                <li>✓ Histórico de Vendas</li>
                <li>✓ Painel Administrativo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-gold-400">Tecnologia</h4>
              <ul className="space-y-2 text-meat-100 text-sm">
                <li>• React + Vite</li>
                <li>• Express Backend</li>
                <li>• Supabase Database</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-meat-600 pt-6 text-center text-meat-200 text-sm">
            <p>© {new Date().getFullYear()} Sistema de Caixa Registrador • Desenvolvido com ❤️ e 🥩</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
