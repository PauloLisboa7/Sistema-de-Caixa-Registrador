const express = require('express')
const cors = require('cors')
const productsRouter = require('./routes/products')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Rotas
app.use('/api/products', productsRouter)

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erro interno do servidor' })
})

const PORT = process.env.PORT || 4001
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})