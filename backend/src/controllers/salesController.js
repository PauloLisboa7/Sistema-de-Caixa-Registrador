
const supabase = require('../services/supabaseClient')

// Estrutura esperada de venda: { produtos: [{ id, quantidade }], descontoPercentual }
// Implementação preferencial: chamar função SQL transacional 'create_sale' no banco (RPC).
// Fallback: implementar lógica sequencial (menos segura) caso a função não exista.
async function createSale(req, res) {
  const { produtos, descontoPercentual = 0 } = req.body
  if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
    return res.status(400).json({ error: 'Lista de produtos é obrigatória' })
  }

  // Preparar payload básico (a função SQL espera um JSON com produtos e desconto)
  const vendaPayload = { produtos, descontoPercentual }

  try {
    // Tenta usar a função SQL transacional (criada em backend/scripts/create_function.sql)
    const { data, error } = await supabase.rpc('create_sale', { sale: JSON.stringify(vendaPayload) })
    if (error) {
      // Se função não existir ou erro no RPC, cair para o fallback
      console.warn('RPC create_sale falhou, fallback para lógica em JS:', error.message || error)
      return await createSaleFallback(req, res)
    }

    // Supabase RPC pode retornar o registro inserido
    return res.status(201).json(data)
  } catch (err) {
    console.warn('Erro ao chamar RPC create_sale, executando fallback:', err.message || err)
    return await createSaleFallback(req, res)
  }
}

async function createSaleFallback(req, res) {
  // Lógica existente (menos segura): validar, calcular, atualizar e inserir
  const { produtos, descontoPercentual = 0 } = req.body

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

  if (descontoPercentual > 0) {
    total = total * (1 - descontoPercentual / 100)
  }

  for (const item of produtos) {
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
  if (err2) {
    // fallback: se coluna descontoPercentual não existir no banco, tentar inserir sem ela
    const msg = (err2.message || '').toString().toLowerCase()
    if (msg.includes('descontopercentual') || msg.includes('descontoPercentual'.toLowerCase())) {
      const venda2 = { ...venda }
      delete venda2.descontoPercentual
      const { data: vendaInserida2, error: err3 } = await supabase.from('vendas').insert([venda2]).select()
      if (err3) return res.status(500).json({ error: err3.message })
      return res.status(201).json(vendaInserida2[0])
    }
    return res.status(500).json({ error: err2.message })
  }

  res.status(201).json(vendaInserida[0])
}

async function listSales(req, res) {
  const { data, error } = await supabase.from('vendas').select('*').order('data', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

async function totalSalesToday(req, res) {
  // calcula o total de vendas do dia atual (timezone do banco)
  try {
    const startOfDay = new Date()
    startOfDay.setHours(0,0,0,0)
    const iso = startOfDay.toISOString()
    const { data, error } = await supabase.from('vendas').select('total').gte('data', iso)
    if (error) return res.status(500).json({ error: error.message })
    const total = data.reduce((s, v) => s + Number(v.total || 0), 0)
    res.json({ total })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { createSale, listSales }
