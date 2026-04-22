---
title: "System API"
description: "Sistem seviyesi fonksiyonlar — yeniden başlatma, OS komutu, giriş denemeleri"
sidebar:
  order: 11
---

:::caution
Sistem seviyesinde işlemler yapar. Yalnızca yetkili kullanıcılar tarafından dikkatli kullanılmalıdır.
:::

## Fonksiyonlar

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.restart()** | Platformu yeniden başlat |
| **ins.shutdown()** | Platformu kapat |
| **ins.setDateTime(ms, format)** | Sistem saatini ayarla |
| **ins.exec(command)** | OS komutu çalıştır |
| **ins.getLastAuthAttempts()** | Son giriş denemelerini listele |

### ins.getLastAuthAttempts()

Son kullanıcı giriş denemelerini listeler. Başarılı ve başarısız girişleri içerir.

```javascript
var attempts = ins.getLastAuthAttempts();
```

Yanıt:
```json
[
  {
    "msg": "inscada logged in successfully",
    "ip": "0:0:0:0:0:0:0:1",
    "username": "inscada",
    "date": { "epochSecond": 1774689046 },
    "isSuccessful": true
  },
  {
    "msg": "admin login failed",
    "ip": "192.168.1.50",
    "username": "admin",
    "date": { "epochSecond": 1774688900 },
    "isSuccessful": false
  }
]
```

```javascript
// Başarısız giriş denemelerini kontrol et
var attempts = ins.getLastAuthAttempts();
var failedCount = 0;
for (var i = 0; i < attempts.size(); i++) {
    if (!attempts.get(i).isSuccessful) {
        failedCount++;
    }
}
if (failedCount > 5) {
    ins.notify("error", "Güvenlik Uyarısı",
        failedCount + " başarısız giriş denemesi tespit edildi!");
}
```

### ins.exec(command)

İşletim sistemi komutu çalıştırır.

```javascript
// Disk kullanımını kontrol et
var result = ins.exec("df -h /");
ins.consoleLog(result);
```

:::caution
`ins.exec()` OS düzeyinde komut çalıştırır. Güvenlik riskleri nedeniyle yalnızca güvenilir script'lerde kullanılmalıdır. Kullanıcı girdisi doğrudan komut parametresi olarak geçirilmemelidir.
:::

### ins.restart() / ins.shutdown()

```javascript
// Bakım penceresi kontrolü ile yeniden başlatma
var hour = ins.now().getHours();
if (hour >= 2 && hour <= 4) {
    ins.writeLog("WARNING", "System", "Planlı yeniden başlatma");
    ins.restart();
}
```

### ins.setDateTime(ms, format)

Sistem saatini ayarlar. Genellikle NTP olmayan ortamlarda kullanılır.

```javascript
ins.setDateTime(Date.now(), "epoch");
```
