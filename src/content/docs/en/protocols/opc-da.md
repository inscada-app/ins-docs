---
title: "OPC DA"
description: "OPC DA Client connection configuration in inSCADA"
sidebar:
  order: 5
---

OPC DA (Data Access) is the most widely used component of the OPC Classic standards. It is built on Windows COM/DCOM technology and provides real-time data access. It was used as the de facto standard in industrial automation before OPC UA.

inSCADA supports the OPC DA protocol in **Client** role only.

:::note
OPC DA is based on Windows COM/DCOM. Therefore, it only runs on **Windows**. For a platform-independent solution, [OPC UA](/docs/en/protocols/opc-ua/) should be preferred.
:::

## OPC DA vs OPC UA

| Feature | OPC DA | OPC UA |
|---------|--------|--------|
| **Platform** | Windows only | Platform independent |
| **Technology** | COM/DCOM | TCP/IP, HTTP, WebSocket |
| **Security** | DCOM security | TLS, certificates, user auth |
| **Discovery** | Via DCOM | Browse + Discovery |
| **Status** | Legacy | Active development |

## Data Model

```
Connection (COM ProgID)
└── Device
    └── Frame (Data Block — Subscription group)
        └── Variable (Item ID)
```

## Configuration

### Connection

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Protocol** | OPC DA | Protocol selection |
| **IP Address** | 192.168.1.100 | OPC DA server IP address |
| **Port** | 135 | DCOM port (default: 135) |
| **COM ProgID** | `Matrikon.OPC.Simulation` | OPC server COM programmatic identifier |
| **Separator** | `.` | Tag path separator character (default: dot) |
| **Max Depth** | 12 | Tag tree browse depth |
| **Server Status Check Time** | 30000 ms | Server status check period |

:::tip
**COM ProgID** is the OPC server's programmatic name in the Windows Registry. Examples: `Matrikon.OPC.Simulation`, `KEPServerEX.V6`, `RSLinx OPC Server`. It can be found from the OPC server documentation or OPC browser tools.
:::

### Device

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Scan Time** | 1000 ms | Scan period |
| **Scan Type** | PERIODIC | `PERIODIC` or `FIXED_DELAY` |

### Frame

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Use Subscription Mode** | true | Subscription-based data retrieval (notification on change) |
| **Percent Deadband** | 0.5 | Analog value change threshold (%) |

**Subscription Mode:** When `true`, the OPC server sends notifications only when values change — reducing network traffic and CPU load. When `false`, periodic polling is performed.

### Variable

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Name** | `Temperature` | Variable name (also used as OPC Item ID) |
| **Type** | VT_R4 | OPC DA data type |

### Supported Data Types (VARIANT Types)

| Data Type | Description |
|-----------|-------------|
| **VT_BOOL** | Boolean |
| **VT_I1** | Signed 8-bit integer |
| **VT_UI1** | Unsigned 8-bit integer |
| **VT_I2** | Signed 16-bit integer |
| **VT_UI2** | Unsigned 16-bit integer |
| **VT_INT** | Signed 32-bit integer |
| **VT_UINT** | Unsigned 32-bit integer |
| **VT_I8** | Signed 64-bit integer |
| **VT_R4** | 32-bit floating point (float) |
| **VT_R8** | 64-bit floating point (double) |
| **VT_BSTR** | Character string |

## Browse (Discovery)

inSCADA can discover available items by **browsing** the OPC DA server's tag tree. This feature makes it easier to find the correct Item ID information when defining variables.

## DCOM Configuration Notes

Since OPC DA runs over Windows DCOM, DCOM configuration is required for remote connections:

1. Configure remote access permissions using **DCOMCNFG** on the OPC server computer
2. Open DCOM ports (135 + dynamic ports) in Windows Firewall
3. Both computers must have the same user account or appropriate authorization

:::caution
DCOM configuration is complex and can create security vulnerabilities. Where possible, using [OPC UA](/docs/en/protocols/opc-ua/) instead of OPC DA is recommended.
:::
