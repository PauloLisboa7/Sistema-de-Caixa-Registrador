import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Checkout() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [desconto, setDesconto] = useState(0)
  const [message, setMessage] = useState(null)
  const api = import.meta.env.VITE_API_URL || 'http://localhost:4001/api'

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    try {
      const res = await axios.get(`${api}/products`)
      setProducts(res.data)
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao carregar produtos' })
    }
  }

  function addToCart(p) {
    if (p.estoque <= 0) {
      setMessage({ type: 'error', text: `${p.nome} sem estoque disponível` })
      return
    }
    const found = cart.find(i => i.id === p.id)
    if (found) {
      if (found.quantidade >= p.estoque) {
        setMessage({ type: 'error', text: `Estoque insuficiente para ${p.nome}` })
        return
      }
      setCart(cart.map(i => i.id === p.id ? { ...i, quantidade: i.quantidade + 1 } : i))
    } else {
      setCart([...cart, { id: p.id, nome: p.nome, preco: p.preco, quantidade: 1 }])
    }
    setMessage({ type: 'success', text: `${p.nome} adicionado ao carrinho` })
  }

  function removeFromCart(id) {
    setCart(cart.filter(i => i.id !== id))
    setMessage({ type: 'info', text: 'Item removido do carrinho' })
  }

  function updateQuantidade(id, novaQuantidade) {
    const produto = products.find(p => p.id === id)
    if (novaQuantidade > produto.estoque) {
      setMessage({ type: 'error', text: `Estoque insuficiente para ${produto.nome}` })
      return
    }
    if (novaQuantidade <= 0) {
      removeFromCart(id)
      return
    }
    setCart(cart.map(i => i.id === id ? { ...i, quantidade: novaQuantidade } : i))
  }

  async function finalizar() {
    const payload = { produtos: cart.map(i => ({ id: i.id, quantidade: i.quantidade })), descontoPercentual: Number(desconto) }
    try {
      const res = await axios.post(`${api}/sales`, payload)
      setMessage({ type: 'success', text: 'Venda registrada com sucesso!' })
      setCart([])
      setDesconto(0)
      fetchProducts()
    } catch (err) {
      const text = err?.response?.data?.error || err.message || 'Erro ao registrar venda'
      setMessage({ type: 'error', text })
    }
  }

  const subtotal = cart.reduce((s, i) => s + i.preco * i.quantidade, 0)
  const total = subtotal * (1 - desconto / 100)

  return (
    <div className="grid grid-2">
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>🛒 Produtos Disponíveis</h2>
        <div className="product-list">
          {products.map(p => (
            <div key={p.id} className="product-card">
              <h3>{p.nome}</h3>
              <div style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--primary-color)',
                margin: '1rem 0'
              }}>
                R$ {Number(p.preco).toFixed(2)}
              </div>
              <div style={{ 
                color: p.estoque > 10 ? 'var(--success-color)' : 'var(--warning-color)',
                marginBottom: '1rem'
              }}>
                Estoque: {p.estoque} unidades
              </div>
              <button 
                className="btn-primary" 
                onClick={() => addToCart(p)}
                disabled={p.estoque <= 0}
                style={{ width: '100%' }}
              >
                {p.estoque <= 0 ? 'Sem Estoque' : '+ Adicionar ao Carrinho'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>🛍️ Carrinho de Compras</h2>
        {message && (
          <div className={`alert alert-${message.type}`} style={{ marginBottom: '1rem' }}>
            {message.text}
          </div>
        )}
        
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color)' }}>
            Carrinho vazio. Adicione produtos para iniciar uma venda.
          </div>
        ) : (
          <>
            <div className="cart-items" style={{ marginBottom: '1.5rem' }}>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div>
                    <h4>{item.nome}</h4>
                    <div>R$ {Number(item.preco).toFixed(2)} cada</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button 
                      className="btn-secondary"
                      onClick={() => updateQuantidade(item.id, item.quantidade - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantidade}</span>
                    <button 
                      className="btn-secondary"
                      onClick={() => updateQuantidade(item.id, item.quantidade + 1)}
                    >
                      +
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={() => removeFromCart(item.id)}
                      style={{ marginLeft: '0.5rem' }}
                    >
                      🗑️
                    </button>
                  </div>
                  <div style={{ fontWeight: 'bold' }}>
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f8f9fa' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>💯 Desconto (%):</span>
                <input 
                  type="number" 
                  value={desconto} 
                  onChange={e => setDesconto(Math.min(100, Math.max(0, e.target.value)))}
                  style={{
                    width: '80px',
                    padding: '0.5rem',
                    border: '1px solid var(--accent-color)',
                    borderRadius: 'var(--border-radius)'
                  }}
                  min="0"
                  max="100"
                />
              </label>
              {desconto > 0 && (
                <div style={{ marginTop: '0.5rem', color: 'var(--success-color)' }}>
                  Economia: R$ {(subtotal - total).toFixed(2)}
                </div>
              )}
            </div>

            <div style={{ 
              backgroundColor: 'var(--primary-color)',
              padding: '1.5rem',
              borderRadius: 'var(--border-radius)',
              color: 'white',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              {desconto > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Desconto ({desconto}%):</span>
                  <span>- R$ {(subtotal - total).toFixed(2)}</span>
                </div>
              )}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                marginTop: '0.5rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid rgba(255,255,255,0.2)'
              }}>
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              className="btn-primary"
              onClick={finalizar}
              style={{ width: '100%', padding: '1rem' }}
            >
              💰 Finalizar Venda
            </button>
          </>
        )}
      </div>
    </div>
  )
}
