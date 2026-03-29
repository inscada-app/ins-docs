---
title: "Alarm API"
description: "Active alarms, alarm history, acknowledgment, and force-off endpoints"
sidebar:
  order: 6
---

The Alarm API provides active alarm queries, alarm history, and alarm management.

## Active Alarms

### GET /api/alarms/fired-alarms

Lists active (triggered) alarms with pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| **projectId** | Integer | Project ID |
| **page** | Integer | Page number (default: 0) |
| **size** | Integer | Page size (default: 20) |

```bash
curl -b cookies.txt \
  "http://localhost:8081/api/alarms/fired-alarms?projectId=153" \
  -H "X-Space: claude"
```

Response:
```json
{
  "content": [],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalPages": 0,
  "totalElements": 0,
  "empty": true
}
```

:::note
When there are no active alarms, `content` returns an empty array.
:::

### GET /api/alarms/fired-alarms/all

Lists the entire alarm history (including closed alarms).

## Alarm Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/alarms/fired-alarms/acknowledge` | Acknowledge an alarm |
| POST | `/api/alarms/fired-alarms/force-off` | Force-close an alarm |

### Alarm Acknowledgment

```bash
curl -b cookies.txt -X POST \
  http://localhost:8081/api/alarms/fired-alarms/acknowledge \
  -H "X-Space: claude" -H "Content-Type: application/json" \
  -d '{"id": 12345}'
```

## Alarm Definition CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alarms?projectId=X` | List alarm definitions |
| POST | `/api/alarms` | Create a new alarm definition |
| PUT | `/api/alarms/{id}` | Update an alarm |
| DELETE | `/api/alarms/{id}` | Delete an alarm |

## Alarm Groups

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alarm-groups?projectId=X` | List alarm groups |
| POST | `/api/alarm-groups` | Create a new group |
| PUT | `/api/alarm-groups/{id}` | Update a group |
| DELETE | `/api/alarm-groups/{id}` | Delete a group |
| POST | `/api/alarm-groups/{id}/activate` | Activate a group |
| POST | `/api/alarm-groups/{id}/deactivate` | Deactivate a group |
