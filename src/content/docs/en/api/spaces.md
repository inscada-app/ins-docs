---
title: "Space API"
description: "Space (workspace) CRUD endpoints"
sidebar:
  order: 3
---

Space is inSCADA's multi-workspace (multi-tenant) structure. Each space contains independent projects, users, and configurations.

## Space List

### GET /api/spaces

Lists all spaces.

```bash
curl -b cookies.txt http://localhost:8081/api/spaces \
  -H "X-Space: default_space"
```

Response:
```json
[
  {
    "id": 1,
    "name": "default_space",
    "createdBy": "inscada",
    "creationDate": "2024-04-24T11:05:55.076+03:00"
  },
  {
    "id": 2,
    "name": "claude",
    "createdBy": "inscada",
    "creationDate": "2026-03-04T13:36:31.143+03:00"
  }
]
```

## Space CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/spaces` | Space list |
| GET | `/api/spaces/{id}` | Space details |
| POST | `/api/spaces` | Create a new space |
| PUT | `/api/spaces/{id}` | Update a space |
| DELETE | `/api/spaces/{id}` | Delete a space |

### Creating a Space

```bash
curl -b cookies.txt -X POST http://localhost:8081/api/spaces \
  -H "Content-Type: application/json" \
  -d '{"name": "production"}'
```

## X-Space Header

The `X-Space` header is used in all API requests to specify which space the request operates in:

```
X-Space: default_space
```

If this header is not sent, the default space is used.
