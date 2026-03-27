---
title: "Utils API"
description: "ins.rest(), ins.runSql(), ins.ping() ve diğer yardımcı fonksiyonlar"
sidebar:
  order: 5
---

Utils API, script'ler içinden HTTP istekleri, SQL sorguları, tarih/sayı formatlama ve sistem yardımcı fonksiyonlarına erişim sağlar.

## HTTP İstekleri

### ins.rest(httpMethod, url, contentType, body)

Harici bir HTTP servisine istek gönderir.

```javascript
// GET isteği
var response = ins.rest("GET",
    "https://api.example.com/data",
    "application/json", null);

// POST isteği
var payload = JSON.stringify({temperature: 25.4, pressure: 3.2});
var response = ins.rest("POST",
    "https://api.example.com/telemetry",
    "application/json", payload);

// Yanıt
var statusCode = response.statusCode;  // 200
var body = response.body;              // yanıt gövdesi (string)
var data = JSON.parse(body);           // JSON parse
```

### ins.rest(httpMethod, url, headers, body)

Özel HTTP header'ları ile istek gönderir.

```javascript
var headers = {
    "Authorization": "Bearer eyJhbGci...",
    "Content-Type": "application/json",
    "X-API-Key": "my-key"
};

var response = ins.rest("GET", "https://api.example.com/secure", headers, null);
```

**Desteklenen HTTP metodları:** `GET`, `POST`, `PUT`, `DELETE`

:::tip
`ins.rest()` sunucu tarafında çalışır — tarayıcıdaki CORS kısıtlamalarından etkilenmez.
:::

## SQL Sorguları

### ins.runSql(sql)

Varsayılan veritabanında SQL sorgusu çalıştırır.

```javascript
var result = ins.runSql("SELECT * FROM custom_table WHERE date = CURRENT_DATE");
// result.columns = ["id", "name", "value"]
// result.rows = [[1, "temp", 25.4], [2, "press", 3.2]]
```

### ins.runSql(datasourceName, sql)

Tanımlı bir harici veri kaynağında SQL sorgusu çalıştırır.

```javascript
var result = ins.runSql("erp_database", "SELECT production_count FROM daily_report");
```

### ins.runSql(url, username, password, sql)

Doğrudan bağlantı bilgileriyle SQL sorgusu çalıştırır.

```javascript
var result = ins.runSql(
    "jdbc:postgresql://192.168.1.50:5432/erp",
    "reader", "password123",
    "SELECT * FROM orders WHERE status = 'active'"
);
```

## InfluxQL Sorguları

### ins.runInfluxQL(influxQL)

Zaman serisi veritabanında InfluxQL sorgusu çalıştırır.

```javascript
var result = ins.runInfluxQL(
    "SELECT mean(value) FROM variable_values WHERE time > now() - 1h GROUP BY time(5m)"
);
```

### ins.getCustomSqlQuery(name) / ins.getCustomInfluxQLQuery(name)

Platformda tanımlı özel sorgu şablonlarını getirir.

```javascript
var sql = ins.getCustomSqlQuery("daily_report");
var result = ins.runSql(sql);
```

## Tarih ve Zaman

### ins.now()

Sunucunun güncel zamanını döndürür.

```javascript
var now = ins.now();
ins.consoleLog("Şu an: " + now.toISOString());
```

### ins.getDate(ms)

Milisaniye değerinden Date nesnesi oluşturur.

```javascript
var yesterday = ins.getDate(Date.now() - 86400000);
var oneHourAgo = ins.getDate(Date.now() - 3600000);
```

## Sayı ve Metin Formatlama

### ins.formatNumber(number, pattern, decimalSeparator, groupingSeparator)

Sayıyı belirli formatta metin olarak döndürür.

```javascript
ins.formatNumber(1234567.89, "#,##0.00", ",", ".");
// "1.234.567,89"

ins.formatNumber(3.14159, "0.00", ".", ",");
// "3.14"
```

### ins.leftPad(str, len, padChar)

Metnin soluna karakter ekleyerek belirli uzunluğa tamamlar.

```javascript
ins.leftPad("42", 5, "0");   // "00042"
ins.leftPad("AB", 4, " ");   // "  AB"
```

### ins.uuid()

Benzersiz UUID üretir.

```javascript
var id = ins.uuid();  // "550e8400-e29b-41d4-a716-446655440000"
```

## Bit İşlemleri

### ins.getBit(value, bitIndex)

Bir sayının belirli bit'ini okur.

```javascript
var statusWord = ins.getVariableValue("status_register").value;
var bit3 = ins.getBit(statusWord, 3);  // true veya false
```

### ins.setBit(value, bitIndex, bitValue)

Bir sayının belirli bit'ini ayarlar.

```javascript
var word = 0;
word = ins.setBit(word, 0, true);   // bit 0 = 1 → word = 1
word = ins.setBit(word, 3, true);   // bit 3 = 1 → word = 9
```

## Ağ

### ins.ping(address, timeout)

Bir IP adresine ping gönderir.

```javascript
var reachable = ins.ping("192.168.1.1", 3000);
if (!reachable) {
    ins.notify("warning", "Ağ Uyarısı", "PLC erişilemez!");
}
```

### ins.ping(address, port, timeout)

Belirli bir porta TCP bağlantı testi yapar.

```javascript
var portOpen = ins.ping("192.168.1.1", 502, 3000);
```

## JSON

### ins.toJSONStr(object)

JavaScript nesnesini JSON string'e dönüştürür.

```javascript
var obj = {temperature: 25.4, status: "ok"};
var json = ins.toJSONStr(obj);
// '{"temperature":25.4,"status":"ok"}'
```

## UI Fonksiyonları

Script'ler içinden kullanıcı arayüzü ile etkileşim:

```javascript
// Konsol logu
ins.consoleLog("Debug: değer = " + value);

// Numpad açma (değer girişi)
ins.numpad("setpoint_temperature");

// Tüm istemcileri yenile
ins.refreshAllClients();

// UI yeniden yükle
ins.reloadUi();

// Gece/gündüz modu
ins.setDayNightMode(true);  // gece modu

// Ses çalma
ins.playAudio(true, "alarm.wav", false);

// Onay popup'ı
ins.confirm("warning", "Dikkat", "Pompa durdurulsun mu?", callbackObj);
```

## Dosya İşlemleri

### ins.writeToFile(fileName, text, append)

Sunucu dosya sistemine yazar.

```javascript
ins.writeToFile("report.csv", "timestamp,temperature,pressure\n", false);
ins.writeToFile("report.csv", ins.now() + ",25.4,3.2\n", true);
```

### ins.readFile(fileName)

Sunucu dosya sisteminden okur.

```javascript
var content = ins.readFile("config.json");
var config = JSON.parse(content);
```
