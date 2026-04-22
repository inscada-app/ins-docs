---
title: "Alarm API"
description: "Alarm grup yönetimi, geçmiş sorgulama ve onaylama"
sidebar:
  order: 3
---

Alarm API, alarm gruplarını yönetme ve alarm geçmişini sorgulama sağlar.

## Fonksiyonlar

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.activateAlarmGroup(name)** | Alarm grubunu etkinleştir |
| **ins.deactivateAlarmGroup(name)** | Alarm grubunu devre dışı bırak |
| **ins.getLastFiredAlarms(index, count)** | Son tetiklenen alarmları listele |
| **ins.getLastFiredAlarmsByDate(start, end, includeOff, limit)** | Tarih aralığında alarm geçmişi |
| **ins.getAlarmLastFiredAlarmsByName(names, includeOff)** | Belirli alarmların son durumu |
| **ins.acknowledgeAlarm(id, type, onTime, acknowledger)** | Alarm onayla |
| **ins.updateAlarm(name, map)** | Alarm tanımını güncelle |

### Örnekler

```javascript
// Son 5 alarmı listele
var alarms = ins.getLastFiredAlarms(0, 5);
// → [] (aktif alarm yoksa boş dizi döner)
```

```javascript
// Tarih aralığında alarm geçmişi
var end = ins.now();
var start = ins.getDate(end.getTime() - 86400000); // 24 saat
var history = ins.getLastFiredAlarmsByDate(start, end, true, 100);
```

```javascript
// Alarm grubunu devre dışı bırak (bakım sırasında)
ins.deactivateAlarmGroup("Temperature_Alarms");

// Bakım sonrası tekrar etkinleştir
ins.activateAlarmGroup("Temperature_Alarms");
```
