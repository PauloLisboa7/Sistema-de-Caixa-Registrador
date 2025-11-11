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
    <div className="grid grid-2">
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>📝 Cadastrar Novo Produto</h2>
        {message && (
          <div className={`alert alert-${message.type}`} style={{ marginBottom: '1rem' }}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nome do Produto</label>
            <input
              type="text"
              value={newProduct.nome}
              onChange={e => setNewProduct({ ...newProduct, nome: e.target.value })}
              required
              placeholder="Ex: Picanha"
            />
          </div>
          <div className="input-group">
            <label>Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={newProduct.preco}
              onChange={e => setNewProduct({ ...newProduct, preco: e.target.value })}
              required
              placeholder="Ex: 89.90"
            />
          </div>
          <div className="input-group">
            <label>Estoque (unidades)</label>
            <input
              type="number"
              min="0"
              value={newProduct.estoque}
              onChange={e => setNewProduct({ ...newProduct, estoque: e.target.value })}
              required
              placeholder="Ex: 50"
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            ✨ Adicionar Produto
          </button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>📋 Gerenciar Produtos</h2>
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              {editingProduct?.id === product.id ? (
                <form onSubmit={handleUpdate} className="edit-form">
                  <div className="input-group">
                    <input
                      type="text"
                      value={editingProduct.nome}
                      onChange={e => setEditingProduct({ ...editingProduct, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingProduct.preco}
                      onChange={e => setEditingProduct({ ...editingProduct, preco: e.target.value })}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.estoque}
                      onChange={e => setEditingProduct({ ...editingProduct, estoque: e.target.value })}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                      💾 Salvar
                    </button>
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => setEditingProduct(null)}
                      style={{ flex: 1 }}
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3>{product.nome}</h3>
                  <div style={{ 
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--primary-color)',
                    margin: '1rem 0'
                  }}>
                    R$ {Number(product.preco).toFixed(2)}
                  </div>
                  <div style={{ 
                    color: product.estoque > 10 ? 'var(--success-color)' : 'var(--warning-color)',
                    marginBottom: '1rem'
                  }}>
                    Estoque: {product.estoque} unidades
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn-secondary"
                      onClick={() => setEditingProduct(product)}
                      style={{ flex: 1 }}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={() => handleDelete(product.id)}
                      style={{ flex: 1 }}
                    >
                      🗑️ Excluir
                    </button>
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