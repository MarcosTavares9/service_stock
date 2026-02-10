-- Script para adicionar coluna status em todas as tabelas
-- Execute este script conectado ao banco Stock_Control no pgAdmin

-- Adicionar coluna status na tabela categories
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS status VARCHAR(10) DEFAULT 'true';

-- Atualizar registros existentes para 'true' (ativo)
UPDATE categories 
SET status = 'true' 
WHERE status IS NULL;

-- Adicionar coluna status na tabela products
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

-- Adicionar coluna status na tabela locations
-- Remover coluna active e adicionar status
ALTER TABLE locations 
DROP COLUMN IF EXISTS active;

ALTER TABLE locations 
ADD COLUMN IF NOT EXISTS status VARCHAR(10) DEFAULT 'true';

-- Atualizar registros existentes para 'true' (ativo)
UPDATE locations 
SET status = 'true' 
WHERE status IS NULL;

-- Adicionar coluna status na tabela users
-- Atualizar valores existentes
UPDATE users 
SET status = CASE 
  WHEN status = 'ativo' THEN 'true'
  WHEN status = 'inativo' THEN 'false'
  ELSE 'false'
END
WHERE status NOT IN ('true', 'false', 'blocked');

-- Garantir que todos os usuários tenham status válido
UPDATE users 
SET status = 'false' 
WHERE status IS NULL OR status NOT IN ('true', 'false', 'blocked');

-- Adicionar coluna status na tabela history
ALTER TABLE history 
ADD COLUMN IF NOT EXISTS status VARCHAR(10) DEFAULT 'true';

-- Atualizar registros existentes para 'true' (ativo)
UPDATE history 
SET status = 'true' 
WHERE status IS NULL;

-- Verificar os dados atualizados
SELECT 'Categorias:' as tabela, COUNT(*) as total, 
  COUNT(*) FILTER (WHERE status = 'true') as ativos,
  COUNT(*) FILTER (WHERE status = 'false') as inativos,
  COUNT(*) FILTER (WHERE status = 'blocked') as bloqueados
FROM categories
UNION ALL
SELECT 'Produtos:', COUNT(*),
  COUNT(*) FILTER (WHERE status = 'true'),
  COUNT(*) FILTER (WHERE status = 'false'),
  COUNT(*) FILTER (WHERE status = 'blocked')
FROM products
UNION ALL
SELECT 'Localizações:', COUNT(*),
  COUNT(*) FILTER (WHERE status = 'true'),
  COUNT(*) FILTER (WHERE status = 'false'),
  COUNT(*) FILTER (WHERE status = 'blocked')
FROM locations
UNION ALL
SELECT 'Usuários:', COUNT(*),
  COUNT(*) FILTER (WHERE status = 'true'),
  COUNT(*) FILTER (WHERE status = 'false'),
  COUNT(*) FILTER (WHERE status = 'blocked')
FROM users
UNION ALL
SELECT 'Histórico:', COUNT(*),
  COUNT(*) FILTER (WHERE status = 'true'),
  COUNT(*) FILTER (WHERE status = 'false'),
  COUNT(*) FILTER (WHERE status = 'blocked')
FROM history;
