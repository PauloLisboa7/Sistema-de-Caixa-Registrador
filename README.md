# Sistema de Caixa Registrador

Projeto Fullstack simples para um caixa de supermercado (açougue).

Estrutura:
- backend: API RESTful (Express) conectando ao Supabase
- frontend: React + Vite consumindo a API

Veja as pastas `backend/` e `frontend/` para instruções de execução.

Status atual do projeto:
- Backend: Express + Supabase (rotas CRUD para produtos e vendas). Implementada proteção/fallback para casos de schema ausente e endpoint para total das vendas do dia.
- Frontend: React + Vite com páginas Produtos, Caixa (carrinho) e Histórico. Checkout exibe mensagens de sucesso/erro.

Observações importantes:
- Execute `backend/scripts/create_tables.sql` e, se desejar, `backend/scripts/create_function.sql` no editor SQL do Supabase para garantir que o schema e a função transacional existam no banco.
- Use `npm run seed` para inserir produtos de exemplo (após criar as tabelas).

