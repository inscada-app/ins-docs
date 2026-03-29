---
title: "Project API"
description: "Project CRUD, status queries, and connection management endpoints"
sidebar:
  order: 4
---

## Project List

### GET /api/projects

Lists all projects in the space.

```bash
curl -b cookies.txt http://localhost:8081/api/projects \
  -H "X-Space: claude"
```

Response:
```json
[
  {
    "id": 153,
    "name": "Energy Monitoring Demo",
    "dsc": "Demo project for energy monitoring with simulated data",
    "isActive": true,
    "latitude": null,
    "longitude": null,
    "createdBy": "inscada",
    "creationDate": "2026-03-04T14:47:52.913+03:00",
    "lastModifiedDate": "2026-03-04T14:47:52.913+03:00"
  },
  {
    "id": 353,
    "name": "Building",
    "dsc": "Building Management System - HVAC & Air Conditioning Demo",
    "isActive": true
  }
]
```

### GET /api/projects/{id}

Returns project details.

```bash
curl -b cookies.txt http://localhost:8081/api/projects/153 \
  -H "X-Space: claude"
```

Response:
```json
{
  "id": 153,
  "name": "Energy Monitoring Demo",
  "dsc": "Demo project for energy monitoring with simulated data",
  "isActive": true,
  "icon": null,
  "address": null,
  "latitude": null,
  "longitude": null,
  "properties": null,
  "createdBy": "inscada",
  "creationDate": "2026-03-04T14:47:52.913+03:00"
}
```

### GET /api/projects/{id}/status

Returns the running status of all project components.

```bash
curl -b cookies.txt http://localhost:8081/api/projects/153/status \
  -H "X-Space: claude"
```

Response:
```json
{
  "connectionStatuses": { "153": "Connected" },
  "scriptStatuses": { "160": "Not Scheduled", "159": "Not Scheduled" },
  "dataTransferStatuses": {},
  "reportStatuses": {},
  "alarmGroupStatuses": {}
}
```

## Project CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create a new project |
| PUT | `/api/projects/{id}` | Update a project |
| DELETE | `/api/projects/{id}` | Delete a project |
| POST | `/api/projects/clone` | Clone a project |

### Creating a Project

```bash
curl -b cookies.txt -X POST http://localhost:8081/api/projects \
  -H "X-Space: claude" -H "Content-Type: application/json" \
  -d '{
    "name": "New Project",
    "dsc": "Project description",
    "isActive": true,
    "latitude": 41.0,
    "longitude": 29.0
  }'
```

## Connections

### GET /api/connections?projectId={id}

Lists the connections in a project.

```bash
curl -b cookies.txt "http://localhost:8081/api/connections?projectId=153" \
  -H "X-Space: claude"
```

Response:
```json
[
  {
    "id": 153,
    "name": "LOCAL-Energy",
    "protocol": "LOCAL",
    "ip": "127.0.0.1",
    "port": 0,
    "projectId": 153,
    "dsc": "Local protocol connection for energy simulation",
    "owner": "inscada"
  }
]
```

### Connection Control

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/connections/{id}/start` | Start a connection |
| POST | `/api/connections/{id}/stop` | Stop a connection |
| GET | `/api/connections/{id}/status` | Connection status |
