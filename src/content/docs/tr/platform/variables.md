---
title: "Değişkenler"
description: "Değişken tanımlama, ölçekleme, loglama ve value expression"
sidebar:
  order: 4
---

Değişken (Variable), inSCADA'daki en temel veri birimidir. Bir sıcaklık ölçümü, bir motor durumu, bir enerji sayacı — her biri bir değişkendir.

![Değişken Listesi](../../../../assets/docs/dev-variables.png)

## Değişken Oluşturma

**Menü:** Runtime → Variables → Yeni Değişken

| Alan | Zorunlu | Açıklama |
|------|---------|----------|
| **Name** | Evet | Değişken adı (proje içinde benzersiz) |
| **Type** | Evet | Veri tipi |
| **Unit** | Hayır | Mühendislik birimi (°C, kW, V, A, bar...) |
| **Description** | Hayır | Açıklama |
| **Connection / Device / Frame** | Evet | Hangi bağlantıya ait |
| **Active** | Evet | Aktif/pasif |

## Veri Tipleri

| Tip | Açıklama | Örnek |
|-----|----------|-------|
| **Float** | Ondalıklı sayı | 25.4, 230.1, 0.95 |
| **Integer** | Tam sayı | 100, -5, 0 |
| **Boolean** | Doğru/Yanlış | true, false |
| **String** | Metin | "Recipe-A", "Running" |

## Değişken Yapısı (Örnek)

```json
{
  "id": 23227,
  "name": "ActivePower_kW",
  "dsc": "Total active power",
  "type": "Float",
  "unit": "kW",
  "projectId": 153,
  "connectionId": 153,
  "deviceId": 453,
  "frameId": 703,
  "isActive": true,
  "fractionalDigitCount": 2,
  "engZeroScale": 0.0,
  "engFullScale": 1000.0,
  "logType": "Periodically",
  "logPeriod": 10,
  "keepLastValues": true,
  "valueExpressionType": "CUSTOM",
  "valueExpressionCode": "var t = new Date().getTime() / 1000; return (Math.sin(t / 60) * 150 + 450 + Math.random() * 30).toFixed(2) * 1;"
}
```

---

## Ölçekleme (Scaling)

Ham (raw) değer, mühendislik değerine lineer dönüşüm ile çevrilir.

| Parametre | Açıklama |
|-----------|----------|
| **engZeroScale** | Mühendislik birimi alt sınır |
| **engFullScale** | Mühendislik birimi üst sınır |
| **rawZeroScale** | Ham değer alt sınır |
| **rawFullScale** | Ham değer üst sınır |

### Dönüşüm Formülü

```
Eng = engZeroScale + (raw - rawZeroScale) ×
      (engFullScale - engZeroScale) / (rawFullScale - rawZeroScale)
```

### Örnek: 4-20mA Sensör → 0-100°C

| Parametre | Değer |
|-----------|-------|
| rawZeroScale | 4 (mA) |
| rawFullScale | 20 (mA) |
| engZeroScale | 0 (°C) |
| engFullScale | 100 (°C) |

- Raw: 4mA → Eng: 0°C
- Raw: 12mA → Eng: 50°C
- Raw: 20mA → Eng: 100°C

### Anlık Değer Yanıtında Ölçekleme

```json
{
  "value": 359.91,
  "extras": { "raw_value": 606.56 },
  "flags": { "scaled": true }
}
```

`value` ölçeklenmiş mühendislik değeri, `extras.raw_value` ham değerdir.

---

## Loglama (Tarihsel Veri)

Değişken değerleri zaman serisi veritabanına kaydedilebilir.

### Loglama Tipleri

| Tip | Açıklama |
|-----|----------|
| **Periodically** | Sabit aralıkla kayıt (`logPeriod` saniye) |
| **When Changed** | Yalnızca değer değiştiğinde kayıt |
| **None** | Kayıt yok |

### Loglama Parametreleri

| Parametre | Açıklama |
|-----------|----------|
| **logPeriod** | Kayıt periyodu (saniye). `10` = her 10 saniyede bir |
| **logThreshold** | Minimum değişim eşiği (opsiyonel). Küçük dalgalanmaları filtreler |
| **logMinValue / logMaxValue** | Geçerli değer aralığı. Dışındaki değerler loglanmaz |
| **keepLastValues** | Son değer listesini bellekte tut |

### Fractional Digit Count

`fractionalDigitCount` gösterilecek ondalık basamak sayısını belirler:

| Değer | Gösterim |
|-------|----------|
| `0` | 350 |
| `1` | 350.5 |
| `2` | 350.48 |
| `3` | 350.483 |

---

## Value Expression

Değişkene özel bir JavaScript formülü atanabilir. Her okuma döngüsünde bu formül çalışır ve sonucu değişkenin değeri olur.

### Expression Tipleri

| Tip | Açıklama |
|-----|----------|
| **NONE** | Expression yok, ham değer kullanılır |
| **CUSTOM** | Satır içi JavaScript kodu |
| **REFERENCE** | Paylaşımlı Expression referansı (space seviyesi) |

### Örnek: Simülasyon

```javascript
// Sinüs dalga (ActivePower_kW)
var t = new Date().getTime() / 1000;
return (Math.sin(t / 60) * 150 + 450 + Math.random() * 30).toFixed(2) * 1;
```

### Örnek: Birim Dönüşümü

```javascript
// Fahrenheit → Celsius
var fahrenheit = value; // ham değer
return ((fahrenheit - 32) * 5 / 9).toFixed(1) * 1;
```

### Örnek: Koşullu Mantık

```javascript
// İki değişkenden verimlilik hesapla
var input = ins.getVariableValue("Input_kW").value;
var output = ins.getVariableValue("Output_kW").value;
if (input > 0) {
    return ((output / input) * 100).toFixed(1) * 1;
}
return 0;
```

---

## Pulse (Darbe) Özelliği

Boolean değişkenlere darbe modu atanabilir:

| Parametre | Açıklama |
|-----------|----------|
| **isPulseOn** | ON darbesi aktif |
| **pulseOnDuration** | ON darbe süresi (ms) |
| **isPulseOff** | OFF darbesi aktif |
| **pulseOffDuration** | OFF darbe süresi (ms) |

Darbe modu, anlık komut gönderimi için kullanılır (örn: motor start butonu — basıldığında ON, bırakıldığında otomatik OFF).

---

## Yazma Sınırları

| Parametre | Açıklama |
|-----------|----------|
| **setMinValue** | Yazılabilir minimum değer |
| **setMaxValue** | Yazılabilir maksimum değer |

Bu parametreler ayarlandığında, aralık dışı yazma komutları reddedilir. Operatör hatalarını önlemek için kullanılır.

---

## Script ile Değişken Yönetimi

```javascript
// Anlık değer oku
var val = ins.getVariableValue("ActivePower_kW");
// → { value: 359.91, extras: { raw_value: 606.56 }, dateInMs: ... }

// Toplu okuma
var vals = ins.getVariableValues(["ActivePower_kW", "Voltage_V", "Current_A"]);

// Değer yaz
ins.setVariableValue("Temperature_C", {value: 55.0});

// Değişken bilgisi
var info = ins.getVariable("ActivePower_kW");
// → { name: "ActivePower_kW", unit: "kW", type: "Float", logPeriod: 10 ... }
```

Detaylı API: [Variable API →](/docs/tr/platform/scripts/variable-api/) | [REST API →](/docs/tr/api/variables/)
