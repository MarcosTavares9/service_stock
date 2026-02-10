-- Script para corrigir o tipo das colunas categories_id e locations_id na tabela history
-- Execute este script conectado ao banco Stock_Control no pgAdmin
-- Este script altera as colunas de INT para UUID

-- Verificar o tipo atual das colunas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'history' 
AND column_name IN ('categories_id', 'locations_id');

-- Remover as colunas se existirem como INT
ALTER TABLE history DROP COLUMN IF EXISTS categories_id;
ALTER TABLE history DROP COLUMN IF EXISTS locations_id;

-- Recriar as colunas com o tipo correto (UUID)
ALTER TABLE history 
ADD COLUMN categories_id UUID;

ALTER TABLE history 
ADD COLUMN locations_id UUID;

-- Adicionar comentários nas colunas
COMMENT ON COLUMN history.categories_id IS 'ID da categoria do produto no momento da alteração';
COMMENT ON COLUMN history.locations_id IS 'ID da localização do produto no momento da alteração';

-- Verificar se as colunas foram criadas corretamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'history' 
AND column_name IN ('categories_id', 'locations_id');
