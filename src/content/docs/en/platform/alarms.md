---
title: "Alarm Management"
description: "Alarm groups, alarm definitions, alarm types and alarm monitoring"
sidebar:
  order: 5
---

The alarm system detects, records, and notifies abnormal conditions in variable values. Alarms are organized in groups, and each group is bound to a project.

![Alarm Groups](../../../../assets/docs/dev-alarm-groups.png)

## Alarm Group

An alarm group is a container that organizes alarm definitions and sets common behavior parameters.

### Creating an Alarm Group

**Menu:** Runtime → Alarms → Alarm Groups → New Group

| Field | Required | Description |
|-------|----------|-------------|
| **Name** | Yes | Group name |
| **Scan Time (ms)** | Yes | Alarm check period (min: 100ms) |
| **Priority** | Yes | Priority level (1-255) |
| **Description** | No | Description |

### Alarm Group Advanced Settings

| Field | Description |
|-------|-------------|
| **On Script** | Script to run when an alarm fires |
| **Off Script** | Script to run when an alarm clears |
| **Ack Script** | Script to run when an alarm is acknowledged |
| **On (No Ack) Color** | Fired, not acknowledged color |
| **On (Ack) Color** | Fired, acknowledged color |
| **Off (No Ack) Color** | Cleared, not acknowledged color |
| **Off (Ack) Color** | Cleared, acknowledged color |
| **Hidden on Monitor** | Hide on alarm monitor |

### Printer Integration

Alarm events can be sent directly to a network printer:

| Field | Description |
|-------|-------------|
| **Printer IP** | Printer IP address |
| **Printer Port** | Printer port number |
| **Print When On** | Print when fired |
| **Print When Off** | Print when cleared |
| **Print When Ack** | Print when acknowledged |

---

## Alarm Types

### Analog Alarm

Monitors threshold values of numeric variables.

| Threshold | Description | Example |
|-----------|-------------|---------|
| **High-High** | Very high (critical) | Temperature > 90°C |
| **High** | High (warning) | Temperature > 70°C |
| **Low** | Low (warning) | Pressure < 2 bar |
| **Low-Low** | Very low (critical) | Pressure < 1 bar |

A separate alarm definition is created for each threshold. Hysteresis (deadband) value prevents alarm chattering.

### Digital Alarm

Monitors state changes of Boolean variables.

| Condition | Description |
|-----------|-------------|
| **ON = Alarm** | Alarm fires when value is `true` |
| **OFF = Normal** | Alarm clears when value is `false` |

Examples: Motor fault signal, door open contact, emergency stop button.

### Custom Alarm

Define custom alarm conditions using JavaScript expressions.

```javascript
// Alarm condition dependent on multiple variables
var power = ins.getVariableValue("ActivePower_kW").value;
var temp = ins.getVariableValue("Temperature_C").value;
return power > 500 && temp > 70; // alarm if both are high
```

---

## Alarm Lifecycle

```
Normal → Fired → Acknowledged → Off
```

### State Transitions

| Transition | Triggered By | Description |
|------------|-------------|-------------|
| Normal → **Fired** | System | Alarm condition is met |
| Fired → **Acknowledged** | Operator | Operator acknowledged the alarm |
| Fired/Ack → **Off** | System | Alarm condition is no longer met |
| Fired → **Force Off** | Operator | Alarm is force-cleared |

### Alarm Color Codes

| State | Default | Meaning |
|-------|---------|---------|
| Fired + No Ack | Red flashing | Attention required |
| Fired + Ack | Red solid | Aware, still active |
| Off + No Ack | Yellow | Cleared but not seen |
| Off + Ack | Normal | Completed |

---

## Alarm Monitoring

### Alarm Monitor

**Menu:** Runtime → Alarm Tracking → Alarm Monitor

![Alarm Monitor](../../../../assets/docs/rt-alarm-monitor.png)

Displays active alarms in real time. From this screen, operators can:
- View alarms
- Acknowledge alarms
- Force-clear alarms (Force Off)

### Alarm Tracking

**Menu:** Visualization → Alarm Tracking

Queries alarm history by date range. Each alarm record contains:

| Field | Description |
|-------|-------------|
| Alarm name | Which alarm fired |
| Fire time | When it fired |
| Off time | When it cleared |
| Acknowledged by | Who acknowledged it |
| Duration | How long it lasted |
| Value | Value at the time of firing |

---

## Managing Alarms with Scripts

```javascript
// Last fired alarms
var alarms = ins.getLastFiredAlarms(0, 10);
// → [] (empty array if no active alarms)

// Alarm history by date range
var end = ins.now();
var start = ins.getDate(end.getTime() - 86400000);
var history = ins.getLastFiredAlarmsByDate(start, end, true, 100);

// Deactivate alarm group (maintenance mode)
ins.deactivateAlarmGroup("Temperature_Alarms");

// Reactivate after maintenance
ins.activateAlarmGroup("Temperature_Alarms");
```

Detailed API: [Alarm API →](/docs/tr/platform/scripts/alarm-api/) | [REST API →](/docs/tr/api/alarms/)
