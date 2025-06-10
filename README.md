[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19743385&assignment_repo_type=AssignmentRepo)
# Express.js Product API

A RESTful API built with Express.js for managing products. This API implements standard CRUD operations, middleware, error handling, and advanced features like filtering, pagination, and search.

## 🚀 Features

- RESTful CRUD operations for products
- Custom middleware for logging and authentication
- Comprehensive error handling
- Advanced features:
  - Filtering by category
  - Pagination
  - Search functionality
  - Product statistics

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PLP-MERN-Stack-Development/week-2-express-js-assignment-siele-tech.git
   cd week-2-express-js-assignment-siele-tech
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will start on http://localhost:3000

## 🔑 API Authentication

All API endpoints require an API key to be included in the request headers:
```
X-API-Key: your-secret-api-key
```

## 📚 API Endpoints

### Products

#### Get All Products
```
GET /api/products
```
Query Parameters:
- `category`: Filter by category
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response:
```json
{
  "total": 3,
  "page": 1,
  "limit": 10,
  "products": [...]
}
```

#### Get Product by ID
```
GET /api/products/:id
```

#### Create Product
```
POST /api/products
```
Request Body:
```json
{
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "category": "electronics",
  "inStock": true
}
```

#### Update Product
```
PUT /api/products/:id
```
Request Body: Same as Create Product

#### Delete Product
```
DELETE /api/products/:id
```

### Search
```
GET /api/products/search?q=search_term
```

### Statistics
```
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

## 🔒 Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:
```json
{
  "error": {
    "message": "Error message",
    "status": 400
  }
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## 🧪 Testing

You can test the API using tools like Postman, Insomnia, or curl. Here's an example using curl:

```bash
# Get all products
curl -H "X-API-Key: your-secret-api-key" http://localhost:3000/api/products

# Create a new product
curl -X POST -H "X-API-Key: your-secret-api-key" -H "Content-Type: application/json" \
  -d '{"name":"New Product","description":"Description","price":99.99,"category":"electronics","inStock":true}' \
  http://localhost:3000/api/products
```

## 📝 License

This project is licensed under the MIT License. 