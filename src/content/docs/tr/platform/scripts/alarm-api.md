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

### Örnek


