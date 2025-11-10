import React, { useState, useEffect } from 'react'
import Products from './pages/Products'
import Checkout from './pages/Checkout'
import History from './pages/History'

export default function App() {
  const [page, setPage] = useState('products')

  return (
    <div style={{ padding: 20 }}>
      <header style={{ marginBottom: 20 }}>
        <button onClick={() => setPage('products')}>Produtos</button>
        <button onClick={() => setPage('checkout')}>Caixa</button>
        <button onClick={() => setPage('history')}>Histórico</button>
      </header>
      <main>
        {page === 'products' && <Products />}
        {page === 'checkout' && <Checkout />}
        {page === 'history' && <History />}
      </main>
    </div>
  )
}
