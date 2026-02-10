# Stock Control API

API RESTful para sistema de controle de estoque desenvolvida em NestJS com arquitetura modular.

## Arquitetura

Este projeto utiliza arquitetura modular NestJS para garantir:

- **Separação de responsabilidades**: Controller + Service + Entity por módulo
- **Testabilidade**: Fácil criação de testes unitários e de integração
- **Manutenibilidade**: Código organizado e fácil de entender
- **Escalabilidade**: Fácil adicionar novos módulos

### Estrutura de Pastas

```
src/
├── modules/           # Módulos da aplicação
│   ├── auth/          # Autenticação (login, registro, JWT)
│   ├── products/      # Produtos (CRUD + bulk operations)
│   ├── categories/    # Categorias
│   ├── locations/     # Localizações
│   ├── users/         # Usuários
│   ├── history/       # Histórico de movimentações
│   ├── dashboard/     # Dashboard e estatísticas
│   └── reports/       # Relatórios (CSV, Excel, PDF)
└── shared/            # Código compartilhado
    ├── core/          # Filters, interceptors, pipes, decorators, exceptions
    ├── utils/         # Utilitários, constants, enums
    ├── base/          # Classes base, interfaces globais
    └── config/        # Configurações (database, etc)
```

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

**Opção 1: Supabase (Connection String) - RECOMENDADO**
```env
DB_URL=postgresql://user:password@host:port/database
```

**Opção 2: PostgreSQL Local (Configuração Individual)**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=stock_control
```

**Outras variáveis:**
```env
# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# App
PORT=3000
NODE_ENV=development

# Upload
UPLOAD_DEST=./uploads
MAX_FILE_SIZE=15728640
```

## Executando a aplicação

```bash
# desenvolvimento
npm run start:dev

# produção
npm run build
npm run start:prod
```

## Testes

```bash
# unitários
npm run test

# e2e
npm run test:e2e

# cobertura
npm run test:cov
```

## Documentação da API

A documentação completa da API está disponível em `/api/docs` quando a aplicação estiver rodando.

## Documentação Adicional

- [Variáveis de Ambiente](docs/ENV_VARIABLES.md)
- [Endpoints da API](docs/API_ENDPOINTS.md)
- [Guia do Frontend](docs/FRONTEND_GUIDE.md)
- [Status do Database](docs/DATABASE_STATUS.md)
