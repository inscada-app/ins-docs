---
title: "What is inSCADA?"
description: "Overview of the inSCADA web-based SCADA/IIoT development platform"
sidebar:
  order: 1
---

**inSCADA** is a web-based SCADA/IIoT platform built for monitoring, controlling and collecting data from industrial facilities. Built on Java (JDK 11), it is accessible via any browser from the moment of installation — no client software required.

## Key Differentiator: Runtime = Development

In traditional SCADA software, the development environment and runtime environment are separate: a project is developed, compiled, tested, and deployed to production.

In inSCADA, this separation doesn't exist. **Runtime and development live in the same environment.** You don't need a separate IDE to add a connection, define a variable, or design a screen — all configuration is done on the live system through a browser and takes effect immediately.

This approach:
- Enables **rapid field intervention**
- Eliminates the compile-deploy cycle
- Significantly reduces development time

## Key Capabilities

| Capability | Description |
|-----------|-------------|
| **Multi-Protocol** | Modbus TCP/RTU, BACnet, KNX, OPC-UA, DNP3, IEC 104, REST and more |
| **SVG Animation** | Import SVGs from Figma or any vector editor, bind live data to objects |
| **Script Engine** | Write, schedule and run automation scripts with Nashorn-based ECMAScript 5 |
| **REST API** | Programmatic access to all platform functions via 1100+ endpoints |
| **Alarm Management** | Analog/digital alarm definition, grouping, notifications and history analysis |
| **Web Access** | No installation required — access from any device via browser |
| **AI Tools** | Natural language querying and development with AI Assistant and MCP Server |

## Platform Architecture

Data in inSCADA is organized in a hierarchical structure:

```
Space (Workspace)
└── Project
    ├── Connection (Protocol connection)
    │   └── Device
    │       └── Frame (Data frame)
    │           └── Variable (Fundamental data point)
    ├── Script (Automation script)
    └── Alarm Group
        └── Alarm Definition
```

- **Space**: Multi-workspace tenant isolation
- **Variable**: The platform's building block — logging, scaling, alarms and animation bindings all work through variables
- **Script**: Server-side JavaScript automations — scheduled or triggered
- **Connection**: Each represents a different protocol and field device

## Next Step

To install the platform and create your first project, proceed to [Installation](/docs/en/getting-started/installation/).
