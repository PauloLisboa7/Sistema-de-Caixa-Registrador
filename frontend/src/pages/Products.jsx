import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Products() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const api = import.meta.env.VITE_API_URL || 'http://localhost:4001/api'

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const res = await axios.get(`${api}/products`)
        setProducts(res.data || [])
        setError(null)
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
        setError('Erro ao carregar produtos. Por favor, tente novamente.')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [api])

  if (error) {
    return (
      <div className="card alert alert-error">
        <h2>😕 Ops! Algo deu errado</h2>
        <p>{error}</p>
        <button 
          className="btn-primary" 
          onClick={() => window.location.reload()}
          style={{ marginTop: '1rem' }}
        >
          🔄 Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="card fade-in">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0 }}>📦 Produtos disponíveis</h2>
        <span className="card" style={{ 
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--accent-color)',
          color: 'white',
          borderRadius: 'var(--border-radius)'
        }}>
          {products.length} itens
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading">Carregando produtos...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="alert" style={{ textAlign: 'center' }}>
          <h3>Nenhum produto encontrado</h3>
          <p>Adicione produtos para começar as vendas.</p>
        </div>
      ) : (
        <div className="product-list">
          {products.map(p => (
            <div key={p.id} className="product-card">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <h3 style={{ margin: 0 }}>{p.nome}</h3>
                <span style={{ 
                  backgroundColor: p.estoque > 10 ? 'var(--success-color)' : 'var(--warning-color)',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--border-radius)',
                  fontSize: '0.875rem'
                }}>
                  {p.estoque} un
                </span>
              </div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                color: 'var(--primary-color)',
                margin: '1rem 0'
              }}>
                R$ {Number(p.preco).toFixed(2)}
              </div>
              <button 
                className="btn-secondary" 
                style={{ width: '100%' }}
                onClick={() => window.location.href = '/checkout'}
              >
                🛒 Adicionar ao carrinho
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
