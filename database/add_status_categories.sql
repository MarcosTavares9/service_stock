-- Script para adicionar coluna status na tabela categories
-- Execute este script conectado ao banco Stock_Control no pgAdmin

-- Adicionar coluna status
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS status VARCHAR(10) DEFAULT 'true';

-- Atualizar registros existentes para 'true' (ativo)
UPDATE categories 
SET status = 'true' 
WHERE status IS NULL;

-- Verificar os dados atualizados
SELECT 'Categorias:' as tabela, COUNT(*) as total, 
  COUNT(*) FILTER (WHERE status = 'true') as ativos,
  COUNT(*) FILTER (WHERE status = 'false') as inativos,
  COUNT(*) FILTER (WHERE status = 'blocked') as bloqueados
FROM categories;
