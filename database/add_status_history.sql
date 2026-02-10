-- Script para adicionar coluna status na tabela history
-- Execute este script conectado ao banco Stock_Control no pgAdmin

-- Adicionar coluna status
ALTER TABLE history 
ADD COLUMN IF NOT EXISTS status VARCHAR(10) DEFAULT 'true';

-- Atualizar registros existentes para 'true' (ativo)
UPDATE history 
SET status = 'true' 
WHERE status IS NULL;

-- Verificar os dados atualizados
SELECT 'Histórico:' as tabela, COUNT(*) as total, 
  COUNT(*) FILTER (WHERE status = 'true') as ativos,
  COUNT(*) FILTER (WHERE status = 'false') as inativos,
  COUNT(*) FILTER (WHERE status = 'blocked') as bloqueados
FROM history;
