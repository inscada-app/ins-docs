---
title: "Report API"
description: "Jasper rapor üretme, dışa aktarma ve e-posta gönderme"
sidebar:
  order: 8
---

Report API, Jasper Reports tabanlı rapor üretme ve dağıtım sağlar. Raporlar PDF ve Excel formatında dışa aktarılabilir, dosyaya kaydedilebilir veya e-posta ile gönderilebilir.

## Fonksiyonlar

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.scheduleReport(name)** | Rapor zamanla |
| **ins.cancelReport(name)** | Rapor iptal et |
| **ins.mailReport(name, start, end)** | Rapor üret ve e-posta gönder |
| **ins.mailJasperReport(name, params, users, subject, content)** | Parametreli PDF rapor gönder |
| **ins.exportJasperPdfToFile(name, path)** | PDF dosyası kaydet |
| **ins.exportJasperExcelToFile(name, path)** | Excel dosyası kaydet |

### Örnekler

```javascript
// Raporu zamanla (tanımlı zamanlama tipine göre çalıştırır)
ins.scheduleReport("daily_energy_report");
```

```javascript
// Rapor üret ve e-posta gönder
var end = ins.now();
var start = ins.getDate(end.getTime() - 86400000); // 24 saat önce
ins.mailReport("daily_energy_report", start, end);
```

```javascript
// Parametreli Jasper rapor — PDF olarak e-posta gönder
var params = {
    "START_DATE": ins.getDate(ins.now().getTime() - 86400000),
    "END_DATE": ins.now(),
    "PROJECT_ID": 153
};

ins.mailJasperReport(
    "energy_report",        // rapor adı
    params,                 // rapor parametreleri
    ["manager", "operator"],// alıcılar
    "Günlük Enerji Raporu", // e-posta konusu
    "Ekteki rapor otomatik oluşturulmuştur." // e-posta içeriği
);
```

```javascript
// PDF dosyası olarak kaydet
ins.exportJasperPdfToFile("energy_report", "/reports/daily_report.pdf");

// Excel dosyası olarak kaydet
ins.exportJasperExcelToFile("energy_report", "/reports/daily_report.xlsx");
```

```javascript
// Rapor iptal et
ins.cancelReport("daily_energy_report");
```

### Zamanlanmış Rapor Senaryosu

Her gün 08:00'de önceki günün raporunu PDF olarak kaydedip e-posta gönderen script:

```javascript
// Schedule Type: Daily, Time: 08:00
var now = ins.now();
var yesterday = ins.getDate(now.getTime() - 86400000);
var year = 1900 + yesterday.getYear();
var month = ins.leftPad("" + (yesterday.getMonth() + 1), 2, "0");
var day = ins.leftPad("" + yesterday.getDate(), 2, "0");
var fileName = "/reports/energy_" + year + month + day + ".pdf";

ins.exportJasperPdfToFile("energy_report", fileName);
ins.mailReport("energy_report", yesterday, now);
ins.writeLog("INFO", "Report", "Günlük rapor oluşturuldu: " + fileName);
```
