# Arquitetura Hexagonal - Stock Control API

## Visão Geral

Este projeto utiliza **Arquitetura Hexagonal** (também conhecida como Ports and Adapters) para garantir separação de responsabilidades, testabilidade e manutenibilidade.

## Estrutura de Camadas

### 1. Domain (Domínio)
**Localização:** `src/domain/`

Contém a lógica de negócio pura, independente de frameworks e infraestrutura:

- **Entities**: Entidades do domínio (User, Product, Category, etc.)
- **Ports**: Interfaces que definem contratos (repositories, services)
- **Value Objects**: Objetos de valor quando necessário

**Características:**
- Não depende de nenhuma camada externa
- Contém regras de negócio
- Define contratos através de interfaces (ports)

### 2. Application (Aplicação)
**Localização:** `src/application/`

Contém os casos de uso da aplicação:

- **Use Cases**: Lógica de aplicação que orquestra o domínio
- **DTOs**: Data Transfer Objects para entrada/saída
- **Interfaces**: Contratos que a aplicação precisa

**Características:**
- Depende apenas do Domain
- Implementa casos de uso específicos
- Não conhece detalhes de infraestrutura

### 3. Infrastructure (Infraestrutura)
**Localização:** `src/infrastructure/`

Implementa os adapters e detalhes técnicos:

- **Repositories**: Implementações concretas dos repositórios
- **Controllers**: Endpoints HTTP
- **Services**: Serviços externos (email, storage, etc.)
- **Modules**: Configuração do NestJS

**Características:**
- Implementa os ports definidos no Domain
- Depende do Domain e Application
- Contém toda a configuração técnica

### 4. Shared (Compartilhado)
**Localização:** `src/shared/`

Código compartilhado entre camadas:

- **Exceptions**: Exceções customizadas
- **Utils**: Utilitários gerais
- **Types**: Tipos TypeScript compartilhados

## Fluxo de Dados

```
Request → Controller (Infrastructure) 
       → Use Case (Application) 
       → Repository Port (Domain Interface)
       → Repository Implementation (Infrastructure)
       → Database
```

## Princípios Aplicados

### 1. Dependency Inversion
- Domain define interfaces (ports)
- Infrastructure implementa essas interfaces
- Application depende de abstrações, não de implementações

### 2. Single Responsibility
- Cada use case tem uma responsabilidade única
- Repositories apenas acessam dados
- Controllers apenas recebem requisições HTTP

### 3. Open/Closed Principle
- Fácil adicionar novos adapters sem modificar o core
- Novos casos de uso podem ser adicionados sem alterar existentes

## Módulos Implementados

### Autenticação (`auth`)
- Login
- Registro
- Confirmação de email
- JWT Strategy

### Produtos (`products`)
- CRUD completo
- Criação em lote
- Upload de imagens
- Cálculo automático de status

### Categorias (`categories`)
- CRUD completo
- Validação de produtos associados

### Localizações (`locations`)
- CRUD completo
- Validação de produtos associados

### Usuários (`users`)
- CRUD completo
- Gerenciamento de perfil
- Upload de foto de perfil

### Histórico (`history`)
- Listagem com filtros
- Registro automático de operações

### Dashboard (`dashboard`)
- Estatísticas gerais
- Produtos com estoque baixo

### Relatórios (`reports`)
- Exportação CSV
- Exportação Excel
- Exportação PDF

## Injeção de Dependências

O NestJS gerencia a injeção de dependências através de:

1. **Providers**: Classes que podem ser injetadas
2. **Tokens**: Identificadores para injeção (ex: `'IProductRepository'`)
3. **Modules**: Agrupam providers relacionados

Exemplo:
```typescript
{
  provide: 'IProductRepository',
  useClass: ProductRepository,
}
```

## Testes

A arquitetura facilita testes porque:

1. **Domain**: Pode ser testado isoladamente
2. **Application**: Use cases podem ser testados com mocks dos ports
3. **Infrastructure**: Pode ser testado com banco de dados em memória

## Próximos Passos

1. Implementar testes unitários para use cases
2. Implementar testes de integração para controllers
3. Adicionar validações mais robustas
4. Implementar upload real de arquivos (S3, local storage)
5. Implementar serviço de email real (SendGrid, AWS SES)
6. Adicionar cache quando necessário
7. Implementar rate limiting
8. Adicionar logging estruturado

## Benefícios da Arquitetura

1. **Manutenibilidade**: Código organizado e fácil de entender
2. **Testabilidade**: Fácil criar mocks e testar isoladamente
3. **Escalabilidade**: Fácil adicionar novas funcionalidades
4. **Flexibilidade**: Fácil trocar implementações (ex: banco de dados)
5. **Independência**: Domain não depende de frameworks

