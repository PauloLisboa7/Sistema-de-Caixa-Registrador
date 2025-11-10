-- Função transacional para criar venda, validar e atualizar estoque em uma única transação
-- Uso: executar este SQL no Supabase SQL editor (requer privilégios)

create or replace function create_sale(sale json) returns jsonb as $$
declare
  prod record;
  v_total numeric := 0;
  produtos_json jsonb := '[]'::jsonb;
  num_updated int := 0;
begin
  perform pg_advisory_xact_lock(1); -- lock para esta transação

  -- validar estoque primeiro
  for prod in select * from json_to_recordset(sale->'produtos') as (id int, quantidade int)
  loop
    if (select estoque from produtos where id = prod.id) < prod.quantidade then
      raise exception 'Estoque insuficiente para produto %', prod.id;
    end if;
  end loop;

  -- calcular totais e atualizar estoque
  for prod in select * from json_to_recordset(sale->'produtos') as (id int, quantidade int)
  loop
    update produtos set estoque = produtos.estoque - prod.quantidade where produtos.id = prod.id;
    -- obter info do produto
    produtos_json = produtos_json || jsonb_build_array(jsonb_build_object('id', prod.id, 'quantidade', prod.quantidade, 'nome', (select nome from produtos where id = prod.id), 'preco', (select preco from produtos where id = prod.id)));
    v_total := v_total + ((select preco from produtos where id = prod.id) * prod.quantidade);
  end loop;

  -- aplicar desconto se existir
  if (sale ? 'descontoPercentual') then
    v_total := v_total * (1 - (sale->>'descontoPercentual')::numeric / 100);
  end if;

  -- inserir venda
  insert into vendas(data, total, produtos, descontoPercentual) values (now(), v_total, produtos_json, (sale->>'descontoPercentual')::numeric)
  returning to_jsonb(vendas.*) into prod;

  return prod;
end;
$$ language plpgsql;
