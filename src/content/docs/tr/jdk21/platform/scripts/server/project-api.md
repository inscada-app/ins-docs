---
title: "Project API"
description: "Proje bilgilerini sorgulama ve GIS lokasyonu güncelleme"
sidebar:
  order: 9
---

Project API; platformdaki projeleri listelemek, mevcut projenin tanımını çekmek ve bir projenin GIS (harita) lokasyonunu güncellemek için kullanılır.

## `ins.getProjects()`

Platformdaki **tüm** projeleri döner — `Collection<ProjectResponseDto>`.

```javascript
var projects = ins.getProjects();
projects.forEach(function(p) {
    ins.consoleLog(p.getName() + " active=" + p.getIsActive());
});
```

## `ins.getProjects(isActive)`

Aktif/pasif filtresiyle döner.

```javascript
var activeOnly = ins.getProjects(true);
```

## `ins.getProject()`

Script'in çalıştığı **mevcut** projenin tanımını döner.

```javascript
var p = ins.getProject();
ins.consoleLog(p.getName() + " @ " + p.getLatitude() + ", " + p.getLongitude());
```

### `ProjectResponseDto` Alanları

| Metod | Tür | Açıklama |
| --- | --- | --- |
| `getName()` | `String` | Proje adı |
| `getDsc()` | `String` | Açıklama |
| `getIsActive()` | `Boolean` | Proje aktif mi |
| `getAddress()` | `String` | Adres (text) |
| `getLatitude()` / `getLongitude()` | `Double` | GIS koordinatı |
| `getIconFileId()` | `String` | Harita simgesi dosya ID'si |
| `getProperties()` | `String` | Serileşmiş ek özellikler (JSON string) |

## `ins.updateProjectLocation(latitude, longitude)` / `(projectName, latitude, longitude)`

Projenin GIS koordinatını günceller. `projectName` verilmezse mevcut proje varsayılır.

```javascript
// Mevcut projenin lokasyonu
ins.updateProjectLocation(37.9, 32.5);

// Başka bir projenin lokasyonu
ins.updateProjectLocation("other_project", 41.0, 29.0);
```

## Örnek: Mobil Cihazdan Gelen Lokasyonu Projeye Yansıt

```javascript
function main() {
    var lat = ins.getVariableValue("Device_Latitude").value;
    var lng = ins.getVariableValue("Device_Longitude").value;

    if (lat && lng) {
        ins.updateProjectLocation(lat, lng);
        ins.writeLog("info", "GIS", "Proje lokasyonu güncellendi: " + lat + ", " + lng);
    }
}
main();
```
