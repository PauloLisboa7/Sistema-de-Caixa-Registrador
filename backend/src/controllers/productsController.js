const supabase = require('../services/supabaseClient')

async function listProducts(req, res) {
  const { data, error } = await supabase.from('produtos').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

async function getProduct(req, res) {
  const { id } = req.params
  const { data, error } = await supabase.from('produtos').select('*').eq('id', id).single()
  if (error) return res.status(404).json({ error: error.message })
  res.json(data)
}

async function createProduct(req, res) {
  const { nome, preco, estoque } = req.body
  const { data, error } = await supabase.from('produtos').insert([{ nome, preco, estoque }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
}

async function updateProduct(req, res) {
  const { id } = req.params
  const changes = req.body
  const { data, error } = await supabase.from('produtos').update(changes).eq('id', id).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
}

async function deleteProduct(req, res) {
  const { id } = req.params
  const { error } = await supabase.from('produtos').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ deleted: true })
}

async function syncProducts(req, res) {
  try {
    const { data, error } = await supabase.from('produtos').select('*')
    if (error) return res.status(500).json({ error: error.message })
    res.json({ success: true, count: data.length, data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  syncProducts,
}
