---
title: "Map API"
description: "GIS harita fonksiyonları — konum, çizgi, renk ve alarm durumu"
sidebar:
  order: 12
---

Map API, inSCADA'nın GIS harita ekranına veri göndermek için kullanılır. Harita üzerinde proje konumları, rota çizgileri ve alarm durumları görselleştirilebilir.

## Fonksiyonlar

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.sendMapData(name, [lat,lng], popup)** | Haritaya konum ekle/güncelle |
| **ins.drawMapLines(id, points, color, weight)** | Haritada çizgi çiz |
| **ins.setMapColor(color)** | Harita tema rengini ayarla |
| **ins.sendMapFiredAlarmStatus()** | Alarm durumlarını haritada güncelle |

### ins.sendMapData(name, coords, popup)

Harita üzerinde bir konum noktası ekler veya günceller. `popup` parametresi HTML destekler.

```javascript
ins.sendMapData(
    "Energy Station",
    [41.0082, 28.9784],
    "<b>Istanbul</b><br>Active Power: 350 kW"
);
// → OK
```

```javascript
// Dinamik popup — anlık değerleri göster
var power = ins.getVariableValue("ActivePower_kW").value;
var voltage = ins.getVariableValue("Voltage_V").value;
var status = ins.getConnectionStatus("LOCAL-Energy");

var popup = "<b>Energy Monitoring Demo</b><br>"
    + "<table>"
    + "<tr><td>Güç:</td><td>" + power + " kW</td></tr>"
    + "<tr><td>Gerilim:</td><td>" + voltage + " V</td></tr>"
    + "<tr><td>Durum:</td><td>" + status + "</td></tr>"
    + "</table>";

ins.sendMapData("Energy Station", [41.0082, 28.9784], popup);
```

### ins.drawMapLines(id, points, color, weight)

Harita üzerinde noktalar arası çizgi çizer. Boru hatları, kablo güzergahları veya rotalar için kullanılır.

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| **id** | String | Çizgi tanımlayıcı (güncelleme için) |
| **points** | Array | `[[lat1,lng1], [lat2,lng2], ...]` koordinat dizisi |
| **color** | String | Renk kodu (hex) |
| **weight** | Integer | Çizgi kalınlığı (piksel) |

```javascript
ins.drawMapLines("route1",
    [[41.0082, 28.9784], [41.0152, 29.0044]],
    "#0066cc", 3);
// → OK
```

```javascript
// Boru hattı güzergahı
ins.drawMapLines("pipeline_main",
    [[39.92, 32.85], [40.10, 32.90], [40.25, 33.05], [40.50, 33.20]],
    "#ff6600", 4);
```

### ins.setMapColor(color)

Haritanın tema rengini ayarlar.

```javascript
ins.setMapColor("#0066cc");
// → OK
```

### ins.sendMapFiredAlarmStatus()

Tüm projelerin alarm durumlarını haritada günceller. Harita üzerindeki proje noktaları alarm durumuna göre renklendirilir (yeşil=normal, kırmızı=alarm).

```javascript
ins.sendMapFiredAlarmStatus();
// → OK
```

```javascript
// Periyodik script ile harita verilerini güncelle (her 30 saniye)
var projects = ins.getProjects();
for (var i = 0; i < projects.size(); i++) {
    var p = projects.get(i);
    if (p.latitude && p.longitude) {
        ins.sendMapData(p.name,
            [p.latitude, p.longitude],
            "<b>" + p.name + "</b><br>" + p.dsc);
    }
}
ins.sendMapFiredAlarmStatus();
```
