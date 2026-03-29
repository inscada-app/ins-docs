---
title: "System Requirements"
description: "Hardware, software and network requirements for the inSCADA platform"
sidebar:
  order: 2
---

This section covers the hardware, software and network infrastructure requirements for installing and running the inSCADA platform.

:::caution[Important]
inSCADA should be installed on a dedicated machine along with its platform components (RDB, TSDB, In-Memory Cache). Do not run other resource-intensive applications on the same machine.
:::

## Hardware Requirements

inSCADA can run on a wide range of hardware — from servers and desktop PCs to industrial PCs and mini computers. The following table shows minimum hardware requirements by tag (variable) count. Use the higher of the tag or device count as your basis.

| System Scale | Tag Count | CPU (Cores) | RAM | Disk (SSD) |
|-------------|-----------|-------------|-----|------------|
| **Small** | < 1,000 | 4 | 8 GB | 128 GB |
| **Medium** | 1,000 – 5,000 | 4 | 16 GB | 256 GB |
| **Large** | 5,000 – 10,000 | 8 | 16 GB | 512 GB |
| **Enterprise** | 10,000 – 50,000 | 8 | 32 GB | 1 TB |
| **Enterprise+** | 50,000+ | 16 | 64 GB | 2 TB+ |

:::note
- Listed values are minimum requirements. We recommend doubling the RAM values.
- In a redundant (cluster) setup, hardware should be calculated separately for each node.
- Disk space may increase depending on historical data retention period and logging frequency.
:::

### Client Requirements

Since inSCADA is web-based, no client-side installation is required. Any modern browser is sufficient.

| Component | Minimum |
|-----------|---------|
| **Browser** | Chrome 90+, Edge 90+, Firefox 90+ |
| **Screen Resolution** | 1920 × 1080 |
| **Network** | HTTPS access to inSCADA |

Additional requirements for the **inSCADA Viewer** desktop application:

| Component | Minimum |
|-----------|---------|
| **Operating System** | Windows 10/11 (64-bit) |
| **RAM** | 4 GB |
| **Disk** | 500 MB |

## Supported Operating Systems

The inSCADA server runs on the following operating systems:

### Windows

| Operating System | inSCADA | Client (Viewer) |
|-----------------|--------|-----------------|
| Windows Server 2022 | ✓ | ✓ |
| Windows Server 2019 | ✓ | ✓ |
| Windows Server 2016 | ✓ | ✓ |
| Windows 11 (64-bit) | ✓ | ✓ |
| Windows 10 (64-bit) | ✓ | ✓ |

### Linux

| Distribution | inSCADA |
|-------------|--------|
| Ubuntu 22.04 LTS / 24.04 LTS | ✓ |
| Red Hat Enterprise Linux 8 / 9 | ✓ |
| CentOS Stream 8 / 9 | ✓ |
| Debian 11 / 12 | ✓ |

:::note
No graphical interface is required on Linux. inSCADA runs as a service (systemd).
:::

## Software Dependencies

inSCADA works with the following components. All components are **automatically installed** by the setup application. If preferred, these components can also be installed on separate servers to suit your existing infrastructure.

| Component | Purpose | Installation |
|-----------|---------|-------------|
| **Java Runtime (JDK)** | Platform runtime | Automatic via setup |
| **Relational Database (RDB)** | Configuration and metadata | Automatic via setup |
| **Time Series Database (TSDB)** | Historical measurement data | Automatic via setup |
| **In-Memory Cache** | Real-time data access | Automatic via setup |

:::tip
For small and medium systems, the setup installs all components on a single server automatically — no additional configuration needed. For large and enterprise systems, distributing databases across separate machines in your existing infrastructure is recommended; in this case, components are installed independently and connection details are provided to inSCADA.
:::

## Network Requirements

### Bandwidth

| Usage | Minimum |
|-------|---------|
| inSCADA – Field Devices | 100 Mbps Ethernet |
| inSCADA – Clients | 100 Mbps (1 Gbps recommended) |
| Node – Node (Cluster) | 1 Gbps |
| Serial communication | 19,200 bps minimum baud rate |

### Port Requirements

**Platform Ports:**

| Port | Service | Direction |
|------|---------|-----------|
| 8081 | inSCADA Web Interface (HTTP) | Inbound |
| 8082 | inSCADA Web Interface (HTTPS) | Inbound |
| 5432 | Relational Database | Internal |
| 8086 | Time Series Database | Internal |
| 6379 | In-Memory Cache | Internal |
| 7800 | Cluster Communication | Internal (inter-node) |
| 61616 | Message Queue (Cluster) | Internal (inter-node) |

**Protocol Ports (Client — inSCADA → Field Device):**

When inSCADA connects to field devices as a client/master, it initiates outbound connections to the target device's port. These ports generally do not need to be opened on the inSCADA side; they must be open on the target device.

| Port | Protocol | Description |
|------|----------|-------------|
| 502 | Modbus TCP | Default Modbus port |
| 102 | IEC 61850 MMS | MMS communication |
| 2404 | IEC 60870-5-104 | Default IEC 104 port |
| 20000 | DNP3 | Default DNP3 port |
| 4840 | OPC UA | Default OPC UA port |
| 102 | Siemens S7 | S7 communication port |
| 1883 | MQTT | Default MQTT broker port |
| 44818 | EtherNet/IP | Default EIP port |

**Protocol Ports (Server — External System → inSCADA):**

For protocols where inSCADA operates in server/slave role, the relevant port must be **open for inbound connections** on the inSCADA side so external systems can connect.

| Port | Protocol | Description |
|------|----------|-------------|
| Configurable | Modbus TCP Slave | Default: 502 (can be changed) |
| Configurable | IEC 60870-5-104 Server | Default: 2404 (can be changed) |
| Configurable | IEC 61850 Server | MMS server port |
| Configurable | DNP3 Slave | Default: 20000 (can be changed) |
| Configurable | OPC UA Server | Default: 4840 (can be changed) |

:::note
- Only open ports that are actually in use in your firewall rules
- Internal ports (database, cache, cluster) should only be accessible within the same machine or between cluster nodes
- Server/Slave protocol ports can be changed from connection settings
:::

## Virtualisation

inSCADA is supported on the following virtualisation platforms:

| Platform | inSCADA | Client |
|----------|--------|--------|
| VMware vSphere / ESXi | ✓ | ✓ |
| Microsoft Hyper-V | ✓ | ✓ |
| KVM / QEMU | ✓ | — |
| Docker / Container | ✓ | — |

**Virtualisation notes:**
- CPU, memory and disk resources must be allocated as **fixed** — dynamic allocation is not supported
- Do not share resources between virtual machines via over-allocation
- If using shared storage, Fiber SAN is recommended; otherwise use local (direct-attached) SSD
- Set host power management to **"High Performance"** mode

## Disk Space Calculation

Disk space required for historical data storage depends on three factors:

- **Tag count**: Number of logged variables
- **Sampling period**: How often values are recorded (seconds)
- **Retention period**: How many years of historical data to keep

### Calculation Formula

Based on field measurements, numeric SCADA data consumes approximately **~8 Bytes per point** (including index, WAL and metadata).

```
Daily Bytes = Tag Count × (86400 / Period) × 8.08 Bytes
```

- `86400` = seconds in a day
- `Period` = sampling period (seconds)
- `8.08` = measured average bytes per point (InfluxDB 1.8)

### Scenario Table

The following table shows disk requirements for **2 years** of retention at various tag counts and sampling periods:

#### 1,000 Tags

| Period | Daily | Annual | 2 Years |
|--------|-------|--------|---------|
| **1 sec** | 699 MB | 249 GB | 498 GB |
| **5 sec** | 140 MB | 50 GB | 100 GB |
| **10 sec** | 70 MB | 25 GB | 50 GB |
| **30 sec** | 23 MB | 8 GB | 17 GB |
| **60 sec** | 12 MB | 4 GB | 8 GB |

#### 10,000 Tags

| Period | Daily | Annual | 2 Years |
|--------|-------|--------|---------|
| **1 sec** | 6.8 GB | 2.4 TB | 4.9 TB |
| **5 sec** | 1.4 GB | 498 GB | 996 GB |
| **10 sec** | 698 MB | 249 GB | 498 GB |
| **30 sec** | 233 MB | 83 GB | 166 GB |
| **60 sec** | 116 MB | 41 GB | 83 GB |

#### 50,000 Tags

| Period | Daily | Annual | 2 Years |
|--------|-------|--------|---------|
| **1 sec** | 34 GB | 12.2 TB | 24.4 TB |
| **5 sec** | 6.8 GB | 2.4 TB | 4.9 TB |
| **10 sec** | 3.4 GB | 1.2 TB | 2.4 TB |
| **30 sec** | 1.1 GB | 415 GB | 830 GB |
| **60 sec** | 581 MB | 207 GB | 415 GB |

#### 300,000 Tags

| Period | Daily | Annual | 2 Years |
|--------|-------|--------|---------|
| **1 sec** | 205 GB | 73 TB | 146 TB |
| **5 sec** | 41 GB | 14.6 TB | 29.2 TB |
| **10 sec** | 20.5 GB | 7.3 TB | 14.6 TB |
| **30 sec** | 6.8 GB | 2.4 TB | 4.9 TB |
| **60 sec** | 3.4 GB | 1.2 TB | 2.4 TB |

### Measuring Your Own Environment

To derive the Bytes/Point coefficient from your own field measurements:

1. Measure disk size at two different times:
```bash
du -sb /var/lib/influxdb
```

2. Divide the difference by the time interval to get daily growth
3. Calculate Bytes/Point:
```
Bytes/Point = Daily Growth / (Tag Count × 86400 / Period)
```

:::note
- The values above are for **numeric (Float/Integer) heavy** SCADA data
- **String** field usage significantly increases disk consumption
- If series cardinality rises (many different tag combinations), the coefficient may increase
- **Retention policy** and **downsampling** can reduce long-term disk requirements by 70-95%
:::

### Savings with Retention Policy

Default retention periods:

| Data Type | Default Retention |
|-----------|------------------|
| Variable values | 365 days |
| Alarm history | 365 days |
| Event logs | 14 days |
| Login attempts | 365 days |

These can be adjusted via retention policy settings described in [Configuration](/docs/en/deployment/configuration/). Downsampling (e.g., 1 second → 1 minute average) can reduce archive data by up to 95%.

## Next Step

Once your system meets the requirements, proceed to [Installation](/docs/en/getting-started/installation/).
