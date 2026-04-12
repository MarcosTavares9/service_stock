-- Migration: add_role_to_users
-- Adiciona a coluna role na tabela users para suporte a RBAC
-- Roles disponíveis: 'Administrador', 'Gerente', 'Operador'
-- Default: 'Operador' (menor privilégio por padrão)

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'Operador';

-- Rollback:
-- ALTER TABLE users DROP COLUMN IF EXISTS role;
