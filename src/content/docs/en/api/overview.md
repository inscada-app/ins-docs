---
title: "REST API Overview"
description: "inSCADA REST API — authentication, endpoint structure, and usage"
sidebar:
  order: 1
---

inSCADA has a fully RESTful architecture. Every operation on the platform — reading/writing variables, project management, alarm queries, connection control — can be performed through the REST API.

## API Access

**Base URL:**
```
https://<inscada-ip>:8082/api/
```

All endpoints start with the `/api/` prefix. The API accepts and returns data in JSON format.

## Authentication

The inSCADA REST API uses form-based login and JWT token authentication.

### 1. Login

```
POST /login
Content-Type: multipart/form-data

username=admin&password=admin
```

A successful response sets `ins_access_token` and `ins_refresh_token` cookies.

### 2. API Requests

Cookies obtained after login are automatically sent with subsequent requests. Alternatively, the token can also be sent via a header:

```
GET /api/projects
Cookie: ins_access_token=<token>; ins_refresh_token=<token>
X-Space: default_space
```

### 3. Space Header

In the multi-workspace (multi-tenant) architecture, the `X-Space` header is used to specify which space the request operates in:

```
X-Space: default_space
```

## Endpoint Categories

The inSCADA REST API contains 91 controllers and 1100+ endpoints. Below are the main categories and key endpoints:

### Authentication and User

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | User login |
| GET | `/api/auth/currentUser` | Current logged-in user info |
| GET | `/api/auth/loggedInUsers` | Active session list |
| GET | `/api/users` | User list |
| POST | `/api/users` | Create a new user |
| PUT | `/api/users/{id}` | Update a user |
| DELETE | `/api/users/{id}` | Delete a user |
| GET | `/api/users/{id}/roles` | User roles |

### Space (Workspace)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/spaces` | Space list |
| GET | `/api/spaces/{id}` | Space details |
| POST | `/api/spaces` | Create a new space |
| PUT | `/api/spaces/{id}` | Update a space |
| DELETE | `/api/spaces/{id}` | Delete a space |

### Project

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Project list |
| GET | `/api/projects/{id}` | Project details |
| GET | `/api/projects/{id}/status` | Project status |
| POST | `/api/projects` | Create a new project |
| PUT | `/api/projects/{id}` | Update a project |
| DELETE | `/api/projects/{id}` | Delete a project |
| POST | `/api/projects/clone` | Clone a project |

### Connection

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/connections/{id}/start` | Start a connection |
| POST | `/api/connections/{id}/stop` | Stop a connection |
| GET | `/api/connections/{id}/status` | Connection status |
| GET | `/api/connections/{id}/browse` | Device discovery (OPC UA, OPC DA) |

Each protocol has its own CRUD endpoints:
- `/api/modbus/connections`, `/api/dnp3/connections`, `/api/iec104/connections` ...
- `/api/modbus/variables`, `/api/dnp3/variables` ...

### Variable Values

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/variables/{id}/value` | Single variable live value |
| GET | `/api/variables/values?projectId=X&names=a,b` | Bulk live values |
| POST | `/api/variables/{id}/value` | Write a value to a variable |
| GET | `/api/variables/loggedValues` | Query historical data |
| GET | `/api/variables/loggedValues/stats` | Statistics (avg, min, max) |
| GET | `/api/variables/loggedValues/stats/hourly` | Hourly statistics |

### Alarm

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alarms/fired-alarms` | Active alarms |
| GET | `/api/alarms/fired-alarms/all` | Full alarm history |
| POST | `/api/alarms/fired-alarms/acknowledge` | Acknowledge an alarm |
| POST | `/api/alarms/fired-alarms/force-off` | Force-close an alarm |

### Script

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scripts` | Script list |
| GET | `/api/scripts/{id}` | Script details |
| POST | `/api/scripts` | Create a new script |
| PUT | `/api/scripts/{id}` | Update a script |
| DELETE | `/api/scripts/{id}` | Delete a script |
| GET | `/api/scripts/{id}/status` | Script execution status |
| POST | `/api/scripts/runner` | Run script code (ad-hoc) |

### Animation (SVG Screens)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/animations` | Animation list |
| GET | `/api/animations/{id}` | Animation details |
| POST | `/api/animations` | Create a new animation |
| PUT | `/api/animations/{id}` | Update an animation |
| PUT | `/api/animations/{id}/svg` | Update SVG content |
| POST | `/api/animations/{id}/clone` | Clone an animation |

### Trend

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trends` | Trend list |
| POST | `/api/trends` | Create a new trend |
| GET | `/api/trends/{id}/tags` | Trend tags |
| POST | `/api/trends/{id}/tags` | Add a tag |

### Custom Menu

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/custom-menus` | Menu list |
| POST | `/api/custom-menus` | Create a new menu |
| PUT | `/api/custom-menus/{id}` | Update a menu |
| DELETE | `/api/custom-menus/{id}` | Delete a menu |

### Report

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | Report list |
| POST | `/api/reports/{id}/run` | Run a report |
| GET | `/api/reports/{id}/export/pdf` | Export as PDF |
| GET | `/api/reports/{id}/export/excel` | Export as Excel |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/version` | Platform version |
| GET | `/api/license` | License information |
| GET | `/api/cluster/leader` | Cluster leader node |
| GET | `/api/system/status` | System status |

### Example: Version Query

```bash
curl -b cookies.txt http://localhost:8081/api/version -H "X-Space: default_space"
```

```
20260311-1-jdk11
```

## Swagger / API Documentation

inSCADA provides interactive API documentation with a built-in **Swagger UI**. It is activated in development mode (`dev` profile):

```
https://<inscada-ip>:8082/swagger-ui/
```

Through Swagger UI, you can discover all endpoints, view parameter descriptions, and send test requests directly.

## Response Format

All responses are in JSON format:

```json
// Successful response
{
    "id": 1,
    "name": "Temperature",
    "value": 25.4,
    ...
}

// Error response
{
    "status": 400,
    "error": "Bad Request",
    "message": "Variable not found: invalid_name"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| **200** | Success |
| **201** | Created |
| **400** | Bad request |
| **401** | Authentication required |
| **403** | Unauthorized access |
| **404** | Not found |
| **500** | Server error |

## Rate Limiting

API requests are protected by rate limiting. In case of excessive requests, a `429 Too Many Requests` response is returned. Limit values can be adjusted from the system configuration.
