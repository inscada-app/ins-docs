---
title: "Connection Management"
description: "Protocol connections setup, configuration and monitoring"
sidebar:
  order: 2
---

A connection is the communication channel to a field device or system. Each connection uses a protocol and is bound to a project.

![Connection List](../../../../assets/docs/dev-connections.png)

## Creating a Connection

**Menu:** Runtime → Connections → New Connection

| Field | Required | Description |
|-------|----------|-------------|
| **Name** | Yes | Connection name (unique within the project) |
| **Protocol** | Yes | Communication protocol |
| **IP** | Depends on protocol | Target IP address |
| **Port** | Depends on protocol | Target port number |
| **Description** | No | Description |

## Supported Protocols

| Protocol | Use Case | Typical Device |
|----------|----------|----------------|
| **MODBUS TCP** | Industrial automation | PLC, energy analyzer, drive |
| **MODBUS UDP** | Applications requiring fast reads | Energy meter |
| **MODBUS RTU over TCP** | Serial communication gateway | RTU, serial device |
| **DNP3** | Energy distribution | RTU, protection relay |
| **IEC 60870-5-104** | Energy transmission/distribution | RTU, SCADA gateway |
| **IEC 61850** | Substation | IED, protection relay |
| **OPC UA** | Open standard | PLC, DCS, SCADA |
| **OPC DA** | Windows COM/DCOM | Legacy OPC servers |
| **OPC XML** | HTTP/SOAP based | Web service OPC |
| **S7** | Siemens PLC | S7-300, S7-400, S7-1200, S7-1500 |
| **MQTT** | IoT / message-based | Gateway, sensor, broker |
| **EtherNet/IP** | Rockwell/Allen-Bradley | Logix 5000+ series |
| **Fatek** | Fatek PLC | FBs, FBe series |
| **LOCAL** | Simulation / calculation | Internal variable |

Detailed protocol settings: [Protocols →](/docs/tr/protocols/)

## Connection States

| State | Description |
|-------|-------------|
| **Connected** | Connection is active, data is being read |
| **Disconnected** | Connection is lost |
| **Error** | Connection error (timeout, authorization, etc.) |

## Connection Structure (Example)

```json
{
  "id": 153,
  "name": "LOCAL-Energy",
  "protocol": "LOCAL",
  "ip": "127.0.0.1",
  "port": 0,
  "projectId": 153,
  "dsc": "Local protocol connection for energy simulation"
}
```

## Starting / Stopping Connections

Connections can be managed from the interface or via scripts:

```javascript
// Query status
var status = ins.getConnectionStatus("LOCAL-Energy");
// → "Connected"

// Stop and restart
ins.stopConnection("MODBUS-PLC");
java.lang.Thread.sleep(2000);
ins.startConnection("MODBUS-PLC");
```

## Updating Connection Parameters

Connection parameters can be dynamically changed during runtime:

```javascript
// Change IP address
ins.updateConnection("MODBUS-PLC", {
    "ip": "192.168.1.100",
    "port": 502
});
```

:::tip
It is recommended to stop and restart the connection after updating connection parameters.
:::

Detailed API: [Connection API →](/docs/tr/platform/scripts/connection-api/)
