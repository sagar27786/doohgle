# DOOHGLE Backend

## Setup

1. Copy `.env.example` to `.env` and fill in your Postgres credentials and JWT secret.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the backend in dev mode:
   ```sh
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/signup` — Register new user
- `POST /api/auth/login` — Login user

### User fields
- `email` (string, required)
- `password` (string, required)
- `confirmPassword` (string, required for signup)
- `role` (string: `advertiser` or `venue_owner`, required)

