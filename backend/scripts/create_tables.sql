-- Criação das tabelas necessárias para o sistema de caixa

create table if not exists produtos (
  id serial primary key,
  nome text,
  preco numeric,
  estoque integer
);

create table if not exists vendas (
  id serial primary key,
  data timestamptz,
  total numeric,
  produtos jsonb,
  descontoPercentual numeric
);

-- Índices úteis
create index if not exists idx_vendas_data on vendas (data desc);
