# Componentes Globais Criados

Este documento lista todos os componentes globais criados para evitar duplicação de código e padronizar a aplicação.

## 🎯 Decorators

### `@ApiController(tag: string)`
**Localização:** `src/shared/decorators/api-controller.decorator.ts`

Decorator combinado que aplica:
- `@ApiTags(tag)` - Tag do Swagger
- `@ApiBearerAuth()` - Autenticação Bearer
- `@UseGuards(JwtAuthGuard)` - Guard JWT

**Uso:**
```typescript
@ApiController('Produtos')
@Controller('products')
export class ProductsController { ... }
```

**Antes:** 3 decorators repetidos em cada controller
**Depois:** 1 decorator único

### `@Public()`
**Localização:** `src/shared/decorators/public.decorator.ts`

Marca rotas como públicas (sem autenticação).

**Uso:**
```typescript
@Public()
@Get('public-endpoint')
async publicEndpoint() { ... }
```

## 📝 DTOs Base

### `PaginationQueryDto`
**Localização:** `src/shared/dto/pagination-query.dto.ts`

DTO para paginação com validação:
- `page?: number` - Número da página (padrão: 1)
- `limit?: number` - Itens por página (padrão: 10, máximo: 100)

**Uso:**
```typescript
class ListDto extends PaginationQueryDto {
  // outros campos
}
```

### `SearchQueryDto`
**Localização:** `src/shared/dto/search-query.dto.ts`

DTO para busca:
- `search?: string` - Termo de busca

**Uso:**
```typescript
class ListDto extends SearchQueryDto {
  // outros campos
}
```

## 🔍 Filters

### `HttpExceptionFilter`
**Localização:** `src/shared/filters/http-exception.filter.ts`

Filter global para tratamento de exceções HTTP. Padroniza o formato de resposta de erros:

```json
{
  "error": "Mensagem de erro",
  "details": { ... },
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Configuração:** Já aplicado globalmente em `main.ts`

## 🔄 Interceptors

### `TransformResponseInterceptor`
**Localização:** `src/shared/interceptors/transform-response.interceptor.ts`

Interceptor para transformar respostas em formato padrão (opcional, comentado em `main.ts`).

**Formato:**
```json
{
  "data": { ... },
  "statusCode": 200,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Pipes

### `ParseIntSafePipe`
**Localização:** `src/shared/pipes/parse-int-safe.pipe.ts`

Pipe para converter strings em números com validação e mensagem de erro personalizada.

**Uso:**
```typescript
@Get(':id')
async get(@Param('id', ParseIntSafePipe) id: number) { ... }
```

## 🛠️ Utils

### `ValidationUtil`
**Localização:** `src/shared/utils/validation.util.ts`

Utilitários para validação:

#### `checkUnique()`
Valida se um valor (email ou nome) é único no repositório.

#### `parseBoolean()`
Converte string para boolean de forma segura.

**Uso:**
```typescript
const ativo = ValidationUtil.parseBoolean(query.ativo);
```

### `PaginationUtil` (já existia)
**Localização:** `src/shared/utils/pagination.util.ts`

Utilitários para paginação:
- `create()` - Cria resultado paginado
- `normalize()` - Normaliza parâmetros de paginação
- `getSkip()` - Calcula offset

### `FileUtil` (já existia)
**Localização:** `src/shared/utils/file.util.ts`

Utilitários para arquivos:
- `validateImage()` - Valida imagem
- `generateFileName()` - Gera nome único para arquivo

## 🏗️ Base Classes

### `BaseCrudUseCase<T, ID>`
**Localização:** `src/shared/base/base-crud.use-case.ts`

Classe base abstrata para operações CRUD comuns:
- `findById()` - Buscar por ID
- `create()` - Criar
- `update()` - Atualizar
- `delete()` - Deletar

**Uso:**
```typescript
class ProductUseCase extends BaseCrudUseCase<Product, number> {
  protected repository = this.productRepository;
  protected resourceName = 'Produto';
}
```

## 📊 Constantes

### `ApiResponses`
**Localização:** `src/shared/constants/api-responses.constant.ts`

Constantes para respostas da API Swagger:
- `created()` - 201 Created
- `ok()` - 200 OK
- `notFound()` - 404 Not Found
- `badRequest()` - 400 Bad Request
- `unauthorized()` - 401 Unauthorized
- `conflict()` - 409 Conflict

**Uso:**
```typescript
@ApiResponse(ApiResponses.notFound('Produto'))
```

## 📈 Benefícios

### Antes
- 7 controllers com 3 decorators repetidos cada = 21 linhas duplicadas
- Validação de boolean repetida em vários lugares
- Tratamento de erros inconsistente
- Código repetido para operações CRUD básicas

### Depois
- 1 decorator reutilizável
- Validações centralizadas
- Tratamento de erros padronizado
- Base classes para reduzir duplicação

## 🎯 Próximos Passos Sugeridos

1. Criar base repository com métodos comuns
2. Criar base controller com métodos CRUD padrão
3. Adicionar mais DTOs base (DateRangeDto, FilterDto, etc)
4. Criar validators customizados reutilizáveis
5. Adicionar logging interceptor global

