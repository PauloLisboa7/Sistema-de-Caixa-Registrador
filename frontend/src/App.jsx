import React, { useState } from 'react'
import Products from './pages/Products'
import Checkout from './pages/Checkout'
import History from './pages/History'
import './styles/global.css'

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
      default:
        return <Products />
    }
  }

  return (
    <div className="container fade-in">
      <header className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: 'var(--primary-color)',
          marginBottom: '1.5rem',
          fontSize: '2rem',
          fontWeight: '600'
        }}>
          🏪 Sistema de Caixa Registrador
        </h1>
        <nav style={{ 
          display: 'flex', 
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => setPage('products')}
            className={`nav-button ${page === 'products' ? 'active' : ''}`}
          >
            📦 Produtos
          </button>
          <button 
            onClick={() => setPage('checkout')}
            className={`nav-button ${page === 'checkout' ? 'active' : ''}`}
          >
            🛒 Caixa
          </button>
          <button 
            onClick={() => setPage('history')}
            className={`nav-button ${page === 'history' ? 'active' : ''}`}
          >
            📊 Histórico
          </button>
        </nav>
      </header>
      <main className="fade-in">
        {renderContent()}
      </main>
      <footer style={{ 
        textAlign: 'center', 
        marginTop: '2rem',
        padding: '1rem',
        color: 'var(--text-color)',
        opacity: 0.7
      }}>
        © {new Date().getFullYear()} Sistema de Caixa Registrador - Desenvolvido com ❤️
      </footer>
    </div>
  )
}
