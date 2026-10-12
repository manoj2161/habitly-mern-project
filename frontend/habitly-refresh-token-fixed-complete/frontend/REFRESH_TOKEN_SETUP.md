# Habitly Frontend - Refresh Token Setup

## What was fixed

- Replaced the old global "clear auth on every 401" behavior with a refresh-token interceptor.
- A 401 from a Habitly protected API request now attempts one refresh.
- Concurrent 401 requests share one refresh request instead of creating multiple refresh calls.
- The failed request is retried once with the new access token.
- Login continues using the existing `token` storage contract.
- `rememberMe` behavior is preserved: refreshed access tokens stay in the same localStorage/sessionStorage location as the existing token.
- External APIs such as the Habitly AI service are not sent through the auth-refresh flow.
- Logout now clears the server-side refresh cookie as well as local/session authentication state.

## Important

The refresh token is an HttpOnly cookie. Do not attempt to read it with `document.cookie`.

The frontend only stores the short-lived access token.

## Existing environment

Keep the existing:

`VITE_API_URL=<your Habitly backend URL>`

No refresh token secret belongs in the frontend environment.
