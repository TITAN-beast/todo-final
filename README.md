# Production-Ready Full-Stack Todo Application (TaskFlow)

A secure, enterprise-grade Full-Stack Todo Application built with **React.js**, **Node.js + Express.js** (following strict **MVC Architecture**), and **Supabase PostgreSQL** with **Row Level Security (RLS)**.

---

## 1. Project Overview

TaskFlow is designed following production best practices:
- **Strict Separation of Concerns**: Frontend and Backend are decoupled applications communicating solely over a REST API.
- **Enterprise MVC Backend**: Clear separation into Models, Views (JSON API responses), Controllers, Services, Middlewares, Configs, and Utilities.
- **Robust Security**: Supabase credentials (Service Role Key) are **never** exposed to the frontend browser. Authentication is backed by bcrypt password hashing and signed JWT tokens with user isolation.
- **Supabase Database & RLS**: Database tables are secured via PostgreSQL Row Level Security (RLS) policies enforcing that users can only read, write, update, and delete their own records.

---

## 2. Technologies Used

| Tier | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js (v18) | Single Page Application with component-driven architecture |
| **Routing** | React Router DOM (v6) | Client-side routing with authentication guards |
| **Styling** | Vanilla CSS | Custom design system with modern dark-mode aesthetic |
| **Icons** | Lucide React | High-quality, lightweight SVG iconography |
| **Backend** | Node.js (v24) & Express.js | High-performance RESTful API server |
| **Architecture** | MVC Pattern | Model-View-Controller with dedicated Services layer |
| **Database** | Supabase PostgreSQL 17 | Cloud relational database engine |
| **Authentication**| JWT (`jsonwebtoken`) | Stateless token-based user authentication |
| **Password Hashing**| `bcryptjs` | Salted 10-round bcrypt hashing |
| **Security** | Supabase RLS | Database-level row isolation policies |
| **Tooling** | Webpack 5, Babel, Dotenv | Clean, fast modular development bundle |

---

## 3. Architecture

```text
                             TASKFLOW TODO APPLICATION
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                         │
                    ▼                                         ▼
             frontend-todo                              backend-todo
          React.js Client App                         Express.js Server
                    │                                         │
                    │   HTTP REST API                         │
                    │   Authorization: Bearer <JWT>           │
                    └─────────────────► Routes ◄──────────────┘
                                          │
                                      Middleware
                           (Auth, Validation, Errors)
                                          │
                                     Controllers
                                          │
                                       Services
                                 (Business / Auth Logic)
                                          │
                                        Models
                                          │
                                 Supabase Service Role
                                          │
                                          ▼
                                 Supabase PostgreSQL
                                ┌─────────┴─────────┐
                                │                   │
                              users               todos
                           (RLS Enabled)       (RLS Enabled)
```

---

## 4. Folder Structure

```text
todo-fullstack/
│
├── frontend-todo/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorMessage.js       # Dismissable error alert component
│   │   │   ├── Loading.js            # Pulsating loading spinner
│   │   │   ├── Navbar.js             # Sticky navbar with user profile & logout
│   │   │   ├── ProtectedRoute.js     # Route guard redirecting to /login
│   │   │   ├── TodoForm.js           # Task creation form
│   │   │   ├── TodoItem.js           # Task row with edit, toggle & delete
│   │   │   └── TodoList.js           # Filter tabs, search box & task list
│   │   ├── pages/
│   │   │   ├── LoginPage.js          # User sign-in page
│   │   │   ├── RegisterPage.js       # User sign-up page
│   │   │   └── TodosPage.js          # Main dashboard with metrics & tasks
│   │   ├── services/
│   │   │   ├── api.js                # Fetch wrapper with Bearer token injection
│   │   │   ├── authService.js        # Auth API calls (register, login, me)
│   │   │   └── todoService.js        # Todo API calls (CRUD)
│   │   ├── context/
│   │   │   └── AuthContext.js        # Global user session context & state
│   │   ├── hooks/
│   │   │   ├── useAuth.js            # Auth consumer hook
│   │   │   └── useTodos.js           # Todos state & optimistic mutation hook
│   │   ├── utils/
│   │   │   └── storage.js            # LocalStorage token & session manager
│   │   ├── App.css                   # Component styles & dashboard layout
│   │   ├── App.js                    # App router & layout shell
│   │   ├── index.css                 # Design system tokens & global resets
│   │   └── index.js                  # React DOM createRoot entry
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── webpack.config.js
│
├── backend-todo/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js           # Supabase client initialization
│   │   ├── controllers/
│   │   │   ├── authController.js     # Auth request handlers
│   │   │   └── todoController.js     # Todo CRUD request handlers
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT verification & user attachment
│   │   │   ├── errorMiddleware.js    # 404 & centralized error handler
│   │   │   └── validationMiddleware.js # Input sanitization & validator
│   │   ├── models/
│   │   │   ├── todoModel.js          # DB queries for 'todos' table
│   │   │   └── userModel.js          # DB queries for 'users' table
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth endpoints
│   │   │   ├── healthRoutes.js       # /api/health endpoint
│   │   │   └── todoRoutes.js         # /api/todos endpoints
│   │   ├── services/
│   │   │   ├── authService.js        # Password hashing & JWT generation
│   │   │   └── todoService.js        # Todo business logic & ownership
│   │   ├── utils/
│   │   │   ├── jwt.js                # Token sign & verify utilities
│   │   │   ├── response.js           # Consistent JSON response helpers
│   │   │   └── validation.js         # Form field regex & length checks
│   │   ├── app.js                    # Express app configuration & middleware
│   │   └── server.js                 # HTTP listener & lifecycle management
│   ├── test-endpoints.js             # Automated endpoint & security test suite
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 5. Supabase Setup & Database Schema

The database tables are configured directly in your connected Supabase PostgreSQL instance.

### `users` Table

```sql
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `todos` Table

```sql
CREATE TABLE IF NOT EXISTS public.todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_todos_user_id ON public.todos(user_id);
```

---

## 6. Row Level Security (RLS) Policies

Row Level Security is enabled on both user tables:

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
```

### Explanation of Policies:

1. **Service Role Full Access**:
   The backend Express server connects using the `service_role` credential. Dedicated policies grant administrative access to the service role:
   ```sql
   CREATE POLICY "Service role has full access to users"
       ON public.users FOR ALL TO service_role
       USING (true) WITH CHECK (true);

   CREATE POLICY "Service role has full access to todos"
       ON public.todos FOR ALL TO service_role
       USING (true) WITH CHECK (true);
   ```

2. **User Data Isolation (`todos`)**:
   A user can only select, create, modify, or delete a todo if `auth.uid() = user_id`. This prevents any user from viewing or altering another user's todos.
   ```sql
   CREATE POLICY "Users can view their own todos"
       ON public.todos FOR SELECT
       USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own todos"
       ON public.todos FOR INSERT
       WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own todos"
       ON public.todos FOR UPDATE
       USING (auth.uid() = user_id)
       WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own todos"
       ON public.todos FOR DELETE
       USING (auth.uid() = user_id);
   ```

3. **User Profile Security (`users`)**:
   Users can only view or update their own user record (`auth.uid() = id`). Passwords are never queried in user-facing endpoints.

---

## 7. Environment Variables

### Backend (`backend-todo/.env`)

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Your Supabase Project URL
SUPABASE_URL=https://qyowwrhkpraygqfqfmub.supabase.co

# Your Secret Supabase Service Role Key (from Dashboard -> Settings -> API)
SUPABASE_SERVICE_ROLE_KEY=your_secret_service_role_key_here

# Backend JWT Signing Secret
JWT_SECRET=super_secret_jwt_key_9f82d1c68e743a1290bb4c9e81d7f63a25b4109e
JWT_EXPIRES_IN=7d
```

> **Important**: The `SUPABASE_SERVICE_ROLE_KEY` is located in your **Supabase Dashboard** under **Project Settings -> API -> Project API keys -> `service_role` (secret)**. Paste this into `backend-todo/.env`.

### Frontend (`frontend-todo/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 8. Installation & Running Locally

### Step 1: Backend Setup (Terminal 1)

```bash
cd backend-todo
npm install
npm run dev
```

* Backend server runs at: `http://localhost:5000`
* Health check: `http://localhost:5000/api/health`
* Run test suite: `npm test`

### Step 2: Frontend Setup (Terminal 2)

```bash
cd frontend-todo
npm install
npm start
```

* Frontend application opens automatically at: `http://localhost:3000`

---

## 9. API Documentation & Testing

All endpoints respond with standardized JSON:
- **Success**: `{ "success": true, "message": "...", "data": { ... } }`
- **Error**: `{ "success": false, "message": "..." }`

### 1. Health Check
* **Endpoint**: `GET /api/health`
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Todo API is running",
    "data": {
      "status": "healthy",
      "timestamp": "2026-09-25T07:30:39.527Z"
    }
  }
  ```

### 2. Register User
* **Endpoint**: `POST /api/auth/register`
* **Headers**: `Content-Type: application/json`
* **Body**:
  ```json
  {
    "name": "Vinay Kumar",
    "email": "vinay@example.com",
    "password": "Password123"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "c1f7b76a-5452-45e1-8848-03fd165fbb60",
        "name": "Vinay Kumar",
        "email": "vinay@example.com",
        "createdAt": "2026-09-25T07:35:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### 3. Login User
* **Endpoint**: `POST /api/auth/login`
* **Headers**: `Content-Type: application/json`
* **Body**:
  ```json
  {
    "email": "vinay@example.com",
    "password": "Password123"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "c1f7b76a-5452-45e1-8848-03fd165fbb60",
        "name": "Vinay Kumar",
        "email": "vinay@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### 4. Get Current User Profile
* **Endpoint**: `GET /api/auth/me`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Current user profile fetched successfully",
    "data": {
      "user": {
        "id": "c1f7b76a-5452-45e1-8848-03fd165fbb60",
        "name": "Vinay Kumar",
        "email": "vinay@example.com"
      }
    }
  }
  ```

### 5. Create Todo
* **Endpoint**: `POST /api/todos`
* **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
* **Body**:
  ```json
  {
    "title": "Study Express MVC Architecture",
    "description": "Review models, controllers, and services separation"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Todo created successfully",
    "data": {
      "todo": {
        "id": "f82b2f8a-98be-406a-a633-875c7423eef2",
        "user_id": "c1f7b76a-5452-45e1-8848-03fd165fbb60",
        "title": "Study Express MVC Architecture",
        "description": "Review models, controllers, and services separation",
        "completed": false,
        "created_at": "2026-09-25T07:36:00.000Z",
        "updated_at": "2026-09-25T07:36:00.000Z"
      }
    }
  }
  ```

### 6. Get All Todos
* **Endpoint**: `GET /api/todos`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Todos retrieved successfully",
    "data": {
      "todos": [ ... ]
    }
  }
  ```

### 7. Get Single Todo
* **Endpoint**: `GET /api/todos/:id`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Todo retrieved successfully",
    "data": {
      "todo": { ... }
    }
  }
  ```

### 8. Update Todo
* **Endpoint**: `PUT /api/todos/:id`
* **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
* **Body**:
  ```json
  {
    "completed": true
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Todo updated successfully",
    "data": {
      "todo": { ... }
    }
  }
  ```

### 9. Delete Todo
* **Endpoint**: `DELETE /api/todos/:id`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Todo deleted successfully"
  }
  ```

---

## 10. Security Checklist

- [x] **No Frontend Credentials**: `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to the Express server environment.
- [x] **Password Protection**: Passwords are never stored in plain text; hashed using salted bcrypt (10 rounds).
- [x] **Safe Responses**: User endpoints never return password hashes or raw database errors.
- [x] **Row Level Security**: Enabled on `users` and `todos` with strict row ownership checks.
- [x] **Automatic User Binding**: Todo creation automatically derives `user_id` from the verified JWT payload, rejecting client-submitted user IDs.
- [x] **Strict Route Protection**: Middleware blocks unauthorized requests with `401 Unauthorized`.
- [x] **Configurable CORS**: Configured to restrict origins in production.
- [x] **Git Protection**: `.gitignore` configured to ensure `.env` and `node_modules` are never committed.

---

## 11. Production Deployment

### Backend Deployment (e.g., Render, Railway, Fly.io, or AWS EC2)
1. Set Environment Variables on host:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend-domain.com`
   - `SUPABASE_URL=https://qyowwrhkpraygqfqfmub.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY=<your-secret-key>`
   - `JWT_SECRET=<strong-random-secret>`
2. Start command:
   ```bash
   npm start
   ```

### Frontend Deployment (e.g., Vercel, Netlify, Cloudflare Pages, or S3/CloudFront)
1. Set Build Command:
   ```bash
   npm run build
   ```
2. Set Output Directory:
   ```bash
   build
   ```
3. Set Environment Variable:
   - `REACT_APP_API_URL=https://your-backend-api-domain.com/api`
