---
title: "Log API"
description: "Denetim logu yazma ve sorgulama"
sidebar:
  order: 10
---

Log API, denetim (audit) loglarına kayıt ekleme ve sorgulama sağlar. Script'ler tarafından yazılan loglar, platform log ekranında görüntülenebilir.

## Fonksiyonlar

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.writeLog(type, activity, msg)** | Denetim loguna kayıt ekle |
| **ins.getLogsByPage(start, end, page, size)** | Logları sayfalı sorgula |

### ins.writeLog(type, activity, msg)

Denetim loguna yeni kayıt ekler.

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| **type** | String | Log seviyesi: `"INFO"`, `"WARNING"`, `"ERROR"` |
| **activity** | String | İşlem/aktivite adı |
| **msg** | String | Log mesajı |

```javascript
ins.writeLog("INFO", "Script Test", "Documentation test log entry");
// → OK
```

```javascript
// Otomasyon senaryosu: değer yazma işlemini logla
var oldVal = ins.getVariableValue("Temperature_C").value;
ins.setVariableValue("Temperature_C", {value: 55.0});
ins.writeLog("INFO", "Setpoint Change",
    "Temperature_C: " + oldVal + " → 55.0");
```

### ins.getLogsByPage(start, end, page, size)

Belirli tarih aralığındaki logları sayfalı olarak sorgular.

```javascript
var end = ins.now();
var start = ins.getDate(end.getTime() - 3600000); // 1 saat önce

var logs = ins.getLogsByPage(start, end, 0, 3);
```

Yanıt:
```json
[
  {
    "activity": "Script Test",
    "dttm": 1774688982859,
    "msg": "Documentation test log entry",
    "projectId": 153,
    "logSeverity": "Information"
  },
  {
    "activity": "test",
    "dttm": 1774688964302,
    "msg": "Script test failed. Cause: TypeError: ...",
    "projectId": 153,
    "logSeverity": "Error"
  }
]
```

| Alan | Açıklama |
|------|----------|
| **activity** | İşlem adı |
| **dttm** | Zaman damgası (epoch ms) |
| **msg** | Log mesajı |
| **projectId** | Proje ID'si |
| **logSeverity** | Seviye: Information, Warning, Error |

```javascript
// Hatalı giriş denemelerini kontrol et
var end = ins.now();
var start = ins.getDate(end.getTime() - 86400000);
var logs = ins.getLogsByPage(start, end, 0, 100);

var errorCount = 0;
for (var i = 0; i < logs.length; i++) {
    if (logs[i].logSeverity === "Error") {
        errorCount++;
    }
}
ins.consoleLog("Son 24 saatte " + errorCount + " hata kaydı");
```
