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
      <div className="card-premium border-red-500">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">😕</span>
          <div>
            <h2 className="text-2xl font-bold text-red-700">Oops! Algo deu errado</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <button 
          className="btn-primary mt-4"
          onClick={() => window.location.reload()}
        >
          🔄 Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="card-premium">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-meat-700 mb-2">📦 Produtos Disponíveis</h2>
            <p className="text-meat-600">Confira nossa seleção premium de açougaria</p>
          </div>
          <div className="flex gap-3">
            <button
              className="btn-secondary px-4 py-2"
              onClick={async () => {
                try {
                  setLoading(true)
                  await axios.post(`${api}/products/sync`)
                  const res = await axios.get(`${api}/products`)
                  setProducts(res.data || [])
                  setError(null)
                } catch (err) {
                  console.error('Erro ao sincronizar produtos:', err)
                  setError('Erro ao sincronizar produtos.')
                } finally {
                  setLoading(false)
                }
              }}
            >
              🔄 Sincronizar
            </button>
            <div className="bg-meat-600 text-white px-4 py-2 rounded-meat font-bold shadow-meat">
              {products.length} itens
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="loader mx-auto mb-4"></div>
            <p className="text-meat-600 font-semibold">Carregando produtos...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="card text-center py-16">
          <h3 className="text-2xl font-bold text-meat-700 mb-2">📭 Nenhum produto encontrado</h3>
          <p className="text-meat-600">Adicione produtos no painel administrativo para começar.</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.id} className="card hover:shadow-meat-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-meat-700 flex-1">{p.nome}</h3>
                <span className={`badge ml-2 whitespace-nowrap ${
                  p.estoque > 10 ? 'badge-success' : p.estoque > 0 ? 'badge-warning' : 'badge-danger'
                }`}>
                  {p.estoque} un
                </span>
              </div>
              
              <div className="border-t border-meat-100 pt-3">
                <div className="text-3xl font-bold gradient-text mb-2">
                  R$ {Number(p.preco).toFixed(2)}
                </div>
                <p className="text-sm text-meat-600 font-medium">
                  {p.estoque > 0 ? '✓ Em estoque' : '✗ Indisponível'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
