---
title: "Project API"
description: "Proje bilgileri ve konum güncelleme"
sidebar:
  order: 9
---

## Fonksiyonlar

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.getProjects()** | Tüm projeleri listele |
| **ins.getProjects(isActive)** | Aktif/pasif projeleri filtrele |
| **ins.updateProjectLocation(lat, lng)** | Proje GIS konumunu güncelle |

### Örnekler

```javascript
var projects = ins.getProjects();
```

Yanıt:
```json
[
  {
    "id": 153,
    "name": "Energy Monitoring Demo",
    "dsc": "Demo project for energy monitoring with simulated data",
    "isActive": true,
    "latitude": null,
    "longitude": null,
    "createdBy": "inscada",
    "creationDate": 1772624872913
  },
  {
    "id": 353,
    "name": "Building",
    "dsc": "Building Management System - HVAC & Air Conditioning Demo",
    "isActive": true
  },
  {
    "id": 354,
    "name": "Renewable Energy Demo",
    "dsc": "Solar, Wind, Battery Storage & Grid simulation",
    "isActive": true
  }
]
```

```javascript
// Proje konumunu güncelle
ins.updateProjectLocation(37.9, 32.5);
```
