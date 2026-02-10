# 🚀 Guia Rápido para o Frontend

## 📋 Informações Essenciais

### Base URL
```
http://localhost:3000
```

### Documentação Interativa (Swagger)
```
http://localhost:3000/docs
```

---

## 🔐 Autenticação

### 1. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "marcos@teste.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "03698749-7be8-4b6c-8a24-83a632674a8c",
    "firstName": "Marcos",
    "lastName": "Tavares",
    "email": "marcos@teste.com",
    "photo": null
  }
}
```

### 2. Usar o Token
Salve o token e inclua em todas as requisições (exceto login/register):
```http
Authorization: Bearer <seu_token_aqui>
```

---

## 📦 Endpoints Principais

### Produtos

#### Listar Produtos
```http
GET /products?page=1&limit=10
Authorization: Bearer <token>
```

#### Criar Produto
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Notebook Dell",
  "category_id": "550e8400-e29b-41d4-a716-446655440000",
  "location_id": "550e8400-e29b-41d4-a716-446655440001",
  "quantity": 10,
  "minimum_stock": 5,
  "image": "https://example.com/image.jpg"
}
```

#### Atualizar Produto
```http
PUT /products/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Notebook Dell Atualizado",
  "quantity": 15
}
```

#### Deletar Produto
```http
DELETE /products/{id}
Authorization: Bearer <token>
```

---

### Categorias

#### Listar Categorias
```http
GET /categories
Authorization: Bearer <token>
```

#### Criar Categoria
```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Eletrônicos",
  "icon_name": "electronics"
}
```

---

### Localizações

#### Listar Localizações
```http
GET /locations?active=true
Authorization: Bearer <token>
```

#### Criar Localização
```http
POST /locations
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Armazém Principal",
  "description": "Armazém central",
  "active": true
}
```

---

### Histórico

#### Listar Histórico
```http
GET /history?page=1&limit=10&type=adjustment
Authorization: Bearer <token>
```

**Resposta inclui:**
- `categories_id` - ID da categoria do produto no momento da alteração
- `locations_id` - ID da localização do produto no momento da alteração
- `product_id` - ID do produto
- `user_id` - ID do usuário que fez a alteração
- `observation` - Descrição detalhada das alterações

**Exemplo de resposta:**
```json
{
  "data": [
    {
      "uuid": "...",
      "type": "adjustment",
      "product_id": "...",
      "user_id": "...",
      "categories_id": "550e8400-e29b-41d4-a716-446655440002",
      "locations_id": "550e8400-e29b-41d4-a716-446655440003",
      "quantity_changed": 5,
      "previous_quantity": 10,
      "new_quantity": 15,
      "observation": "Produto atualizado. Alterações: Categoria alterada de 'Eletrônicos' para 'Informática'; Localização alterada de 'Armazém Principal' para 'Sala 101'",
      "created_at": "2026-01-11T02:30:00.000Z",
      "user": {
        "id": "...",
        "name": "Marcos",
        "email": "marcos@teste.com"
      },
      "product": {
        "uuid": "...",
        "name": "Notebook Dell"
      }
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

---

### Dashboard

#### Estatísticas
```http
GET /dashboard/stats
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "totalProducts": 100,
  "totalCategories": 5,
  "totalLocations": 10,
  "lowStockProducts": 15,
  "emptyStockProducts": 5
}
```

#### Produtos com Estoque Baixo
```http
GET /dashboard/low-stock?limit=10
Authorization: Bearer <token>
```

---

## 🔧 Configuração de Requisições

### Headers Obrigatórios (exceto login/register)
```javascript
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

### Exemplo com Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Adicionar token após login
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Exemplo de requisição
const produtos = await api.get('/products');
```

### Exemplo com Fetch
```javascript
const token = 'seu_token_aqui';

const response = await fetch('http://localhost:3000/products', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

---

## 📊 Tipos de Dados

### Tipos de Histórico
- `entry` - Entrada de produto (criação ou adição)
- `exit` - Saída de produto (deleção ou remoção)
- `adjustment` - Ajuste de produto (atualização)

### Status de Produto
- `ok` - Estoque acima do mínimo
- `low` - Estoque igual ou abaixo do mínimo
- `empty` - Estoque zerado

### Status de Usuário
- `active` - Usuário ativo
- `inactive` - Usuário inativo

---

## ⚠️ Tratamento de Erros

### Erro 401 - Não Autorizado
```json
{
  "error": "Token inválido",
  "statusCode": 401,
  "timestamp": "2026-01-11T20:08:39.434Z"
}
```
**Solução:** Fazer login novamente e atualizar o token

### Erro 400 - Dados Inválidos
```json
{
  "error": "Validation failed",
  "statusCode": 400,
  "message": ["name should not be empty"]
}
```
**Solução:** Verificar os dados enviados

### Erro 404 - Não Encontrado
```json
{
  "error": "Produto não encontrado",
  "statusCode": 404
}
```

### Erro 500 - Erro do Servidor
```json
{
  "error": "Erro interno do servidor",
  "statusCode": 500
}
```

---

## 📝 Notas Importantes

1. **Todos os IDs são UUIDs** (formato: `550e8400-e29b-41d4-a716-446655440000`)
2. **O token expira** - Implemente refresh token ou refaça login quando necessário
3. **Histórico sempre salva** categoria e localização do produto no momento da alteração
4. **Paginação padrão:** `page=1&limit=10`
5. **Datas no formato ISO 8601:** `2026-01-11T02:30:00.000Z`

---

## 🔗 Links Úteis

- **Swagger UI:** http://localhost:3000/docs
- **Documentação Completa:** Ver `API_ENDPOINTS.md`
