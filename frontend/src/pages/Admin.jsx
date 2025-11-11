import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Admin() {
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    nome: '',
    preco: '',
    estoque: ''
  })
  const [message, setMessage] = useState(null)
  const api = import.meta.env.VITE_API_URL || 'http://localhost:4001/api'

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const res = await axios.get(`${api}/products`)
      setProducts(res.data)
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao carregar produtos' })
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await axios.post(`${api}/products`, {
        nome: newProduct.nome,
        preco: Number(newProduct.preco),
        estoque: Number(newProduct.estoque)
      })
      setMessage({ type: 'success', text: 'Produto adicionado com sucesso!' })
      setNewProduct({ nome: '', preco: '', estoque: '' })
      fetchProducts()
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao adicionar produto' })
    }
  }

  async function handleUpdate(e) {
    e.preventDefault()
    try {
      await axios.put(`${api}/products/${editingProduct.id}`, {
        nome: editingProduct.nome,
        preco: Number(editingProduct.preco),
        estoque: Number(editingProduct.estoque)
      })
      setMessage({ type: 'success', text: 'Produto atualizado com sucesso!' })
      setEditingProduct(null)
      fetchProducts()
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao atualizar produto' })
    }
  }

  async function handleDelete(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    try {
      await axios.delete(`${api}/products/${id}`)
      setMessage({ type: 'success', text: 'Produto excluído com sucesso!' })
      fetchProducts()
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao excluir produto' })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Adicionar Produto */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-100">
        <h2 className="text-3xl font-black text-amber-900 mb-6">📝 Novo Produto</h2>
        {message && (
          <div className={`p-4 rounded-lg mb-4 font-bold animate-slide-in-up ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-amber-900 mb-2">Nome</label>
            <input type="text" value={newProduct.nome} onChange={e => setNewProduct({ ...newProduct, nome: e.target.value })} required placeholder="Ex: Picanha" className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-700 focus:outline-none"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-amber-900 mb-2">Preço (R$)</label>
            <input type="number" step="0.01" min="0" value={newProduct.preco} onChange={e => setNewProduct({ ...newProduct, preco: e.target.value })} required placeholder="Ex: 89.90" className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-700 focus:outline-none"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-amber-900 mb-2">Estoque</label>
            <input type="number" min="0" value={newProduct.estoque} onChange={e => setNewProduct({ ...newProduct, estoque: e.target.value })} required placeholder="Ex: 50" className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-700 focus:outline-none"/>
          </div>
          <button type="submit" className="w-full py-3 bg-amber-700 text-white font-black rounded-lg hover:bg-amber-800 transition-all shadow-lg">✨ Adicionar</button>
        </form>
      </div>

      {/* Gerenciar Produtos */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-100">
        <h2 className="text-3xl font-black text-amber-900 mb-6">📋 Gerenciar ({products.length})</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {products.map(product => (
            <div key={product.id} className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border-l-4 border-amber-700">
              {editingProduct?.id === product.id ? (
                <form onSubmit={handleUpdate} className="space-y-2">
                  <input type="text" value={editingProduct.nome} onChange={e => setEditingProduct({ ...editingProduct, nome: e.target.value })} required className="w-full px-3 py-2 rounded border-2 border-amber-200 focus:border-amber-700 focus:outline-none text-sm"/>
                  <input type="number" step="0.01" min="0" value={editingProduct.preco} onChange={e => setEditingProduct({ ...editingProduct, preco: e.target.value })} required className="w-full px-3 py-2 rounded border-2 border-amber-200 focus:border-amber-700 focus:outline-none text-sm"/>
                  <input type="number" min="0" value={editingProduct.estoque} onChange={e => setEditingProduct({ ...editingProduct, estoque: e.target.value })} required className="w-full px-3 py-2 rounded border-2 border-amber-200 focus:border-amber-700 focus:outline-none text-sm"/>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 py-2 bg-green-600 text-white font-bold rounded text-sm hover:bg-green-700">💾 Salvar</button>
                    <button type="button" className="flex-1 py-2 bg-gray-400 text-white font-bold rounded text-sm hover:bg-gray-500" onClick={() => setEditingProduct(null)}>❌ Cancelar</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-amber-900 mb-2">{product.nome}</h3>
                  <div className="text-2xl font-black text-amber-700 mb-2">R$ {Number(product.preco).toFixed(2)}</div>
                  <div className={`mb-3 font-bold ${product.estoque > 10 ? 'text-green-700' : 'text-orange-700'}`}>📦 Estoque: {product.estoque} un</div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-yellow-500 text-amber-950 font-bold rounded text-sm hover:bg-yellow-600" onClick={() => setEditingProduct(product)}>✏️ Editar</button>
                    <button className="flex-1 py-2 bg-red-600 text-white font-bold rounded text-sm hover:bg-red-700" onClick={() => handleDelete(product.id)}>🗑️ Excluir</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}