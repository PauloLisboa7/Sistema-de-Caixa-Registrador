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
    <div className="fade-in">
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

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>📋 Histórico de Vendas</h2>
        {sales.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color)' }}>
            Nenhuma venda registrada.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sales.map(sale => (
              <div key={sale.id} className="card" style={{ 
                border: '1px solid var(--accent-color)',
                backgroundColor: '#fff'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  backgroundColor: 'var(--accent-color)',
                  color: 'white',
                  borderRadius: 'var(--border-radius)'
                }}>
                  <span>{new Date(sale.data).toLocaleString()}</span>
                  <span style={{ fontWeight: 'bold' }}>
                    R$ {Number(sale.total).toFixed(2)}
                  </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>🛍️ Itens da Venda</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {sale.produtos && sale.produtos.map((produto, idx) => (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '0.5rem',
                        backgroundColor: '#f8f9fa',
                        borderRadius: 'var(--border-radius)'
                      }}>
                        <div>
                          <strong>{produto.nome}</strong>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                            {produto.quantidade}x R$ {Number(produto.preco).toFixed(2)}
                          </div>
                        </div>
                        <div style={{ fontWeight: 'bold' }}>
                          R$ {Number(produto.subtotal).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {sale.descontoPercentual > 0 && (
                  <div style={{ 
                    color: 'var(--success-color)', 
                    marginTop: '0.5rem',
                    fontSize: '0.9rem'
                  }}>
                    Desconto aplicado: {sale.descontoPercentual}%
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
