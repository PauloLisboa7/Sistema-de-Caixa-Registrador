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
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-xl border-2 border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black text-amber-900 mb-2">📦 Produtos Disponíveis</h2>
            <p className="text-lg text-amber-700">Confira nossa seleção premium de açougaria</p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-6 py-3 bg-yellow-500 text-amber-950 font-bold rounded-lg hover:bg-yellow-600 transition-all shadow-lg"
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
            <div className="bg-amber-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg">
              {products.length} itens
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700 mb-4"></div>
            <p className="text-amber-800 font-semibold">Carregando produtos...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="bg-white p-12 rounded-xl text-center shadow-lg border border-amber-100">
          <h3 className="text-2xl font-bold text-amber-900 mb-2">📭 Nenhum produto encontrado</h3>
          <p className="text-amber-700">Adicione produtos no painel administrativo para começar.</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 overflow-hidden border border-amber-100">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-amber-900 flex-1">{p.nome}</h3>
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    p.estoque > 10 
                      ? 'bg-green-100 text-green-800' 
                      : p.estoque > 0 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {p.estoque} un
                  </span>
                </div>
                
                <div className="border-t border-amber-100 pt-3">
                  <div className="text-3xl font-black text-amber-700 mb-2">
                    R$ {Number(p.preco).toFixed(2)}
                  </div>
                  <p className="text-sm text-amber-600 font-medium">
                    {p.estoque > 0 ? '✓ Em estoque' : '✗ Indisponível'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
