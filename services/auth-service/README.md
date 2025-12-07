# Auth Service – E-Wallet System

The **Auth Service** manages authentication, authorization, and user identity within the E-Wallet microservices ecosystem.  
It is built with **NestJS**, **PostgreSQL**, and fully containerized with **Docker**.

---

## 🚀 Features

- User registration  
- Secure login  
- JWT authentication (access + refresh tokens)  
- Password hashing (bcrypt)  
- Refresh token rotation  
- User profile retrieval  
- Microservice-friendly design  
- Ready for future features (email verification, 2FA, etc.)

---

## 🛠️ Tech Stack

- **NestJS**
- **PostgreSQL**
- **TypeORM**
- **Docker**
- **JWT**
- **Redis** (shared across services)

---

## 📁 Project Structure

```
auth-service/
├── src/
│ ├── auth/
│ │ ├── auth.controller.ts
│ │ ├── auth.service.ts
│ │ └── strategies/
│ ├── users/
│ ├── common/
│ └── main.ts
├── test/
├── Dockerfile
├── tsconfig.json
└── README.md
```
---

## 🔧 Environment Variables

Create a `.env` file:

```
App
PORT=3001

Database
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=admin
DATABASE_PASSWORD=admin
DATABASE_NAME=wallet_db

JWT
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=super_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```
---

## 🐳 Running with Docker

```bash
docker compose up --build
```

This will start:

- Auth service
- PostgreSQL
- Redis (if included in root compose)


🧩 Part of the E-Wallet Architecture

The Auth Service interacts with:

- Wallet Service
- Redis (caching & queues)


### 📜 License
MIT License
