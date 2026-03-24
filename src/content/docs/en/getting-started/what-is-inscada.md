---
title: "What is inSCADA?"
description: "Overview of the inSCADA web-based SCADA/IIoT development platform"
sidebar:
  order: 1
---

**inSCADA** is a web-based platform designed for developing SCADA, HMI and IIoT applications across all areas of industry. It has a fully RESTful architecture — every operation on the platform can be performed through the REST API. Its multi-tenant structure allows multiple workspaces (Spaces) and projects to be managed simultaneously in isolation. With multi-user access, different roles and permissions can be defined so teams can work in parallel.

All development activities — project creation, connection configuration, screen design, script development — are carried out through the web interface. Any browser can be used, and for a streamlined operator experience the **inSCADA Viewer** desktop application is also available.

## Key Differentiator: Runtime = Development

In traditional SCADA software, the development environment and runtime environment are separate: a project is developed, compiled, tested, and deployed to production.

In inSCADA, this separation doesn't exist. **Runtime and development live in the same environment.** You don't need a separate IDE to add a connection, define a variable, or design a screen — all configuration is done on the live system through a browser and takes effect immediately.

This approach:
- Enables **rapid field intervention**
- Eliminates the compile-deploy cycle
- Significantly reduces development time

## What Can You Do with inSCADA?

### SCADA / HMI

Collect live data from field devices and present operators with visual screens. SVG-based mimic screens can be imported directly from design tools like Figma. Any SVG object (text, rectangle, path, etc.) can be bound to an animation type and live data — colour changes, movement, rotation, value display and more.

### Data Collection and Communication

Supports a wide range of protocols including Modbus TCP/RTU, BACnet, KNX, OPC-UA, DNP3, IEC 60870-5-104 and REST API. Combine data from different protocols in the same project and monitor from a single point. Network redundancy manages multiple communication channels — automatic failover when a channel drops.

### Alarm and Event Management

Analog and digital alarm definitions, alarm groups, priority levels and notification mechanisms. Alarm history is recorded and included in the audit trail. Alarm states are displayed in real time on live screens.

### Scripting and Automation

Write server-side automations using the Nashorn-based ECMAScript 5 script engine. Scripts can run on a schedule (cron) or be triggered. REST API calls, data processing, reporting and external system integrations are all handled through scripts.

### Historical Data and Reporting

Variable values are logged at configurable intervals. Trend charts, table views and statistical analysis tools allow examination of historical data. Data can be exported as Excel (.xlsx) files.

### REST API and Integration

Programmatic access to all platform functions via 1100+ endpoints. Variable read/write, project management, alarm queries, script execution — all available over REST. Integration with third-party systems (ERP, MES, cloud services) is established through this API.

### AI-Powered Development

Query your inSCADA data in natural language, write scripts, analyse alarms and generate charts using the AI Assistant (desktop app) or MCP Server (Claude Desktop extension). Access platform functions through AI with 37 tools.

## Platform Architecture

Data in inSCADA is organized in a hierarchical structure:

```
Space (Workspace)
└── Project
    ├── Connection (Protocol connection)
    │   └── Device
    │       └── Frame (Data frame)
    │           └── Variable
    ├── Script (Automation)
    └── Alarm Group
        └── Alarm Definition
```

**Space** provides multi-workspace tenant isolation. **Variable** is the platform's fundamental building block — logging, scaling, alarms and animation bindings all work through variables.

## Getting Started Steps

Getting started with inSCADA can be summarised in four steps:

1. **Install** — Install inSCADA on your Windows server, access the management interface via browser
2. **Create a project** — Define a space and project, prepare your working environment
3. **Add connections** — Establish protocol connections to your field devices, define variables
4. **Start monitoring** — Design SVG screens, set alarm rules, go live

For detailed installation steps, proceed to [System Requirements](/docs/en/getting-started/system-requirements/).
