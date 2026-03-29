---
title: "Variable API"
description: "ins.getVariableValue, ins.setVariableValue ve diğer değişken fonksiyonları"
sidebar:
  order: 1
---

Variable API, script'ler içinden inSCADA değişkenlerinin anlık ve tarihsel değerlerine erişim sağlar.

## Değer Okuma

### ins.getVariableValue(name)

Bir değişkenin anlık değerini okur. Cache'ten (In-Memory) alır, < 1ms erişim süresi.

```javascript
var result = ins.getVariableValue("ActivePower_kW");
var power = result.value;
var time = result.dateInMs;
```

Yanıt:
```json
{
  "flags": { "scaled": true },
  "date": 1774686685945,
  "value": 359.91,
  "extras": { "raw_value": 606.56 },
  "variableShortInfo": {
    "dsc": "Total active power",
    "frame": "Energy-Frame",
    "project": "Energy Monitoring Demo",
    "device": "Energy-Device",
    "name": "ActivePower_kW",
    "connection": "LOCAL-Energy"
  },
  "dateInMs": 1774686685945
}
```

| Alan | Açıklama |
|------|----------|
| **value** | Ölçeklenmiş (engineering) değer |
| **extras.raw_value** | Ham (raw) değer |
| **dateInMs** | Zaman damgası (milisaniye, epoch) |
| **flags.scaled** | Ölçekleme uygulandı mı |
| **variableShortInfo** | Değişken meta bilgisi (proje, cihaz, bağlantı vb.) |

**Farklı projeden okuma:**
```javascript
var val = ins.getVariableValue("other_project", "pressure");
```

**Dizi değişken okuma (index ile):**
```javascript
var val = ins.getVariableValue("array_var", 3);  // 4. eleman
```

### ins.getVariableValues(names[])

Birden fazla değişkeni toplu okur. Tek tek okumaktan daha performanslıdır.

```javascript
var values = ins.getVariableValues(["ActivePower_kW", "Voltage_V", "Current_A"]);
var power = values.ActivePower_kW.value;
var voltage = values.Voltage_V.value;
```

Yanıt:
```json
{
  "ActivePower_kW": {
    "flags": { "scaled": true },
    "value": 351.78,
    "extras": { "raw_value": 606.56 },
    "variableShortInfo": { "name": "ActivePower_kW", "dsc": "Total active power" },
    "dateInMs": 1774686691951
  },
  "Voltage_V": {
    "flags": { "scaled": true },
    "value": 236.1,
    "extras": { "raw_value": 229.7 },
    "variableShortInfo": { "name": "Voltage_V", "dsc": "Line voltage" },
    "dateInMs": 1774686691951
  },
  "Current_A": {
    "flags": { "scaled": true },
    "value": 34.33,
    "extras": { "raw_value": 58.92 },
    "variableShortInfo": { "name": "Current_A", "dsc": "Line current" },
    "dateInMs": 1774686691951
  }
}
```

### ins.getProjectVariableValues()

Projedeki tüm değişkenlerin anlık değerlerini toplu okur.

```javascript
var all = ins.getProjectVariableValues();
// tüm variable name → value map
```

## Değer Yazma

### ins.setVariableValue(name, details)

Bir değişkene değer yazar. `details` parametresi `{value: X}` formatında bir Map'tir.

```javascript
ins.setVariableValue("Temperature_C", {value: 55.0});
ins.setVariableValue("GridStatus", {value: true});
```

**Farklı projeye yazma:**
```javascript
ins.setVariableValue("other_project", "target_temp", {value: 80.0});
```

### ins.setVariableValues(map)

Birden fazla değişkene toplu değer yazar.

```javascript
ins.setVariableValues({
    "Temperature_C": {value: 42.5},
    "Voltage_V": {value: 228.0}
});

// Doğrulama
var vals = ins.getVariableValues(["Temperature_C", "Voltage_V"]);
// → {Temperature_C: 52.9, Voltage_V: 226.6}
```

### ins.mapVariableValue(src, dest)

Bir değişkenin değerini başka bir değişkene kopyalar.

```javascript
// temperature değerini display_temp'e kopyala
ins.mapVariableValue("Temperature_C", "display_temp");

// Varsayılan değer ile (kaynak null ise)
ins.mapVariableValue("Temperature_C", "display_temp", 0);
```

### ins.toggleVariableValue(name)

Boolean bir değişkenin değerini tersine çevirir (true → false, false → true).

```javascript
ins.toggleVariableValue("GridStatus");
```

## Tarihsel Veri Sorgulama

### ins.getLoggedVariableValuesByPage(names, startDate, endDate, page, pageSize)

Queries historical data records with pagination.

```javascript
var end = ins.now();
var start = ins.getDate(end.getTime() - 300000); // 5 dakika önce

var logs = ins.getLoggedVariableValuesByPage(
    ["ActivePower_kW"],
    start, end,
    0,   // sayfa numarası
    5    // sayfa boyutu
);
```

Yanıt:
```json
[
  {
    "value": 616.41,
    "dttm": 1774687311955,
    "flags": { "scaled": true },
    "project": "Energy Monitoring Demo",
    "variableId": 23227,
    "extras": { "raw_value": 606.56 },
    "name": "ActivePower_kW",
    "projectId": 153
  },
  {
    "value": 609.38,
    "dttm": 1774687291956,
    "flags": { "scaled": true },
    "name": "ActivePower_kW"
  },
  {
    "value": 602.68,
    "dttm": 1774687271952
  }
]
```

:::note
Sonuçlar **en yeniden eskiye** sıralıdır. Eskiden yeniye sıralı sonuçlar için `getLoggedVariableValuesByPageAsc()` kullanın.
:::

### ins.getLoggedVariableValueStats(names, startDate, endDate)

Belirli aralıktaki istatistikleri hesaplar (ortalama, min, max, toplam, medyan).

```javascript
var end = ins.now();
var start = ins.getDate(end.getTime() - 3600000); // 1 saat önce

var stats = ins.getLoggedVariableValueStats(
    ["ActivePower_kW"],
    start, end
);
```

Yanıt:
```json
{
  "ActivePower_kW": {
    "maxValue": 624.76,
    "minValue": 305.11,
    "avgValue": 470.95,
    "sumValue": 74881.16,
    "countValue": 159,
    "medianValue": 482.58,
    "firstValue": 464.04,
    "lastValue": 543.08,
    "maxDiffValue": 319.65,
    "lastFirstDiffValue": 79.04,
    "variableId": 23227,
    "name": "ActivePower_kW"
  }
}
```

| Alan | Açıklama |
|------|----------|
| **avgValue** | Ortalama |
| **minValue / maxValue** | Minimum / Maksimum |
| **sumValue** | Toplam |
| **countValue** | Kayıt sayısı |
| **medianValue** | Medyan |
| **firstValue / lastValue** | İlk / Son değer |
| **maxDiffValue** | Max-Min farkı |
| **lastFirstDiffValue** | Son-İlk farkı |

### ins.getLoggedHourlyVariableValueStats / getLoggedDailyVariableValueStats

Saatlik veya günlük gruplanmış istatistikler.

```javascript
var hourly = ins.getLoggedHourlyVariableValueStats(
    ["ActivePower_kW"],
    startDate, endDate
);
```

## Değişken Bilgileri

### ins.getVariables()

Projedeki tüm değişken tanımlarını listeler.

```javascript
var variables = ins.getVariables();
// variable listesi (name, type, connection, device, frame bilgileriyle)
```

### ins.getVariable(name)

Tek bir değişkenin tanım bilgilerini getirir.

```javascript
var v = ins.getVariable("ActivePower_kW");
```

Yanıt:
```json
{
  "name": "ActivePower_kW",
  "unit": "kW",
  "type": "Float",
  "dsc": "Total active power",
  "logType": "Periodically",
  "logPeriod": 10,
  "engZeroScale": 0,
  "engFullScale": 1000,
  "fractionalDigitCount": 2
}
```

### ins.updateVariable(name, map)

Bir değişkenin yapılandırmasını günceller.

```javascript
ins.updateVariable("temperature", {
    "active_flag": true,
    "log_type": "PERIODICALLY"
});
```
