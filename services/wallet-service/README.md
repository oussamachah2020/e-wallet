# Wallet Service – E-Wallet System

The **Wallet Service** manages balance operations, money transfers, and transaction history within the E-Wallet microservices architecture.  
It is responsible for the **core financial logic** of the platform and is built with **NestJS**, **PostgreSQL**, **TypeORM**, and **Docker**.

---

## 💰 Features

- Fetch user balance  
- Send money  
- Receive money  
- Atomic balance updates  
- Transaction history  
- Service-to-service communication  
- Business validation (funds, ownership, etc.)  
- Redis & BullMQ ready (for processing + notifications)

---

## 🛠️ Tech Stack

- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **Docker**
- **Redis**
- **BullMQ** (for jobs/queues)
- **Microservices pattern**

---

## 📁 Project Structure

```
wallet-service/
├── src/
│ ├── wallet/
│ │ ├── wallet.controller.ts
│ │ ├── wallet.service.ts
│ ├── transactions/
│ ├── common/
│ └── main.ts
├── test/
├── Dockerfile
├── tsconfig.json
└── README.md
```


## 🔧 Environment Variables

Create a `.env` file:

```
App
PORT=3002

Database
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=admin
DATABASE_PASSWORD=admin
DATABASE_NAME=wallet_db

Redis
REDIS_HOST=redis
REDIS_PORT=6379
```
---

## 🐳 Running with Docker

```bash
docker compose up --build
```

This will start:

- Wallet Service
- PostgreSQL
- Redis

## 📜 License
MIT License