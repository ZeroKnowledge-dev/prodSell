# 🚀 ProdSell - Product Management System

ProdSell is a **full-stack product management system** designed to streamline sales operations. It includes **user authentication, category & product management, invoice generation, and sales summaries**.

## 🔥 Features

✅ User Authentication & Profile Management  
✅ CRUD Operations for Categories, Customers & Products  
✅ Invoice Generation & Detailed Invoice View  
✅ Date-Range Sales Summary & Printable Invoices

## 🛠️ Tech Stack

-   **Frontend:** Vue 3, Tailwind CSS, HTML, CSS
-   **Backend:** PHP (Laravel)
-   **Database:** MySQL

---

## 🚀 Installation Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ZeroKnowledge-dev/prodSell
cd prodSell
```

### 2️⃣ Install Backend Dependencies

```bash
composer install
```

### 3️⃣ Install Frontend Dependencies

```bash
npm install
```

### 4️⃣ Configure Environment

Copy the `.env.example` file and rename it to `.env`:

```bash
cp .env.example .env
```

Then, update your database credentials in the `.env` file.

### 5️⃣ Generate App Key

```bash
php artisan key:generate
```

### 6️⃣ Run Migrations & Seed Database

```bash
php artisan migrate
```

### 7️⃣ Create a Storage Link

```bash
php artisan storage:link
```

### 8️⃣ Start the Development Server

```bash
composer run dev
```

---

## 🎯 Usage

-   Access the app at `http://localhost:8000`
-   Register/Login to manage products, categories, and invoices.
-   Generate invoices and track sales with ease.

---

## 📌 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

## 📜 License

This project is **open-source** and available under the [MIT License](LICENSE).
