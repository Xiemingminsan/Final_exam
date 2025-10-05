# Verification Run

This document captures the order of checks performed to confirm the project still aligns with the assignment requirements, along with the exact commands and outputs from the latest manual test session.

## Requirement Checks

1. **Server boot** – ensure `npm start` (via `node src/server.js`) launches without errors.
2. **User registration** – confirm validation, hashing, and token issuance via `POST /user/register`.
3. **Protected book creation** – verify `POST /books` succeeds with a valid Bearer token.
4. **Pagination data** – fetch `GET /books` to confirm `{ id, title }` payload and pagination metadata.
5. **Book update authorization** – call `PUT /books/:id` with the owning user.
6. **Book deletion authorization** – delete the created book with `DELETE /books/:id`.
7. **Refresh token rotation** – request a new access token through `POST /user/refreshToken`.

## Manual Test Session

```bash
$ node src/server.js > /tmp/server.log 2>&1 &
[backgrounded server]

$ curl -s -X POST http://localhost:3000/user/register     -H 'Content-Type: application/json'     -d '{"firstName":"Mia","lastName":"Stone","email":"mia@example.com","username":"miastone","password":"secret123"}'
{"user":{"id":1,"firstName":"Mia","lastName":"Stone","email":"mia@example.com","username":"miastone"},"tokens":{"accessToken":"<access>","refreshToken":"<refresh>"}}

$ curl -s -X POST http://localhost:3000/books     -H "Authorization: Bearer <access>"     -H 'Content-Type: application/json'     -d '{"title":"Intro to APIs","author":"Author One"}'
{"id":1,"title":"Intro to APIs","author":"Author One","userId":1}

$ curl -s http://localhost:3000/books
{"data":[{"id":1,"title":"Intro to APIs"}],"pagination":{"page":1,"limit":10,"total":1,"pages":1}}

$ curl -s -X PUT http://localhost:3000/books/1     -H "Authorization: Bearer <access>"     -H 'Content-Type: application/json'     -d '{"title":"Intro to APIs - Updated"}'
{"id":1,"title":"Intro to APIs - Updated","author":"Author One","userId":1}

$ curl -s -o /dev/null -w '%{http_code}' -X DELETE http://localhost:3000/books/1     -H "Authorization: Bearer <access>"
204

$ curl -s http://localhost:3000/books
{"data":[],"pagination":{"page":1,"limit":10,"total":0,"pages":1}}

$ curl -s -X POST http://localhost:3000/user/refreshToken     -H 'Content-Type: application/json'     -d '{"refreshToken":"<refresh>"}'
{"accessToken":"<newAccess>","refreshToken":"<newRefresh>"}
```

The placeholder token values (`<access>`, `<refresh>`, etc.) represent the actual JWT strings returned during the run.
