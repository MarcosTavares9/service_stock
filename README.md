# Stock Control API

API RESTful para sistema de controle de estoque desenvolvida em NestJS com arquitetura hexagonal.

## Arquitetura

Este projeto utiliza arquitetura hexagonal (Ports and Adapters) para garantir:

- **Separação de responsabilidades**: Lógica de negócio isolada da infraestrutura
- **Testabilidade**: Fácil criação de testes unitários e de integração
- **Manutenibilidade**: Código organizado e fácil de entender
- **Escalabilidade**: Fácil adicionar novos adapters sem modificar o core

### Estrutura de Pastas

```
src/
├── domain/           # Camada de domínio (entidades, value objects, ports)
│   ├── auth/
│   ├── products/
│   ├── categories/
│   ├── locations/
│   ├── users/
│   └── history/
├── application/      # Camada de aplicação (use cases, DTOs)
│   ├── auth/
│   ├── products/
│   ├── categories/
│   ├── locations/
│   ├── users/
│   └── history/
├── infrastructure/   # Camada de infraestrutura (repositórios, controllers, adapters)
│   ├── database/
│   ├── auth/
│   ├── products/
│   ├── categories/
│   ├── locations/
│   ├── users/
│   └── history/
└── shared/          # Código compartilhado (exceções, utils, etc)
```

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=stock_control

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

