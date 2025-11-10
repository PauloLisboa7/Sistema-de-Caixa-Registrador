import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Products() {
  const [products, setProducts] = useState([])
  const api = process.env.VITE_API_URL || 'http://localhost:4000/api'

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const res = await axios.get(`${api}/products`)
    setProducts(res.data)
  }

  return (
    <div>
      <h2>Produtos</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.nome} — R$ {p.preco} — estoque: {p.estoque}</li>
        ))}
      </ul>
    </div>
  )
}
