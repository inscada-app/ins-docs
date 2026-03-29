---
title: "Web Components"
description: "Zero-dependency SCADA components — live data display with a single HTML tag"
sidebar:
  order: 23
---

inSCADA Web Components is a zero-dependency component library that allows displaying live SCADA data with a single HTML tag inside Custom Menus and Faceplates.

## Why Web Components?

The traditional method for displaying variable values inside a Custom Menu is using the `fetch` API:

```javascript
// Traditional method: 15+ lines of JavaScript
async function loadValue() {
  const resp = await fetch('/api/variables/values?projectId=153&names=ActivePower_kW', {
    credentials: 'include'
  });
  const data = await resp.json();
  document.getElementById('power').textContent = data.ActivePower_kW.value.toFixed(1);
}
setInterval(loadValue, 2000);
```

The same operation with Web Components:

```html
<!-- 1 line of HTML -->
<ins-live-value project="153" variable="ActivePower_kW"
                unit="kW" decimals="1">
</ins-live-value>
```

**Advantages:**
- No need to write JavaScript
- Automatic periodic updates (polling)
- Components reading from the same project are merged into a single API call (batching)
- Automatic fading when data is not received (stale detection)
- Threshold-based color changes (threshold coloring)
- Style isolation with Shadow DOM

## Installation

Add the Web Components library to your Custom Menu HTML content:

```html
<script src="/libs/ins-components.min.js"></script>
```

## `<ins-live-value>`

Displays a variable's live value.

### Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| **project** | Number | Yes | Project ID |
| **variable** | String | Yes | Variable name |
| **unit** | String | No | Unit label (°C, kW, bar, V, A...) |
| **label** | String | No | Title label |
| **decimals** | Number | No | Number of decimal places |
| **thresholds** | String | No | Color thresholds (format: `"0:blue,30:green,60:orange,80:red"`) |
| **format** | String | No | `"raw"` — unformatted display |

### Basic Usage

```html
<!-- Value only -->
<ins-live-value project="153" variable="ActivePower_kW"></ins-live-value>

<!-- Unit and decimals -->
<ins-live-value project="153" variable="Temperature_C"
                unit="°C" decimals="1">
</ins-live-value>

<!-- With label -->
<ins-live-value project="153" variable="Voltage_V"
                unit="V" label="Voltage" decimals="1">
</ins-live-value>
```

### Threshold-Based Color Changes

Automatic color changes based on value using the `thresholds` attribute:

```html
<ins-live-value project="153" variable="Temperature_C"
                unit="°C" label="Temperature" decimals="1"
                thresholds="0:#2196F3,30:#4CAF50,60:#FF9800,80:#F44336">
</ins-live-value>
```

| Value Range | Color | Meaning |
|-------------|-------|---------|
| 0 - 29 | Blue (#2196F3) | Cold |
| 30 - 59 | Green (#4CAF50) | Normal |
| 60 - 79 | Orange (#FF9800) | Warning |
| 80+ | Red (#F44336) | Critical |

### CSS Customization

```css
ins-live-value {
  --value-color: #333;      /* Value text color */
  --label-color: #888;      /* Label text color */
  --unit-color: #888;       /* Unit text color */
  --stale-opacity: 0.4;     /* Opacity when data is not received */
}
```

## InsDataBus (Data Management)

A singleton class running in the background. If multiple `<ins-live-value>` components are reading data from the same project, it merges them into a single API call.

### Configuration

```javascript
// Change polling interval (default: 2000ms, minimum: 500ms)
InsDataBus.instance.refreshMs = 3000;

// Change space (default: "default_space")
InsDataBus.instance.space = "production";
```

### Subscription API

Components subscribe automatically, but programmatic usage is also possible:

```javascript
InsDataBus.instance.subscribe(153, 'ActivePower_kW', (value) => {
  console.log('New value:', value);
});
```

## Example: Energy Monitoring Page

A complete energy monitoring page inside a Custom Menu:

```html
<script src="/libs/ins-components.min.js"></script>

<style>
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 20px; }
  .card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; }
  ins-live-value { font-size: 32px; }
</style>

<div class="grid">
  <div class="card">
    <ins-live-value project="153" variable="ActivePower_kW"
                    unit="kW" label="Active Power" decimals="1"
                    thresholds="0:#2196F3,200:#4CAF50,500:#FF9800,800:#F44336">
    </ins-live-value>
  </div>

  <div class="card">
    <ins-live-value project="153" variable="Voltage_V"
                    unit="V" label="Voltage" decimals="1"
                    thresholds="200:#F44336,215:#FF9800,225:#4CAF50,245:#FF9800,260:#F44336">
    </ins-live-value>
  </div>

  <div class="card">
    <ins-live-value project="153" variable="Current_A"
                    unit="A" label="Current" decimals="2">
    </ins-live-value>
  </div>

  <div class="card">
    <ins-live-value project="153" variable="Frequency_Hz"
                    unit="Hz" label="Frequency" decimals="2"
                    thresholds="49:#F44336,49.5:#FF9800,49.8:#4CAF50,50.2:#FF9800,50.5:#F44336">
    </ins-live-value>
  </div>

  <div class="card">
    <ins-live-value project="153" variable="PowerFactor"
                    label="Power Factor" decimals="3"
                    thresholds="0:#F44336,0.8:#FF9800,0.9:#4CAF50">
    </ins-live-value>
  </div>

  <div class="card">
    <ins-live-value project="153" variable="Temperature_C"
                    unit="°C" label="Panel Temperature" decimals="1"
                    thresholds="0:#2196F3,30:#4CAF50,60:#FF9800,80:#F44336">
    </ins-live-value>
  </div>
</div>
```

## Stale Data Detection

If a component fails to receive data for 3 consecutive polling cycles (default: 6 seconds), it automatically fades out. This visually indicates communication interruptions.

Normal state → `opacity: 1.0`
Stale state → `opacity: 0.4` (customizable with CSS `--stale-opacity`)

## Faceplate Encapsulation (Planned)

In future versions, Faceplates will be encapsulated as Web Components:

```html
<!-- Planned usage -->
<ins-motor project="153"
           speed-var="Motor1_Speed"
           status-var="Motor1_Status"
           current-var="Motor1_Current">
</ins-motor>
```

This will allow a Faceplate to be directly embedded in Custom Menu HTML pages.
