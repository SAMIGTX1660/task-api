# Task API

A small to-do list API built with Node.js and Express. It supports creating, reading, updating, and deleting tasks from an in-memory array. Because the data is stored in memory only, it resets when the server stops.

## What this project does

- Shows a simple API home endpoint
- Checks server health at /health
- Lists all tasks at /tasks
- Reads one task by ID
- Creates a new task
- Updates a task by ID
- Deletes a task by ID
- Exposes interactive API docs at /docs with Swagger UI

## Prerequisites

- Node.js installed on your machine
- npm (usually comes with Node.js)

## Build and run

From the project folder:

```bash
npm install
npm start
```

You can also run it directly:

```bash
node Hello_server.js
```

The app runs on:

- http://localhost:3000
- Swagger docs: http://localhost:3000/docs

## API endpoints

| Method | Path | What it does | Success | Errors |
|---|---|---|---|---|
| GET | / | API info | 200 | none |
| GET | /health | Health check | 200 | none |
| GET | /tasks | List all tasks | 200 | none |
| GET | /tasks/:id | Get one task | 200 | 404 |
| POST | /tasks | Create a task | 201 | 400 |
| PUT | /tasks/:id | Update a task | 200 | 400, 404 |
| DELETE | /tasks/:id | Delete a task | 204 | 404 |

## Example output

```bash
curl http://localhost:3000/health
```

```json
{"status":"ok"}
```

## Swagger UI

![Swagger UI](swagger.png)

## How I built it

I wrote the Express server, route handlers, and validation logic myself and tested the app by starting the server and calling the health endpoint and task routes with curl. AI helped explain Express routing and helped fix the request validation and route behavior, and I checked the final result by running the app locally and confirming the responses.
