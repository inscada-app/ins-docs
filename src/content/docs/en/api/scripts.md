---
title: "Script API"
description: "Script CRUD, execution, and ad-hoc script runner endpoints"
sidebar:
  order: 7
---

The Script API provides script creation, update, deletion, and execution operations.

## CRUD Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scripts` | Script list |
| GET | `/api/scripts/{id}` | Script details |
| POST | `/api/scripts` | Create a new script |
| PUT | `/api/scripts/{id}` | Update a script |
| DELETE | `/api/scripts/{id}` | Delete a script |
| GET | `/api/scripts/{id}/status` | Script execution status |

## Ad-Hoc Script Execution

### POST /api/scripts/runner

Accepts JavaScript code as a string and executes it on the server side. The script has full access to the `ins.*` API.

### Request

```
POST /api/scripts/runner
Content-Type: application/json
X-Space: <space_name>
```

```json
{
  "projectId": 153,
  "name": "test-script",
  "code": "var val = ins.getVariableValue('ActivePower_kW'); ins.toJSONStr(val);",
  "log": false,
  "compile": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **projectId** | Integer | Yes | Target project ID |
| **name** | String | Yes | Script identifier name |
| **code** | String | Yes | JavaScript code to execute |
| **log** | Boolean | No | Enable execution log |
| **compile** | Boolean | No | Compile before execution |
| **bindings** | Object | No | Custom variables to inject into the script |

### Response

The result of the script's last expression is returned directly:

```
HTTP/1.1 200 OK
Content-Type: application/json

359.91
```

### cURL Examples

```bash
# Login
curl -c cookies.txt -X POST http://localhost:8081/login \
  -F "username=inscada" -F "password=1907"

# Read variable value
curl -b cookies.txt -X POST http://localhost:8081/api/scripts/runner \
  -H "X-Space: claude" -H "Content-Type: application/json" \
  -d '{
    "projectId": 153,
    "name": "read-value",
    "code": "var val = ins.getVariableValue(\"ActivePower_kW\"); ins.toJSONStr(val);",
    "log": false,
    "compile": false
  }'
```

Response:
```json
{
  "flags": { "scaled": true },
  "date": 1774686685945,
  "value": 359.91,
  "extras": { "raw_value": 606.56 },
  "variableShortInfo": {
    "dsc": "Total active power",
    "frame": "Energy-Frame",
    "project": "Energy Monitoring Demo",
    "device": "Energy-Device",
    "name": "ActivePower_kW",
    "connection": "LOCAL-Energy"
  },
  "dateInMs": 1774686685945
}
```

```bash
# Read multiple values
curl -b cookies.txt -X POST http://localhost:8081/api/scripts/runner \
  -H "X-Space: claude" -H "Content-Type: application/json" \
  -d '{
    "projectId": 153,
    "name": "read-multi",
    "code": "var vals = ins.getVariableValues([\"ActivePower_kW\",\"Voltage_V\",\"Current_A\"]); ins.toJSONStr(vals);",
    "log": false,
    "compile": false
  }'
```

```bash
# Write a value
curl -b cookies.txt -X POST http://localhost:8081/api/scripts/runner \
  -H "X-Space: claude" -H "Content-Type: application/json" \
  -d '{
    "projectId": 153,
    "name": "write-value",
    "code": "ins.setVariableValue(\"Temperature_C\", {value: 55.0});",
    "log": false,
    "compile": false
  }'
```

```bash
# Query statistics
curl -b cookies.txt -X POST http://localhost:8081/api/scripts/runner \
  -H "X-Space: claude" -H "Content-Type: application/json" \
  -d '{
    "projectId": 153,
    "name": "stats",
    "code": "var end=ins.now(); var start=ins.getDate(end.getTime()-3600000); var stats=ins.getLoggedVariableValueStats([\"ActivePower_kW\"],start,end); ins.toJSONStr(stats);",
    "log": false,
    "compile": false
  }'
```

Response:
```json
{
  "ActivePower_kW": {
    "maxValue": 624.76,
    "minValue": 305.11,
    "avgValue": 470.95,
    "sumValue": 74881.16,
    "countValue": 159,
    "medianValue": 482.58,
    "firstValue": 464.04,
    "lastValue": 543.08
  }
}
```

### Authorization

This endpoint requires the `RUN_SCRIPT` permission. Scripts run on the server side using the Nashorn JavaScript engine and have full access to the `ins.*` API (Variable, Connection, Alarm, Script, Report, etc.).

:::caution
This endpoint executes code on the server side. The `RUN_SCRIPT` permission should only be granted to trusted users.
:::
