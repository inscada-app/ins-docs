---
title: "Notification API"
description: "Web bildirim, e-posta (plain + HTML multipart) ve SMS gönderimi"
sidebar:
  order: 6
---

Notification API; script'lerden platform kullanıcılarına **web bildirim**, **e-posta** ve **SMS** iletileri gönderir. Her üçü de platform kullanıcı adları (`username[]`) üzerinden adreslenir — gerçek e-posta adresi / telefon numarası kullanıcı profilinden alınır.

## Web Bildirim

### `ins.notify(type, title, message)`

Tüm bağlı UI istemcilerine (webix clients) anlık web bildirim gönderir; kullanıcı arayüzünde popup olarak görünür.

```javascript
ins.notify("info", "Vardiya", "Vardiya değişimi tamamlandı");
```

| `type` | Görünüm |
| --- | --- |
| `"info"` | Bilgi (mavi) |
| `"success"` | Başarılı (yeşil) |
| `"warning"` | Uyarı (sarı) |
| `"error"` | Hata (kırmızı) |

```javascript
var temp = ins.getVariableValue("Temperature_C").value;
if (temp > 60) {
    ins.notify("warning", "Sıcaklık Uyarısı",
        "Panel sıcaklığı " + temp + "°C — limit 60°C");
}
```

## E-posta

### `ins.sendMail(usernames[], subject, content)`

Verilen platform kullanıcılarına **plain text** e-posta gönderir.

```javascript
ins.sendMail(
    ["operator1", "supervisor"],
    "Günlük Rapor",
    "Bugünkü toplam üretim: 1250 kWh"
);
```

### `ins.sendMail(usernames[], subject, content, htmlContent)`

**Multipart/alternative** e-posta gönderir — hem düz metin (`content`) hem HTML (`htmlContent`) gövdesi aynı mesajda yer alır; e-posta istemcisi hangisini destekliyorsa onu gösterir.

```javascript
var power = ins.getVariableValue("ActivePower_kW").value;
var voltage = ins.getVariableValue("Voltage_V").value;

var textBody = "Enerji Raporu\n"
    + "Aktif Güç: " + power + " kW\n"
    + "Gerilim: " + voltage + " V\n";

var htmlBody = "<h2>Enerji Raporu</h2>"
    + "<table border='1' cellpadding='6'>"
    + "<tr><td>Aktif Güç</td><td>" + power + " kW</td></tr>"
    + "<tr><td>Gerilim</td><td>" + voltage + " V</td></tr>"
    + "</table>";

ins.sendMail(["manager"], "Enerji Raporu", textBody, htmlBody);
```

:::note
`htmlContent` bir **String** parametresidir (boolean bayrak değil). `null` verirsen yalnızca plain-text sürüm gider; iki sürüm de içerik taşıyorsa istemci HTML'e geçer.
:::

:::caution
E-posta göndermek için **Settings → Email Settings** bölümünde SMTP yapılandırması tanımlı olmalıdır. Her kullanıcının profilinde geçerli bir e-posta adresi bulunması gerekir — aksi halde o kullanıcıya mail atlanır.
:::

## SMS

### `ins.sendSMS(usernames[], message)`

Platformda tanımlı **varsayılan** SMS sağlayıcısı üzerinden SMS gönderir.

```javascript
ins.sendSMS(["oncall_engineer"], "ALARM: Trafo sıcaklığı kritik seviyede!");
```

### `ins.sendSMS(usernames[], message, provider)`

Belirtilen SMS sağlayıcısı üzerinden gönderir (çoklu sağlayıcı kurulu ise).

```javascript
ins.sendSMS(["operator"], "Sistem bakım hatırlatması", "NetGSM");
```

:::caution
SMS göndermek için **Settings → SMS Settings** bölümünde SMS sağlayıcı yapılandırılmış ve her kullanıcı profilinde geçerli bir telefon numarası bulunuyor olmalıdır.
:::

## Örnek: Çok Kanallı Kritik Alarm

```javascript
function main() {
    var temp = ins.getVariableValue("TransformerTemp_C").value;
    if (temp < 85) return;

    var msg = "Trafo sıcaklığı: " + temp + "°C — limit 85°C";

    // 1) Tüm UI'lere anlık uyarı
    ins.notify("error", "Kritik Sıcaklık", msg);

    // 2) Sorumlulara SMS
    ins.sendSMS(["oncall_engineer", "shift_supervisor"], msg);

    // 3) Yönetim için zengin e-posta
    var html = "<h3 style='color:#c0392b'>Kritik Sıcaklık</h3>"
        + "<p>" + msg + "</p>"
        + "<p>Zaman: " + ins.now() + "</p>";
    ins.sendMail(["plant_manager"], "[KRITIK] Trafo Sıcaklığı", msg, html);

    ins.writeLog("ERROR", "TempWatch", msg);
}
main();
```
