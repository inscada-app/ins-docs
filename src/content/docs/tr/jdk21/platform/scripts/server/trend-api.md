---
title: "Trend API"
description: "Trend tanımları, tag'leri ve tag ölçeklerini dinamik güncelleme"
sidebar:
  order: 4
---

Trend API; platformdaki trend tanımlarını ve bunlara bağlı tag'leri (trend üzerindeki her bir değişken/çizgi) listeler, runtime'da tag ölçeğini değiştirmeye izin verir.

## `ins.getTrends()`

Projedeki tüm trend tanımlarını döner — `Collection<TrendResponseDto>`.

```javascript
var trends = ins.getTrends();
trends.forEach(function(t) {
    ins.consoleLog(t.getName() + " period=" + t.getPeriod() + "ms");
});
```

### `TrendResponseDto` Alanları

| Metod | Tür | Açıklama |
| --- | --- | --- |
| `getName()` | `String` | Trend adı |
| `getDsc()` | `String` | Açıklama |
| `getPeriod()` | `Integer` | Örnekleme periyodu (ms) |
| `getOrder()` | `Integer` | UI listesindeki sıra |
| `getConfigs()` | `String` | Serileşmiş görünüm ayarları (JSON string) |
| `getProjectId()` | `String` | Proje ID |

## `ins.getTrendTags(trendId)`

Verilen trend ID'ye bağlı tüm tag'leri döner — `Collection<TrendTagResponseDto>`.

```javascript
// Trend ID'yi ad üzerinden bul
var trends = ins.getTrends();
var target = null;
trends.forEach(function(t) {
    if (t.getName() == "Power Trend") target = t;
});

if (target) {
    var tags = ins.getTrendTags(target.getBaseId());
    tags.forEach(function(tag) {
        ins.consoleLog(tag.getVariableName() + " [" + tag.getMinScale() + ", " + tag.getMaxScale() + "]");
    });
}
```

### `TrendTagResponseDto` Alanları

| Metod | Tür | Açıklama |
| --- | --- | --- |
| `getName()` | `String` | Tag adı |
| `getDsc()` | `String` | Açıklama |
| `getStatus()` | `Boolean` | Tag aktif mi |
| `getOrder()` | `Integer` | Trend içi sıra |
| `getVariableName()` / `getVariableUnit()` | `String` | Bağlı değişken adı ve birimi |
| `getVariableId()` / `getTrendId()` | `String` | Referans ID'ler |
| `getMinScale()` / `getMaxScale()` | `Double` | Y ekseni ölçek alt/üst sınırı |
| `getColor()` | `String` | Çizgi rengi (hex) |
| `getThickness()` | `Integer` | Çizgi kalınlığı |
| `getGridThickness()` | `Double` | Grid kalınlığı |
| `getHideValueAxe()` | `Boolean` | Değer ekseni gizlensin mi |

## `ins.setTrendTagMinMaxScale(trendName, tagName, minScale, maxScale)`

Belirli bir trend tag'inin Y ekseni ölçek alt/üst sınırını günceller. Trend, bu değerleri bir sonraki render'dan itibaren yeni aralıkla çizer.

```javascript
ins.setTrendTagMinMaxScale("Power Trend", "ActivePower_kW", 0.0, 500.0);
```

## Örnek: Son 1 Saatlik Veriye Göre Otomatik Ölçek

Trend'in y eksen aralığını son 1 saatteki gerçek veri aralığına %10 pay bırakarak dinamik ayarla.

```javascript
function main() {
    var end = ins.now();
    var start = ins.getDate(end.getTime() - 3600000);

    var stats = ins.getLoggedVariableValueStats(["ActivePower_kW"], start, end);
    var s = stats.ActivePower_kW;
    if (!s) return;

    var margin = (s.getMaxValue() - s.getMinValue()) * 0.1;
    ins.setTrendTagMinMaxScale(
        "Power Trend", "ActivePower_kW",
        s.getMinValue() - margin,
        s.getMaxValue() + margin
    );
}
main();
```
