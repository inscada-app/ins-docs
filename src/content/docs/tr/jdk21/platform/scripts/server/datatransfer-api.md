---
title: "Data Transfer API"
description: "Dosya tabanlı veri aktarımı yönetimi"
sidebar:
  order: 13
---

Data Transfer API, tanımlı veri aktarım görevlerini script'ler içinden yönetmeyi sağlar. Veri aktarımları, değişken verilerini dosya (CSV, XML vb.) veya harici sistemlere aktarmak için kullanılır.

## Fonksiyonlar

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.scheduleDataTransfer(name)** | Veri aktarım görevini başlat |
| **ins.cancelDataTransfer(name)** | Veri aktarım görevini iptal et |

### Örnekler

```javascript
// Veri aktarım görevini başlat
ins.scheduleDataTransfer("export_hourly_data");
```

```javascript
// Aktarımı iptal et
ins.cancelDataTransfer("export_hourly_data");
```

```javascript
// Senaryo: Vardiya sonunda veri aktarımı tetikle
var hour = ins.now().getHours();
if (hour === 8 || hour === 16 || hour === 0) {
    ins.scheduleDataTransfer("shift_export");
    ins.writeLog("INFO", "Data Transfer", "Vardiya sonu aktarımı başlatıldı");
}
```

:::note
Veri aktarım görevleri **Development → Data Transfers** menüsünden tanımlanır. `scheduleDataTransfer()` yalnızca mevcut bir tanımı tetikler, yeni tanım oluşturmaz.
:::
