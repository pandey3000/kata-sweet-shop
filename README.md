# 🍬 Sweet Shop Management System

A **full-stack Sweet Shop Management System** built using **MERN-style architecture** (MongoDB, Express, React, Node.js).  
The application supports **user authentication, role-based access (admin/user), inventory management, purchasing, and restocking**, with a clean frontend UI and a secure backend API.

This project follows **modern development practices**, including RESTful APIs, JWT authentication, protected routes, and automated testing for both backend and frontend.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User Registration & Login
- JWT-based authentication
- Role-based access control (`user`, `admin`)
- Protected backend routes
- Protected frontend routes (Admin Panel)

### 🍭 Sweet Inventory Management
- Add new sweets (Admin only)
- View all available sweets
- Search sweets by name or category
- Update sweet details
- Delete sweets (Admin only)

### 📦 Inventory Operations
- Purchase sweets (stock decreases)
- Restock sweets (Admin only)
- Prevent purchase when out of stock

### 🎨 Frontend UI
- Responsive UI built with React + Tailwind CSS
- Dashboard to browse sweets
- Admin Panel for inventory management
- Toast notifications for success/error messages
- Persistent login using localStorage

### 🧪 Testing
- Backend API tests using **Jest & Supertest**
- Frontend component tests using **Vitest & React Testing Library**

---

## 🏗️ Tech Stack

### Backend
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT (jsonwebtoken)**
- **bcryptjs**
- **Jest & Supertest**

### Frontend
- **React (Vite)**
- **React Router**
- **Axios**
- **Tailwind CSS**
- **Vitest**
- **React Testing Library**

---

## 📂 Project Structure

