# NovaPay — Internet Banking Frontend

A modern, dark-themed internet banking single-page application built with React, Vite, and Tailwind CSS. Supports user banking features and a dedicated admin dashboard with role-based access control.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS v4 | Styling |
| Axios | HTTP client with interceptors |
| React Router v6 | Client-side routing |
| @tanstack/react-query | Server state management |
| Recharts | Charts and data visualization |
| jwt-decode | JWT token parsing |

---

## Features

- JWT authentication with automatic refresh token rotation
- Role-based routing (USER and ADMIN)
- Dashboard with account overview and spending charts
- Account management (create, view, delete)
- Fund transfers between accounts
- Transaction history with filters
- Card management (create, block, delete)
- Beneficiary management
- PDF statement download
- Profile management with password update
- Admin dashboard — system stats, user management, account suspension, transaction monitoring

---

## Prerequisites

Make sure the following are installed on your machine before proceeding:

- **Node.js** v18 or higher → [Download](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- The **backend server** must be running on `http://localhost:8080` (see backend README)

Check your versions:
```bash
node --version
npm --version
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Anirudha-N-Joshi/internet-banking-react-frontend.git
cd novapay-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Tailwind CSS PostCSS plugin (required for Tailwind v4)

```bash
npm install @tailwindcss/postcss
```

### 4. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

---

## Project Structure

```
novapay-frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── axiosInstance.js       # Axios instance with JWT interceptors and auto-refresh
│   │   └── index.js               # All API call definitions
│   ├── components/
│   │   ├── Layout.jsx             # App shell with sidebar
│   │   ├── Sidebar.jsx            # Navigation with role-based admin links
│   │   ├── Modal.jsx              # Reusable modal component
│   │   ├── PrivateRoute.jsx       # Auth guard for protected routes
│   │   ├── Spinner.jsx            # Loading spinner
│   ├── context/
│   │   └── AuthContext.jsx        # Global auth state, login, logout, token management
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Accounts.jsx
│   │   ├── Transfer.jsx
│   │   ├── Transactions.jsx
│   │   ├── Cards.jsx
│   │   ├── Beneficiaries.jsx
│   │   ├── Statement.jsx
│   │   ├── Profile.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminUsers.jsx
│   │       ├── AdminAccounts.jsx
│   │       └── AdminTransactions.jsx
│   ├── App.jsx                    # Route definitions
│   ├── main.jsx                   # App entry point with providers
│   └── index.css                  # Global styles and CSS variables
├── vite.config.js
├── postcss.config.js
└── package.json
```

---

## Configuration Files

### `vite.config.js`
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
})
```

### `postcss.config.js`
```js
export default {
  plugins: { '@tailwindcss/postcss': {} }
}
```

### `index.css`
Must start with:
```css
@import "tailwindcss";
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server at localhost:5173 |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |

---

## Authentication Flow

1. User logs in → backend returns `accessToken` (15 min) + `refreshToken` (7 days)
2. Both tokens are stored in `localStorage`
3. Every API request automatically attaches the `accessToken` via Axios request interceptor
4. When a request returns `401` → Axios response interceptor calls `/api/v1/authentication/refresh` automatically
5. New `accessToken` is stored and the original request is retried — user never notices
6. If refresh token is also expired → user is redirected to `/login`
7. On logout → refresh token is deleted from the backend database

---

## Role-Based Access

| Role | Access |
|---|---|
| `USER` | Dashboard, Accounts, Transfer, Transactions, Cards, Beneficiaries, Statement, Profile |
| `ADMIN` | All USER pages + Admin Dashboard, Admin Users, Admin Accounts, Admin Transactions |

Admin routes are protected by an `AdminRoute` component that redirects non-admin users to `/dashboard`.
