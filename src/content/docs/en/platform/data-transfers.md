---
title: "Data Transfers"
description: "Inter-project variable data transfer and statistical calculation"
sidebar:
  order: 8
---

Data Transfer periodically transfers variable values from one project to variables in another project. It performs statistical calculations from the source variable and writes the result to the target variable.

![Data Transfers](../../../../assets/docs/dev-data-transfers.png)

## Creating a Data Transfer

**Menu:** Development → Data Transfers → New Transfer

| Field | Required | Description |
|-------|----------|-------------|
| **Name** | Yes | Transfer name |
| **Project** | Yes | Associated project |
| **Period** | Yes | Execution period (ms, min: 1000) |
| **Description** | No | Description |

## Transfer Details

Each Data Transfer contains multiple **transfer details** (rows). Each row is a source-target mapping:

| Field | Description |
|-------|-------------|
| **Source Variable** | Source variable |
| **Target Variable** | Target variable |
| **Calculation Type** | Statistical calculation type |
| **Range Type** | Time range type |
| **Threshold** | Threshold value (optional) |

### Calculation Types

| Type | Description |
|------|-------------|
| **LAST** | Last value |
| **AVG** | Average |
| **MIN** | Minimum |
| **MAX** | Maximum |
| **SUM** | Sum |
| **COUNT** | Record count |
| **DIFF** | Difference between first and last value |

### Time Range Types

| Type | Description |
|------|-------------|
| **CURRENT** | Data within the last period interval |
| **PREVIOUS** | The previous period interval |

## Use Cases

### Hourly Energy Consumption

Calculating hourly consumption from an energy meter and writing it to another variable:
- Source: `Energy_kWh` (cumulative meter)
- Target: `Hourly_Consumption`
- Calculation: DIFF (last - first = hourly consumption)
- Period: 3600000 ms (1 hour)

### Daily Average Temperature

- Source: `Temperature_C`
- Target: `DailyAvg_Temperature`
- Calculation: AVG
- Period: 86400000 ms (24 hours)

### Cross-Project Data Aggregation

Aggregating power values from multiple sites into a central project:
- Source (Project A): `Site1_Power_kW`
- Target (Central Project): `Total_Power`
- Calculation: LAST

## Management via Script

```javascript
// Start a transfer job
ins.scheduleDataTransfer("hourly_energy_calc");

// Cancel a transfer job
ins.cancelDataTransfer("hourly_energy_calc");
```

Detailed API: [Data Transfer API →](/docs/tr/platform/scripts/datatransfer-api/)
