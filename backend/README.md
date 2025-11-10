# Backend

Instruções rápidas:

1. Copiar `.env.example` para `.env` e preencher `SUPABASE_KEY` com a chave do Supabase (não commitá-la).

2. Instalar dependências:

```powershell
cd backend
npm install
```

3. Rodar em desenvolvimento:

```powershell
npm run dev
```

Tabelas esperadas no Supabase:

```sql
create table produtos (
  id serial primary key,
  nome text,
  preco numeric,
  estoque integer
);

create table vendas (
  id serial primary key,
  data timestamptz,
  total numeric,
  produtos jsonb,
  descontoPercentual numeric
);
```
