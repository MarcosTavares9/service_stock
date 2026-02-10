# Scripts SQL para Adicionar Coluna Status

## Ordem de Execução

Execute os scripts na seguinte ordem:

### 1. Categories
```sql
-- Arquivo: add_status_categories.sql
```
Adiciona coluna `status` na tabela `categories`.

### 2. Products
```sql
-- Arquivo: add_status_products.sql
```
⚠️ **IMPORTANTE**: Este script renomeia a coluna `status` existente para `stock_status` e adiciona uma nova coluna `status` para controle.

### 3. Locations
```sql
-- Arquivo: add_status_locations.sql
```
Remove a coluna `active` e adiciona a coluna `status`.

### 4. Users
```sql
-- Arquivo: add_status_users.sql
```
Converte valores existentes ('ativo'/'inativo') para ('true'/'false').

### 5. History
```sql
-- Arquivo: add_status_history.sql
```
Adiciona coluna `status` na tabela `history`.

## Valores do Status

- `'true'` = **Ativo** - Entidade está ativa e disponível
- `'false'` = **Inativo** - Entidade está desativada mas ainda existe
- `'blocked'` = **Bloqueado/Excluído** - Entidade foi excluída (soft delete)

## Observações

- Todos os registros existentes serão atualizados para `'true'` (ativo) por padrão
- Os scripts são idempotentes (podem ser executados múltiplas vezes sem problemas)
- Cada script inclui uma query de verificação ao final para confirmar os dados
