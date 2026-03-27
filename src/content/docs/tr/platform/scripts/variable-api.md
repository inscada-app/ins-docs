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
var result = ins.getVariableValue("temperature");
// result = {value: 25.4, date: "2026-03-27T10:30:00Z"}

var temp = result.value;  // 25.4
var time = result.date;   // zaman damgası
```

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
var values = ins.getVariableValues(["temp", "pressure", "flow"]);
// values = {"temp": {value: 25.4}, "pressure": {value: 3.2}, "flow": {value: 120}}

var temp = values.temp.value;
var press = values.pressure.value;
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
ins.setVariableValue("setpoint", {value: 75.0});
ins.setVariableValue("motor_start", {value: true});
ins.setVariableValue("recipe_name", {value: "Recipe-A"});
```

**Farklı projeye yazma:**
```javascript
ins.setVariableValue("other_project", "target_temp", {value: 80.0});
```

### ins.setVariableValues(map)

Birden fazla değişkene toplu değer yazar.

```javascript
ins.setVariableValues({
    "setpoint_1": {value: 75.0},
    "setpoint_2": {value: 80.0},
    "mode": {value: 1}
});
```

### ins.mapVariableValue(src, dest)

Bir değişkenin değerini başka bir değişkene kopyalar.

```javascript
// temperature değerini display_temp'e kopyala
ins.mapVariableValue("temperature", "display_temp");

// Varsayılan değer ile (kaynak null ise)
ins.mapVariableValue("temperature", "display_temp", 0);
```

### ins.toggleVariableValue(name)

Boolean bir değişkenin değerini tersine çevirir (true → false, false → true).

```javascript
ins.toggleVariableValue("pump_running");
```

## Tarihsel Veri Sorgulama

### ins.getLoggedVariableValuesByPage(names, startDate, endDate, page, pageSize)

Tarihsel veri kayıtlarını sayfalı olarak sorgular.

```javascript
var startDate = ins.getDate(Date.now() - 86400000); // 24 saat önce
var endDate = ins.now();

var logs = ins.getLoggedVariableValuesByPage(
    ["temperature", "pressure"],
    startDate, endDate,
    0,    // sayfa numarası
    1000  // sayfa boyutu
);
```

### ins.getLoggedVariableValueStats(names, startDate, endDate)

Belirli aralıktaki istatistikleri hesaplar (ortalama, min, max, toplam).

```javascript
var stats = ins.getLoggedVariableValueStats(
    ["temperature"],
    startDate, endDate
);
// stats.temperature = {avg, min, max, sum, count}
```

### ins.getLoggedHourlyVariableValueStats / getLoggedDailyVariableValueStats

Saatlik veya günlük gruplanmış istatistikler.

```javascript
var hourly = ins.getLoggedHourlyVariableValueStats(
    ["energy_consumption"],
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
var v = ins.getVariable("temperature");
```

### ins.updateVariable(name, map)

Bir değişkenin yapılandırmasını günceller.

```javascript
ins.updateVariable("temperature", {
    "active_flag": true,
    "log_type": "PERIODICALLY"
});
```
