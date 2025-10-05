# Online Bookstore API

This project provides a classroom-friendly RESTful API for managing users and books in an online bookstore scenario. The implementation follows an MVC-inspired structure with straightforward authentication, authorization, validation, and pagination built with lightweight helpers bundled in the repo.

## Features

- User registration and login with password hashing
- JWT-based access and refresh tokens handled in the auth controller
- CRUD operations for books with user-level authorization
- Input validation for all endpoints
- Pagination for the books list using the built-in Sequelize-style helpers
- Lightweight file-backed persistence simulating Sequelize with PostgreSQL

## Requirements

- Node.js 20+

## Getting Started

1. Clone the repository (no external npm install is necessary because the project ships with the required lightweight implementations).
2. Copy `.env.example` to `.env` and adjust values if needed.
3. Run the application:

```bash
npm start
```

The API listens on the port defined in the `.env` file (defaults to `3000`).

See [REQUIREMENTS_CHECKLIST.md](REQUIREMENTS_CHECKLIST.md) for a detailed breakdown of how each assignment requirement was verified, and [VERIFICATION_RUN.md](VERIFICATION_RUN.md) for the exact commands and outputs captured during the latest check.

## API Overview

### Authentication

- `POST /user/register`
- `POST /user/login`
- `POST /user/refreshToken`

### Books

- `GET /books`
- `POST /books`
- `PUT /books/:id`
- `DELETE /books/:id`

Refer to the controllers and route definitions for request and response specifics.
