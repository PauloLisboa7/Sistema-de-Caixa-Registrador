const express = require('express')
const { supabase } = require('../config/supabase')
const router = express.Router()

// Sincronizar estoque
router.post('/sync', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('nome')
    
    if (error) throw error

    // Verifica cada produto e atualiza se necessário
    const updates = data.map(async (product) => {
      if (product.nome.includes('PICANHA')) {
        // Atualiza para manter 13 unidades para picanhas
        if (product.estoque !== 13) {
          const { error: updateError } = await supabase
            .from('produtos')
            .update({ estoque: 13 })
            .eq('id', product.id)
          
          if (updateError) throw updateError
        }
      }
    })

    await Promise.all(updates)
    
    // Busca dados atualizados
    const { data: updatedData, error: finalError } = await supabase
      .from('produtos')
      .select('*')
      .order('nome')
    
    if (finalError) throw finalError
    res.json(updatedData)
  } catch (err) {
    console.error('Erro ao sincronizar produtos:', err)
    res.status(500).json({ error: 'Erro ao sincronizar produtos' })
  }
})

// Listar produtos
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('nome')
    
    if (error) throw error
    res.json(data)
  } catch (err) {
    console.error('Erro ao listar produtos:', err)
    res.status(500).json({ error: 'Erro ao listar produtos' })
  }
})

// Adicionar produto
router.post('/', async (req, res) => {
  try {
    const { nome, preco, estoque } = req.body
    
    if (!nome || !preco || !estoque) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
    }

    const { data, error } = await supabase
      .from('produtos')
      .insert([{ nome, preco, estoque }])
      .select()
    
    if (error) throw error
    res.status(201).json(data[0])
  } catch (err) {
    console.error('Erro ao adicionar produto:', err)
    res.status(500).json({ error: 'Erro ao adicionar produto' })
  }
})

// Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nome, preco, estoque } = req.body
    
    if (!nome || !preco || !estoque) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
    }

    const { data, error } = await supabase
      .from('produtos')
      .update({ nome, preco, estoque })
      .eq('id', id)
      .select()
    
    if (error) throw error
    if (data.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }
    res.json(data[0])
  } catch (err) {
    console.error('Erro ao atualizar produto:', err)
    res.status(500).json({ error: 'Erro ao atualizar produto' })
  }
})

// Excluir produto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    res.status(204).send()
  } catch (err) {
    console.error('Erro ao excluir produto:', err)
    res.status(500).json({ error: 'Erro ao excluir produto' })
  }
})

module.exports = router