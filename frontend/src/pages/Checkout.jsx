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
    setTimeout(() => setMessage(null), 3000)
  }

  function removeFromCart(id) {
    setCart(cart.filter(i => i.id !== id))
    setMessage({ type: 'info', text: 'Item removido do carrinho' })
    setTimeout(() => setMessage(null), 3000)
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
    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Adicione produtos antes de finalizar' })
      return
    }
    const payload = { produtos: cart.map(i => ({ id: i.id, quantidade: i.quantidade })), descontoPercentual: Number(desconto) }
    try {
      const res = await axios.post(`${api}/sales`, payload)
      setMessage({ type: 'success', text: 'Venda registrada com sucesso!' })
      setCart([])
      setDesconto(0)
      fetchProducts()
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      const text = err?.response?.data?.error || err.message || 'Erro ao registrar venda'
      setMessage({ type: 'error', text })
    }
  }

  const subtotal = cart.reduce((s, i) => s + i.preco * i.quantidade, 0)
  const total = subtotal * (1 - desconto / 100)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Produtos Disponíveis */}
      <div className="lg:col-span-2">
        <div className="card-premium mb-6">
          <h2 className="text-2xl font-bold text-meat-700 flex items-center gap-2">
            � Produtos Disponíveis
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(p => (
            <div 
              key={p.id} 
              className={`card ${p.estoque <= 0 ? 'opacity-50' : ''} hover:shadow-meat-lg transition-all duration-300`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-meat-700">{p.nome}</h3>
                <span className={`badge ${
                  p.estoque > 10 ? 'badge-success' : p.estoque > 0 ? 'badge-warning' : 'badge-danger'
                }`}>
                  {p.estoque} un
                </span>
              </div>
              
              <div className="border-b border-meat-100 py-2 mb-3">
                <div className="text-2xl font-bold gradient-text">
                  R$ {Number(p.preco).toFixed(2)}
                </div>
              </div>

              <button 
                className={p.estoque <= 0 ? 'btn-primary opacity-50 cursor-not-allowed' : 'btn-primary w-full'}
                onClick={() => addToCart(p)}
                disabled={p.estoque <= 0}
              >
                {p.estoque <= 0 ? '❌ Sem Estoque' : '➕ Adicionar ao Carrinho'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Carrinho */}
      <div>
        <div className="card-premium sticky top-24">
          <h2 className="text-2xl font-bold text-meat-700 flex items-center gap-2 mb-4">
            � Carrinho
          </h2>

          {/* Mensagens */}
          {message && (
            <div className={`alert alert-${message.type} mb-4 text-sm animate-slide-in-up`}>
              {message.text}
            </div>
          )}

          {/* Itens do Carrinho */}
          {cart.length === 0 ? (
            <div className="text-center py-8 text-meat-600">
              <p className="text-2xl mb-2">🛍️</p>
              <p className="font-semibold">Carrinho vazio</p>
              <p className="text-sm mt-2">Adicione produtos para iniciar</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="bg-meat-50 p-3 rounded-meat border-l-4 border-meat-600">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-meat-700 text-sm">{item.nome}</h4>
                      <button
                        className="text-red-600 hover:text-red-700 font-bold"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <span className="text-meat-600">R$ {Number(item.preco).toFixed(2)}</span>
                      <span className="font-bold text-meat-700">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <button
                        className="px-2 py-1 bg-meat-600 text-white text-xs rounded font-bold hover:bg-meat-700"
                        onClick={() => updateQuantidade(item.id, item.quantidade - 1)}
                      >
                        −
                      </button>
                      <span className="font-bold text-meat-700 min-w-8 text-center">{item.quantidade}</span>
                      <button
                        className="px-2 py-1 bg-meat-600 text-white text-xs rounded font-bold hover:bg-meat-700"
                        onClick={() => updateQuantidade(item.id, item.quantidade + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desconto */}
              <div className="bg-gold-50 p-3 rounded-meat mb-4 border-2 border-gold-200">
                <label className="block text-sm font-bold text-meat-700 mb-2">
                  💯 Desconto (%)
                </label>
                <input 
                  type="number" 
                  value={desconto} 
                  onChange={e => setDesconto(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="input-field text-sm"
                  min="0"
                  max="100"
                />
                {desconto > 0 && (
                  <div className="mt-2 text-sm font-bold text-emerald-700">
                    💰 Economia: R$ {(subtotal - total).toFixed(2)}
                  </div>
                )}
              </div>

              {/* Resumo */}
              <div className="bg-gradient-to-br from-meat-600 to-meat-700 text-white p-4 rounded-meat mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-bold">R$ {subtotal.toFixed(2)}</span>
                </div>
                {desconto > 0 && (
                  <div className="flex justify-between text-sm border-t border-meat-500 pt-2">
                    <span>Desconto ({desconto}%):</span>
                    <span className="font-bold">- R$ {(subtotal - total).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-meat-500 pt-2 mt-2">
                  <span>Total:</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Botão Finalizar */}
              <button 
                className="btn-success w-full py-3 text-lg"
                onClick={finalizar}
              >
                💰 Finalizar Venda
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
