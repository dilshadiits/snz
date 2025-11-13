# Snazo Backend API

A comprehensive Node.js/Express backend API for the Snazo food ordering application with full CRUD operations for products, delivery pincodes, and promocodes.

## 📁 Project Structure

```
snazo-backend/
├── config/
│   ├── database.js          # In-memory database
│   └── jwt.config.js         # JWT configuration
├── controllers/
│   ├── auth.controller.js    # Authentication logic
│   ├── product.controller.js # Product CRUD operations
│   ├── pincode.controller.js # Pincode CRUD operations
│   ├── promocode.controller.js # Promocode CRUD operations
│   └── order.controller.js   # Order management
├── middleware/
│   └── auth.middleware.js    # JWT authentication & authorization
├── routes/
│   ├── auth.routes.js        # Auth endpoints
│   ├── product.routes.js     # Product endpoints
│   ├── pincode.routes.js     # Pincode endpoints
│   ├── promocode.routes.js   # Promocode endpoints
│   └── order.routes.js       # Order endpoints
├── server.js                 # Main application entry point
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd snazo-backend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration
```
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

5. Start the server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

### 🔐 Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@snazo.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1",
    "name": "Admin",
    "email": "admin@snazo.com",
    "isAdmin": true
  }
}
```

---

### 🍔 Product Endpoints

#### Get All Products
```http
GET /api/products?category=chicken&popular=true&inStock=true&minPrice=100&maxPrice=500
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Delicious item",
  "price": 299,
  "originalPrice": 350,
  "image": "https://example.com/image.jpg",
  "category": "chicken",
  "weight": "400g",
  "discount": true,
  "popular": false,
  "inStock": true
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "price": 279,
  "inStock": false
}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer <admin-token>
```

---

### 📍 Pincode Endpoints

#### Get All Pincodes
```http
GET /api/pincodes?isActive=true
```

#### Check Pincode Availability
```http
GET /api/pincodes/:pincode
```

**Example Response:**
```json
{
  "success": true,
  "available": true,
  "pincode": {
    "pincode": "673001",
    "area": "Kozhikode City",
    "deliveryCharge": 30,
    "isActive": true,
    "estimatedTime": "30-45 mins"
  }
}
```

#### Add Pincode (Admin Only)
```http
POST /api/pincodes
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "pincode": "673006",
  "area": "Beypore",
  "deliveryCharge": 60,
  "estimatedTime": "45-60 mins",
  "isActive": true
}
```

#### Update Pincode (Admin Only)
```http
PUT /api/pincodes/:pincode
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "deliveryCharge": 40,
  "isActive": false
}
```

#### Delete Pincode (Admin Only)
```http
DELETE /api/pincodes/:pincode
Authorization: Bearer <admin-token>
```

---

### 🎟️ Promocode Endpoints

#### Get All Promocodes
```http
GET /api/promocodes?isActive=true
```

#### Validate Promocode
```http
POST /api/promocodes/validate
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "WELCOME50",
  "orderAmount": 600,
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "promocode": { ... },
  "discountAmount": 50,
  "message": "Promocode applied successfully"
}
```

#### Create Promocode (Admin Only)
```http
POST /api/promocodes
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "code": "NEWYEAR25",
  "description": "New Year Special - 25% off",
  "discountType": "percentage",
  "discountValue": 25,
  "minOrderAmount": 500,
  "maxDiscount": 300,
  "usageLimit": 2,
  "validFrom": "2025-01-01T00:00:00.000Z",
  "validUntil": "2025-01-31T23:59:59.000Z",
  "isActive": true
}
```

**Discount Types:**
- `flat` - Fixed amount discount
- `percentage` - Percentage-based discount (with max cap)
- `delivery` - Free/discounted delivery

#### Update Promocode (Admin Only)
```http
PUT /api/promocodes/:code
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "isActive": false,
  "discountValue": 30
}
```

#### Delete Promocode (Admin Only)
```http
DELETE /api/promocodes/:code
Authorization: Bearer <admin-token>
```

#### Apply Promocode (Mark as Used)
```http
POST /api/promocodes/:code/apply
Authorization: Bearer <token>
```

---

### 📦 Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "id": "1",
      "name": "Chicken Samosa",
      "price": 446,
      "qty": 2
    }
  ],
  "deliveryAddress": {
    "name": "John Doe",
    "phone": "9876543210",
    "address": "123 Main St",
    "city": "Kozhikode",
    "pincode": "673001"
  },
  "pincode": "673001",
  "promocode": "WELCOME50",
  "totalAmount": 892,
  "deliveryCharge": 30
}
```

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

#### Get All Orders (Admin Only)
```http
GET /api/orders/all
Authorization: Bearer <admin-token>
```

---

## 🔒 Default Admin Credentials

```
Email: admin@snazo.com
Password: admin123
```

## 🛠️ Development

### Adding New Routes

1. Create controller in `controllers/`
2. Create route file in `routes/`
3. Import and use in `server.js`

### Database Migration

Currently using in-memory storage. To migrate to MongoDB:

1. Install mongoose: `npm install mongoose`
2. Replace `config/database.js` with MongoDB connection
3. Create models in `models/` directory
4. Update controllers to use Mongoose models

### Environment Variables

- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT signing
- `NODE_ENV` - Environment (development/production)

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional error information"
}
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (Admin/User)
- Token expiration (7 days)

## 📈 Future Enhancements

- [ ] MongoDB/PostgreSQL integration
- [ ] Rate limiting
- [ ] Request validation with Joi/Yup
- [ ] File upload for product images
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Order tracking system
- [ ] Analytics dashboard
- [ ] Logging with Winston/Morgan

## 📄 License

MIT

## 👨‍💻 Author