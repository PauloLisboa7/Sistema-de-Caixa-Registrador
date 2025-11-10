import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function History() {
  const [sales, setSales] = useState([])
  const [totalDay, setTotalDay] = useState(0)
  const api = import.meta.env.VITE_API_URL || 'http://localhost:4001/api'

  useEffect(() => { fetchSales() }, [])

  async function fetchSales() {
    const res = await axios.get(`${api}/sales`)
    setSales(res.data)
    // buscar total do dia
    try {
      const t = await axios.get(`${api}/sales/total-day`)
      setTotalDay(t.data.total || 0)
    } catch (e) {
      setTotalDay(0)
    }
  }

  return (
    <div>
      <h2>Histórico de Vendas</h2>
      <div className="card" style={{ 
        marginBottom: '1.5rem',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>💰 Total de Vendas Hoje</h3>
        <div style={{ 
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          R$ {Number(totalDay).toFixed(2)}
        </div>
      </div>
      <ul>
        {sales.map(s => (
          <li key={s.id}>{new Date(s.data).toLocaleString()} — R$ {s.total} — produtos: {s.produtos ? s.produtos.length : 0}</li>
        ))}
      </ul>
    </div>
  )
}
