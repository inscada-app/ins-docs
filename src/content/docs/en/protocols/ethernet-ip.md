---
title: "EtherNet/IP"
description: "EtherNet/IP (CIP) protocol in inSCADA — Rockwell/Allen-Bradley Logix series PLC connection"
sidebar:
  order: 9
---

EtherNet/IP (Ethernet Industrial Protocol) is an industrial communication protocol based on CIP (Common Industrial Protocol). It is managed by ODVA (Open DeviceNet Vendors Association). It runs over TCP/IP and UDP, using port **44818** by default.

inSCADA supports the EtherNet/IP protocol in **Client** role only.

## Supported Devices

inSCADA's EtherNet/IP implementation uses **tag-based addressing** (CIP implicit messaging). This addressing method is supported on the following control platforms:

| Platform | Support | Description |
|----------|:------:|-------------|
| **ControlLogix** (Allen-Bradley) | ✓ | Logix 5000+ series — full support |
| **CompactLogix** (Allen-Bradley) | ✓ | Logix 5000+ series — full support |
| **SoftLogix** (Rockwell) | ✓ | PC-based Logix runtime environment |
| **MicroLogix** (Allen-Bradley) | ✗ | Data file-based addressing — not supported |
| **SLC 500** (Allen-Bradley) | ✗ | Data file-based addressing — not supported |
| **PLC-5** (Allen-Bradley) | ✗ | Data file-based addressing — not supported |

:::note
**Why is MicroLogix/SLC/PLC-5 not supported?**

These older platforms use **data file-based addressing** (e.g., `N7:0`, `F8:3`, `B3/0`). inSCADA's EtherNet/IP implementation uses the **tag-based addressing** structure of the Logix 5000+ series (e.g., `Motor_1_Speed`, `Tank.Level`). These two addressing methods differ at the protocol level — the CIP message structure and routing mechanism are incompatible.

If communication with data file-based devices is required, an OPC DA/UA gateway or a proxy through ControlLogix can be used as alternatives.
:::

## Tag-Based Addressing

On Logix platforms, data is accessed by **tag (label)** names. Instead of register addresses, the tag name defined in the program is used directly:

```
Motor_1_Speed          → Simple tag (REAL)
Tank.Level             → UDT (User Defined Type) member
Station[3].Temp        → Array element
Program:MainProgram.Counter  → Program scope tag
```

This approach:
- Is human-readable — the tag name describes what the data is
- Maps directly to the PLC program
- Eliminates the need for register address calculations

## Data Model

```
Connection (IP, port, timeout)
└── Device (Slot number)
    └── Frame (Data Block — Grouping)
        └── Variable (Tag name)
```

## Configuration

### Connection

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Protocol** | EthernetIp | Protocol selection |
| **IP Address** | 192.168.1.1 | PLC IP address |
| **Port** | 44818 | EtherNet/IP port (default: 44818) |
| **Timeout** | 5000 ms | Request timeout duration |
| **Retries** | 3 | Number of failed request retries |

### Device

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Slot** | 0 | PLC backplane slot number |
| **Scan Time** | 1000 ms | Scan period |
| **Scan Type** | PERIODIC | `PERIODIC` or `FIXED_DELAY` |

:::tip
**Slot number** is the physical position of the PLC CPU module on the chassis. For CompactLogix it is typically `0`, for ControlLogix it is the slot where the CPU is installed (e.g., `0`, `1`, or `2`).
:::

### Frame

In EtherNet/IP, a Frame is used only to group variables. There are no protocol-specific additional parameters.

### Variable

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Name** | `Motor_1_Speed` | Tag name in the PLC (full path) |
| **Type** | REAL | CIP data type |
| **Bit Parent Type** | (optional) | Parent data type for bit access |

The variable name must be **exactly the same** as the tag name in the PLC program. inSCADA uses this name to send a CIP Read/Write Tag Service request.

#### Supported Data Types

| Data Type | CIP Size | Description |
|-----------|----------|-------------|
| **BIT** | 1 bit | Single bit (requires Bit Parent Type) |
| **BOOL** | 1 bit | Boolean value |
| **SINT** | 8 bit | Signed 8-bit integer (-128 ~ 127) |
| **INT** | 16 bit | Signed 16-bit integer (-32768 ~ 32767) |
| **DINT** | 32 bit | Signed 32-bit integer |
| **LINT** | 64 bit | Signed 64-bit integer |
| **REAL** | 32 bit | 32-bit floating point (IEEE 754) |
| **BITS** | 32 bit | Bit array (as 32-bit word) |
| **STRUCT** | Variable | Structured data type (UDT) |

#### Bit Access

The **BIT** type is used to access a single bit. In this case, the **Bit Parent Type** must be selected to specify which data type the bit is read from:

| Bit Parent Type | Description |
|----------------|-------------|
| **SINT** | Read bit from 8-bit integer |
| **BITS** | Read bit from 32-bit word |

### Tag Name Examples

| Tag Name | Type | Description |
|----------|------|-------------|
| `Motor_Speed` | REAL | Simple controller tag |
| `Tank.Level` | REAL | UDT (structured type) member |
| `Sensors[0]` | DINT | First element of array |
| `Sensors[5]` | DINT | 6th element of array |
| `Station[2].Temperature` | REAL | Array + structured type |
| `Program:MainProgram.LocalTag` | INT | Program scope tag |
| `Motor_Run` | BOOL | Boolean tag |
| `StatusBits` | BITS | 32-bit status word |

## Batch Read

inSCADA reads EtherNet/IP tags **in bulk** for performance. Multiple tags are read with a single CIP request:

- Normal tags: 20 tags/request
- String tags: 5 tags/request (larger payload)
- Bit tags: 20 tags/request (read via parent type)

This behavior is automatic — no user configuration is required.

## Rockwell Studio 5000 / RSLogix 5000 Notes

No special configuration is required on the PLC side for communication with inSCADA. The following points should be checked:

- Ensure tags are defined as **Controller Scope** (global) — for Program scope tags, use the `Program:ProgramName.TagName` format
- Verify that the PLC's **Remote Access** settings are enabled
- Ensure port **44818** is open in the firewall
