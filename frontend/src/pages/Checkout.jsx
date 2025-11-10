import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Checkout() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [desconto, setDesconto] = useState(0)
  const api = import.meta.env.VITE_API_URL || 'http://localhost:4001/api'

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const res = await axios.get(`${api}/products`)
    setProducts(res.data)
  }

  function addToCart(p) {
    const found = cart.find(i => i.id === p.id)
    if (found) {
      setCart(cart.map(i => i.id === p.id ? { ...i, quantidade: i.quantidade + 1 } : i))
    } else {
      setCart([...cart, { id: p.id, nome: p.nome, preco: p.preco, quantidade: 1 }])
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter(i => i.id !== id))
  }

  async function finalizar() {
    const payload = { produtos: cart.map(i => ({ id: i.id, quantidade: i.quantidade })), descontoPercentual: Number(desconto) }
    try {
      const res = await axios.post(`${api}/sales`, payload)
      setMessage({ type: 'success', text: 'Venda registrada. Total: R$ ' + Number(res.data.total).toFixed(2) })
      setCart([])
      fetchProducts()
    } catch (err) {
      const text = err?.response?.data?.error || err.message || 'Erro ao registrar venda'
      setMessage({ type: 'error', text })
    }
  }

  const subtotal = cart.reduce((s, i) => s + i.preco * i.quantidade, 0)
  const total = subtotal * (1 - desconto / 100)

  return (
    <div>
      <h2>Caixa</h2>
      {message && <div style={{ padding: 8, marginBottom: 8, color: message.type === 'error' ? 'crimson' : 'green' }}>{message.text}</div>}
      <div style={{ display: 'flex', gap: 20 }}>
        <div>
          <h3>Produtos</h3>
          <ul>
            {products.map(p => (
              <li key={p.id}>{p.nome} — R$ {p.preco} — estoque: {p.estoque} <button onClick={() => addToCart(p)}>Adicionar</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Carrinho</h3>
          <ul>
            {cart.map(i => (
              <li key={i.id}>{i.nome} x{i.quantidade} — R$ {i.preco * i.quantidade} <button onClick={() => removeFromCart(i.id)}>remover</button></li>
            ))}
          </ul>
          <div>
            <label>Desconto %: <input type="number" value={desconto} onChange={e => setDesconto(e.target.value)} /></label>
          </div>
          <div>Subtotal: R$ {subtotal.toFixed(2)}</div>
          <div>Total: R$ {total.toFixed(2)}</div>
          <button onClick={finalizar} disabled={cart.length===0}>Finalizar Venda</button>
        </div>
      </div>
    </div>
  )
}
