---
title: "Variable API"
description: "Variable live value read/write, historical data query, and statistics endpoints"
sidebar:
  order: 5
---

The Variable API provides REST access to the live and historical values of inSCADA variables.

## Live Value Read

### GET /api/variables/{id}/value

Reads the live value of a single variable.

```bash
curl -b cookies.txt http://localhost:8081/api/variables/23227/value \
  -H "X-Space: claude"
```

Response:
```json
{
  "flags": { "scaled": true },
  "date": "2026-03-28T11:50:25.959+03:00",
  "value": 330.48,
  "extras": { "raw_value": 606.56 },
  "variableShortInfo": {
    "dsc": "Total active power",
    "frame": "Energy-Frame",
    "project": "Energy Monitoring Demo",
    "device": "Energy-Device",
    "name": "ActivePower_kW",
    "connection": "LOCAL-Energy"
  },
  "dateInMs": 1774687825959
}
```

### GET /api/variables/values

Reads the live values of multiple variables in bulk.

| Parameter | Type | Description |
|-----------|------|-------------|
| **projectId** | Integer | Project ID |
| **names** | String | Comma-separated variable names |

```bash
curl -b cookies.txt \
  "http://localhost:8081/api/variables/values?projectId=153&names=ActivePower_kW,Voltage_V,Current_A" \
  -H "X-Space: claude"
```

Response:
```json
{
  "ActivePower_kW": {
    "flags": { "scaled": true },
    "date": "2026-03-28T11:50:33.950+03:00",
    "value": 323.66,
    "extras": { "raw_value": 606.56 },
    "variableShortInfo": {
      "name": "ActivePower_kW",
      "dsc": "Total active power",
      "project": "Energy Monitoring Demo"
    },
    "dateInMs": 1774687833950
  },
  "Voltage_V": {
    "flags": { "scaled": true },
    "value": 236.7,
    "extras": { "raw_value": 228.0 },
    "variableShortInfo": { "name": "Voltage_V", "dsc": "Line voltage" }
  },
  "Current_A": {
    "flags": { "scaled": true },
    "value": 33.12,
    "extras": { "raw_value": 58.92 },
    "variableShortInfo": { "name": "Current_A", "dsc": "Line current" }
  }
}
```

## Writing Values

### POST /api/variables/{id}/value

Writes a value to a variable.

```bash
curl -b cookies.txt -X POST http://localhost:8081/api/variables/23234/value \
  -H "X-Space: claude" -H "Content-Type: application/json" \
  -d '{"value": 55.0}'
```

## Historical Data

### GET /api/variables/loggedValues

Queries logged variable data with pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| **projectId** | Integer | Project ID |
| **names** | String | Comma-separated variable names |
| **startDate** | Long | Start time (epoch ms) |
| **endDate** | Long | End time (epoch ms) |
| **page** | Integer | Page number (starts from 0) |
| **size** | Integer | Page size |

### GET /api/variables/loggedValues/stats

Returns statistics for a specified time range.

| Parameter | Type | Description |
|-----------|------|-------------|
| **projectId** | Integer | Project ID |
| **names** | String | Comma-separated variable names |
| **startDate** | Long | Start time (epoch ms) |
| **endDate** | Long | End time (epoch ms) |

:::tip
The statistics response includes the fields `avgValue`, `minValue`, `maxValue`, `sumValue`, `countValue`, `medianValue`, `firstValue`, `lastValue`. For the detailed structure, see the [Script API — Variable API](/tr/platform/scripts/variable-api/) page.
:::

### GET /api/variables/loggedValues/stats/hourly

Hourly grouped statistics.

### GET /api/variables/loggedValues/stats/daily

Daily grouped statistics.

## Variable CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/variables?projectId=X` | Variable list |
| GET | `/api/variables/{id}` | Variable details |
| POST | `/api/variables` | Create a new variable |
| PUT | `/api/variables/{id}` | Update a variable |
| DELETE | `/api/variables/{id}` | Delete a variable |

### Variable List Response

```bash
curl -b cookies.txt "http://localhost:8081/api/variables?projectId=153" \
  -H "X-Space: claude"
```

Response (abbreviated):
```json
[
  {
    "id": 23227,
    "name": "ActivePower_kW",
    "dsc": "Total active power",
    "type": "Float",
    "unit": "kW",
    "projectId": 153,
    "connectionId": 153,
    "deviceId": 453,
    "frameId": 703,
    "logType": "Periodically",
    "logPeriod": 10,
    "engZeroScale": 0.0,
    "engFullScale": 1000.0,
    "fractionalDigitCount": 2,
    "isActive": true,
    "keepLastValues": true
  },
  {
    "id": 23229,
    "name": "Voltage_V",
    "dsc": "Line voltage",
    "type": "Float",
    "unit": "V",
    "engZeroScale": 200.0,
    "engFullScale": 260.0
  }
]
```
