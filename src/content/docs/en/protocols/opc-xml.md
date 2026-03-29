---
title: "OPC XML-DA"
description: "OPC XML-DA Client connection configuration in inSCADA"
sidebar:
  order: 6
---

OPC XML-DA (XML Data Access) is the web services (SOAP/XML) based version of OPC DA. Since it runs over HTTP instead of COM/DCOM, it is platform independent and has a firewall-friendly architecture.

inSCADA supports the OPC XML-DA protocol in **Client** role only.

## OPC XML-DA vs OPC DA vs OPC UA

| Feature | OPC DA | OPC XML-DA | OPC UA |
|---------|--------|------------|--------|
| **Platform** | Windows only | Platform independent | Platform independent |
| **Transport** | COM/DCOM | HTTP/SOAP | TCP, HTTP, WebSocket |
| **Performance** | High | Medium (XML overhead) | High |
| **Firewall** | Problematic (DCOM) | Easy (HTTP) | Easy |
| **Status** | Legacy | Legacy | Active |

:::note
OPC XML-DA was developed as a platform-independent alternative to OPC DA but has been largely superseded by OPC UA. For new projects, [OPC UA](/docs/en/protocols/opc-ua/) should be preferred. OPC XML-DA should only be used for integration with legacy systems that do not support OPC UA.
:::

## Data Model

```
Connection (HTTP URL)
└── Device
    └── Frame (Data Block — Subscription group)
        └── Variable (Item Name)
```

## Configuration

### Connection

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Protocol** | OPC XML | Protocol selection |
| **IP Address** | 192.168.1.100 | OPC XML-DA server IP address |
| **Port** | 8080 | HTTP port |
| **Path** | `/OpcXmlDaService` | Web service path (endpoint) |
| **Connect Timeout** | 5000 ms | Connection establishment timeout |
| **Request Timeout** | 5000 ms | Request timeout |
| **Max Depth** | 12 | Tag tree browse depth |

### Device

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Scan Time** | 1000 ms | Scan period |
| **Scan Type** | PERIODIC | `PERIODIC` or `FIXED_DELAY` |

### Frame

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Use Subscription Mode** | true | Subscription-based data retrieval |
| **Percent Deadband** | 0.5 | Analog value change threshold (%) |
| **Hold Time** | 0 ms | Server response hold duration |
| **Wait Time** | 0 ms | Server change wait duration |

**Hold Time and Wait Time:** Control the OPC XML-DA subscription mechanism. The server waits for value changes during the `Wait Time` and holds the response during the `Hold Time`. When both values are 0, immediate polling is performed.

### Variable

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Name** | `Random.Int1` | Item name (OPC XML-DA item path) |
| **Type** | Float | Data type |

### Supported Data Types

| Data Type | Description |
|-----------|-------------|
| **Boolean** | Single bit value |
| **SByte** | Signed 8-bit integer |
| **Byte** | Unsigned 8-bit integer |
| **Int16** | Signed 16-bit integer |
| **UInt16** | Unsigned 16-bit integer |
| **Int32** | Signed 32-bit integer |
| **UInt32** | Unsigned 32-bit integer |
| **Int64** | Signed 64-bit integer |
| **Float** | 32-bit floating point |
| **Double** | 64-bit floating point |
| **String** | Character string |
| **DateTime** | Timestamp |
