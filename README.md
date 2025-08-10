# URL Shortener (MERN)

Full‑stack URL shortener with per‑user link management, JWT auth, bcrypt password hashing, modular Express backend, and React (Vite) frontend.

## Features
* User registration & login (email + password) with bcrypt hashing
* JWT issuance (7d expiry) and protected routes
* Create short links (random or custom code) with optional expiration
* List & delete own links; click tracking & last access timestamp
* Public redirect endpoint `/:shortCode`
* Clean modular code structure (controllers, routes, models, security, utils)

## Tech Stack
* MongoDB + Mongoose
* Express.js
* React 18 + Vite + Axios + React Router
* JWT (jsonwebtoken) & bcrypt

## Directory Layout
```
server/       # Express + Mongoose backend
	src/
		models/   # User, Link schemas
		controllers/ # auth, link, redirect logic
		routes/   # authRoutes, linkRoutes, redirectRoutes
		security/ # authMiddleware
		utils/    # helpers (e.g. URL validation)
client/       # React frontend (Vite)
```

## Backend API
Auth:
POST /api/auth/register { email, password }
POST /api/auth/login { email, password } -> { token }
GET /api/auth/me (Bearer token)

Links (auth required):
POST /api/links { originalUrl, customCode?, expiresAt?(ISO date) }
GET /api/links
DELETE /api/links/:id

Redirect:
GET /:shortCode -> 302 redirect to originalUrl (410 if expired)

Health:
GET /health -> { status: 'ok' }

## Setup & Run
### Prerequisites
* Node 18+
* MongoDB running locally (default uri: mongodb://127.0.0.1:27017/url_shortener)

### 1. Backend
```
cd server
cp .env.example .env   # On Windows PowerShell: copy .env.example .env
npm install
npm run dev
```
Server listens on `PORT` (default 5000).

### 2. Frontend
In a separate terminal:
```
cd client
npm install
npm run dev
```
Vite dev server (default 5173) proxies `/api` to backend.

### 3. Try it
1. Open http://localhost:5173
2. Register, then login.
3. Create a link; open the short URL shown in the table.

## Environment Variables (`server/.env`)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/url_shortener
JWT_SECRET=replace_with_strong_secret
AUTO_CREATE_DB=true # optional; force create empty collections at startup
SERVE_STATIC=false  # set true after building client to have Express serve SPA and keep redirects at /r
```

## Security Notes
* Replace the default `JWT_SECRET` immediately in production.
* Add rate limiting & input sanitation (e.g. helmet, express-rate-limit) for production.
* Consider storing password reset tokens, enabling HTTPS, and adding CSRF protection for any state-changing non-JSON endpoints.

## Next Improvements (Optional)
* Add analytics endpoint (daily clicks chart per link)
* Add pagination & search on links
* Implement soft delete & restore
* Add QR code generation for short links
* Add unit/integration tests (Jest / Vitest + Supertest)
* Dockerize services

## Requirements Coverage
| Requirement | Status |
|-------------|--------|
| URL shortener | Implemented (Link model + redirect route) |
| User login & per-user links | Implemented (auth middleware + owner scoping) |
| Bcrypt hashing | Implemented (`User.hashPassword`, `comparePassword`) |
| MERN stack | Implemented (Mongo, Express, React, Node) |
| Modular code | Implemented (separated folders & layers) |
| JWT & auth token login | Implemented (login issues token, protected routes) |

## License
MIT (add a LICENSE file if distributing publicly).
