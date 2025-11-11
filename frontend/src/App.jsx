import React, { useState } from 'react'
import Products from './pages/Products'
import Checkout from './pages/Checkout'
import History from './pages/History'
import Admin from './pages/Admin'
import './styles/tailwind.css'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
      {/* Header Premium */}
      <header className="sticky top-0 z-50 bg-white shadow-lg border-b-4 border-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="text-5xl">🏪</div>
                <div>
                  <h1 className="text-4xl font-black text-amber-900">Caixa Registrador</h1>
                  <p className="text-base text-amber-700 font-semibold">Premium Açougue & Vendas</p>
                </div>
              </div>
            </div>

            {/* Navegação */}
            <nav className="flex gap-3 flex-wrap">
              <button
                onClick={() => setPage('products')}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  page === 'products'
                    ? 'bg-amber-700 text-white shadow-lg scale-105'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                }`}
              >
                📦 Produtos
              </button>
              <button
                onClick={() => setPage('checkout')}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  page === 'checkout'
                    ? 'bg-amber-700 text-white shadow-lg scale-105'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                }`}
              >
                🛒 Caixa
              </button>
              <button
                onClick={() => setPage('history')}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  page === 'history'
                    ? 'bg-amber-700 text-white shadow-lg scale-105'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                }`}
              >
                📊 Histórico
              </button>
              <button
                onClick={() => setPage('admin')}
                className={`ml-auto px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  page === 'admin'
                    ? 'bg-yellow-500 text-amber-950 shadow-lg scale-105'
                    : 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200'
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
      <footer className="mt-16 bg-amber-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">🏪 Caixa Registrador</h3>
              <p className="text-amber-100 text-sm">Sistema completo para gestão de vendas em açougues e mercados</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-yellow-300">Funcionalidades</h4>
              <ul className="space-y-2 text-amber-100 text-sm">
                <li>✓ Gestão de Produtos</li>
                <li>✓ Caixa em Tempo Real</li>
                <li>✓ Histórico de Vendas</li>
                <li>✓ Painel Administrativo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-yellow-300">Tecnologia</h4>
              <ul className="space-y-2 text-amber-100 text-sm">
                <li>• React + Vite</li>
                <li>• Express Backend</li>
                <li>• Supabase Database</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-700 pt-6 text-center text-amber-200 text-sm">
            <p>© {new Date().getFullYear()} Sistema de Caixa Registrador • Desenvolvido com ❤️ e 🥩</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
