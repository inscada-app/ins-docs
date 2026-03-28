---
title: "Trend API"
description: "Trend tanımları ve tag yönetimi"
sidebar:
  order: 4
---

Trend API, trend tanımlarına ve tag'lerine erişim sağlar. Trend grafikleri, değişkenlerin zaman içindeki değişimini görselleştirmek için kullanılır.

## Fonksiyonlar

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.getTrends()** | Tüm trend tanımlarını listele |
| **ins.getTrendTags(trendId)** | Trend tag'lerini listele |
| **ins.setTrendTagMinMaxScale(trendName, tagName, min, max)** | Tag ölçek aralığını güncelle |

### Örnekler

```javascript
// Tüm trend tanımlarını listele
var trends = ins.getTrends();
// → [] (tanımlı trend yoksa boş dizi)
```

```javascript
// Trend tag'lerini listele
var tags = ins.getTrendTags(1);
// Her tag, bir değişkenin trend grafiğindeki görünüm ayarlarını içerir
```

```javascript
// Tag ölçek aralığını dinamik güncelle
// Örn: alarm limitlerine göre ölçeği ayarla
var stats = ins.getLoggedVariableValueStats(
    Java.to(["ActivePower_kW"], "java.lang.String[]"),
    ins.getDate(ins.now().getTime() - 3600000),
    ins.now()
);
var min = stats.ActivePower_kW.minValue;
var max = stats.ActivePower_kW.maxValue;
var margin = (max - min) * 0.1;

ins.setTrendTagMinMaxScale("Power Trend", "ActivePower_kW",
    min - margin, max + margin);
```
