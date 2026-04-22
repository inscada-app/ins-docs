---
title: "Project API"
description: "Query project info and update a project's GIS location"
sidebar:
  order: 9
---

Project API lists the projects on the platform, returns the definition of the current project, and updates a project's GIS (map) location.

## `ins.getProjects()`

Returns **every** project on the platform — `Collection<ProjectResponseDto>`.

```javascript
var projects = ins.getProjects();
projects.forEach(function(p) {
    ins.consoleLog(p.getName() + " active=" + p.getIsActive());
});
```

## `ins.getProjects(isActive)`

Returns projects filtered by active / inactive state.

```javascript
var activeOnly = ins.getProjects(true);
```

## `ins.getProject()`

Returns the definition of the **current** project the script is running in.

```javascript
var p = ins.getProject();
ins.consoleLog(p.getName() + " @ " + p.getLatitude() + ", " + p.getLongitude());
```

### `ProjectResponseDto` Fields

| Method | Type | Description |
| --- | --- | --- |
| `getName()` | `String` | Project name |
| `getDsc()` | `String` | Description |
| `getIsActive()` | `Boolean` | Whether the project is active |
| `getAddress()` | `String` | Address (text) |
| `getLatitude()` / `getLongitude()` | `Double` | GIS coordinate |
| `getIconFileId()` | `String` | Map icon file ID |
| `getProperties()` | `String` | Serialized extra properties (JSON string) |

## `ins.updateProjectLocation(latitude, longitude)` / `(projectName, latitude, longitude)`

Updates the project's GIS coordinate. `projectName` defaults to the current project.

```javascript
// Current project's location
ins.updateProjectLocation(37.9, 32.5);

// Another project
ins.updateProjectLocation("other_project", 41.0, 29.0);
```

## Example: Forward a Mobile Device's Location to the Project

```javascript
function main() {
    var lat = ins.getVariableValue("Device_Latitude").value;
    var lng = ins.getVariableValue("Device_Longitude").value;

    if (lat && lng) {
        ins.updateProjectLocation(lat, lng);
        ins.writeLog("info", "GIS", "Project location updated: " + lat + ", " + lng);
    }
}
main();
```
