# Express Backend Security Proxy

This backend serves as a security proxy for the Out Sports League application, handling sensitive operations that should not be performed client-side.

## Setup Instructions

```bash
cd backend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=3001
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

## Security Features

- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Server-side validation for all inputs
- **Helmet.js**: Security headers (CSP, HSTS, etc.)
- **CORS Protection**: Configured for specific origins
- **Request Logging**: Security event logging
- **JWT Verification**: Token validation for protected routes

## API Endpoints

### Authentication Proxy

- `POST /api/auth/signin` - Proxied sign-in with rate limiting
- `POST /api/auth/signup` - Proxied sign-up with validation
- `POST /api/auth/refresh` - Token refresh

### Admin Operations

- `POST /api/admin/*` - All admin operations (requires admin token)
- Rate limited and logged

### Notifications

- `POST /api/notifications/send` - Send push notifications
- Input validation and user verification

## Usage from Frontend

```typescript
// Instead of direct Supabase calls for sensitive operations
const response = await fetch("/api/auth/signin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```
