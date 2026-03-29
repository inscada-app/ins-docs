---
title: "Faceplate"
description: "Reusable SVG components — standard SCADA symbols such as motors, valves, and pumps"
sidebar:
  order: 21
---

A Faceplate is a reusable SVG component. You can design frequently used SCADA symbols such as motors, valves, pumps, and tanks once and use them across multiple animation screens.

## Animation vs Faceplate

| Feature | Animation | Faceplate |
|---------|-----------|-----------|
| **Level** | Project | Project |
| **Usage** | Full SCADA screen | Reusable component |
| **SVG Content** | Full-screen SVG | Small component SVG |
| **Binding** | Animation Elements | Faceplate Elements + Placeholders |
| **Placement** | Standalone screen | Embedded within an Animation |

## Creating a Faceplate

**Menu:** Development → Animations → Faceplate Dev

| Field | Required | Description |
|-------|----------|-------------|
| **Name** | Yes | Faceplate name |
| **SVG Content** | Yes | SVG source code |
| **Color** | No | Theme color |
| **Description** | No | Description |

## Faceplate Structure

```
Faceplate: "Motor_Standard"
├── SVG Content (motor symbol SVG)
├── Faceplate Elements (binding definitions)
│   ├── "status_indicator" → color binding
│   ├── "speed_text" → text binding
│   └── "current_bar" → scale binding
└── Faceplate Placeholders (parameter definitions)
    ├── {motor_name} → "Motor 1"
    ├── {speed_var} → "Motor1_Speed_RPM"
    └── {current_var} → "Motor1_Current_A"
```

## Placeholder System

Placeholders are parameters that make a faceplate reusable for different devices.

### Defining Placeholders

| Field | Description |
|-------|-------------|
| **Name** | Placeholder name (e.g., `motor_name`) |
| **Default Value** | Default value |

### Usage Scenario

A factory has 20 motors. All will be displayed with the same symbol:

1. **Design once:** Create the `Motor_Standard` faceplate
2. **Define placeholders:** `{motor_name}`, `{speed_var}`, `{status_var}`
3. **Place in Animation:** Add the faceplate for each motor and fill in the placeholder values

```
Motor 1: {motor_name}="Motor 1", {speed_var}="M1_Speed", {status_var}="M1_Status"
Motor 2: {motor_name}="Motor 2", {speed_var}="M2_Speed", {status_var}="M2_Status"
...
Motor 20: {motor_name}="Motor 20", {speed_var}="M20_Speed", {status_var}="M20_Status"
```

Instead of designing 20 separate symbols: 1 faceplate + 20 placeholder sets.

## Faceplate Elements

A Faceplate Element works with the same logic as an Animation Element — it binds an SVG element to a variable:

| Binding Type | Description |
|-------------|-------------|
| **Text** | Text update (RPM, °C, kW display) |
| **Color** | Status color (running=green, fault=red) |
| **Visibility** | Conditional show/hide |
| **Rotation** | Rotation (valve angle, gauge needle) |

## Example: Motor Faceplate SVG

```xml
<svg viewBox="0 0 120 100">
  <!-- Motor body -->
  <rect id="motor_body" x="10" y="20" width="100" height="60"
        rx="5" fill="#dddddd" stroke="#666"/>

  <!-- Status indicator -->
  <circle id="status_led" cx="95" cy="35" r="8" fill="#cccccc"/>

  <!-- Motor name -->
  <text id="motor_label" x="60" y="15" text-anchor="middle"
        font-size="12">{motor_name}</text>

  <!-- Speed value -->
  <text id="speed_display" x="60" y="55" text-anchor="middle"
        font-size="16" font-weight="bold">-- RPM</text>

  <!-- Current bar -->
  <rect id="current_bar" x="15" y="70" width="0" height="5"
        fill="#3498db"/>
</svg>
```

Faceplate Elements:
- `status_led` → `{status_var}` → Color (true=green, false=red)
- `speed_display` → `{speed_var}` → Text (value + " RPM")
- `current_bar` → `{current_var}` → Scale (0-100A → 0-90px width)

## Encapsulation with Web Components

In the future, Faceplates can be encapsulated as **Web Components**. This allows:
- A faceplate to be used as a custom HTML tag like `<ins-motor>`
- Direct embedding in Custom Menu HTML pages
- Style isolation through Shadow DOM

Detailed information: [Web Components →](/docs/tr/platform/web-components/)
