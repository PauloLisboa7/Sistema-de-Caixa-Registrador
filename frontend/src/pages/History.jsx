import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function History() {
  const [sales, setSales] = useState([])
  const api = process.env.VITE_API_URL || 'http://localhost:4000/api'

  useEffect(() => { fetchSales() }, [])

  async function fetchSales() {
    const res = await axios.get(`${api}/sales`)
    setSales(res.data)
  }

  return (
    <div>
      <h2>Histórico de Vendas</h2>
      <ul>
        {sales.map(s => (
          <li key={s.id}>{new Date(s.data).toLocaleString()} — R$ {s.total} — produtos: {s.produtos ? s.produtos.length : 0}</li>
        ))}
      </ul>
    </div>
  )
}
