---
title: "Communication Protocols"
description: "Protocol architecture in inSCADA — Connection, Device, Frame, Variable structure and addressing logic"
sidebar:
  order: 0
  label: "Overview"
---

inSCADA manages communication with field devices through a standard hierarchical structure. Regardless of the protocol used — MODBUS, DNP3, IEC 104, OPC UA, or others — the data model always follows the same four-level structure.

## Data Model: Connection → Device → Frame → Variable

```
Connection
│   Protocol type, IP address, port, and protocol-specific parameters
│
└── Device
    │   Device address, scan period
    │
    └── Frame (Data Block)
        │   Memory area type, start address, block size
        │
        └── Variable
              Offset address within the block, data type
```

### Connection

A communication channel opened to a field device or system. Each Connection is bound to a single protocol type and target address.

- IP address and port information
- Protocol selection (MODBUS TCP, DNP3, OPC UA, etc.)
- Communication parameters such as timeout, retry
- Protocol-specific settings (security, authentication, etc.)

Multiple Devices can be defined under a single Connection.

### Device

A physical or logical unit accessed through the Connection. It is addressed differently depending on the protocol:

| Protocol | Device Address | Example |
|----------|---------------|---------|
| MODBUS | Station Address (Slave ID) | `1` |
| DNP3 | Local/Remote Address pair | `1 / 10` |
| IEC 104 | Common Address (CASDU) | `1` |
| IEC 61850 | Object Reference (Logical Device) | `IED1LD1` |
| OPC UA | Base Path | `PLC_1` |
| S7 | Rack / Slot | `0 / 0` |
| EtherNet/IP | Slot | `0` |

Each Device has a **Scan Time** (scan period) parameter. inSCADA reads all Frames attached to the Device sequentially at this interval.

### Frame (Data Block)

Represents a specific memory region or data group within a Device. A Frame defines **what will be read**:

- Which memory area (Holding Register, Analog Input, DataBlock, etc.)
- Start address
- Block size (how many units to read)

Multiple Frames can be defined under a single Device — each representing a different memory region or data group.

### Variable

A single data point within a Frame. It is the fundamental building block of inSCADA — logging, scaling, alarms, animations, and all other functions operate through Variables.

## Addressing Logic: Absolute vs Relative

This is the most commonly confused point for developers using inSCADA for the first time. Correct understanding is critical for error-free configuration.

### Frame: Absolute Address Within the Device

The **Start Address** entered when defining a Frame is the **absolute start address** in the device's memory area. The **Quantity** specifies how many units of area will be read from this start address.

A Frame opens a **window** into the device memory:

```
Device Memory (e.g., Holding Register)
┌──────────────────────────────────────────────────────────┐
│ Addr:  0   1   2  ...  99  100  101  102  ...  119  120 │
│                         ▲                          ▲     │
│                         │    Frame Window           │     │
│                         │◄─────────────────────────►│     │
│                    Start: 100            Quantity: 20     │
└──────────────────────────────────────────────────────────┘
```

In this example, the Frame reads a block of **20 registers starting from address 100** in the device's Holding Register area.

### Variable: Relative Address Within the Frame

The address entered when defining a Variable is **not the device's actual address** — it is a **relative offset** from the start of the Frame. That is, the Variable address specifies **which unit within the Frame window** it is located at.

```
Frame: Start Address = 100, Quantity = 20

Device Memory:    [100] [101] [102] [103] [104] ... [119]
Frame Offset:       0     1     2     3     4   ...   19
                    ▲                 ▲     ▲
                    │                 │     │
              Variable A         Variable B  Variable C
              Offset: 0         Offset: 3   Offset: 4
              (Actual: 100)     (Actual: 103) (Actual: 104)
```

:::caution[Critical Rule]
Do **not** enter the device's actual address as the Variable address. Enter the offset relative to the start of the Frame.

For example, if you want to read data at address 103 in the device and the Frame Start Address = 100:
- ❌ Wrong: Variable Address = `103`
- ✓ Correct: Variable Address = `3` (because 103 - 100 = 3)
:::

### MODBUS Example

You want to read voltage and current values from an energy analyzer. According to the device documentation:
- Phase-A Voltage: Holding Register **40100** (REAL, 2 registers)
- Phase-B Voltage: Holding Register **40102** (REAL, 2 registers)
- Phase-C Voltage: Holding Register **40104** (REAL, 2 registers)
- Phase-A Current: Holding Register **40106** (REAL, 2 registers)

**Frame definition:**
| Parameter | Value | Description |
|-----------|-------|-------------|
| Type | Holding Register | Memory area |
| Start Address | 100 | Actual start address of the device |
| Quantity | 10 | 10 registers to be read (100-109) |

:::note
MODBUS addressing: Some device documentation shows **40001-based** (Modicon convention) addresses. In this case, address 40100 is actually register **100** (subtract 40001). In inSCADA, 0-based addresses are entered.
:::

**Variable definitions:**

| Variable | Offset | Data Type | Actual Address | Description |
|----------|:------:|-----------|:--------------:|-------------|
| Voltage_A | 0 | Float | 100-101 | Phase-A Voltage |
| Voltage_B | 2 | Float | 102-103 | Phase-B Voltage |
| Voltage_C | 4 | Float | 104-105 | Phase-C Voltage |
| Current_A | 6 | Float | 106-107 | Phase-A Current |

### Siemens S7 Example

You want to read temperature and status information from DB8 on an S7 PLC:
- Running status: DB8.DBX0.0 (BIT)
- Alarm status: DB8.DBX0.1 (BIT)
- Temperature: DB8.DBD2 (REAL, 4 bytes)
- Pressure: DB8.DBD6 (REAL, 4 bytes)
- Setpoint: DB8.DBW10 (INT, 2 bytes)

**Frame definition:**
| Parameter | Value | Description |
|-----------|-------|-------------|
| Type | DB | DataBlock area |
| DB Number | 8 | DataBlock number |
| Start Address | 0 | Start from byte 0 |
| Quantity | 12 | Read 12 bytes (0-11) |

**Variable definitions:**

| Variable | Byte Offset | Bit Offset | Data Type | S7 Address | Description |
|----------|:---------:|:---------:|-----------|:---------:|-------------|
| Running | 0 | 0 | BIT | DBX0.0 | Running status |
| Alarm | 0 | 1 | BIT | DBX0.1 | Alarm status |
| Temperature | 2 | — | REAL | DBD2 | Temperature (4 bytes) |
| Pressure | 6 | — | REAL | DBD6 | Pressure (4 bytes) |
| Setpoint | 10 | — | INT | DBW10 | Setpoint (2 bytes) |

Note that Variable offsets are relative to the start of the Frame (byte 0). Since S7 addressing is byte-based, when Frame Start Address = 0, the Variable offsets directly correspond to S7 byte addresses. However, if the Frame Start Address were different (e.g., 100), the Variable offsets would still start from 0.

## Frame Size and Performance

Setting the Frame size (Quantity) correctly directly affects communication performance:

- **Frame too large:** Pulls a lot of data in a single request, but an error affects the entire block
- **Frame too small:** A separate request is sent for each variable, slowing down communication
- **Gaps in addresses:** Even if there are unused addresses in between, including them in a single Frame is generally more efficient than using separate Frames

:::tip[Recommended Approach]
Group consecutive addresses in a single Frame. If there are large gaps (e.g., 100 registers apart), split into separate Frames. Be careful not to exceed the protocol's maximum block size (e.g., MODBUS: 125 registers/request).
:::

## Scan Time Factor

Each Frame has a **Scan Time Factor** parameter. The Frame's actual scan period is calculated with this formula:

```
Frame Scan Period = Device Scan Time × Scan Time Factor
```

This feature allows slow-changing data to be scanned less frequently. For example, if Device Scan Time = 1000 ms:

| Frame | Scan Time Factor | Actual Period | Usage |
|-------|:----------------:|:-------------:|-------|
| Live measurements | 1 | 1 sec | Current, voltage, power |
| Status information | 5 | 5 sec | Operating mode, alarm status |
| Configuration | 60 | 1 min | Setpoint, parameters |

## Protocol List

For detailed configuration information, go to the relevant protocol page:

- [MODBUS](/docs/en/protocols/modbus/) — TCP, RTU over TCP, UDP (Client + Server)
- [DNP3](/docs/en/protocols/dnp3/) — Master + Outstation
- [IEC 60870-5-104](/docs/en/protocols/iec104/) — Client + Server
- [IEC 61850](/docs/en/protocols/iec61850/) — MMS Client + Server
- [OPC UA](/docs/en/protocols/opc-ua/) — Client + Server
- [OPC DA](/docs/en/protocols/opc-da/) — Client
- [OPC XML-DA](/docs/en/protocols/opc-xml/) — Client
- [Siemens S7](/docs/en/protocols/s7/) — Client
- [MQTT](/docs/en/protocols/mqtt/) — Subscribe + Publish
- [EtherNet/IP](/docs/en/protocols/ethernet-ip/) — Client (Logix 5000+)
- [Fatek](/docs/en/protocols/fatek/) — TCP + UDP Client
- [REST API Client](/docs/en/protocols/rest-client/) — Coming Soon
- [BACnet](/docs/en/protocols/bacnet/) — Gateway
- [KNX](/docs/en/protocols/knx/) — Gateway
