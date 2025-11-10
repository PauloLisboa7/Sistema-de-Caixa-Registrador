require('dotenv').config()
const supabase = require('../services/supabaseClient')

async function clean() {
  try {
    const { data: produtos, error } = await supabase.from('produtos').select('*').order('id', { ascending: true })
    if (error) {
      console.error('Erro ao listar produtos:', error.message || error)
      process.exit(1)
    }

    const seen = new Map()
    const toDelete = []
    for (const p of produtos) {
      const key = (p.nome || '').trim().toLowerCase()
      if (!key) continue
      if (seen.has(key)) {
        // marcar para deletar (manter o primeiro)
        toDelete.push(p.id)
      } else {
        seen.set(key, p.id)
      }
    }

    if (toDelete.length === 0) {
      console.log('Nenhuma duplicata encontrada.')
      process.exit(0)
    }

    // deletar por ids
    const { error: delErr } = await supabase.from('produtos').delete().in('id', toDelete)
    if (delErr) {
      console.error('Erro ao deletar duplicatas:', delErr.message || delErr)
      process.exit(1)
    }

    console.log('Duplicatas removidas. IDs deletados:', toDelete)
    process.exit(0)
  } catch (err) {
    console.error('Erro inesperado:', err.message || err)
    process.exit(1)
  }
}

clean()
