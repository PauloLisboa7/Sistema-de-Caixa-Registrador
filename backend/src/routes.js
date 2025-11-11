const express = require('express')
const router = express.Router()
const products = require('./controllers/productsController')
const sales = require('./controllers/salesController')

// Produtos
router.get('/products', products.listProducts)
router.post('/products/sync', products.syncProducts)
router.get('/products/:id', products.getProduct)
router.post('/products', products.createProduct)
router.put('/products/:id', products.updateProduct)
router.delete('/products/:id', products.deleteProduct)

// Vendas
router.post('/sales', sales.createSale)
router.get('/sales', sales.listSales)
router.get('/sales/total-day', sales.totalSalesToday)

module.exports = router
