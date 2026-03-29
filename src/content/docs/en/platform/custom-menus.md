---
title: "Custom Menus"
description: "Custom HTML menus — role-based interfaces, iframe integration, and Web Components"
sidebar:
  order: 22
---

Custom Menu is a custom menu page defined at the space level. You can create fully customized interfaces using HTML, CSS, and JavaScript. Different menus can be assigned to different user roles.

## Creating a Custom Menu

**Menu:** Development → Custom Menus → Dev Custom Menus

| Field | Required | Description |
|-------|----------|-------------|
| **Name** | Yes | Menu name |
| **Icon** | No | FontAwesome icon class (e.g., `fas fa-chart-bar`) |
| **Content Type** | Yes | Content type |
| **Content** | Yes | HTML code or URL |
| **Target** | No | Target frame |
| **Position** | No | Menu position |
| **Menu Order** | No | Sort order |
| **Parent** | No | Parent menu (for creating sub-menus) |

## Content Types

| Type | Description | Usage |
|------|-------------|-------|
| **HTML** | Inline HTML code | Custom dashboard, form, report page |
| **URL** | External URL (iframe) | Grafana, Kibana, external web application |

## Menu Hierarchy

Custom Menus can be nested up to 3 levels deep:

```
Custom Menu (Level 1)
├── Sub Menu (Level 2)
│   ├── Sub-Sub Menu (Level 3)
│   └── Sub-Sub Menu (Level 3)
└── Sub Menu (Level 2)
```

## Custom Pages with HTML Content

### Displaying Variable Values (Fetch API)

```html
<div id="power-display" style="font-size: 48px; text-align: center; padding: 40px;">
  Loading...
</div>

<script>
async function loadValue() {
  const resp = await fetch('/api/variables/values?projectId=153&names=ActivePower_kW', {
    credentials: 'include',
    headers: { 'X-Space': 'claude' }
  });
  const data = await resp.json();
  const power = data.ActivePower_kW.value;
  document.getElementById('power-display').innerHTML =
    '<b>' + power.toFixed(1) + '</b> kW';
}
loadValue();
setInterval(loadValue, 5000);
</script>
```

### Web Components Alternative

The same operation can be written much more concisely using inSCADA Web Components instead of fetch:

```html
<!-- Display variable value in a single line -->
<ins-value variable="ActivePower_kW" project="Energy Monitoring Demo"
           space="claude" suffix=" kW" decimals="1"
           style="font-size: 48px; font-weight: bold;">
</ins-value>
```

Web Components advantages:
- Automatic WebSocket connection — no periodic fetch required
- Real-time updates
- Declarative syntax — no need to write JavaScript
- Multiple components work independently on the same page

Detailed information: [Web Components →](/docs/tr/platform/web-components/)

### Multi-Variable Table

```html
<style>
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #ddd; padding: 12px; text-align: left; }
  th { background: #1CA1C1; color: white; }
</style>

<table>
  <tr><th>Variable</th><th>Value</th><th>Unit</th></tr>
  <tr>
    <td>Active Power</td>
    <td><ins-value variable="ActivePower_kW" decimals="2"></ins-value></td>
    <td>kW</td>
  </tr>
  <tr>
    <td>Voltage</td>
    <td><ins-value variable="Voltage_V" decimals="1"></ins-value></td>
    <td>V</td>
  </tr>
  <tr>
    <td>Current</td>
    <td><ins-value variable="Current_A" decimals="2"></ins-value></td>
    <td>A</td>
  </tr>
</table>
```

### External URL Integration

Embed external web applications as an iframe using Content Type = URL:

```
https://grafana.company.com/d/energy-dashboard?orgId=1&kiosk
```

## Role-Based Menu Assignment

Custom Menus are defined at the space level, then assigned to users through roles:

1. **Create the Custom Menu** — Development → Custom Menus
2. **Assign the menu to a role** — User Menu → Roles → Add the custom menu to the Role Menus section
3. **Assign the role to a user** — Assign the relevant role to the user

This way:
- **Operator:** Sees only monitoring pages
- **Engineer:** Sees configuration + monitoring pages
- **Administrator:** Sees report and analysis pages
