---
title: "MODBUS"
description: "MODBUS protocol family in inSCADA — TCP, RTU over TCP, UDP variants"
sidebar:
  order: 1
  label: "MODBUS"
---

MODBUS is one of the most widely used communication protocols in industrial automation. inSCADA supports multiple variants of the MODBUS protocol in both **Client (Master)** and **Server (Slave)** roles.

## Supported Variants

| Variant | Client / Master | Server / Slave |
|---------|:--------------:|:--------------:|
| [MODBUS TCP](/docs/en/protocols/modbus/tcp-client/) | ✓ | ✓ |
| [MODBUS RTU over TCP](/docs/en/protocols/modbus/rtu-over-tcp/) | ✓ | ✓ |
| [MODBUS UDP](/docs/en/protocols/modbus/udp/) | ✓ | ✓ |

## Data Model

Each MODBUS connection in inSCADA is defined in the following hierarchical structure:

```
Connection
└── Device (identified by Slave ID)
    └── Frame (Register block)
        └── Variable (Single register/bit address)
```

### Connection Parameters

Common connection parameters for all MODBUS variants:

| Parameter | Type | Description |
|-----------|------|-------------|
| **IP / Host** | String | Target device IP address or hostname |
| **Port** | Integer | Target port (default: 502) |
| **Timeout** | Integer (ms) | Response wait time |
| **Connect Timeout** | Integer (ms) | Connection establishment timeout |
| **Retries** | Integer | Failed request retry count |
| **Pool Size** | Integer | Connection pool size |
| **Max Idle Timeout** | Integer (ms) | Idle connection timeout |
| **Check CRC** | Boolean | CRC validation check (for RTU) |
| **Reconnect on Error** | Boolean | Automatic reconnection on error |

### Device Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| **Station Address** | Integer (1-247) | MODBUS Slave address (Unit ID) |
| **Scan Time** | Integer (ms) | Scan period |
| **Scan Type** | Enum | `PERIODIC` or `FIXED_DELAY` |
| **Retain Flag** | Boolean | Retain last value |

### Frame (Data Block) Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| **Type** | Enum | Register type (see below) |
| **Start Address** | Integer | Starting register address |
| **Quantity** | Integer | Number of registers to read |
| **Inter Frame Delay** | Integer (ms) | Delay between frames |
| **Is Readable** | Boolean | Read permission |
| **Is Writable** | Boolean | Write permission |
| **Minutes Offset** | Integer | Time offset (minutes) |
| **Scan Time Factor** | Integer | Scan multiplier |

#### Register Types

| Type | Function Code | Read | Write | Description |
|------|--------------|:----:|:-----:|-------------|
| **Coil** | FC01 / FC05 / FC15 | ✓ | ✓ | Digital output (1 bit) |
| **Discrete Input** | FC02 | ✓ | — | Digital input (1 bit, read-only) |
| **Holding Register** | FC03 / FC06 / FC16 | ✓ | ✓ | Analog output (16 bit) |
| **Input Register** | FC04 | ✓ | — | Analog input (16 bit, read-only) |

### Variable Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| **Start Address** | Integer | Register address (offset within frame) |
| **Type** | Enum | Data type (see below) |
| **Byte Swap** | Boolean | Byte order swap (Big/Little Endian) |
| **Word Swap** | Boolean | Word order swap (for 32-bit values) |
| **Bit Offset** | Integer | Bit address (for Coil/Discrete) |
| **Length** | Integer | Character length for String type |

#### Supported Data Types

| Data Type | Size | Description |
|-----------|------|-------------|
| **Boolean** | 1 bit | Single bit value |
| **Byte** | 8 bit | Signed byte |
| **Unsigned Byte** | 8 bit | Unsigned byte |
| **Short** | 16 bit | Signed 16-bit integer |
| **Unsigned Short** | 16 bit | Unsigned 16-bit integer |
| **Integer** | 32 bit | Signed 32-bit integer |
| **Unsigned Integer** | 32 bit | Unsigned 32-bit integer |
| **Long** | 64 bit | Signed 64-bit integer |
| **Float** | 32 bit | IEEE 754 floating point |
| **Double** | 64 bit | IEEE 754 double precision |
| **16 BIT BCD** | 16 bit | Binary Coded Decimal |
| **32 BIT BCD** | 32 bit | Binary Coded Decimal |
| **64 BIT BCD** | 64 bit | Binary Coded Decimal |
| **String** | Variable | ASCII character string |

:::tip
Byte Swap and Word Swap settings for 32-bit and 64-bit data types may vary depending on the device manufacturer. Check your device documentation.
:::

## Next Steps

For variant-specific configuration details:

- [MODBUS TCP Client / Server](/docs/en/protocols/modbus/tcp-client/)
- [MODBUS RTU over TCP](/docs/en/protocols/modbus/rtu-over-tcp/)
- [MODBUS UDP](/docs/en/protocols/modbus/udp/)
