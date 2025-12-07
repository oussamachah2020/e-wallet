# E-Wallet System – Microservices Architecture

A modern e-wallet application built with **NestJS**, **PostgreSQL**, **BullMQ**, **Docker**, and a fully isolated **microservices architecture**.  
This project supports secure money transfers, balance management, and a complete transaction system — with upcoming services for **notifications** and **analytics**.

---

## 🚀 Project Purpose

The goal of this project is to build a scalable and modular digital wallet system that enables:

- Sending money  
- Receiving money  
- Storing and managing user balances  
- Recording and viewing transactions  
- Extensible architecture for analytics & notifications  

---

## 🏗️ Tech Stack

### **Backend**
- NestJS (Modular & microservice-ready)
- PostgreSQL
- Docker & Docker Compose
- Redis + BullMQ (Background jobs)
- TypeORM
- Microservice communication via Redis or TCP
- Caching & rate limiting

### **Frontend**
- React Native (Expo)
- Planned UI rebuild for better UX
- Features: Auth → Wallet → Transactions → Offline mode

---

## 🧩 Microservices Overview

### **1. Auth Service (Completed)**
Handles:
- User registration & login  
- Access & refresh tokens  
- User profile  
- Secure password handling  

### **2. Wallet Service (Completed MVP)**
Handles:
- User balance  
- Sending & receiving money  
- Transaction history  
- Balance updates  
- **Upcoming**: Fraud/security improvements

### **3. Notification Service (Planned)**
- Push notifications (Expo)  
- Email and in-app alerts  
- BullMQ queue processing  

### **4. Analytics Service (Planned)**
- Transaction insights  
- Spending analysis  
- System metrics  

---

## 🐳 Docker Setup

The project includes full Docker support for:

- PostgreSQL  
- Redis  
- PgAdmin  
- Microservices  


## 🙋‍♂️ Author
Oussama Chahidi – Full Stack Developer
Passionate about scalable architectures, secure systems, and real-world applications.

