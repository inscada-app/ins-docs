---
title: "Notification API"
description: "E-posta, SMS ve web bildirim gönderme"
sidebar:
  order: 6
---

Notification API, script'ler içinden e-posta, SMS ve web bildirimi gönderme sağlar.

## Fonksiyonlar

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.sendMail(users, subject, content)** | E-posta gönder |
| **ins.sendMail(users, subject, content, html)** | HTML e-posta gönder |
| **ins.sendSMS(users, message)** | SMS gönder |
| **ins.sendSMS(users, message, provider)** | Belirli sağlayıcı ile SMS |
| **ins.notify(type, title, message)** | Web bildirimi gönder |

## Web Bildirimi

### ins.notify(type, title, message)

Tüm bağlı istemcilere anlık web bildirimi gönderir. Bildirim kullanıcı arayüzünde popup olarak görünür.

```javascript
ins.notify("info", "Bilgi", "Vardiya değişimi tamamlandı");
// → OK
```

| type | Açıklama |
|------|----------|
| **info** | Bilgilendirme (mavi) |
| **success** | Başarılı işlem (yeşil) |
| **warning** | Uyarı (sarı) |
| **error** | Hata (kırmızı) |

```javascript
// Alarm eşiği aşıldığında uyarı gönder
var temp = ins.getVariableValue("Temperature_C").value;
if (temp > 60) {
    ins.notify("warning", "Sıcaklık Uyarısı",
        "Panel sıcaklığı " + temp + "°C — limit 60°C");
}
```

## E-posta

### ins.sendMail(users, subject, content)

Platform üzerinde tanımlı kullanıcılara e-posta gönderir. `users` parametresi kullanıcı adı dizisidir.

```javascript
ins.sendMail(
    ["operator1", "supervisor"],
    "Günlük Rapor",
    "Bugünkü toplam üretim: 1250 kWh"
);
```

:::note
E-posta göndermek için **Settings → Email Settings** bölümünden SMTP sunucu yapılandırması yapılmış olmalıdır.
:::

### ins.sendMail(users, subject, content, html)

HTML formatında e-posta gönderir. `html` parametresi `true` olduğunda `content` HTML olarak yorumlanır.

```javascript
var power = ins.getVariableValue("ActivePower_kW").value;
var voltage = ins.getVariableValue("Voltage_V").value;

var htmlBody = "<h2>Enerji Raporu</h2>"
    + "<table border='1'>"
    + "<tr><td>Aktif Güç</td><td>" + power + " kW</td></tr>"
    + "<tr><td>Gerilim</td><td>" + voltage + " V</td></tr>"
    + "</table>";

ins.sendMail(["manager"], "Enerji Raporu", htmlBody, true);
```

## SMS

### ins.sendSMS(users, message)

Platform kullanıcılarına SMS gönderir.

```javascript
ins.sendSMS(["oncall_engineer"], "ALARM: Trafo sıcaklığı kritik seviyede!");
```

### ins.sendSMS(users, message, provider)

Belirli bir SMS sağlayıcısı üzerinden gönderir.

```javascript
ins.sendSMS(["operator"], "Sistem bakım hatırlatması", "ileti_merkezi");
```

:::note
SMS göndermek için **Settings → SMS Settings** bölümünden SMS sağlayıcı yapılandırması yapılmış olmalıdır.
:::
