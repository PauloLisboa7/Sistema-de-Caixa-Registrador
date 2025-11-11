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
    <div className="animate-fade-in space-y-6">
      {/* Card Total do Dia */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-800 rounded-xl shadow-lg p-8 text-center text-white border-b-4 border-amber-900">
        <h3 className="text-lg font-bold mb-2">💰 Total de Vendas Hoje</h3>
        <div className="text-5xl font-black">
          R$ {Number(totalDay).toFixed(2)}
        </div>
      </div>

      {/* Card Histórico */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-100">
        <h2 className="text-3xl font-black text-amber-900 mb-6">📋 Histórico de Vendas</h2>
        
        {sales.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl font-semibold">Nenhuma venda registrada</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {sales.map(sale => (
              <div key={sale.id} className="bg-white border-l-4 border-amber-700 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
                {/* Header com Data e Total */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-4 flex justify-between items-center border-b-2 border-amber-200">
                  <span className="font-bold text-amber-900">
                    {new Date(sale.data).toLocaleString()}
                  </span>
                  <span className="text-2xl font-black text-amber-700">
                    R$ {Number(sale.total).toFixed(2)}
                  </span>
                </div>

                {/* Itens da Venda */}
                <div className="p-6">
                  <h4 className="text-lg font-bold text-amber-900 mb-4">🛍️ Itens da Venda</h4>
                  <div className="space-y-2">
                    {sale.produtos && sale.produtos.map((produto, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-bold text-gray-800">{produto.nome}</p>
                          <p className="text-sm text-gray-600">
                            {produto.quantidade}x R$ {Number(produto.preco).toFixed(2)}
                          </p>
                        </div>
                        <p className="font-black text-amber-700">
                          R$ {Number(produto.subtotal).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Desconto */}
                  {sale.descontoPercentual > 0 && (
                    <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-600 rounded">
                      <p className="text-sm font-bold text-green-700">
                        ✅ Desconto aplicado: {sale.descontoPercentual}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
