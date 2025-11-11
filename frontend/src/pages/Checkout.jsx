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
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border-2 border-amber-200 mb-6">
          <h2 className="text-3xl font-black text-amber-900">📦 Produtos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p.id} className={`bg-white rounded-xl shadow-lg p-6 border border-amber-100 transition-all ${p.estoque <= 0 ? 'opacity-50' : 'hover:shadow-xl'}`}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-amber-900">{p.nome}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.estoque > 10 ? 'bg-green-100 text-green-800' : p.estoque > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {p.estoque} un
                </span>
              </div>
              <div className="border-b border-amber-100 py-3 mb-3">
                <div className="text-3xl font-black text-amber-700">R$ {Number(p.preco).toFixed(2)}</div>
              </div>
              <button 
                className={`w-full py-2 font-bold rounded-lg transition-all ${p.estoque <= 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-amber-700 text-white hover:bg-amber-800 shadow-lg'}`}
                onClick={() => addToCart(p)}
                disabled={p.estoque <= 0}
              >
                {p.estoque <= 0 ? '❌ Sem Estoque' : '➕ Adicionar'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Carrinho */}
      <div>
        <div className="bg-gradient-to-b from-amber-50 to-orange-50 sticky top-24 rounded-xl shadow-xl p-6 border-2 border-amber-200">
          <h2 className="text-2xl font-black text-amber-900 mb-4">🛒 Carrinho</h2>

          {message && (
            <div className={`p-3 rounded-lg mb-4 text-sm font-bold animate-slide-in-up ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-blue-100 text-blue-800 border border-blue-300'}`}>
              {message.text}
            </div>
          )}

          {cart.length === 0 ? (
            <div className="text-center py-8 text-amber-700">
              <p className="text-4xl mb-2">🛍️</p>
              <p className="font-bold text-lg">Carrinho vazio</p>
              <p className="text-sm mt-2">Adicione produtos</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="bg-amber-100 p-3 rounded-lg border-l-4 border-amber-700">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-amber-900 text-sm">{item.nome}</h4>
                      <button className="text-red-600 hover:text-red-800 font-bold" onClick={() => removeFromCart(item.id)}>✕</button>
                    </div>
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <span className="text-amber-800">R$ {Number(item.preco).toFixed(2)}</span>
                      <span className="font-bold text-amber-900">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <button className="px-2 py-1 bg-amber-700 text-white text-xs rounded font-bold hover:bg-amber-800" onClick={() => updateQuantidade(item.id, item.quantidade - 1)}>−</button>
                      <span className="font-bold text-amber-900 min-w-8 text-center">{item.quantidade}</span>
                      <button className="px-2 py-1 bg-amber-700 text-white text-xs rounded font-bold hover:bg-amber-800" onClick={() => updateQuantidade(item.id, item.quantidade + 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-100 p-3 rounded-lg mb-4 border-2 border-yellow-400">
                <label className="block text-sm font-bold text-amber-900 mb-2">💯 Desconto (%)</label>
                <input type="number" value={desconto} onChange={e => setDesconto(Math.min(100, Math.max(0, Number(e.target.value))))} className="w-full px-3 py-2 rounded-lg border-2 border-yellow-300 focus:border-amber-700 focus:outline-none text-sm" min="0" max="100"/>
                {desconto > 0 && <div className="mt-2 text-sm font-bold text-green-700">💰 Economia: R$ {(subtotal - total).toFixed(2)}</div>}
              </div>

              <div className="bg-gradient-to-b from-amber-700 to-amber-800 text-white p-4 rounded-lg mb-4 space-y-2">
                <div className="flex justify-between text-sm"><span>Subtotal:</span><span className="font-bold">R$ {subtotal.toFixed(2)}</span></div>
                {desconto > 0 && <div className="flex justify-between text-sm border-t border-amber-600 pt-2"><span>Desconto ({desconto}%):</span><span className="font-bold">- R$ {(subtotal - total).toFixed(2)}</span></div>}
                <div className="flex justify-between text-lg font-black border-t border-amber-600 pt-2 mt-2"><span>Total:</span><span>R$ {total.toFixed(2)}</span></div>
              </div>

              <button className="w-full py-3 bg-green-600 text-white text-lg font-black rounded-lg hover:bg-green-700 transition-all shadow-lg" onClick={finalizar}>💰 Finalizar Venda</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
