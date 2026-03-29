---
title: "Fatek"
description: "Fatek FBs/FBe series PLC connection configuration in inSCADA (TCP and UDP)"
sidebar:
  order: 10
---

The Fatek protocol provides communication with Fatek Automation's FBs and FBe series PLCs over Ethernet. inSCADA supports the Fatek protocol with **TCP** and **UDP** transport layers in **Client** role only.

## Supported Variants

| Variant | Description |
|---------|-------------|
| **Fatek TCP** | Fatek communication over TCP/IP |
| **Fatek UDP** | Fatek communication over UDP |

## Data Model

```
Connection (IP, port)
└── Device (Station Address)
    └── Frame (Data Block — Register area)
        └── Variable (Register address)
```

## Configuration

### Connection

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Protocol** | Fatek TCP or Fatek UDP | Protocol selection |
| **IP Address** | 192.168.1.10 | PLC IP address |
| **Port** | 500 | Fatek Ethernet port (default: 500) |
| **Timeout** | 5000 ms | Request timeout duration |

### Device

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Station Address** | 1 | PLC station number (1-254) |
| **Scan Time** | 1000 ms | Scan period |
| **Scan Type** | PERIODIC | `PERIODIC` or `FIXED_DELAY` |

### Frame

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Type** | D | Register area type (see below) |
| **Start Address** | 0 | Starting register address |
| **Quantity** | 50 | Number of registers/bits to read |

#### Register Areas (Frame Types)

Fatek PLCs have multiple memory areas. These areas are divided into two main categories: **discrete (bit)** and **register (word)**.

**Discrete (Bit) Areas:**

| Type | Description | Access |
|------|-------------|--------|
| **X** | Digital input (Input) | Read-only |
| **Y** | Digital output (Output) | Read/Write |
| **M** | Internal relay | Read/Write |
| **S** | Step relay | Read/Write |
| **T** | Timer contact | Read-only |
| **C** | Counter contact | Read-only |

**Word (16-bit) Register Areas:**

| Type | Description | Access |
|------|-------------|--------|
| **WX** | Input word register | Read-only |
| **WY** | Output word register | Read/Write |
| **WM** | Internal relay word register | Read/Write |
| **WS** | Step relay word register | Read/Write |
| **WT** | Timer current value (16-bit) | Read-only |
| **WC** | Counter current value (16-bit) | Read-only |
| **RT** | Timer preset value (16-bit) | Read/Write |
| **RC** | Counter preset value (16-bit) | Read/Write |
| **R** | Data register (16-bit) | Read/Write |
| **D** | Data register (16-bit) | Read/Write |
| **F** | File register (16-bit) | Read/Write |

**Double Word (32-bit) Register Areas:**

| Type | Description | Access |
|------|-------------|--------|
| **DWX** | Input double word | Read-only |
| **DWY** | Output double word | Read/Write |
| **DWM** | Internal relay double word | Read/Write |
| **DWS** | Step relay double word | Read/Write |
| **DWT** | Timer current value (32-bit) | Read-only |
| **DWC** | Counter current value (32-bit) | Read-only |
| **DRT** | Timer preset value (32-bit) | Read/Write |
| **DRC** | Counter preset value (32-bit) | Read/Write |
| **DR** | Data register (32-bit) | Read/Write |
| **DD** | Data register (32-bit) | Read/Write |
| **DF** | File register (32-bit) | Read/Write |

:::tip
Most common usage: **X**, **Y**, **M** for discrete I/O; **D** or **R** registers for data storage; **DD** or **DR** for 32-bit values.
:::

### Variable

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Start Address** | 0 | Register offset within the frame |
| **Type** | FLOAT | Data type |

#### Supported Data Types

| Data Type | Size | Description |
|-----------|------|-------------|
| **BOOL** | 1 bit | Discrete (bit) value |
| **INT16** | 16 bit | Signed 16-bit integer |
| **UINT16** | 16 bit | Unsigned 16-bit integer |
| **INT32** | 32 bit | Signed 32-bit integer |
| **UINT32** | 32 bit | Unsigned 32-bit integer |
| **FLOAT** | 32 bit | 32-bit floating point (IEEE 754) |

## Address Calculation Example

```
Frame: D register, Start Address: 0, Quantity: 20

Variable examples:
├── D0    → Start: 0, Type: INT16    (first data register)
├── D1    → Start: 1, Type: UINT16   (second data register)
├── D2-3  → Start: 2, Type: FLOAT    (32-bit float, occupies 2 registers)
├── D4-5  → Start: 4, Type: INT32    (32-bit integer, occupies 2 registers)
└── D10   → Start: 10, Type: INT16

Frame: M relay, Start Address: 0, Quantity: 32

Variable examples:
├── M0    → Start: 0, Type: BOOL     (first internal relay)
├── M1    → Start: 1, Type: BOOL     (second internal relay)
└── M16   → Start: 16, Type: BOOL
```

## TCP vs UDP Selection

| Feature | Fatek TCP | Fatek UDP |
|---------|-----------|-----------|
| **Reliability** | High (guaranteed delivery) | Low (packet loss possible) |
| **Latency** | Normal | Low |
| **Usage** | General purpose (recommended) | Low-latency requirements |

:::note
**Fatek TCP** should be preferred for most applications. UDP should only be used in cases with special performance requirements.
:::
