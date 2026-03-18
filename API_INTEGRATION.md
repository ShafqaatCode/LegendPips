# API Integration Guide

The frontend has been integrated with the LegendPips backend API.

## Setup

1. **Create `.env` file** in the frontend root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

2. **Make sure the backend is running** on `http://localhost:5000`

3. **Start the frontend:**
   ```bash
   npm run dev
   ```

## Integrated Features

### 1. Authentication
- **Login**: `src/pages/Login/LoginForm.tsx`
  - Integrated with `POST /api/login`
  - Stores JWT token in localStorage
  - Automatically reloads on success

- **Register**: `src/pages/Register/RegisterForm.tsx`
  - Integrated with `POST /api/register`
  - Validates password match
  - Handles full name splitting (firstName, lastName)
  - Stores JWT token in localStorage

### 2. Contests
- **Contest List**: `src/components/ContestList/Competitions.tsx`
  - Integrated with `GET /api/getAllContests`
  - Supports filtering by status (All, Upcoming, Ongoing, Ended)
  - Pagination support
  - Error handling

## API Services

### Auth Service (`src/services/authService.ts`)
- `login(credentials)` - Login user
- `register(userData)` - Register new user
- `logout()` - Clear auth token
- `getCurrentUser()` - Get user from localStorage
- `isAuthenticated()` - Check if user is logged in

### Contest Service (`src/services/contestService.ts`)
- `fetchCompetitions(status?, page?, limit?)` - Get all contests
- `fetchCompetitionById(id)` - Get contest by ID

## Configuration

API base URL is configured in `src/utils/apiConfig.ts`:
- Default: `http://localhost:5000/api`
- Can be overridden with `VITE_API_BASE_URL` environment variable

## Token Management

JWT tokens are stored in `localStorage`:
- Token key: `token`
- User data key: `user`

Tokens are automatically included in API requests via `Authorization: Bearer <token>` header.

## Error Handling

All API calls include error handling:
- Display error messages to users
- Console logging for debugging
- Graceful fallbacks (empty arrays, null checks)

## Next Steps

1. Test login/register functionality
2. Test contest fetching
3. Add protected route middleware
4. Add loading states where needed
5. Add toast notifications for better UX
