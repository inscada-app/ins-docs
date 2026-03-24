---
title: "What is inSCADA?"
description: "Overview of the inSCADA web-based SCADA/IIoT development platform"
sidebar:
  order: 1
---

**inSCADA** is a web-based platform designed for developing SCADA, HMI and IIoT applications across all areas of industry. It has a fully RESTful architecture — every operation on the platform can be performed through the REST API. Its multi-tenant structure allows multiple workspaces (Spaces) and projects to be managed simultaneously in isolation. With multi-user access, different roles and permissions can be defined so teams can work in parallel.

Project creation, connection configuration, alarm definitions, trend settings, notification rules and more — 95% of the development and configuration activities needed in the SCADA domain are carried out through the web interface. Any browser can be used, and for a streamlined user experience the **inSCADA Viewer** desktop application is also available.

### Screen Design: Two Different Approaches

inSCADA offers two different methods for developing user interfaces:

**Traditional Method — SVG Animation:** The classic approach of binding live data and animations to visual objects, as found in traditional SCADA software. inSCADA delivers this through an SVG-based solution. Outputs from any SVG editor (Figma, Illustrator, Inkscape, etc.) can be imported directly into the platform. Any object within the SVG (text, rectangle, path, circle, etc.) can be assigned an animation type — colour change, movement, rotation, value display, opacity and more.

**Modern Method — HTML/JS/CSS Application Development:** Using the Custom Menu feature, you can develop fully custom interfaces with HTML, JavaScript and CSS. This method allows you to create dashboards, control panels or reporting screens with unlimited flexibility using standard web technologies.

Both methods can be used together in the same project — you can create **hybrid interfaces**. For example, an SVG mimic screen can sit alongside an HTML-based trend chart or control panel.

## Key Differentiator: Runtime = Development

In traditional SCADA software, the development environment and runtime environment are separate: a project is developed, compiled, tested, and deployed to production.

In inSCADA, this separation doesn't exist. **Runtime and development live in the same environment.** You don't need a separate IDE to add a connection, define a variable, or design a screen — all configuration is done on the live system through a browser and takes effect immediately.

This approach:
- Enables **rapid field intervention**
- Eliminates the compile-deploy cycle
- Significantly reduces development time

## What Can You Do with inSCADA?

### SCADA / HMI

Collect live data from field devices and present users with visual screens. Using the SVG and HTML/JS/CSS methods described above, design interfaces tailored to your facility. Live values, trend charts, alarm indicators and control buttons can all be combined in a single screen.

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

### Data Hierarchy

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

### Three-Layer Data Architecture

inSCADA stores different types of data in different database technologies. This separation is critical for performance and scalability:

| Layer | Purpose | Stored Data |
|-------|---------|-------------|
| **Relational Database (RDB)** | Configuration and metadata | Project, connection, device, variable definitions, users, roles, alarm rules, script definitions, licence information |
| **Time Series Database (TSDB)** | Historical measurement data (Historian) | Variable values, timestamps, quality flags. Configurable retention period, downsampling for ageing |
| **In-Memory Cache** | Real-time access | Instant variable values (<1ms access), session information, rate-limit counters |

### Data Flow Architecture

A measurement value coming from a field device passes through these stages in the platform:

```
Field Device (Sensor/Transmitter)
        │
        │ Protocol (Modbus, OPC UA, IEC 104...)
        ▼
┌─────────────────────────────┐
│   Protocol Driver            │
│   (Connector)               │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│   Value Processing Pipeline  │
│                              │
│   1. Scaling                 │
│      (raw → engineering)     │
│   2. Time adjustment         │
│   3. Expression evaluation   │
│      (JavaScript expression) │
│   4. Pulse generation        │
└────────────┬────────────────┘
             │
     ┌───────┴───────┐
     ▼               ▼
 ┌────────┐    ┌──────────┐
 │ Cache  │    │ Historian │
 │(instant│    │ (based on │
 │ value) │    │  logging  │
 │        │    │  rules)   │
 │ → Web  │    └──────────┘
 │  push  │
 └────────┘
```

### High Availability

inSCADA supports redundant operation with an Active-Active cluster architecture. Two or more nodes run simultaneously; when the leader node fails, the standby node takes over automatically. Configuration changes, files and historical data are synchronised between nodes.

## Getting Started Steps

Getting started with inSCADA can be summarised in four steps:

1. **Install** — Install inSCADA on your Windows server, access the management interface via browser
2. **Create a project** — Define a space and project, prepare your working environment
3. **Add connections** — Establish protocol connections to your field devices, define variables
4. **Start monitoring** — Design SVG screens, set alarm rules, go live

For detailed installation steps, proceed to [System Requirements](/docs/en/getting-started/system-requirements/).
