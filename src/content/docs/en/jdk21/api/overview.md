---
title: "REST API Overview"
description: "inSCADA REST API — authentication, common headers and response format"
sidebar:
  order: 1
---

inSCADA is a fully RESTful platform. Reading/writing variables, managing projects, querying alarms, controlling connections — every operation is available over REST.

:::tip[Full Endpoint Reference]
This page covers authentication and common conventions. For interactive, parameter-level documentation of every controller and every endpoint, see **[REST API Reference](/docs/jdk21/api/reference/)** — auto-generated from the platform's OpenAPI spec.
:::

## Base URL

```
https://<inscada-ip>:8082/api/
```

All endpoints prefixed with `/api/` accept and return JSON. The three public auth endpoints — `/login`, `/validate`, `/refresh`, `/logout` — live at the root, without the `/api/` prefix.

## Authentication

inSCADA uses a hybrid Bearer token + optional cookie model. Browser sessions work via cookies; API clients (Postman, curl, SDKs) should prefer the `Authorization: Bearer` header.

### 1. Login

```http
POST /login
Content-Type: application/x-www-form-urlencoded

username=admin&password=admin
```

Successful response:

```json
{
  "access_token": "eyJhbG...",
  "refresh_token": "eyJhbG...",
  "expire-seconds": 300,
  "activeSpace": "default_space",
  "spaces": ["default_space", "production"]
}
```

If OTP is enabled the response differs:

```json
{ "otp_required": true, "otp_type": "MAIL", "username": "admin" }
```

Call `POST /validate` with the returned `username` and the OTP code; on success the normal token pair is returned.

### 2. Using the Token

Subsequent requests carry the token as:

```http
GET /api/projects
Authorization: Bearer <access_token>
X-Space: default_space
```

### 3. Refreshing Tokens

```http
POST /refresh
Content-Type: application/json

{ "refresh_token": "eyJhbG..." }
```

Returns a new token pair.

### 4. Logout

```http
POST /logout
Authorization: Bearer <access_token>
```

## X-Space Header

In multi-space (multi-tenant) installations, **every API request** must include the `X-Space` header to identify the working space:

```http
X-Space: default_space
```

Valid space IDs are returned in the `spaces` field of the login response. In single-space installations the default is used when the header is omitted.

## Response Format

All responses are JSON.

```json
// Success
{ "id": 1, "name": "Temperature", "value": 25.4 }

// Error
{ "status": 400, "error": "Bad Request", "message": "Variable not found: invalid_name" }
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| **200** | OK |
| **201** | Created |
| **400** | Bad request |
| **401** | Not authenticated / token invalid |
| **403** | Forbidden |
| **404** | Not found |
| **429** | Rate limit exceeded |
| **500** | Server error |

## Rate Limiting

API requests are rate-limited. Exceeding the limit returns `429 Too Many Requests`. Limits are configurable at system level.

## Swagger UI

Interactive Swagger UI shipped with the platform in the `dev` profile:

```
https://<inscada-ip>:8082/swagger-ui/
```

For production deployments, the same spec is served on this site under [REST API Reference](/docs/jdk21/api/reference/).
