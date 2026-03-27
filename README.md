# 📍 Location Tracking Backend (MERN)

## 🚀 Description
This is the backend for a role-based Location Tracking System. It provides secure APIs for authentication, location (block) management, history tracking, and user/admin control using JWT and middleware.

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Middleware (Authorization)

---

## 🔐 Core Features
- JWT Authentication (Login / Register)
- Role-Based Access Control (Admin / User)
- Protected API routes using middleware
- Location management (Blocks)
- History tracking of activities
- Record management system
- Admin-controlled user access

---

---

## 🔄 Data Flow

Client → Server → Routes → Middleware → Controller → Model → Database

---

## 📡 API Modules

### 🔑 Auth
- `POST /api/auth/register` → Register user  
- `POST /api/auth/login` → Login & get token  

---

### 📍 Blocks (Location)
- `GET /api/blocks` → Get locations  
- `POST /api/blocks` → Add new location  

---

### 📜 History
- `GET /api/history` → Get activity history  

---

### 📦 Records
- `GET /api/records` → Get tracking records  

---

### 👤 Users
- `GET /api/users` → Get users  

---

### 🛠️ Admin
- Admin-only operations using role-based access  

---

## 🔑 Authentication & Authorization

- JWT token generated during login  
- Token verified using middleware  
- Role-based access (Admin/User)  
- Protected routes for sensitive APIs  

---
