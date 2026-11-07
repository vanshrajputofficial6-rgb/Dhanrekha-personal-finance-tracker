<div align="center">

# 💰 Personal Finance Tracker

A full-stack MERN app for tracking income, expenses, and spending patterns, with a clean dashboard and charts.

![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black)

</div>

---

## ✨ Features

- Add, edit, view, and delete income and expense transactions
- Summary of total income, total expenses, and current balance
- Spending breakdown by category
- Filter transactions by type, category, and date range
- Input validation with clear error messages
- Clean, teal-themed UI *(frontend in progress)*

## 🛠️ Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Frontend  | React, Vite, CSS variables          |
| Backend   | Node.js, Express                    |
| Database  | MongoDB with Mongoose               |
| Tooling   | Nodemon, dotenv, CORS, Postman      |

## 📁 Project Structure

```
personal-finance-tracker/
├── client/          # React frontend (Vite)
└── server/
    ├── config/      # Database connection
    ├── controllers/ # Request handlers
    ├── middleware/  # Error handling
    ├── models/      # Mongoose schemas
    ├── routes/      # API routes
    └── index.js     # Server entry point
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB](https://www.mongodb.com/) running locally, or a MongoDB Atlas connection string

### 1. Clone the repository

```bash
git clone https://github.com/vanshrajputofficial6-rgb/personal-finance-tracker.git
cd personal-finance-tracker
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finance-tracker
```

Start the server:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd ../client
npm install
npm run dev
```

The app runs at `http://localhost:5173` and the API at `http://localhost:5000`.

## 🔌 API Endpoints

| Method | Endpoint                          | Description                          |
| ------ | --------------------------------- | ------------------------------------ |
| GET    | `/api/health`                     | Health check                         |
| GET    | `/api/transactions`               | List transactions (supports filters) |
| GET    | `/api/transactions/:id`           | Get one transaction                  |
| POST   | `/api/transactions`               | Create a transaction                 |
| PUT    | `/api/transactions/:id`           | Update a transaction                 |
| DELETE | `/api/transactions/:id`           | Delete a transaction                 |
| GET    | `/api/summary`                    | Total income, expenses, and balance  |
| GET    | `/api/summary/by-category`        | Expense totals grouped by category   |

**Query filters for `GET /api/transactions`:** `type`, `category`, `startDate`, `endDate`

**Example request body:**

```json
{
  "amount": 250,
  "type": "expense",
  "category": "Food",
  "description": "Lunch"
}
```

**Valid categories:** Food, Transport, Shopping, Bills, Entertainment, Health, Salary, Other

## 🗺️ Roadmap

- [x] Backend API with validation and error handling
- [x] Summary and category endpoints
- [ ] Frontend foundation with theme and layout
- [ ] Dashboard with charts
- [ ] Transactions UI (add, edit, delete, filter)
- [ ] Monthly budgets
- [ ] CSV export
- [ ] User authentication (JWT)

## 🎨 Theme

| Role       | Color     |
| ---------- | --------- |
| Primary    | `#0F766E` |
| Accent     | `#5EEAD4` |
| Background | `#F0FDFA` |

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
Made with ❤️ by <a href="https://github.com/vanshrajputofficial6-rgb">Vansh Rajput</a>
</div>