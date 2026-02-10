-- Script para adicionar coluna status na tabela locations
-- Execute este script conectado ao banco Stock_Control no pgAdmin

-- Remover coluna active (se existir)
ALTER TABLE locations 
DROP COLUMN IF EXISTS active;

-- Adicionar coluna status
ALTER TABLE locations 
ADD COLUMN IF NOT EXISTS status VARCHAR(10) DEFAULT 'true';

-- Atualizar registros existentes para 'true' (ativo)
UPDATE locations 
SET status = 'true' 
WHERE status IS NULL;

-- Verificar os dados atualizados
SELECT 'Localizações:' as tabela, COUNT(*) as total, 
  COUNT(*) FILTER (WHERE status = 'true') as ativos,
  COUNT(*) FILTER (WHERE status = 'false') as inativos,
  COUNT(*) FILTER (WHERE status = 'blocked') as bloqueados
FROM locations;
