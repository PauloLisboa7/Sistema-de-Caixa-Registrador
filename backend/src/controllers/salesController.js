const supabase = require('../services/supabaseClient')

// Estrutura esperada de venda: { produtos: [{ id, quantidade }], descontoPercentual }
async function createSale(req, res) {
  const { produtos, descontoPercentual = 0 } = req.body
  if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
    return res.status(400).json({ error: 'Lista de produtos é obrigatória' })
  }

  // Validar estoque e calcular total
  let total = 0
  const produtosDetalhados = []

  for (const item of produtos) {
    const { data: produto, error } = await supabase.from('produtos').select('*').eq('id', item.id).single()
    if (error || !produto) return res.status(400).json({ error: `Produto ${item.id} não encontrado` })
    if (produto.estoque < item.quantidade) return res.status(400).json({ error: `Estoque insuficiente para ${produto.nome}` })

    const subtotal = Number(produto.preco) * Number(item.quantidade)
    total += subtotal
    produtosDetalhados.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: item.quantidade, subtotal })
  }

  // Aplicar desconto
  if (descontoPercentual > 0) {
    total = total * (1 - descontoPercentual / 100)
  }

  // Atualizar estoque (sequencial) e registrar venda
  for (const item of produtos) {
    // obter estoque atual (novamente por segurança)
    const { data: p } = await supabase.from('produtos').select('estoque').eq('id', item.id).limit(1).single()
    const novoEstoque = Number(p.estoque) - Number(item.quantidade)
    await supabase.from('produtos').update({ estoque: novoEstoque }).eq('id', item.id)
  }

  const venda = {
    data: new Date().toISOString(),
    total,
    produtos: produtosDetalhados,
    descontoPercentual
  }

  const { data: vendaInserida, error: err2 } = await supabase.from('vendas').insert([venda]).select()
  if (err2) return res.status(500).json({ error: err2.message })

  res.status(201).json(vendaInserida[0])
}

async function listSales(req, res) {
  const { data, error } = await supabase.from('vendas').select('*').order('data', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

module.exports = { createSale, listSales }
