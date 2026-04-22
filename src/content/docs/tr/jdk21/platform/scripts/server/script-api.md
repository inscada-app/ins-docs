---
title: "Script API"
description: "Script zamanlama, çalıştırma ve global nesne yönetimi"
sidebar:
  order: 7
---

Script API, diğer script'leri yönetme ve script'ler arası veri paylaşımı sağlar.

## Script Yönetimi

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.scheduleScript(name)** | Script'i zamanlayıcısına göre başlat |
| **ins.cancelScript(name)** | Çalışan script'i durdur |
| **ins.executeScript(name)** | Script'i anında çalıştır, sonucu döndür |

### Örnekler

```javascript
// Script'i zamanlayıcısına göre başlat
ins.scheduleScript("Chart_ActiveReactivePower");
// → OK
```

```javascript
// Script'i durdur
ins.cancelScript("Chart_ActiveReactivePower");
// → OK
```

```javascript
// Başka bir script'i anında çalıştır ve sonucunu al
var result = ins.executeScript("Calculate_DailyTotal");
```

:::note
`ins.executeScript()` hedef script'i anında çalıştırır ve script'in döndürdüğü sonucu döner. Hedef script mevcut değilse 404 hatası alırsınız.
:::

## Global Nesne (Script'ler Arası Veri Paylaşımı)

Script'ler birbirinden izole çalışır. Ancak `setGlobalObject` / `getGlobalObject` ile script'ler arası veri paylaşımı yapılabilir.

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.setGlobalObject(name, obj)** | Paylaşımlı nesne kaydet |
| **ins.getGlobalObject(name)** | Paylaşımlı nesneyi oku |
| **ins.setGlobalObject(name, obj, ms)** | TTL ile paylaşımlı nesne (otomatik silinir) |

### Basit Değer

```javascript
// Script A: değer kaydet
ins.setGlobalObject("daily_counter", 42);

// Script B: değeri oku
var counter = ins.getGlobalObject("daily_counter");
// → 42
```

### Karmaşık Nesne

```javascript
// Script A: vardiya bilgisi kaydet
ins.setGlobalObject("shift_data", {
    shift: "A",
    count: 150,
    startTime: ins.now().toString()
});

// Script B: vardiya bilgisini oku
var data = ins.getGlobalObject("shift_data");
```

Yanıt:
```json
{
  "shift": "A",
  "count": 150,
  "startTime": "Sat Mar 28 12:10:21 TRT 2026"
}
```

### TTL ile Geçici Nesne

Belirli süre sonra otomatik silinen geçici veri:

```javascript
// 60 saniye sonra otomatik silinecek cache
ins.setGlobalObject("temp_cache", {value: 99}, 60000);

var cached = ins.getGlobalObject("temp_cache");
// → { value: 99 }
// 60 saniye sonra → null
```

### Kullanım Senaryoları

```javascript
// Senaryo 1: Periyodik script hesaplama sonucunu UI script'ine aktar
// Backend script (her 10 saniye):
var power = ins.getVariableValue("ActivePower_kW").value;
var voltage = ins.getVariableValue("Voltage_V").value;
ins.setGlobalObject("dashboard_summary", {
    power: power,
    voltage: voltage,
    updatedAt: ins.now().toString()
});

// Frontend/UI script:
var summary = ins.getGlobalObject("dashboard_summary");
```

```javascript
// Senaryo 2: Rate limiting — son çalışma zamanını kontrol et
var lastRun = ins.getGlobalObject("report_last_run");
var now = ins.now().getTime();

if (!lastRun || (now - lastRun) > 3600000) {
    // 1 saatten fazla olmuş, raporu çalıştır
    ins.scheduleReport("hourly_report");
    ins.setGlobalObject("report_last_run", now);
}
```
