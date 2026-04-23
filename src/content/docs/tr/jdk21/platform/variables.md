---
title: "Değişkenler"
description: "Değişken tanımlama, ölçekleme, loglama ve value expression"
sidebar:
  order: 4
---

Değişken (Variable), inSCADA'daki en temel veri birimidir. Bir sıcaklık ölçümü, bir motor durumu, bir enerji sayacı — her biri bir değişkendir.

![Değişken Listesi](../../../../../assets/docs/dev-variables.png)

## Değişken Alanları

Temel meta veri:

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| **name** | String (≤100) | Evet | Değişken adı — proje içinde benzersiz |
| **dsc** | String (≤255) | Hayır | Açıklama |
| **code** | String (≤20) | Hayır | Kısa teknik kod (ekranlarda kullanılabilir) |
| **unit** | String (≤50) | Hayır | Mühendislik birimi (°C, kW, V, A, bar, …) |
| **fractionalDigitCount** | Short | Hayır | Ekrana yazılırken ondalık basamak sayısı |
| **projectId** | String | Evet | Ait olduğu proje |
| **frameId** | String | Evet | Ait olduğu frame (protokol ve device da buradan çıkarılır) |
| **protocol** | `Protocol` | Otomatik | Frame'den miras alınır |
| **isActive** | Boolean | Evet | Aktif / pasif |
| **isWritable** | Boolean | Evet | Dışarıdan yazılabilir mi |

Ölçekleme:

| Alan | Tip | Açıklama |
|------|-----|----------|
| **rawZeroScale** | Double | Ham değer alt sınırı |
| **rawFullScale** | Double | Ham değer üst sınırı |
| **engZeroScale** | Double | Mühendislik birimi alt sınırı |
| **engFullScale** | Double | Mühendislik birimi üst sınırı |

Loglama:

| Alan | Tip | Açıklama |
|------|-----|----------|
| **logType** | `VariableLogType` | Aşağıdaki tabloya bakın |
| **logPeriod** | Integer (≥1) | Periyodik loglama süresi (s) |
| **logThreshold** | Double | Minimum değişim eşiği (noise filtresi) |
| **logMinValue / logMaxValue** | Double | Geçerli değer aralığı — dışındakiler loglanmaz |
| **logExpressionCode** | String | Loglama kararını üreten kod (logType = Expression/Custom için) |
| **logExpressionId** | String | Paylaşımlı Expression referansı |
| **keepLastValues** | Boolean | Son değer listesini cache'te tut (bkz. `ins.getLastVariableValues`) |

Value Expression (değer üretme):

| Alan | Tip | Açıklama |
|------|-----|----------|
| **valueExpressionType** | `ExpressionType` | `NONE`, `CUSTOM` veya `EXPRESSION` |
| **valueExpressionCode** | String (≤32 767) | Satır içi kod (tip = `CUSTOM`) |
| **valueExpressionId** | String | Paylaşımlı Expression referansı (tip = `EXPRESSION`) |

Yazma sınırları & darbe (pulse):

| Alan | Tip | Açıklama |
|------|-----|----------|
| **setMinValue / setMaxValue** | Double | Kabul edilen yazma aralığı |
| **isPulseOn / pulseOnDuration** | Boolean / Integer | ON darbesi ve süresi (ms) |
| **isPulseOff / pulseOffDuration** | Boolean / Integer | OFF darbesi ve süresi (ms) |

Protokole özgü alanlar (adres, veri tipi, byte/word swap vb.) `config` JSONB alanında tutulur ve API yanıtında üst seviyeye düzleştirilerek döner.

## Veri Tipleri

Her protokolün kendi veri tipi enum'u vardır; ortak kavramsal haritalama:

| Kavram | Modbus | OPC UA | Diğer |
|--------|--------|--------|-------|
| **Float** | Float, Double | Float, Double | çoğu protokolde var |
| **Integer** | Integer, Short, Long, Byte, Unsigned … | Int16/32/64, UInt16/32/64, Byte, SByte | protokole göre değişir |
| **Boolean** | Boolean | Boolean | |
| **String** | String | String | |
| **BCD** | 16/32/64-bit BCD | — | Modbus'a özgü |

Modbus için tam liste: `Float`, `Double`, `Integer`, `Short`, `Long`, `Byte`, `Unsigned Integer`, `Unsigned Short`, `Unsigned Byte`, `16 BIT BCD`, `32 BIT BCD`, `64 BIT BCD`, `Boolean`, `String`. Diğer protokollerin tip listeleri için protokol sayfalarına bakın.

## Değişken JSON Örneği (Modbus, Holding Register'dan Float)

```json
{
  "id": "var-23227",
  "name": "ActivePower_kW",
  "dsc": "Total active power",
  "unit": "kW",
  "protocol": "Modbus TCP",
  "projectId": "proj-153",
  "frameId": "frame-703",
  "isActive": true,
  "isWritable": false,
  "fractionalDigitCount": 2,
  "engZeroScale": 0.0,
  "engFullScale": 1000.0,
  "logType": "Periodically",
  "logPeriod": 10,
  "keepLastValues": true,
  "valueExpressionType": "NONE",

  "type": "Float",
  "startAddress": 0,
  "byteSwapFlag": false,
  "wordSwapFlag": true
}
```

Son dört alan (`type`, `startAddress`, `byteSwapFlag`, `wordSwapFlag`) Modbus'a özgü `config` alanlarıdır.

---

## Ölçekleme (Scaling)

Ham (raw) değer, mühendislik değerine lineer dönüşüm ile çevrilir.

### Dönüşüm Formülü

```
Eng = engZeroScale + (raw - rawZeroScale) ×
      (engFullScale - engZeroScale) / (rawFullScale - rawZeroScale)
```

### Örnek: 4-20 mA sensör → 0-100 °C

| Parametre | Değer |
|-----------|-------|
| rawZeroScale | 4 (mA) |
| rawFullScale | 20 (mA) |
| engZeroScale | 0 (°C) |
| engFullScale | 100 (°C) |

- Raw: 4 mA → Eng: 0 °C
- Raw: 12 mA → Eng: 50 °C
- Raw: 20 mA → Eng: 100 °C

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

Değişken değerleri InfluxDB'ye `VariableLogType`'a göre yazılır.

### Loglama Tipleri

`VariableLogType` enum — altı değer:

| Tip | Açıklama |
|-----|----------|
| **No Log** | Kayıt yok |
| **When Changed** | Yalnızca değer değiştiğinde kayıt |
| **Periodically** | Sabit aralıkla kayıt (`logPeriod` saniye) |
| **Threshold** | `logThreshold` değerinden fazla değişim olduğunda kayıt |
| **Expression** | `logExpressionId` ile paylaşımlı Expression değerlendirilir — truthy dönerse kayıt |
| **Custom** | `logExpressionCode` satır içi kod — truthy dönerse kayıt |

### Loglama Parametreleri

| Parametre | Açıklama |
|-----------|----------|
| **logPeriod** | Periyodik loglama periyodu (saniye). `10` = her 10 saniyede bir |
| **logThreshold** | Minimum değişim eşiği (Threshold modu veya ek filtre için) |
| **logMinValue / logMaxValue** | Geçerli değer aralığı. Dışındaki değerler loglanmaz |
| **keepLastValues** | Son değer listesini cache'te tut (`ins.getLastVariableValues(name, n)` çağrısı için) |

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

`ExpressionType` enum:

| Tip | Açıklama |
|-----|----------|
| **NONE** | Expression yok — ham değer (ölçeklenmiş) kullanılır |
| **CUSTOM** | `valueExpressionCode` içindeki satır içi kod çalıştırılır |
| **EXPRESSION** | `valueExpressionId` ile paylaşımlı Expression referansı — space seviyesi formül havuzundan |

### Örnek: Simülasyon

```javascript
// Sinüs dalga (ActivePower_kW)
var t = new Date().getTime() / 1000;
return (Math.sin(t / 60) * 150 + 450 + Math.random() * 30).toFixed(2) * 1;
```

### Örnek: Birim Dönüşümü

```javascript
// Fahrenheit → Celsius (ham değer 'value' olarak erişilebilir)
return ((value - 32) * 5 / 9).toFixed(1) * 1;
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

| Alan | Açıklama |
|------|----------|
| **isPulseOn** | ON darbesi aktif |
| **pulseOnDuration** | ON darbe süresi (ms) |
| **isPulseOff** | OFF darbesi aktif |
| **pulseOffDuration** | OFF darbe süresi (ms) |

Darbe modu, anlık komut gönderimi için kullanılır — örneğin motor start butonu: basıldığında ON, `pulseOnDuration` süresi dolunca otomatik OFF. Operatörün manuel OFF göndermesine gerek kalmaz.

---

## Yazma Sınırları

| Alan | Açıklama |
|------|----------|
| **setMinValue** | Yazılabilir minimum değer |
| **setMaxValue** | Yazılabilir maksimum değer |

Bu değerler ayarlandığında, aralık dışı yazma komutları API ve script üzerinden reddedilir. Operatör hatalarını önlemek için kullanılır.

---

## Script ile Değişken Yönetimi

```javascript
// Anlık değer oku
var val = ins.getVariableValue("ActivePower_kW");
// → { value: 359.91, extras: { raw_value: 606.56 }, dateInMs: ... }

// Toplu okuma
var vals = ins.getVariableValues(["ActivePower_kW", "Voltage_V", "Current_A"]);

// Değer yaz
ins.setVariableValue("Temperature_C", { value: 55.0 });

// Son N değer (keepLastValues = true olan değişkenlerde)
var last100 = ins.getLastVariableValues("Temperature_C", 100);

// Loglanmış (tarihsel) değerleri sorgula
var start = ins.getDate(ins.now().getTime() - 3600000); // son 1 saat
var history = ins.getLoggedValues("Temperature_C", start, ins.now());
```

Detaylı API: [Variable API →](/docs/tr/jdk21/platform/scripts/server/variable-api/) | [REST API Reference →](/docs/tr/jdk21/api/reference/) (Variable Value Controller, Protocol Variable Controller grupları)
