require('dotenv').config()
const supabase = require('../services/supabaseClient')

async function seed() {
  try {
    const produtos = [
      { nome: 'Picanha', preco: 59.9, estoque: 20 },
      { nome: 'Alcatra', preco: 34.5, estoque: 25 },
      { nome: 'Fraldinha', preco: 28.0, estoque: 15 },
      { nome: 'Cupim', preco: 22.5, estoque: 10 },
      { nome: 'Contra Filé', preco: 39.9, estoque: 18 }
    ]

    const { data, error } = await supabase.from('produtos').insert(produtos).select()
    if (error) {
      // mensagem amigável caso tabela não exista
      if (error.message && error.message.toLowerCase().includes('relation "produtos" does not exist')) {
        console.error('Erro: tabela `produtos` não encontrada no banco. Rode o SQL em backend/scripts/create_tables.sql no Supabase.')
      } else {
        console.error('Erro ao inserir produtos:', error.message || error)
      }
      process.exit(1)
    }

    console.log('Seed concluído. Produtos inseridos:')
    console.table(data)
    process.exit(0)
  } catch (err) {
    console.error('Erro inesperado durante seed:', err.message || err)
    process.exit(1)
  }
}

seed()
