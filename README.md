[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19743385&assignment_repo_type=AssignmentRepo)
# Product API

A RESTful API built with Express.js for managing products.

## 🚀 Features

- CRUD operations for products
- Authentication using API key
- Request logging
- Error handling
- Filtering and pagination
- Sorting by any field
- Search functionality
- Product statistics
- Rate limiting
- CORS support
- Input validation

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (Node Package Manager)

## 🔧 Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd week-2-express-js-assignment-siele-tech
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   API_KEY=your-secret-api-key
   ```

4. Start the server:
   ```bash
   # Production mode
   npm start

   # Development mode with auto-reload
   npm run dev
   ```

The server will start running on http://localhost:3000

## 🔑 Authentication

All API endpoints under `/api` require authentication using an API key. Include the API key in the request headers:

```
X-API-Key: your-secret-api-key
```

## 📚 API Documentation

### Products

#### Get All Products
```http
GET /api/products
```

Query Parameters:
- `category` (optional): Filter products by category (must be one of: electronics, kitchen, clothing, books, sports)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `sort` (optional): Field to sort by (default: name)
- `order` (optional): Sort order - 'asc' or 'desc' (default: asc)

Response:
```json
{
  "total": 3,
  "page": 1,
  "limit": 10,
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
    // ... more products
  ]
}
```

#### Get Product by ID
```http
GET /api/products/:id
```

Response:
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}
```

#### Create Product
```http
POST /api/products
```

Request Body:
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category": "electronics",
  "inStock": true
}
```

Validation Rules:
- All fields are required
- Price must be a positive number
- Category must be one of: electronics, kitchen, clothing, books, sports

Response:
```json
{
  "id": "generated-uuid",
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category": "electronics",
  "inStock": true
}
```

#### Update Product
```http
PUT /api/products/:id
```

Request Body:
```json
{
  "name": "Updated Product",
  "description": "Updated description",
  "price": 149.99,
  "category": "electronics",
  "inStock": false
}
```

Validation Rules:
- All fields are required
- Price must be a positive number
- Category must be one of: electronics, kitchen, clothing, books, sports

Response:
```json
{
  "id": "product-id",
  "name": "Updated Product",
  "description": "Updated description",
  "price": 149.99,
  "category": "electronics",
  "inStock": false
}
```

#### Delete Product
```http
DELETE /api/products/:id
```

Response: 204 No Content

### Search Products
```http
GET /api/products/search?q=search-term
```

Response:
```json
[
  {
    "id": "1",
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM",
    "price": 1200,
    "category": "electronics",
    "inStock": true
  }
  // ... matching products
]
```

### Product Statistics
```http
GET /api/products/stats
```

Response:
```json
{
  "total": 3,
  "inStock": 2,
  "categories": {
    "electronics": 2,
    "kitchen": 1
  }
}
```

## ⚠️ Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "error": {
    "message": "Error message",
    "status": 400
  }
}
```

Common error codes:
- 400: Bad Request (Validation Error)
- 401: Unauthorized (Invalid API Key)
- 404: Not Found
- 429: Too Many Requests (Rate Limit Exceeded)
- 500: Internal Server Error

## 🔒 Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address
- Exceeding the limit will result in a 429 Too Many Requests error

## 🌐 CORS Support

The API supports Cross-Origin Resource Sharing (CORS), allowing web clients to make requests from different domains.

## 🧪 Testing

You can test the API using tools like Postman, Insomnia, or curl. Make sure to include the API key in the request headers for all API endpoints.

Example curl command:
```bash
curl -H "X-API-Key: your-secret-api-key" http://localhost:3000/api/products
```

## 📝 License

This project is licensed under the MIT License. 