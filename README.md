# Spotify Clone Backend

A simple Express + MongoDB backend for a Spotify-style music application.

## Features

- User registration and login with JWT authentication
- Artist-only music upload via ImageKit
- Album creation by artists
- Fetch all music and albums for authenticated users

## Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- JWT authentication
- Bcrypt for password hashing
- Multer for file upload handling
- ImageKit for storing uploaded music files

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database URI
- ImageKit private key

### Install dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file at the project root with these values:

```env
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
IMAGEKIT_PRIVATE_KIT=<your-imagekit-private-key>
```

> Note: The code currently uses cookies to store the JWT token and also accepts it via `Authorization: Bearer <token>` in some routes.

### Start the server

```bash
npm run dev
```

or

```bash
npm start
```

The server listens on port `3000`.

## API Endpoints

### Auth

#### Register

- URL: `POST /api/auth/register`
- Body (JSON):
  - `username` (string)
  - `email` (string)
  - `password` (string)
  - `role` (string, optional) — `user` or `artist` (default: `user`)

Response:
- 201: user created with JWT token

#### Login

- URL: `POST /api/auth/login`
- Body (JSON):
  - `username` or `email`
  - `password`

Response:
- 200: login successful with JWT token

### Music

#### Upload music (Artist only)

- URL: `POST /api/music/upload`
- Headers:
  - `Content-Type: multipart/form-data`
  - Cookie with `token` or `Authorization: Bearer <token>`
- Form field:
  - `music` — music file
- Body field:
  - `title` (string)

Response:
- 201: music created

#### Create album (Artist only)

- URL: `POST /api/music/album`
- Headers:
  - `Content-Type: application/json`
  - Cookie with `token` or `Authorization: Bearer <token>`
- Body (JSON):
  - `title` (string)
  - `musics` (array of music IDs)

Response:
- 201: album created

#### Get all music (Authenticated user)

- URL: `GET /api/music/`
- Headers:
  - Cookie with `token`

Response:
- 200: list of all music items

#### Get all albums (Authenticated user)

- URL: `GET /api/music/getallalbum`
- Headers:
  - Cookie with `token`

Response:
- 200: list of albums

#### Get album by ID (Authenticated user)

- URL: `GET /api/music/getallalbum/:albumId`
- Headers:
  - Cookie with `token`

Response:
- 200: album details

## Project Structure

- `server.js` — entry point
- `src/app.js` — Express app setup
- `src/db.js` — MongoDB connection
- `src/routes/` — API routes
- `src/controller/` — route handlers
- `src/middlewares/` — auth middleware
- `src/models/` — Mongoose models
- `src/services/` — file upload service

## Notes

- The app stores JWT tokens in cookies under the name `token`.
- Artists must use `role: "artist"` when registering to upload music and create albums.
- Uploaded music files are saved using ImageKit.
