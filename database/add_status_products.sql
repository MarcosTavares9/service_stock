-- Script para adicionar coluna status na tabela products
-- Execute este script conectado ao banco Stock_Control no pgAdmin

-- Primeiro, renomear a coluna status existente para stock_status
ALTER TABLE products 
RENAME COLUMN status TO stock_status;

-- Adicionar nova coluna status para controle
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS status VARCHAR(10) DEFAULT 'true';

-- Atualizar registros existentes para 'true' (ativo)
UPDATE products 
SET status = 'true' 
WHERE status IS NULL;

-- Verificar os dados atualizados
SELECT 'Produtos:' as tabela, COUNT(*) as total, 
  COUNT(*) FILTER (WHERE status = 'true') as ativos,
  COUNT(*) FILTER (WHERE status = 'false') as inativos,
  COUNT(*) FILTER (WHERE status = 'blocked') as bloqueados
FROM products;
