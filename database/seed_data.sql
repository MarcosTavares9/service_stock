-- Script para inserir dados de exemplo no banco Stock_Control
-- Execute este script conectado ao banco Stock_Control no pgAdmin

-- Inserir categorias de exemplo
INSERT INTO categories (uuid, name, icon_name, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Eletrônicos', 'electronics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Informática', 'computer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Móveis', 'furniture', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Escritório', 'office', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Limpeza', 'cleaning', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- Inserir localizações de exemplo
INSERT INTO locations (uuid, name, description, active, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Armazém Principal', 'Armazém central de estoque', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Sala 101', 'Sala de reuniões', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Sala 102', 'Escritório administrativo', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Depósito', 'Depósito de materiais', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- Verificar os dados inseridos
SELECT 'Categorias criadas:' as info;
SELECT uuid, name, icon_name FROM categories;

SELECT 'Localizações criadas:' as info;
SELECT uuid, name, description, active FROM locations WHERE active = true;
