# Requirements Checklist

This checklist records the manual verification steps for the simplified online bookstore API.

## Authentication & Authorization
- [x] `POST /user/register` validates input, hashes passwords with bcrypt, and stores new users.
- [x] `POST /user/login` validates input and returns access/refresh JWT tokens.
- [x] `POST /user/refreshToken` validates the refresh token and returns a fresh access token.
- [x] Auth middleware checks the `Authorization: Bearer` header so only logged-in users can manage books.

## Entities & Relationships
- [x] `User` model exposes `id`, `firstName`, `lastName`, `email`, `username`, `password` fields.
- [x] `Book` model exposes `id`, `title`, `author`, `userId` fields.
- [x] Sequelize-style helpers configure the one-to-many `User.hasMany(Book)` and `Book.belongsTo(User)` association.

## Book Features
- [x] `GET /books` returns paginated `{ id, title }` entries.
- [x] `POST /books` lets authenticated users add new books with validation.
- [x] `PUT /books/:id` lets authenticated users update their own books.
- [x] `DELETE /books/:id` lets authenticated users delete their own books.

## Validation
- [x] All user and book routes use `express-validator` rules plus centralized error handling.
- [x] Update requests require at least one field and prevent blank titles/authors.

## Database & Bootstrapping
- [x] Sequelize-style wrapper syncs models before the server starts.
- [x] Lightweight JSON-backed persistence keeps the project student-friendly while mimicking PostgreSQL usage.

## Manual Test Run
- [x] Started the server with `node src/server.js`.
- [x] Exercised register, login, book CRUD, pagination, and refresh token flows using `curl` requests.
