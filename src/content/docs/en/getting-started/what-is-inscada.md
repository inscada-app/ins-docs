---
title: "What is inSCADA?"
description: "Overview of the inSCADA web-based SCADA/IIoT development platform"
sidebar:
  order: 1
---

**inSCADA** is a web-based platform designed for developing SCADA, HMI and IIoT applications across all areas of industry. Project creation, connection configuration, alarm definitions, trend settings, notification rules and more — 95% of the development and configuration activities needed in the SCADA domain are carried out through the web interface. Any browser can be used, and for a streamlined user experience the **inSCADA Viewer** desktop application is also available.

It has a fully RESTful architecture — every operation on the platform can be performed through the REST API. Its multi-tenant structure allows multiple workspaces (Spaces) and projects to be managed simultaneously in isolation. With multi-user access, different roles and permissions can be defined so teams can work in parallel.

## Key Differentiator: Runtime = Development

In traditional SCADA software, the development environment and runtime environment are separate: a project is developed, compiled, tested, and deployed to production.

In inSCADA, this separation doesn't exist. **Runtime and development live in the same environment.** You don't need a separate IDE to add a connection, define a variable, or design a screen — all configuration is done on the live system through a browser and takes effect immediately.

This approach:
- Enables **rapid field intervention**
- Eliminates the compile-deploy cycle
- Significantly reduces development time

## What Can You Do with inSCADA?

### SCADA / HMI

Collect live data from field devices and present users with visual screens. inSCADA offers two different methods for developing interfaces:

**Traditional Method — SVG Animation:** The classic approach of binding live data and animations to visual objects, as found in traditional SCADA software. inSCADA delivers this through an SVG-based solution. Outputs from any SVG editor (Figma, Illustrator, Inkscape, etc.) can be imported directly into the platform. Any object within the SVG can be assigned an animation type — colour change, movement, rotation, value display, opacity and more.

**Modern Method — HTML/JS/CSS Application Development:** Using the Custom Menu feature, you can develop fully custom interfaces with HTML, JavaScript and CSS. Dashboards, control panels or reporting screens are built using standard web technologies.

Both methods can be used together in the same project — you can create **hybrid interfaces**. For example, an SVG mimic screen can sit alongside an HTML-based trend chart or control panel.

### Data Collection and Communication

Supports a wide range of protocols including Modbus TCP/RTU/UDP, OPC UA, OPC DA, IEC 61850, IEC 60870-5-104, DNP3, Siemens S7, MQTT, EtherNet/IP and Fatek. Combine data from different protocols in the same project and monitor from a single point. Network redundancy manages multiple communication channels — automatic failover when a channel drops. Additional protocols such as BACnet and KNX can be integrated through gateway applications.

### Alarm and Event Management

Analog and digital alarm definitions, alarm groups, priority levels and notification mechanisms. Alarm history is recorded and included in the audit trail. Alarm states are displayed in real time on live screens.

### Scripting and Automation

Write server-side automations using the JavaScript-based script engine. Scripts can run on a schedule (cron) or be triggered. REST API calls, data processing, reporting and external system integrations are all handled through scripts.

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

The platform uses a three-layer data architecture: a relational database (RDB) for configuration data, a time series database (TSDB) for historical measurements, and an in-memory cache for real-time access. It supports redundant operation with an Active-Active cluster architecture.

For detailed architecture information, see [Platform Architecture](/docs/en/platform/architecture/).

## Getting Started Steps

1. **Install and log in** — Install inSCADA on your machine. Log in to the platform via browser or inSCADA Viewer.
2. **Create your first project** — Create your first project in the default `default_space` workspace.
3. **Set up the data structure** — Define a Connection, Device, Frame (data block) and Variables in your project.
4. **Start communication** — Start your connection from the Runtime Control Panel and verify live data flow.
5. **Develop your application** — Design SVG animation screens or HTML interfaces, create alarm groups and alarm rules, set up trends and expand your application.

For detailed installation steps, proceed to [System Requirements](/docs/en/getting-started/system-requirements/).
