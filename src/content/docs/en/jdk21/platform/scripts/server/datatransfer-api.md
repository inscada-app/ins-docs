---
title: "Data Transfer API"
description: "Schedule, cancel and query file-based (CSV, XML, …) data-transfer jobs"
sidebar:
  order: 13
---

Data Transfer API lets a script start, stop and query file-based data-transfer jobs defined in **Development → Data Transfers**. A data transfer typically writes variable data out to a CSV / XML file or a remote location.

:::note
`scheduleDataTransfer()` only schedules an **existing** data-transfer definition — it does not create one. If the definition does not exist, the call throws.
:::

## `ins.scheduleDataTransfer(name)` / `(projectName, name)`

Adds the named data transfer to the scheduler — it runs at the period defined in the transfer. `projectName` defaults to the current project.

```javascript
ins.scheduleDataTransfer("export_hourly_data");
ins.scheduleDataTransfer("other_project", "export_hourly_data");
```

## `ins.cancelDataTransfer(name)` / `(projectName, name)`

Removes the transfer from the scheduler — remaining triggers are cancelled; a transfer currently running is **not** interrupted and runs to completion.

```javascript
ins.cancelDataTransfer("export_hourly_data");
```

## `ins.getDataTransferStatus(name)` / `(projectName, name)`

Returns a `DataTransferStatus` enum — two values:

| Value | Meaning |
| --- | --- |
| `"Scheduled"` | Attached to the scheduler |
| `"Not Scheduled"` | Not attached |

```javascript
if (ins.getDataTransferStatus("export_hourly_data") == "Not Scheduled") {
    ins.scheduleDataTransfer("export_hourly_data");
}
```

## Example: End-of-Shift Export

```javascript
function main() {
    var h = ins.now().getHours();
    if (h !== 0 && h !== 8 && h !== 16) return;

    if (ins.getDataTransferStatus("shift_export") == "Not Scheduled") {
        ins.scheduleDataTransfer("shift_export");
        ins.writeLog("info", "DataTransfer", "End-of-shift transfer scheduled");
    }
}
main();
```
