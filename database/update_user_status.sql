-- Script para atualizar o status do usuário para 'ativo'
-- Execute este script conectado ao banco Stock_Control no pgAdmin

-- Ver todos os usuários e seus status
SELECT id, name, email, status, email_confirmed FROM users;

-- Atualizar status de um usuário específico por email
UPDATE users 
SET status = 'ativo', email_confirmed = true 
WHERE email = 'marcos@teste.com';

-- Ou atualizar todos os usuários para ativo
-- UPDATE users SET status = 'ativo', email_confirmed = true;

-- Verificar se foi atualizado
SELECT id, name, email, status, email_confirmed FROM users WHERE email = 'marcos@teste.com';
