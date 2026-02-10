# Variáveis de Ambiente - Backend

Crie um arquivo `.env` na raiz do projeto `service_stock` com as seguintes variáveis:

```env
# Porta do servidor
PORT=3000

# URL da aplicação (usado para links de confirmação de email, etc)
APP_URL=http://localhost:3000

# URLs permitidas para CORS (separadas por vírgula)
# Exemplo: ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://meusite.com.br
ALLOWED_ORIGINS=

# URL do frontend (fallback se ALLOWED_ORIGINS não estiver definido)
FRONTEND_URL=http://localhost:5173

# JWT Secret (OBRIGATÓRIO - use uma string aleatória forte em produção)
JWT_SECRET=your-secret-key-here-change-in-production

# Tempo de expiração do JWT
JWT_EXPIRES_IN=24h

# Configuração do banco de dados
# Opção 1: URL completa (recomendado para Supabase, Heroku, etc)
DATABASE_URL=postgresql://user:password@localhost:5432/Stock_Control

# Opção 2: Configuração individual (fallback)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=root
DB_DATABASE=Stock_Control

# Caminho para upload de arquivos
UPLOAD_PATH=/uploads

# Ambiente
NODE_ENV=development
```

## Variáveis Obrigatórias

- `JWT_SECRET`: Deve ser configurado com uma string aleatória forte em produção

## Variáveis Opcionais

Todas as outras variáveis têm valores padrão, mas é recomendado configurá-las conforme seu ambiente.
