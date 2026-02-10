-- Script para atualizar coluna status na tabela users
-- Execute este script conectado ao banco Stock_Control no pgAdmin

-- Atualizar valores existentes de 'ativo'/'inativo' para 'true'/'false'
UPDATE users 
SET status = CASE 
  WHEN status = 'ativo' THEN 'true'
  WHEN status = 'inativo' THEN 'false'
  WHEN status = 'active' THEN 'true'
  WHEN status = 'inactive' THEN 'false'
  ELSE status
END
WHERE status NOT IN ('true', 'false', 'blocked');

-- Garantir que todos os usuários tenham status válido
-- Se status for NULL ou inválido, definir como 'false' (inativo)
UPDATE users 
SET status = 'false' 
WHERE status IS NULL OR status NOT IN ('true', 'false', 'blocked');

-- Verificar os dados atualizados
SELECT 'Usuários:' as tabela, COUNT(*) as total, 
  COUNT(*) FILTER (WHERE status = 'true') as ativos,
  COUNT(*) FILTER (WHERE status = 'false') as inativos,
  COUNT(*) FILTER (WHERE status = 'blocked') as bloqueados
FROM users;
