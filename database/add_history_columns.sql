-- Script para adicionar colunas categories_id e locations_id na tabela history
-- Execute este script conectado ao banco Stock_Control no pgAdmin
-- IMPORTANTE: Se você já criou as colunas como INT, use o script fix_history_columns_type.sql primeiro

-- Verificar se as colunas já existem e qual o tipo
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'history' 
AND column_name IN ('categories_id', 'locations_id');

-- Se as colunas não existirem, criar como UUID
-- Se já existirem como INT, você precisa usar o script fix_history_columns_type.sql
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'history' AND column_name = 'categories_id'
  ) THEN
    ALTER TABLE history ADD COLUMN categories_id UUID;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'history' AND column_name = 'locations_id'
  ) THEN
    ALTER TABLE history ADD COLUMN locations_id UUID;
  END IF;
END $$;

-- Adicionar comentários nas colunas
COMMENT ON COLUMN history.categories_id IS 'ID da categoria do produto no momento da alteração';
COMMENT ON COLUMN history.locations_id IS 'ID da localização do produto no momento da alteração';

-- Verificar se as colunas foram criadas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'history' 
AND column_name IN ('categories_id', 'locations_id');
