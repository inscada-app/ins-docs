---
title: "Trend API"
description: "Trend definitions, tags, and dynamic tag-scale updates"
sidebar:
  order: 4
---

Trend API lists the trend definitions and their tags (each tag = one variable / line on the trend) and lets scripts change a tag's Y-axis scale at runtime.

## `ins.getTrends()`

Returns every trend definition in the project — `Collection<TrendResponseDto>`.

```javascript
var trends = ins.getTrends();
trends.forEach(function(t) {
    ins.consoleLog(t.getName() + " period=" + t.getPeriod() + "ms");
});
```

### `TrendResponseDto` Fields

| Method | Type | Description |
| --- | --- | --- |
| `getName()` | `String` | Trend name |
| `getDsc()` | `String` | Description |
| `getPeriod()` | `Integer` | Sampling period (ms) |
| `getOrder()` | `Integer` | Order in the UI list |
| `getConfigs()` | `String` | Serialized display configuration (JSON string) |
| `getProjectId()` | `String` | Project ID |

## `ins.getTrendTags(trendId)`

Returns every tag attached to the given trend — `Collection<TrendTagResponseDto>`.

```javascript
// Look up the trend id by name
var trends = ins.getTrends();
var target = null;
trends.forEach(function(t) {
    if (t.getName() == "Power Trend") target = t;
});

if (target) {
    var tags = ins.getTrendTags(target.getBaseId());
    tags.forEach(function(tag) {
        ins.consoleLog(tag.getVariableName() + " [" + tag.getMinScale() + ", " + tag.getMaxScale() + "]");
    });
}
```

### `TrendTagResponseDto` Fields

| Method | Type | Description |
| --- | --- | --- |
| `getName()` | `String` | Tag name |
| `getDsc()` | `String` | Description |
| `getStatus()` | `Boolean` | Whether the tag is active |
| `getOrder()` | `Integer` | Order inside the trend |
| `getVariableName()` / `getVariableUnit()` | `String` | Bound variable name and unit |
| `getVariableId()` / `getTrendId()` | `String` | Reference IDs |
| `getMinScale()` / `getMaxScale()` | `Double` | Y-axis lower/upper bounds |
| `getColor()` | `String` | Line color (hex) |
| `getThickness()` | `Integer` | Line thickness |
| `getGridThickness()` | `Double` | Grid thickness |
| `getHideValueAxe()` | `Boolean` | Whether to hide the value axis |

## `ins.setTrendTagMinMaxScale(trendName, tagName, minScale, maxScale)`

Sets a trend tag's Y-axis bounds. The trend uses the new range from the next render onward.

```javascript
ins.setTrendTagMinMaxScale("Power Trend", "ActivePower_kW", 0.0, 500.0);
```

## Example: Auto-scale From the Last Hour

Dynamically adjust the trend's Y-axis range based on the last hour of real data, with 10 % margin.

```javascript
function main() {
    var end = ins.now();
    var start = ins.getDate(end.getTime() - 3600000);

    var stats = ins.getLoggedVariableValueStats(["ActivePower_kW"], start, end);
    var s = stats.ActivePower_kW;
    if (!s) return;

    var margin = (s.getMaxValue() - s.getMinValue()) * 0.1;
    ins.setTrendTagMinMaxScale(
        "Power Trend", "ActivePower_kW",
        s.getMinValue() - margin,
        s.getMaxValue() + margin
    );
}
main();
```
