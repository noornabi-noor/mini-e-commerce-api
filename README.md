# 🛒 Mini E-Commerce API

A RESTful backend API that simulates a basic online shopping platform.  
This project demonstrates secure authentication, role-based access control, product management, cart functionality, order processing, and strong business logic enforcement with data consistency.

---

# 🚀 Project Overview

The Mini E-Commerce API provides:

- Secure JWT-based authentication
- Role-based authorization (Admin & Customer)
- Product management (Admin only)
- Cart operations
- Order processing with stock validation
- Business rule enforcement
- Transaction-safe operations
- Proper RESTful API structure

This project focuses on clean architecture, maintainable code, and backend-driven business logic.

---

# 🧰 Tech Stack

- **Backend:** Node.js + Express
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT-based authentication
- **Validation:** Request validation middleware
- **API Testing:** Postman

---

# ⚙️ Setup Instructions

## 1️⃣ Clone the Repository

```bash
git clone <https://github.com/noornabi-noor/mini-e-commerce-api.git>
cd mini-ecommerce-api
```

## 2️⃣ Install Dependencies
```bash
npm install
```

## 3️⃣ Configure Environment Variables

Create a .env file in the root directory:

- DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ecommerce"
- PORT=5000
- BETTER_AUTH_SECRET=<give_your_betterAuth_secret>
- BETTER_AUTH_URL=http://localhost:5000
- APP_URL=http://localhost:3000

---

# 🌱 Database Seeding (Admin Setup)

This project includes a seed script that automatically creates an Admin user using the authentication system and promotes the user to ADMIN role.

The admin is created via the Auth API and then updated in the database with:

- role = ADMIN
- emailVerified = true

---

## 🔧 Required Environment Variables

Add the following variables to your `.env` file:

```env
ADMIN_NAME="Admin Name"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="strongpassword"
```
## ▶️ Run Seed Script
```bash
npm run seed:admin
```

If the admin already exists, the script will skip creation

---

## 4️⃣ Run Database Migrations
```bash
npx prisma migrate dev
```

## 5️⃣ Start the Server
```bash
Development: npm run dev
```

Production:
```bash
npm run build
npm start
```

Server runs at:
```bash
http://localhost:5000
```
--- 

## 🗂️ Database Schema

Here is the ER diagram for the Mini E-Commerce API:

![Database Schema](https://i.ibb.co.com/v463GD7j/e-commerce.png)

The full ER diagram for the Mini E-Commerce API can be viewed online at DrawSQL:

[View Database Schema on DrawSQL](https://drawsql.app/teams/myself-668/diagrams/mini-e-commerce-api)

---

### 🔐 Authentication & Authorization

- Authentication handled via **Better Auth** (secure session management)
- Protected routes using **custom middleware** (`auth`) that checks:
  - Valid session
  - Email verification
  - User role (Admin / Customer)
- Role-based access control enforced for Admin and Customer routes
- Proper HTTP status codes used for authorization errors:
  - `200 OK` – Successful GET/DELETE operations
  - `201 Created` – Successful resource creation (e.g., placing an order, adding a product)
  - `401 Unauthorized` for missing/invalid sessions
  - `403 Forbidden` for insufficient permissions or unverified email
  - `500 Internal Server Error` – Unexpected server errors
---

## 📏 Business Rules Implemented

- Customers cannot order more than available stock
- Order total is calculated on the backend
- Product stock cannot go negative
- Stock is deducted only after successful order placement
- Database transactions ensure data consistency
- Role-based access is strictly enforced
- Proper validation and error handling implemented

---
## 🧠 Key Architectural Decisions

**1. Layered Structure**  
The backend is organized into clear layers:  
- **Routes** – Define API endpoints and handle incoming requests.  
- **Controllers** – Orchestrate request handling and response formatting.  
- **Services (Business Logic)** – Contain all core business rules, calculations, and operations.  
- **Database Layer (Prisma)** – Handles all interactions with the database.  

This layered approach ensures:  
- **Separation of concerns** – Each layer has a specific responsibility.  
- **Clean and maintainable code** – Easier to extend or modify features.  
- **Scalability** – New modules or features can be added without disrupting existing logic.  

**2. Backend-Driven Logic**  
- All critical operations, such as order total calculation, stock validation, and inventory deduction, are handled on the server.  
- This prevents manipulation of business logic on the client-side and ensures data integrity.  

**3. Transaction Handling**  
- Order placement is wrapped in **database transactions** to maintain consistency:  
  - Stock validation  
  - Inventory deduction  
  - Order creation  
  - Order items creation  
- Transactions ensure that **either all operations succeed, or none do**, preventing partial updates that could corrupt data.
---
## 🧪 Testing

The API has been thoroughly tested using:

- **Postman** – All endpoints verified for correct behavior.  
- **Role-based access tests** – Ensuring only authorized roles can access protected routes.  
- **Stock overflow prevention tests** – Orders cannot exceed available product stock.  
- **Validation and error handling checks** – Input validation and proper HTTP status codes confirmed.
---
## 📌 Evaluation Criteria Covered

✔ Business logic implementation  
✔ Role-based authorization  
✔ Database design and relationships  
✔ Transaction management  
✔ Data consistency and integrity  
✔ RESTful API design  
✔ Secure authentication (JWT-based)  
✔ Clean and maintainable backend code  
---
## 👨‍💻 Author

**Md. Noornabi** – Backend Developer
---