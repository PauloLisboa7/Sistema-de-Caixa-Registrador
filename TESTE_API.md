# 🧪 Teste Completo da API - Sistema de Caixa Registrador

## ✅ Verificação de Funcionamento

### 1️⃣ Produtos Endpoint

**GET /api/products** - Listar todos os produtos
```
Esperado: Array com produtos do Supabase
```

**POST /api/products/sync** - Sincronizar produtos
```
Esperado: { success: true, count: X, data: [...] }
```

**POST /api/products** - Criar novo produto
```json
{
  "nome": "Bife Ancho",
  "preco": 45.90,
  "estoque": 15
}
```
Esperado: Produto criado no Supabase com ID

**PUT /api/products/:id** - Atualizar produto
```json
{
  "preco": 50.00,
  "estoque": 20
}
```
Esperado: Produto atualizado no Supabase

**DELETE /api/products/:id** - Deletar produto
Esperado: { deleted: true }

---

### 2️⃣ Vendas Endpoint

**POST /api/sales** - Registrar venda
```json
{
  "produtos": [
    { "id": 1, "quantidade": 2 },
    { "id": 2, "quantidade": 1 }
  ],
  "descontoPercentual": 10
}
```
Esperado: 
- Venda registrada no Supabase
- Estoque dos produtos atualizado
- Retorna detalhes da venda

**GET /api/sales** - Listar vendas
Esperado: Array com todas as vendas

**GET /api/sales/total-day** - Total do dia
Esperado: { total: X.XX }

---

## 🗄️ Verificação Supabase

1. Tabela `produtos` deve ter registros
2. Tabela `vendas` deve armazenar vendas com desconto
3. Verificar que estoque é decrementado após venda
4. Verificar que desconto é aplicado corretamente

---

## 🎯 Teste Manual no Navegador

1. ✅ Abrir http://localhost:5174
2. ✅ Visualizar produtos carregados (página Produtos)
3. ✅ Clicar em "🔄 Sincronizar" (deve recarregar lista)
4. ✅ Adicionar produto ao carrinho
5. ✅ Aplicar desconto (10%)
6. ✅ Finalizar venda
7. ✅ Verificar histórico
8. ✅ Verificar painel admin

---

## 🔐 Verificação de Variáveis de Ambiente

Backend (.env):
- ✅ SUPABASE_URL definida
- ✅ SUPABASE_KEY definida
- ✅ PORT=4001

Frontend (.env):
- ✅ VITE_API_URL=http://localhost:4001/api

---

## 📊 Fluxo Esperado

```
1. Frontend carrega produtos via GET /api/products
2. Usuário clica em "Sincronizar" → POST /api/products/sync
3. Usuário adiciona produtos ao carrinho
4. Usuário finaliza venda → POST /api/sales
5. Backend atualiza estoque no Supabase
6. Usuário pode ver histórico → GET /api/sales
```

---

## ✨ Status

- Backend: ✅ Rodando na porta 4001
- Frontend: ✅ Rodando na porta 5174
- Supabase: ✅ Conectado
- Rota de sync: ✅ Implementada
