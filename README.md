# Sistema de Caixa Registrador

Projeto Fullstack simples para um caixa de supermercado (açougue) com funcionalidades de:
- Cadastro e listagem de produtos
- Carrinho de compras com desconto
- Histórico de vendas e total do dia
- Controle de estoque automático
- Proteção transacional (via função SQL ou fallback em código)

## Instalação e Execução

1. Clone o repositório
2. Configure o banco Supabase:
   - Execute `backend/scripts/create_tables.sql` no editor SQL
   - (Opcional) Execute `backend/scripts/create_function.sql` para proteção transacional
   - Copie `.env.example` para `.env` e configure as variáveis

3. Backend (porta 4001):
```bash
cd backend
npm install
npm run seed    # popula o banco com produtos de exemplo
npm run dev     # inicia o servidor
```

4. Frontend (porta 5174):
```bash
cd frontend
npm install
npm run dev -- --port 5174
```

5. Acesse http://localhost:5174

## Funcionalidades

- **Produtos**: CRUD completo com validação de estoque
- **Vendas**: 
  - Carrinho de compras intuitivo
  - Aplicação de desconto em porcentagem
  - Validação de estoque em tempo real
  - Atualização automática após venda
- **Histórico**:
  - Lista de todas as vendas
  - Total de vendas do dia
  - Detalhes de produtos e descontos

## Tecnologias

- Backend: Node.js, Express, Supabase
- Frontend: React, Vite
- Banco: PostgreSQL (via Supabase)

## Observações

- A função transacional SQL (`create_function.sql`) é opcional - existe um fallback em código
- O sistema usa porta 4001 para evitar conflitos com outros serviços
- Produtos de exemplo são focados em açougue mas podem ser alterados

## Segurança

- Todas as operações que alteram dados são protegidas (transação SQL ou código)
- Validações de estoque previnem vendas impossíveis
- Estrutura preparada para novos recursos de segurança
