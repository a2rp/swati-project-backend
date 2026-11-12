# Swati Project Backend

A small Express API demo with JWT-protected TVMaze show search. It includes three fixed demo accounts for learning and local testing; it is not a production user store.

## Requirements

- Node.js 18 or newer
- npm

## Setup

```sh
npm install
```

Copy `.env.example` to `.env`, then set `TOKEN_KEY` to a fresh random value of at least 32 characters. For example:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set `CLIENT_ORIGIN` to the origin of the frontend that will call the API. The defaults run the API on `127.0.0.1:1198` and allow `http://localhost:3000`.

Start the development server with:

```sh
npm run dev
```

## Demo accounts

These sample accounts are public fixtures and must not be reused for real services:

| Email | Password |
| --- | --- |
| `user1@mail.com` | `password1` |
| `user2@mail.com` | `password2` |
| `user3@mail.com` | `password3` |

## API

### `GET /api/hello`

Returns a small health response.

### `POST /api/login`

Accepts JSON containing `email` and `password`. A successful response returns a two-hour JWT token.

### `POST /api/search?title=sunday`

Requires `Authorization: Bearer <token>`. Searches TVMaze and returns its results in the `message` field. Titles must be between 1 and 100 characters.

The API limits JSON request bodies, validates required input, restricts CORS to `CLIENT_ORIGIN`, and does not log tokens or return upstream error details.
