# Habitly Backend - Refresh Token Setup

## What was fixed

- Added `express.json()` so JSON login/register request bodies are parsed correctly.
- Removed duplicate/wildcard CORS behavior and configured credentialed CORS.
- Added short-lived access tokens (15 minutes).
- Added 7-day refresh tokens in an HttpOnly cookie.
- Added `POST /api/auth/user/refresh`.
- Added `POST /api/auth/user/logout` to clear the refresh cookie.
- Refreshes are coordinated server-side without adding a new database collection.
- Existing JWT payload compatibility is preserved for refresh tokens created with the earlier `{ userId }` shape.
- Protected API requests can transparently obtain a new access token after a 401.

## Required environment variables

The backend must have:

- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- your existing MongoDB/database variables
- your existing `PORT` / `APP_NAME` variables if used

For Render, make sure `JWT_REFRESH_SECRET` is present in the Render service environment.

## CORS

The backend allows:

- `https://habitlyx.vercel.app`
- `http://localhost:5173`
- `http://127.0.0.1:5173`

You can additionally set `CLIENT_ORIGIN` if the frontend is deployed at another origin.

## Cookie behavior

The refresh token is:

- HttpOnly
- Secure when the request is HTTPS
- SameSite=None over HTTPS so Vercel -> Render authentication works
- SameSite=Lax for local HTTP development
- valid for 7 days
- scoped to `/`

The frontend JavaScript never reads the refresh token.

## Deployment

Deploy this backend, then verify the Render environment contains `JWT_REFRESH_SECRET`.

No refresh token is stored in localStorage or sessionStorage.
