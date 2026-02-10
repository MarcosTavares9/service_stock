# 📡 Endpoints da API - Stock Control

## 🔐 Autenticação

Todos os endpoints (exceto login e registro) requerem autenticação via Bearer Token.

**Como usar:**
1. Fazer login em `POST /auth/login`
2. Copiar o token retornado
3. Incluir no header: `Authorization: Bearer <token>`

---

## 🔑 Autenticação

### POST `/auth/login`
**Descrição:** Login de usuário  
**Autenticação:** Não requerida  
**Body:**
```json
{
  "email": "marcos@teste.com",
  "password": "senha123"
}
```
**Response:**
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

### POST `/auth/register`
**Descrição:** Registro de novo usuário  
**Autenticação:** Não requerida  
**Body:**
```json
{
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao@example.com",
  "phone": "11999999999",
  "password": "senha123"
}
```

---

## 👤 Usuários

### GET `/users`
**Descrição:** Listar todos os usuários  
**Autenticação:** Requerida

### GET `/users/{id}`
**Descrição:** Buscar usuário por ID  
**Autenticação:** Requerida  
**Response:**
```json
{
  "id": "03698749-7be8-4b6c-8a24-83a632674a8c",
  "firstName": "Marcos",
  "lastName": "Tavares",
  "email": "marcos@teste.com",
  "phone": "11999999999",
  "profilePicture": null,
  "status": "active",
  "emailConfirmed": true,
  "createdAt": "2026-01-10T23:15:02.357Z",
  "updatedAt": "2026-01-10T23:18:27.190Z"
}
```

### POST `/users`
**Descrição:** Criar usuário  
**Autenticação:** Requerida  
**Body:**
```json
{
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

### PUT `/users/{id}`
**Descrição:** Atualizar usuário  
**Autenticação:** Requerida  
**Body:**
```json
{
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao@example.com",
  "status": "active",
  "password": "novaSenha123"
}
```

### DELETE `/users/{id}`
**Descrição:** Deletar usuário  
**Autenticação:** Requerida

---

## 📦 Produtos

### GET `/products`
**Descrição:** Listar todos os produtos  
**Autenticação:** Requerida  
**Response:**
```json
{
  "data": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Notebook Dell",
      "category_id": "550e8400-e29b-41d4-a716-446655440001",
      "location_id": "550e8400-e29b-41d4-a716-446655440002",
      "quantity": 10,
      "minimum_stock": 5,
      "status": "ok",
      "image": "https://example.com/image.jpg",
      "created_at": "2026-01-11T02:30:00.000Z",
      "updated_at": "2026-01-11T02:30:00.000Z"
    }
  ]
}
```

### GET `/products/{id}`
**Descrição:** Buscar produto por ID  
**Autenticação:** Requerida

### POST `/products`
**Descrição:** Criar produto  
**Autenticação:** Requerida  
**Body:**
```json
{
  "name": "Notebook Dell",
  "category_id": "550e8400-e29b-41d4-a716-446655440000",
  "location_id": "550e8400-e29b-41d4-a716-446655440001",
  "quantity": 10,
  "minimum_stock": 5,
  "image": "https://example.com/image.jpg"
}
```

### PUT `/products/{id}`
**Descrição:** Atualizar produto  
**Autenticação:** Requerida  
**Body:**
```json
{
  "name": "Notebook Dell Atualizado",
  "category_id": "550e8400-e29b-41d4-a716-446655440002",
  "location_id": "550e8400-e29b-41d4-a716-446655440003",
  "quantity": 15,
  "minimum_stock": 10,
  "image": "https://example.com/new-image.jpg"
}
```

### DELETE `/products/{id}`
**Descrição:** Deletar produto  
**Autenticação:** Requerida

### POST `/products/bulk`
**Descrição:** Criar múltiplos produtos  
**Autenticação:** Requerida  
**Body:**
```json
{
  "products": [
    {
      "name": "Produto 1",
      "category_id": "550e8400-e29b-41d4-a716-446655440000",
      "location_id": "550e8400-e29b-41d4-a716-446655440001",
      "quantity": 10,
      "minimum_stock": 5
    },
    {
      "name": "Produto 2",
      "category_id": "550e8400-e29b-41d4-a716-446655440000",
      "location_id": "550e8400-e29b-41d4-a716-446655440001",
      "quantity": 20,
      "minimum_stock": 10
    }
  ]
}
```

### PUT `/products/bulk`
**Descrição:** Atualizar múltiplos produtos  
**Autenticação:** Requerida  
**Body:**
```json
{
  "products": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Produto Atualizado",
      "quantity": 15
    }
  ]
}
```

### DELETE `/products/bulk`
**Descrição:** Deletar múltiplos produtos  
**Autenticação:** Requerida  
**Body:**
```json
{
  "ids": [
    "550e8400-e29b-41d4-a716-446655440000",
    "550e8400-e29b-41d4-a716-446655440001"
  ]
}
```

---

## 📁 Categorias

### GET `/categories`
**Descrição:** Listar todas as categorias  
**Autenticação:** Requerida  
**Response:**
```json
{
  "data": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Eletrônicos",
      "icon_name": "electronics",
      "created_at": "2026-01-11T02:30:00.000Z",
      "updated_at": "2026-01-11T02:30:00.000Z"
    }
  ]
}
```

### GET `/categories/{id}`
**Descrição:** Buscar categoria por ID  
**Autenticação:** Requerida

### POST `/categories`
**Descrição:** Criar categoria  
**Autenticação:** Requerida  
**Body:**
```json
{
  "name": "Eletrônicos",
  "icon_name": "electronics"
}
```

### PUT `/categories/{id}`
**Descrição:** Atualizar categoria  
**Autenticação:** Requerida  
**Body:**
```json
{
  "name": "Eletrônicos Atualizado",
  "icon_name": "electronics-updated"
}
```

### DELETE `/categories/{id}`
**Descrição:** Deletar categoria  
**Autenticação:** Requerida

---

## 📍 Localizações

### GET `/locations`
**Descrição:** Listar todas as localizações  
**Autenticação:** Requerida  
**Query Params:** `?active=true` (opcional)  
**Response:**
```json
{
  "data": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Armazém Principal",
      "description": "Armazém central de estoque",
      "active": true,
      "created_at": "2026-01-11T02:30:00.000Z",
      "updated_at": "2026-01-11T02:30:00.000Z"
    }
  ]
}
```

### GET `/locations/{id}`
**Descrição:** Buscar localização por ID  
**Autenticação:** Requerida

### POST `/locations`
**Descrição:** Criar localização  
**Autenticação:** Requerida  
**Body:**
```json
{
  "name": "Armazém Principal",
  "description": "Armazém central de estoque",
  "active": true
}
```

### PUT `/locations/{id}`
**Descrição:** Atualizar localização  
**Autenticação:** Requerida  
**Body:**
```json
{
  "name": "Armazém Principal Atualizado",
  "description": "Nova descrição",
  "active": true
}
```

### DELETE `/locations/{id}`
**Descrição:** Deletar localização  
**Autenticação:** Requerida

---

## 📊 Histórico

### GET `/history`
**Descrição:** Listar todo o histórico  
**Autenticação:** Requerida  
**Query Params:** 
- `page` (opcional, padrão: 1)
- `limit` (opcional, padrão: 10)
- `type` (opcional: `entry`, `exit`, `adjustment`)
- `product_id` (opcional, UUID)
- `user_id` (opcional, UUID)
- `dataInicio` (opcional, formato: `YYYY-MM-DD`)
- `dataFim` (opcional, formato: `YYYY-MM-DD`)

**Response:**
```json
{
  "data": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "type": "adjustment",
      "product_id": "550e8400-e29b-41d4-a716-446655440001",
      "user_id": "03698749-7be8-4b6c-8a24-83a632674a8c",
      "categories_id": "550e8400-e29b-41d4-a716-446655440002",
      "locations_id": "550e8400-e29b-41d4-a716-446655440003",
      "quantity_changed": 5,
      "previous_quantity": 10,
      "new_quantity": 15,
      "observation": "Produto atualizado. Alterações: Categoria alterada de 'Eletrônicos' para 'Informática'; Localização alterada de 'Armazém Principal' para 'Sala 101'; Quantidade: 10 → 15",
      "created_at": "2026-01-11T02:30:00.000Z",
      "user": {
        "id": "03698749-7be8-4b6c-8a24-83a632674a8c",
        "name": "Marcos",
        "email": "marcos@teste.com"
      },
      "product": {
        "uuid": "550e8400-e29b-41d4-a716-446655440001",
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

## 📈 Dashboard

### GET `/dashboard/stats`
**Descrição:** Estatísticas gerais do dashboard  
**Autenticação:** Requerida  
**Response:**
```json
{
  "totalProducts": 100,
  "totalCategories": 5,
  "totalLocations": 10,
  "lowStockProducts": 15,
  "emptyStockProducts": 5
}
```

### GET `/dashboard/low-stock`
**Descrição:** Produtos com estoque baixo  
**Autenticação:** Requerida  
**Query Params:** `?limit=10` (opcional)

---

## 📄 Relatórios

### GET `/reports/export/csv`
**Descrição:** Exportar histórico para CSV  
**Autenticação:** Requerida  
**Query Params:** `?type=entry&product_id=...&user_id=...`

### GET `/reports/export/excel`
**Descrição:** Exportar histórico para Excel  
**Autenticação:** Requerida  
**Query Params:** `?type=entry&product_id=...&user_id=...`

### GET `/reports/export/pdf`
**Descrição:** Exportar histórico para PDF  
**Autenticação:** Requerida  
**Query Params:** `?type=entry&product_id=...&user_id=...`

---

## 🔧 Configuração Base

**Base URL:** `http://localhost:3000`  
**Swagger:** `http://localhost:3000/docs`

**Headers obrigatórios (exceto login/register):**
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 📝 Tipos de Histórico

- `entry` - Entrada de produto (criação ou adição)
- `exit` - Saída de produto (deleção ou remoção)
- `adjustment` - Ajuste de produto (atualização)

---

## 📋 Status de Produto

- `ok` - Estoque acima do mínimo
- `low` - Estoque igual ou abaixo do mínimo
- `empty` - Estoque zerado
