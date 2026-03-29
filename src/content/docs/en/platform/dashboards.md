---
title: "Dashboards"
description: "Space-level dashboards — cross-project data aggregation and widget structure"
sidebar:
  order: 24
---

Dashboard is a panel system defined at the space level. It allows combining data from different projects on a single screen. It consists of freely positionable Board (widget) cards organized under Board Groups.

## Dashboard Structure

```
Dashboard (Space Level)
├── Board Group: "Energy Summary"
│   ├── Board: Active Power Gauge (x:0, y:0, 300x200)
│   ├── Board: Voltage Gauge (x:320, y:0, 300x200)
│   └── Board: Daily Consumption Chart (x:0, y:220, 640x300)
│
└── Board Group: "Building Management"
    ├── Board: HVAC Status
    └── Board: Indoor Temperature
```

## Board Group

A Board Group is the page/tab unit within a dashboard.

**Menu:** Dashboards (top of sidebar)

| Field | Required | Description |
|-------|----------|-------------|
| **Name** | Yes | Group name |
| **Color** | No | Tab color |
| **Rank** | No | Sort order |

## Board (Widget)

Each Board is a freely positionable card within a Board Group.

| Field | Required | Description |
|-------|----------|-------------|
| **Type** | Yes | Widget type |
| **Config** | Yes | Widget configuration (JSON) |
| **X / Y** | No | Position (pixels) |
| **Width / Height** | No | Size (pixels) |
| **Header** | No | Show header |

### Board Types

Widget types that can be added to a Dashboard are configuration-based. Widget settings are written in JSON format in the Config field.

## Space-Level Advantage

Since Dashboards are defined at the space level:
- Variables from different projects can be displayed on the same panel
- All sites can be monitored from a single screen (e.g., total production from 10 different solar power plants)
- Project-independent comparisons can be made

## Custom Menu vs Dashboard

| Feature | Dashboard | Custom Menu |
|---------|-----------|-------------|
| **Level** | Space | Space |
| **Design** | Drag-and-drop widgets | HTML/CSS/JS code |
| **Flexibility** | Configuration-based | Full control |
| **Usage** | Quick dashboard creation | Custom interface development |

:::tip
Use Dashboards for a quick overview panel. For a fully customized interface, prefer Custom Menu + Web Components.
:::
