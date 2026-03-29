---
title: "MQTT"
description: "MQTT protocol in inSCADA — Subscribe/Publish configuration and script-based message parsing"
sidebar:
  order: 8
---

MQTT (Message Queuing Telemetry Transport) is a lightweight, publish/subscribe-based messaging protocol. It is widely used in IoT and IIoT applications for data transmission between sensors, gateways, and cloud platforms. It runs over TCP/IP and uses port **1883** by default (or 8883 with TLS).

inSCADA supports the MQTT protocol in **Client** role — both **Subscribe** (receiving data) and **Publish** (sending data) are possible.

## What Makes MQTT Different: Script-Based Message Processing

The MQTT implementation in inSCADA uses a different approach from other protocols. In protocols like MODBUS or IEC 104, the data structure is fixed (registers, IOA addresses, etc.). In MQTT, the message payload is completely free-form — it can be JSON, XML, plain text, or binary.

For this reason, inSCADA parses MQTT messages using **JavaScript scripts defined at the Frame level**. Each Frame has two script fields:

- **Subscribe Expression:** A script that parses incoming messages and converts them to variable values
- **Publish Expression:** A script that converts variable values into MQTT messages

With this approach, you can map MQTT messages in any format to inSCADA variables.

## Data Model

```
Connection (Broker IP, port, credentials)
└── Device (Base topic)
    └── Frame (Data Block — Topic + Subscribe/Publish scripts)
        └── Variable (Key in script output)
```

## Configuration

### Connection

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Protocol** | MQTT | Protocol selection |
| **IP Address** | 192.168.1.200 | MQTT Broker IP address |
| **Port** | 1883 | Broker port (1883: TCP, 8883: TLS) |
| **Identifier** | `inscada-client-1` | Client identifier (must be unique) |
| **Username** | (optional) | Broker authentication |
| **Password** | (optional) | Broker password |
| **Use SSL** | false | TLS/SSL encryption |
| **Clean Session** | true | Clean session (no persistent subscriptions) |
| **Keep Alive** | 60000 ms | Keep-alive check period |
| **Initial Delay** | 1000 ms | Initial connection wait time |
| **Max Delay** | 60000 ms | Maximum reconnection wait time |
| **Pool Size** | 1 | Connection pool |

### Device

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Base Topic** | `factory/line1` | Base topic path (prefix for Frame topics) |

### Frame

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Topic** | `sensors/temperature` | MQTT topic (subscribe or publish) |
| **QoS** | 1 | Quality of Service (0, 1, or 2) |
| **Subscribe Expression** | (JavaScript code) | Script that parses incoming messages |
| **Publish Expression** | (JavaScript code) | Script that creates outgoing messages |

#### QoS Levels

| QoS | Description |
|-----|-------------|
| **0** | At most once — the message is delivered at most once, loss possible |
| **1** | At least once — the message is delivered at least once, duplicates possible |
| **2** | Exactly once — the message is delivered exactly once, guaranteed |

### Variable

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Name** | `temperature` | Variable name (must match the key in script output) |
| **Type** | Float | Data type |

#### Supported Data Types

| Data Type | Description |
|-----------|-------------|
| **Boolean** | Single bit value |
| **Byte** | 8-bit integer |
| **Short** | 16-bit integer |
| **Integer** | 32-bit integer |
| **Long** | 64-bit integer |
| **Float** | 32-bit floating point |
| **Double** | 64-bit floating point |
| **String** | Character string |

## Subscribe Expression (Receiving Messages)

When an MQTT message arrives, inSCADA executes the **Subscribe Expression** script in the Frame. The following objects are provided to the script as bindings:

| Binding | Type | Description |
|---------|------|-------------|
| **message** | Object | Incoming MQTT message |
| **message.topic** | String | Topic the message arrived from |
| **message.payload** | String | Message content (as string) |
| **message.qos** | Integer | QoS level |
| **message.retained** | Boolean | Whether it is a retained message |
| **frame** | Object | Frame summary information |

The script must return a **JavaScript Map (Object)**. The Map's keys must match Variable names. inSCADA writes each key-value pair from the returned map to the corresponding Variable.

### Example 1: JSON Payload Parse

Incoming message: `{"temperature": 25.4, "humidity": 62.1, "status": true}`

```javascript
// Subscribe Expression
var data = JSON.parse(message.payload);

// Return an object matching Variable names
var result = {};
result.temperature = data.temperature;
result.humidity = data.humidity;
result.status = data.status;
return result;
```

When this script runs:
- `25.4` is written to the `temperature` variable
- `62.1` is written to the `humidity` variable
- `true` is written to the `status` variable

### Example 2: Nested JSON Parse

Incoming message: `{"device": {"id": "sensor-01", "readings": {"temp": 72.5, "press": 3.2}}}`

```javascript
var data = JSON.parse(message.payload);
var result = {};
result.device_id = data.device.id;
result.temp = data.device.readings.temp;
result.press = data.device.readings.press;
return result;
```

### Example 3: Plain Text Parse (CSV)

Incoming message: `25.4;62.1;1;1024`

```javascript
var parts = message.payload.split(';');
var result = {};
result.temperature = parseFloat(parts[0]);
result.humidity = parseFloat(parts[1]);
result.status = parseInt(parts[2]) === 1;
result.pressure = parseFloat(parts[3]);
return result;
```

### Example 4: Conditional Parse by Topic

```javascript
var data = JSON.parse(message.payload);
var result = {};

if (message.topic.indexOf('temperature') > -1) {
    result.temperature = data.value;
} else if (message.topic.indexOf('pressure') > -1) {
    result.pressure = data.value;
}

return result;
```

### Example 5: Using ins.* API (Cross-Variable Access)

You can access other variables within the subscribe script using the `ins` API:

```javascript
var data = JSON.parse(message.payload);
var result = {};
result.temperature = data.temp;

// Read the current value of another variable
var currentSetpoint = ins.getVariableValue('setpoint_temp');
if (currentSetpoint != null) {
    // Calculate the difference and write to another variable
    var diff = data.temp - currentSetpoint.value;
    result.temp_deviation = diff;
}

return result;
```

## Publish Expression (Sending Messages)

When a value is written (set value) to a Variable, inSCADA executes the **Publish Expression** script in the Frame. The following objects are provided to the script as bindings:

| Binding | Type | Description |
|---------|------|-------------|
| **frame** | Object | Frame summary information |
| **setValueRequests** | Array | List of variables and values to be written |
| **setValueRequests[n].variable** | Object | Variable information (name, type) |
| **setValueRequests[n].value** | Object | Value to write |

The script must return a **String** payload to be published to the MQTT broker.

### Example: JSON Publish

```javascript
var payload = {};
for (var i = 0; i < setValueRequests.length; i++) {
    var req = setValueRequests[i];
    payload[req.variable.name] = req.value;
}
return JSON.stringify(payload);
```

This script produces a JSON string like `{"temperature": 25.0, "setpoint": 30.0}` and publishes it to the broker.

### Example: Command Publish

```javascript
var req = setValueRequests[0];
var command = {
    action: 'set',
    variable: req.variable.name,
    value: req.value,
    timestamp: new Date().toISOString()
};
return JSON.stringify(command);
```

## ins.* Script API Reference

Key `ins` API functions available within MQTT scripts:

| Function | Description |
|----------|-------------|
| `ins.getVariableValue(name)` | Read the live value of a Variable (same project) |
| `ins.getVariableValue(project, name)` | Read a variable from a different project |
| `ins.getVariableValues(names[])` | Read multiple variables in bulk |
| `ins.setVariableValue(name, {value: X})` | Write a value to a Variable |
| `ins.setVariableValues({name: {value: X}, ...})` | Write values to multiple variables in bulk |
| `ins.mapVariableValue(src, dest)` | Copy a variable's value to another |
| `ins.toggleVariableValue(name)` | Toggle a Boolean variable |
| `ins.sparkplugDecode(payload)` | Decode a Sparkplug B Protobuf payload |
| `ins.sparkplugEncode(metrics)` | Create a Sparkplug B Protobuf payload |

:::tip
The object returned by `ins.getVariableValue()` has the structure `{value, date}`. Use `.value` to access the value: `ins.getVariableValue('temp').value`
:::

## Sparkplug B Support

[Sparkplug B](https://www.eclipse.org/tahu/) is a payload specification standardized by the Eclipse Foundation for carrying industrial SCADA data over MQTT. It adds the following on top of standard MQTT:

- **Standard topic structure:** A fixed hierarchy in the format `spBv1.0/{group}/{message_type}/{edge_node}/{device}`
- **Birth/Death certificates:** NBIRTH message when a device connects, NDEATH when it disconnects — the SCADA side instantly knows whether the device is online/offline
- **Auto-discovery:** The device sends its variable list and data types with the BIRTH message — no manual tag definition needed
- **Report by exception:** Only changed values are sent — bandwidth is optimized
- **Industrial data types:** Integer, Float, Boolean, DateTime, String, Dataset, Template

Sparkplug B messages are encoded in **Protobuf (Protocol Buffers)** format — a binary format, not plain text like JSON. inSCADA can directly decode/encode Sparkplug B Protobuf messages within scripts using the `ins.sparkplugDecode()` and `ins.sparkplugEncode()` API functions.

### Subscribe — Sparkplug B Decode

```javascript
// Decode Sparkplug B message
var decoded = ins.sparkplugDecode(message.payload);
var result = {};

// metrics: [{name, value, dataType, timestamp}, ...]
var metrics = decoded.metrics;
for (var i = 0; i < metrics.length; i++) {
    result[metrics[i].name] = metrics[i].value;
}

return result;
```

This script parses all metrics from a Sparkplug B DDATA or DBIRTH message and writes them to the corresponding variables.

### Publish — Sparkplug B Encode

```javascript
// Create Sparkplug B payload from variable values
var metrics = [];
for (var i = 0; i < setValueRequests.length; i++) {
    var req = setValueRequests[i];
    metrics.push({
        name: req.variable.name,
        value: req.value
    });
}

return ins.sparkplugEncode(metrics);
```

### Sparkplug B Topic Structure

| Topic | Message Type | Description |
|-------|-------------|-------------|
| `spBv1.0/group/NBIRTH/edge_node` | Node Birth | Edge node came online |
| `spBv1.0/group/NDEATH/edge_node` | Node Death | Edge node went offline |
| `spBv1.0/group/DBIRTH/edge_node/device` | Device Birth | Device online + metric list |
| `spBv1.0/group/DDATA/edge_node/device` | Device Data | Live data (changed metrics) |
| `spBv1.0/group/DCMD/edge_node/device` | Device Command | Sending commands to device |

### Configuration Example

An MQTT Frame configuration using Sparkplug B:

| Parameter | Value |
|-----------|-------|
| **Topic** | `spBv1.0/factory/DDATA/gateway-01/plc-01` |
| **QoS** | 0 |
| **Subscribe Expression** | The decode script above |

:::tip
In Sparkplug B, the DBIRTH message contains all metric definitions of the device. When integrating a new device, first examine the DBIRTH message to learn which metrics will arrive and their data types, then create inSCADA variables accordingly.
:::

## Typical Use Scenarios

### IoT Gateway Integration

```
IoT Sensors ──(MQTT)──► Broker ──(MQTT)──► inSCADA
                                            (Subscribe + Parse)
```

inSCADA subscribes to MQTT messages from IoT gateways or sensors, parses them with scripts, and writes to variables. This way, MQTT-based IoT devices are directly integrated into the SCADA system.

### Cloud Platform Integration

```
inSCADA ──(MQTT Publish)──► Broker ──► Azure IoT Hub / AWS IoT / Google Cloud IoT
```

inSCADA converts the collected field data to JSON format with a publish expression and forwards it to cloud platforms via the MQTT broker.

### Custom Protocol Conversion

Thanks to MQTT's script-based architecture, you can also process non-standard or custom format messages. You can decode binary payloads with JavaScript, combine multiple topics in a single frame, or apply conditional logic.

:::caution
Since subscribe and publish expressions run with every message, it is recommended to keep scripts as simple and efficient as possible for performance reasons. Heavy computations or numerous `ins.*` API calls can increase message processing time.
:::
