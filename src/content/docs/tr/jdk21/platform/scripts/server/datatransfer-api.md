---
title: "Data Transfer API"
description: "Dosya tabanlı (CSV, XML, …) veri aktarım görevlerini zamanlama, iptal ve durum sorgulama"
sidebar:
  order: 13
---

Data Transfer API; platformun **Development → Data Transfers** altında tanımlı olan dosya tabanlı veri aktarım görevlerini script'ten başlatıp durdurmanı ve durumlarını sorgulamanı sağlar. Bir veri aktarımı, değişken verilerini CSV / XML gibi bir dosyaya veya uzak bir konuma yazmak için kullanılır.

:::note
`scheduleDataTransfer()` yalnızca **var olan** bir veri aktarım tanımını zamanlayıcıya ekler — yeni tanım oluşturmaz. Tanım yoksa hata fırlar.
:::

## `ins.scheduleDataTransfer(name)` / `(projectName, name)`

Tanımlı veri aktarımını zamanlayıcıya ekler — tanımdaki periyoda göre çalışmaya başlar. `projectName` verilmezse mevcut proje varsayılır.

```javascript
ins.scheduleDataTransfer("export_hourly_data");
ins.scheduleDataTransfer("other_project", "export_hourly_data");
```

## `ins.cancelDataTransfer(name)` / `(projectName, name)`

Aktarımı zamanlayıcıdan çıkarır — kalan tetiklemeler iptal edilir; o sırada çalışan bir aktarım işi varsa o doğal sonuna kadar gider.

```javascript
ins.cancelDataTransfer("export_hourly_data");
```

## `ins.getDataTransferStatus(name)` / `(projectName, name)`

`DataTransferStatus` enum döner — iki değer:

| Değer | Anlam |
| --- | --- |
| `"Scheduled"` | Zamanlayıcıya bağlı |
| `"Not Scheduled"` | Bağlı değil |

```javascript
if (ins.getDataTransferStatus("export_hourly_data") == "Not Scheduled") {
    ins.scheduleDataTransfer("export_hourly_data");
}
```

## Örnek: Vardiya Sonu Aktarımı

```javascript
function main() {
    var h = ins.now().getHours();
    if (h !== 0 && h !== 8 && h !== 16) return;

    if (ins.getDataTransferStatus("shift_export") == "Not Scheduled") {
        ins.scheduleDataTransfer("shift_export");
        ins.writeLog("info", "DataTransfer", "Vardiya sonu aktarımı zamanlandı");
    }
}
main();
```
