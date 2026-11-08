# Personal Finance Tracker

A full-stack MERN application for recording income and expenses, analysing spending by category, and tracking monthly budgets. It features a responsive dashboard, transaction management with filtering, and CSV export.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Model](#data-model)
- [Design Decisions](#design-decisions)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

- **Transactions:** create, read, update, and delete income and expense records, with server-side validation
- **Filtering:** narrow the list by type, category, and date range
- **Dashboard:** total income, total expenses, and balance, plus a spending-by-category chart
- **Monthly budgets:** set a limit per category for each month, with progress tracking and over-budget alerts
- **CSV export:** download the currently filtered transactions as a spreadsheet-ready file
- **Responsive UI:** usable on desktop, tablet, and phone screens
- **Consistent theming:** all colours and spacing are driven by CSS custom properties
- **Authentication:** register and log in with JWT. Every transaction and budget belongs to its owner, so users see only their own data

## Tech Stack

| Layer      | Technology                                                        |
| ---------- | ----------------------------------------------------------------- |
| Frontend   | React 18, Vite, React Router, Axios, Recharts                     |
| Backend    | Node.js, Express 4                                                |
| Database   | MongoDB with Mongoose ODM                                         |
| Styling    | Plain CSS with custom properties, no UI framework                 |
| Dev tools  | Nodemon, dotenv, CORS, Postman (API testing)                      |

## Architecture

The project is split into two independently runnable applications.

```
personal-finance-tracker/
├── client/                     # React SPA (Vite)
│   └── src/
│       ├── components/         # Reusable UI: forms, lists, cards, filters
│       ├── pages/              # Route-level screens: Dashboard, Transactions
│       ├── services/           # Axios instance and API call functions
│       ├── styles/             # Theme variables and component CSS
│       └── utils/              # Helpers such as CSV export
└── server/                     # Express REST API
    ├── config/                 # Database connection
    ├── controllers/            # Request handling and business logic
    ├── middleware/             # Centralised error handling
    ├── models/                 # Mongoose schemas
    ├── routes/                 # Route definitions per resource
    └── index.js                # Application entry point
```

**Request flow:** a page calls a function in `services/`, which sends an HTTP request through the shared Axios instance. The Express route forwards it to a controller, which validates input through the Mongoose schema and returns JSON. Errors from any layer pass through one error handler, so the client always receives a `{ message }` payload.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [MongoDB](https://www.mongodb.com/) running locally, or a MongoDB Atlas connection string

### 1. Clone the repository

```bash
git clone https://github.com/vanshrajputofficial6-rgb/personal-finance-tracker.git
cd personal-finance-tracker
```

### 2. Start the API

```bash
cd server
npm install
npm run dev
```

The API listens on `http://localhost:5000`.

### 3. Start the client

In a second terminal:

```bash
cd client
npm install
npm run dev
```

The app is served at `http://localhost:5173`.

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finance-tracker
```

For MongoDB Atlas, replace `MONGO_URI` with your `mongodb+srv://` connection string. The `.env` file is git-ignored and must never be committed.

## API Reference

Base URL: `http://localhost:5000/api`
All `/transactions`, `/summary`, and `/budgets` endpoints require a bearer token. Send it in the header `Authorization: Bearer <token>`. Requests without a valid token receive `401 Unauthorized`.

### Authentication

| Method | Endpoint          | Description                                         |
| ------ | ----------------- | --------------------------------------------------- |
| POST   | `/auth/register`  | Create an account. Returns a JWT and the user       |
| POST   | `/auth/login`     | Log in. Returns a JWT and the user                  |
| GET    | `/auth/me`        | Get the logged-in user. Requires `Authorization`    |

### Health

| Method | Endpoint  | Description        |
| ------ | --------- | ------------------ |
| GET    | `/health` | Service status     |

### Transactions

| Method | Endpoint            | Description                                      |
| ------ | ------------------- | ------------------------------------------------ |
| GET    | `/transactions`     | List transactions. Query: `type`, `category`, `startDate`, `endDate` |
| GET    | `/transactions/:id` | Get one transaction                              |
| POST   | `/transactions`     | Create a transaction (`201 Created`)             |
| PUT    | `/transactions/:id` | Update a transaction                             |
| DELETE | `/transactions/:id` | Delete a transaction                             |

### Summary

| Method | Endpoint                   | Description                                  |
| ------ | -------------------------- | -------------------------------------------- |
| GET    | `/summary`                 | Total income, total expenses, and balance    |
| GET    | `/summary/by-category`     | Expense totals and counts grouped by category |

### Budgets

| Method | Endpoint             | Description                                                        |
| ------ | -------------------- | ------------------------------------------------------------------ |
| GET    | `/budgets`           | List budgets. Optional query: `month` (`YYYY-MM`)                  |
| GET    | `/budgets/status`    | Budgets for a month with spent, remaining, percent, and over flag. Requires `month` |
| PUT    | `/budgets`           | Create or update the budget for a category and month (upsert)      |
| DELETE | `/budgets/:id`       | Delete a budget                                                    |

### Example: create a transaction

```http
POST /api/transactions
Content-Type: application/json

{
  "amount": 250,
  "type": "expense",
  "category": "Food",
  "date": "2026-11-08",
  "description": "Lunch"
}
```

```json
{
  "_id": "6aef28adc6cbe34a76da65e7",
  "amount": 250,
  "type": "expense",
  "category": "Food",
  "date": "2026-11-08T00:00:00.000Z",
  "description": "Lunch",
  "createdAt": "2026-11-08T10:20:00.000Z",
  "updatedAt": "2026-11-08T10:20:00.000Z",
  "__v": 0
}
```

### Errors

Validation and server errors return a JSON body with a `message` field:

```json
{ "message": "Amount must be greater than 0" }
```

## Data Model

**Transaction**

| Field         | Type     | Rules                                              |
| ------------- | -------- | -------------------------------------------------- |
| `amount`      | Number   | Required, minimum 0.01                             |
| `type`        | String   | Required, `income` or `expense`                    |
| `category`    | String   | Required, one of the fixed category list           |
| `date`        | Date     | Required, defaults to now                          |
| `description` | String   | Optional, max 200 characters                       |

**Budget**

| Field      | Type   | Rules                                                 |
| ---------- | ------ | ----------------------------------------------------- |
| `category` | String | Required, same fixed category list                    |
| `month`    | String | Required, `YYYY-MM` format                            |
| `limit`    | Number | Required, minimum 1                                   |

A unique index on `(category, month)` guarantees one budget per category per month.

## Design Decisions

- **Amounts are always positive.** Direction is stored in `type`, which keeps aggregation simple and avoids sign-handling bugs.
- **Fixed category list.** Categories are defined once in the model and reused by the chart and budget logic. Custom categories are a deliberate future extension, since they would need their own collection.
- **Aggregation happens in MongoDB.** Totals and category breakdowns use the aggregation pipeline rather than loading every record into Node.
- **Centralised error handling.** Controllers pass errors to one middleware, so response formats stay consistent.
- **Thin client service layer.** Components never call Axios directly. All HTTP calls live in `services/`, and an interceptor converts server errors into readable messages.
- **Theme through CSS custom properties.** Colours live in one `:root` block, so the palette can change without touching component styles.

## Roadmap

- [x] REST API with validation and error handling
- [x] Summary and category aggregation endpoints
- [x] React frontend with routing and theme
- [x] Dashboard with summary cards and category chart
- [x] Transaction management with filtering
- [x] Responsive layout
- [x] Monthly budgets with progress tracking
- [x] CSV export
- [x] User authentication (JWT)
- [x] Per-user data isolation
- [ ] Automated tests (API and component)
- [ ] Deployment configuration

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

**Author:** Vansh Rajput · [GitHub](https://github.com/vanshrajputofficial6-rgb)