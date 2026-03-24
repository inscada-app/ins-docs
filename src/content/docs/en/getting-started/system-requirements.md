---
title: "System Requirements"
description: "Hardware, software and network requirements for the inSCADA platform"
sidebar:
  order: 2
---

This section covers the hardware, software and network infrastructure requirements for installing and running the inSCADA platform.

:::caution[Important]
inSCADA should be installed on dedicated servers along with its platform components (RDB, TSDB, In-Memory Cache). Do not run other resource-intensive applications on the same server.
:::

## Server Hardware Requirements

The following table shows minimum server hardware requirements by tag (variable) count. Use the higher of the tag or device count as your basis.

| System Scale | Tag Count | CPU (Cores) | RAM | Disk (SSD) |
|-------------|-----------|-------------|-----|------------|
| **Small** | < 1,000 | 4 | 8 GB | 128 GB |
| **Medium** | 1,000 – 5,000 | 4 | 16 GB | 256 GB |
| **Large** | 5,000 – 10,000 | 8 | 16 GB | 512 GB |
| **Enterprise** | 10,000 – 50,000 | 8 | 32 GB | 1 TB |
| **Enterprise+** | 50,000+ | 16 | 64 GB | 2 TB+ |

:::note
- Listed values are minimum requirements. We recommend doubling the RAM values.
- In a cluster setup, hardware should be calculated separately for each node.
- Disk space may increase depending on historical data retention period and logging frequency.
:::

### Client Requirements

Since inSCADA is web-based, no client-side installation is required. Any modern browser is sufficient.

| Component | Minimum |
|-----------|---------|
| **Browser** | Chrome 90+, Edge 90+, Firefox 90+ |
| **Screen Resolution** | 1920 × 1080 |
| **Network** | HTTPS access to server |

Additional requirements for the **inSCADA Viewer** desktop application:

| Component | Minimum |
|-----------|---------|
| **Operating System** | Windows 10/11 (64-bit) |
| **RAM** | 4 GB |
| **Disk** | 500 MB |

## Supported Operating Systems

The inSCADA server runs on the following operating systems:

### Windows

| Operating System | Server | Client (Viewer) |
|-----------------|--------|-----------------|
| Windows Server 2022 | ✓ | — |
| Windows Server 2019 | ✓ | — |
| Windows Server 2016 | ✓ | — |
| Windows 11 (64-bit) | ✓ | ✓ |
| Windows 10 (64-bit) | ✓ | ✓ |

### Linux

| Distribution | Server |
|-------------|--------|
| Ubuntu 22.04 LTS / 24.04 LTS | ✓ |
| Red Hat Enterprise Linux 8 / 9 | ✓ |
| CentOS Stream 8 / 9 | ✓ |
| Debian 11 / 12 | ✓ |

:::note
No graphical interface is required on Linux. inSCADA runs as a service (systemd).
:::

## Software Dependencies

inSCADA works with the following components. These are either included in the installation package or installed separately:

| Component | Purpose | Included? |
|-----------|---------|-----------|
| **Java Runtime (JDK)** | Platform runtime | Included |
| **Relational Database (RDB)** | Configuration and metadata | Separate install |
| **Time Series Database (TSDB)** | Historical measurement data | Separate install |
| **In-Memory Cache** | Real-time data access | Separate install |

:::tip
For small and medium systems, all components can be installed on a single server. For large and enterprise systems, distributing databases across separate servers is recommended.
:::

## Network Requirements

### Bandwidth

| Usage | Minimum |
|-------|---------|
| Server – Field Devices | 100 Mbps Ethernet |
| Server – Clients | 100 Mbps (1 Gbps recommended) |
| Server – Server (Cluster) | 1 Gbps |
| Serial communication | 19,200 bps minimum baud rate |

### Port Requirements

| Port | Service | Direction |
|------|---------|-----------|
| 8082 | inSCADA Web Interface (HTTPS) | Inbound |
| 8083 | Script Sandbox (HTTPS) | Internal |
| 5432 | Relational Database | Internal |
| 8086 | Time Series Database | Internal |
| 6379 | In-Memory Cache | Internal |
| 7800 | Cluster Communication | Internal (inter-node) |
| 5672 | Message Queue (Cluster) | Internal (inter-node) |
| 502 | Modbus TCP | Outbound |
| 2404 | IEC 60870-5-104 | Outbound/Inbound |
| 102 | IEC 61850 MMS | Outbound |
| 4840 | OPC UA | Outbound/Inbound |
| 20000 | DNP3 | Outbound/Inbound |

:::note
When configuring firewall rules, only open the required ports. Ports marked as internal should only be accessible within the server or between cluster nodes.
:::

## Virtualisation

inSCADA is supported on the following virtualisation platforms:

| Platform | Server | Client |
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

Disk space required for historical data storage depends on:

- **Tag count**: Number of logged variables
- **Logging frequency**: How often values are recorded
- **Retention period**: How many years of historical data to keep

:::tip
For detailed disk calculations, contact the inSCADA technical team. As a general rule: **1,000 tags × 10-second logging × 1 year ≈ 50 GB** TSDB space.
:::

## Next Step

Once your system meets the requirements, proceed to [Installation](/docs/en/getting-started/installation/).
