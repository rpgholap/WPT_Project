# 🏭 Spare Parts Inventory Management System (MERN + MySQL)

## 📌 Project Overview
The **Spare Parts Inventory Management System** is a full-stack web application designed to manage the inventory, suppliers, and orders of spare parts efficiently.  
The system follows a **role-based access** model with **Admin**, **User**, and **Supplier** roles. It is built using the **MERN stack** (React + Node.js + Express + MySQL) with **JWT authentication** and follows the **MVC architecture**.

The main goal is to streamline spare parts management, track inventory, handle supplier approvals, and simplify user interactions with orders.

---

## 🚀 Key Features

### 1️⃣ Authentication & Authorization
- User and Supplier registration and login with **Regex validation**
- **JWT-based authentication** for secure sessions
- **Role-based access** for Admin, User, and Supplier
- Passwords are **encrypted** using `bcrypt`

### 2️⃣ User Features
- Register and login
- Browse and search spare parts
- Place, edit, or delete orders (CRUD operations)
- Track order status in real-time

### 3️⃣ Supplier Features
- Supplier registration (with optional `supplier_code`)
- Supplier account approval by Admin
- Only approved suppliers can login
- Manage spare parts inventory (Add, Edit, Delete)

### 4️⃣ Admin Features
- Approve or reject supplier accounts
- Manage Users, Suppliers, and Spare Parts
- Maintain inventory and handle requests from suppliers
- Dashboard with overall system statistics

---

## 🗃 Database Schema (MySQL)

### Main Tables
1. `roleTable` – Stores user roles (Admin, User, Supplier)  
2. `users` – Stores user details (**Auto Increment added**)  
3. `suppliers` – Stores supplier details (**Auto Increment + isApproved flag**)  
4. `admin` – Admin credentials and info  
5. `orders` – Stores orders placed by users  
6. `orderDetails` – Detailed items for each order  
7. `spareParts` – Inventory of spare parts  
8. `InventoryManagement` – Tracks stock levels  
9. `requests` – Handles requests between suppliers and admin  

---

## 🔁 Supplier Approval Workflow
1. Supplier registers using an optional `supplier_code`.  
2. If `supplier_code == "supplier123"` → assigned the **SUPPLIER** role.  
3. Supplier **cannot login** until approved by Admin.  
4. After approval → Supplier receives **JWT token** → redirected to **Supplier Dashboard**.

---

## 📦 Key API Endpoints

### User Endpoints
- `POST /signup` – Register a new user  
- `POST /login` – Login  
- `PUT /user/edit-order/:orderId/:sparePart_id` – Edit user order  

### Supplier Endpoints
- `POST /supplier/signup` – Register a supplier  
- `POST /supplier/login` – Login (only if `isApproved = true`)  

### Admin Endpoints
- `PUT /admin/approve-supplier/:supplierId` – Approve supplier  
- `GET /admin/dashboard` – Fetch admin dashboard statistics  

### Requests
- Handles spare part quantity requests between suppliers and Admin  

---

## 🖼 Frontend Pages (Minimum Required)
1. Login Page  
2. Signup Page  
3. Home Page  
4. About Page  
5. Contact Page  
6. Gallery Page (with spare part images)  
7. Dashboard (for Admin/Supplier/User)  

---

## 🧪 Backend Validation
- Proper error and exception handling  
- Field validations using **Regex**  
- Controlled response for **approved/rejected supplier login**  

---

## 🖥 Technology Stack

### Frontend
- React.js  
- Bootstrap  
- Axios (for API calls)  
- React Router  

### Backend
- Node.js  
- Express.js  
- JWT Authentication  
- Bcrypt (Password Encryption)  
- MySQL2  

### Database
- MySQL Workbench  

---

## 📁 Recommended Project Structure

```
/backend
  ├── controllers   # Business logic
  ├── models        # Database models
  ├── routes        # API routes
  ├── middleware    # Auth & validation
  ├── config        # DB connection, env variables
  └── index.js      # Server entry point

/frontend
  ├── components    # Reusable UI components
  ├── pages         # Page-level components
  ├── services      # API service calls
  └── App.js        # Main app entry
```

---

## 🧩 Notes
- `supplier_code` determines role assignment.  
- Backend follows **MVC architecture** for organized code.  
- UI must be **responsive** and maintain a consistent theme.  
- CRUD operations for Users, Suppliers, and Spare Parts are **essential**.  
- Gallery page must include **images of products**.  

---

## 👩‍💻 Author
**Rutuja Pravin Gholap**

