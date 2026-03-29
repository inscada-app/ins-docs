---
title: "REST API Client"
description: "REST API Client in inSCADA — accessing external HTTP services with ins.rest()"
sidebar:
  order: 11
---

REST API Client is an upcoming connection type for inSCADA. With this protocol, data can be periodically fetched from external REST/HTTP services and written to inSCADA variables.

:::note[Coming Soon]
The REST API Client protocol is under development. It is not yet available as a Connection type in the current version.
:::

## Current Alternative: ins.rest() Script API

Until the REST API Client protocol is ready, the `ins.rest()` function via the **Script Engine** can be used for similar needs. This function allows you to send HTTP requests to any external service from within scheduled scripts.

### ins.rest() Usage

The `ins.rest()` function can be used with two different signatures:

**Signature 1 — With Content-Type:**
```javascript
ins.rest(httpMethod, url, contentType, body)
```

**Signature 2 — With Custom Headers:**
```javascript
ins.rest(httpMethod, url, headers, body)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| **httpMethod** | String | `"GET"`, `"POST"`, `"PUT"`, `"DELETE"` |
| **url** | String | Target URL |
| **contentType** | String | Content type (e.g., `"application/json"`) |
| **headers** | Map | Custom HTTP headers |
| **body** | Object | Request body (for POST/PUT) |

**Return value:** A Map with the structure `{statusCode, body, headers}`

### Example 1: Fetching Data from a Weather API

```javascript
// Scheduled script (e.g., every 5 minutes)
var response = ins.rest("GET",
    "https://api.openweathermap.org/data/2.5/weather?q=Istanbul&appid=YOUR_KEY&units=metric",
    "application/json", null);

if (response.statusCode == 200) {
    var data = JSON.parse(response.body);
    ins.setVariableValue("outdoor_temperature", {value: data.main.temp});
    ins.setVariableValue("outdoor_humidity", {value: data.main.humidity});
    ins.setVariableValue("wind_speed", {value: data.wind.speed});
}
```

### Example 2: Sending Data to an IoT Platform

```javascript
// Scheduled script — send inSCADA data to an external system
var temp = ins.getVariableValue("temperature").value;
var press = ins.getVariableValue("pressure").value;

var payload = JSON.stringify({
    deviceId: "plant-01",
    timestamp: new Date().toISOString(),
    measurements: {
        temperature: temp,
        pressure: press
    }
});

var response = ins.rest("POST",
    "https://api.example.com/telemetry",
    "application/json", payload);

if (response.statusCode != 200) {
    ins.consoleLog("Telemetry submission failed: " + response.statusCode);
}
```

### Example 3: API Call with Custom Headers

```javascript
var headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs...",
    "Content-Type": "application/json",
    "X-Custom-Header": "my-value"
};

var response = ins.rest("GET",
    "https://api.example.com/data",
    headers, null);

var data = JSON.parse(response.body);
ins.setVariableValue("api_value", {value: data.result});
```

### Example 4: ERP Integration — Sending Production Data

```javascript
// Send production data to ERP every hour
var production = ins.getVariableValue("production_count").value;
var energy = ins.getVariableValue("energy_consumption").value;

var payload = JSON.stringify({
    line: "Line-1",
    shift: "morning",
    produced: production,
    energyKwh: energy,
    timestamp: ins.now().toISOString()
});

ins.rest("POST", "https://erp.company.com/api/production", "application/json", payload);
```

## Script Scheduling

To run the `ins.rest()` function periodically, create a script in inSCADA's **Script** module and select the scheduling type:

| Scheduling Type | Parameters | Description |
|-----------------|------------|-------------|
| **Periodic** | Period (ms), Offset (ms) | Recurring execution at fixed intervals. E.g.: Period = 300000 → every 5 minutes |
| **Daily** | Hour:Minute | Execution at a specific time every day. E.g.: 08:00 |
| **Once** | Delay (ms) | One-time execution. The script runs once and stops |
| **None** | — | No automatic scheduling. The script is only triggered via API or manually |

This way, periodic HTTP data collection and submission operations can be performed even without the REST API Client protocol.

:::tip
HTTP calls made with `ins.rest()` run on the server side — they are not affected by browser CORS restrictions. Any external API can be accessed.
:::
