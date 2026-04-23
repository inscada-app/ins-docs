---
title: "Alarm Yönetimi"
description: "Alarm grubu, alarm tanımları, alarm tipleri ve alarm izleme"
sidebar:
  order: 5
---

Alarm sistemi, değişken değerlerindeki anormal durumları tespit eder, kaydeder ve bildirir. Alarmlar grup halinde organize edilir ve her grup bir projeye bağlıdır.

![Alarm Grupları](../../../../../assets/docs/dev-alarm-groups.png)

## Alarm Grubu

Alarm grubu, alarm tanımlarını organize eder ve ortak davranış parametrelerini (scan periyodu, öncelik, tetik script'leri, renkler, yazıcı ayarları) belirler.

### Temel Alanlar

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| **name** | String (≤100) | Evet | Grup adı |
| **dsc** | String (≤255) | Hayır | Açıklama |
| **scanTimeInMillis** | Integer (≥100) | Evet | Alarm kontrol periyodu (ms) |
| **priority** | Short (1-255) | Evet | Öncelik seviyesi |
| **projectId** | String | Evet | Ait olduğu proje |

### Script Entegrasyonu

Alarm olaylarında otomatik çalışan script referansları — her biri opsiyoneldir:

| Alan | Açıklama |
|------|----------|
| **onScriptId** | Alarm tetiklendiğinde çalışan `RepeatableScript` |
| **offScriptId** | Alarm kapandığında çalışan script |
| **ackScriptId** | Alarm onaylandığında çalışan script |

### Renkler

Alarm monitöründeki satırların arka planı:

| Alan | Durum |
|------|-------|
| **onNoAckColor** | ON + onaylanmamış |
| **onAckColor** | ON + onaylanmış |
| **offNoAckColor** | OFF + onaylanmamış |
| **offAckColor** | OFF + onaylanmış |

Renkler `#RRGGBB` formatında hex olarak saklanır.

### Yazıcı Entegrasyonu

Alarm olayları doğrudan ağ yazıcısına gönderilebilir:

| Alan | Açıklama |
|------|----------|
| **printerIp** | Yazıcı IP adresi |
| **printerPort** | Yazıcı port numarası (0-65535) |
| **printWhenOn** | Tetiklendiğinde yazdır |
| **printWhenOff** | Kapandığında yazdır |
| **printWhenAck** | Onaylandığında yazdır |
| **printWhenComment** | Yorum eklendiğinde yazdır |

---

## Alarm Tipleri

Her alarm (`Alarm` tablosu) üç alt tipten birine ait bir `DiscriminatorValue` taşır.

### Ortak Alarm Alanları

| Alan | Tip | Açıklama |
|------|-----|----------|
| **name** | String (≤100) | Alarm adı (proje içinde benzersiz) |
| **dsc** | String (≤255) | Açıklama |
| **groupId** | String | Ait olduğu alarm grubu |
| **delay** | Integer (ms, ≥0) | Koşul sağlandıktan sonra beklenen süre (debounce) |
| **isActive** | Boolean | Bu alarm tanımı aktif mi |
| **part** | String (≤100) | Ekipman / hat kodu — raporlama ve filtre için |
| **onTimeVariableId** | String | ON zamanını yazacak değişken referansı (opsiyonel) |
| **offTimeVariableId** | String | OFF zamanını yazacak değişken referansı (opsiyonel) |

### Analog Alarm (`type = "Analog"`)

Sayısal değişkenlerin eşik değerlerini izler. Ek alanlar:

| Alan | Açıklama |
|------|----------|
| **variableId** | İzlenen değişken |
| **setPointValue** | Referans değer (deviation hesabı için) |
| **highHighValue** | Çok yüksek kritik eşiği |
| **highValue** | Yüksek uyarı eşiği |
| **lowValue** | Düşük uyarı eşiği |
| **lowLowValue** | Çok düşük kritik eşiği |
| **deadband** | Histerezis (mutlak) — eşikten geri dönüş için bu kadar fark gerekli |
| **deviationPercentage** | setPoint'ten yüzde sapma eşiği |

| Eşik | Örnek Koşul |
|------|-------------|
| **High-High** | Sıcaklık > 90 °C (kritik) |
| **High** | Sıcaklık > 70 °C (uyarı) |
| **Low** | Basınç < 2 bar (uyarı) |
| **Low-Low** | Basınç < 1 bar (kritik) |

Her eşik kullanılmak zorunda değildir — `null` bırakılırsa o eşik kontrol edilmez. `deadband` değeri ile alarm titreşimi önlenir.

### Digital Alarm (`type = "Digital"`)

Boolean değişkenlerin durum değişimini izler.

| Koşul | Davranış |
|-------|----------|
| Değer `true` | Alarm tetiklenir (ON) |
| Değer `false` | Alarm kapanır (OFF) |

Örnek: motor arıza sinyali, kapı açık kontağı, acil stop butonu.

### Custom Alarm (`type = "Custom"`)

JavaScript expression ile özel alarm koşulu tanımlama. Koşul truthy dönerse alarm ON, falsy dönerse OFF olur.

```javascript
// Birden fazla değişkene bağlı alarm koşulu
var power = ins.getVariableValue("ActivePower_kW").value;
var temp = ins.getVariableValue("Temperature_C").value;
return power > 500 && temp > 70; // her ikisi de yüksekse alarm
```

---

## Alarm Yaşam Döngüsü

Gerçek alarm durumu (`FiredAlarmStatus` enum) iki değerlidir:

```
ON (tetiklendi)  →  OFF (kapandı)
```

Onay (acknowledge), yorum (comment) ve zorla kapatma (force-off) durumun bir parçası **değildir** — ayrı alanlar / operasyonlardır:

| Alan / İşlem | Açıklama |
|--------------|----------|
| **acknowledgeTime / acknowledgedBy** | Operatör onayladığında doldurulur; alarm hâlâ ON olabilir |
| **commentTime / comment / commentedBy** | Operatör yorum eklediğinde doldurulur |
| **forceOff işlemi** | Alarmı yapay olarak OFF'a çeker; koşul hâlâ doğru olsa bile |
| **offTime** | Koşul doğal olarak ortadan kalktığında doldurulur |

### Operatör Aksiyonları

| İşlem | Tetikleyen | Durum Değiştirir mi? |
|-------|-----------|----------------------|
| **Acknowledge** | Operatör | Hayır (`acknowledgeTime` dolar) |
| **Comment** | Operatör | Hayır (`comment` + `commentTime` dolar) |
| **Force Off** | Operatör | Evet (durum ON → OFF'a çekilir) |
| Sistem'in doğal OFF'a alması | Sistem | Evet (`offTime` dolar) |

### Alarm Rengi Durum Matrisi

| Durum | Onay | Tipik Renk |
|-------|------|-----------|
| **ON** | Onaylanmamış | Kırmızı yanıp söner (`onNoAckColor`) |
| **ON** | Onaylanmış | Kırmızı sabit (`onAckColor`) |
| **OFF** | Onaylanmamış | Sarı (`offNoAckColor`) |
| **OFF** | Onaylanmış | Normal (`offAckColor`) |

---

## Alarm İzleme

### Alarm Monitor

![Alarm Monitor](../../../../../assets/docs/rt-alarm-monitor.png)

Aktif alarmları gerçek zamanlı olarak gösterir. Operatör bu ekrandan:
- Alarmları görüntüler
- Onaylar (Acknowledge)
- Yorum ekler (Comment)
- Zorla kapatır (Force Off)

### Alarm Tracking

Alarm geçmişini tarih aralığına göre sorgular. Her `FiredAlarm` kaydı şu alanları içerir:

| Alan | Açıklama |
|------|----------|
| `alarmName` | Hangi alarm tetiklendi |
| `onTime` | Tetiklenme zamanı |
| `offTime` | Kapanma zamanı (null = hâlâ ON) |
| `status` | `On` / `Off` |
| `acknowledgedBy` / `acknowledgeTime` | Kim, ne zaman onayladı |
| `comment` / `commentedBy` / `commentTime` | Yorum metadatası |
| `variableValue` | Tetiklenme anındaki değişken değeri |
| `part` | Alarm tanımından miras — filtreleme için |

---

## Script ile Alarm Yönetimi

```javascript
// Son N aktif alarm (OFF olanları hariç tut)
var last10 = ins.getFiredAlarms(0, 10);
// → [{ alarmName: "...", status: "On", onTime: ..., ... }, ...]

// Son N alarm (OFF olanları da dahil)
var last10Full = ins.getFiredAlarms(0, 10, true);

// Tarih aralığında alarm geçmişi (son 24 saat)
var end = ins.now();
var start = ins.getDate(end.getTime() - 86400000);
var history = ins.getFiredAlarmsByDate(start, end, true, 100);

// An itibariyle aktif alarmlar
var current = ins.getCurrentAlarms(false);

// Alarm grubunu devre dışı bırak (bakım modu)
ins.deactivateAlarmGroup("Temperature_Alarms");
// Bakım sonrası tekrar etkinleştir
ins.activateAlarmGroup("Temperature_Alarms");

// Operatör aksiyonları — FiredAlarmDto alır
var latest = ins.getFiredAlarm(0);
if (latest) {
    ins.acknowledgeAlarm(latest);
    ins.commentAlarm(latest, "Bakım ekibi haberdar edildi");
    // ins.forceOffAlarm(latest); // zorla kapatmak için
}

// Alarm durumu
var groupStatus = ins.getAlarmGroupStatus("Temperature_Alarms");
// → "Active" veya "Not Active"
```

:::note[JDK11'den fark]
JDK21'de API metot adları basitleşti: `getLastFiredAlarms(...)` → **`getFiredAlarms(...)`**, `getLastFiredAlarmsByDate(...)` → **`getFiredAlarmsByDate(...)`**. Ayrıca `acknowledgeAlarm` / `forceOffAlarm` / `commentAlarm` artık primitive arg değil, `FiredAlarmDto` alır.
:::

Detaylı API: [Alarm API →](/docs/tr/jdk21/platform/scripts/server/alarm-api/) | [REST API Reference →](/docs/tr/jdk21/api/reference/) (Alarm Group, Analog Alarm, Digital Alarm, Custom Alarm, Fired Alarm, Alarm Controller Facade grupları)
