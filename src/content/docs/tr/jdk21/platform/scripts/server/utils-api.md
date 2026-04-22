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
    "https://jsonplaceholder.typicode.com/todos/1",
    "application/json", null);

var statusCode = response.statusCode;
var body = response.body;
var data = JSON.parse(body);
```

Yanıt:
```json
{
  "statusCode": 200,
  "body": "{\n  \"userId\": 1,\n  \"id\": 1,\n  \"title\": \"delectus aut autem\",\n  \"completed\": false\n}"
}
```

### ins.rest(httpMethod, url, headers, body)

Özel HTTP header'ları ile istek gönderir.

```javascript
var headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
};

var response = ins.rest("GET",
    "https://jsonplaceholder.typicode.com/todos/1",
    headers, null);
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
// → Sat Mar 28 11:31:47 TRT 2026
```

### ins.getDate(ms)

Milisaniye değerinden Date nesnesi oluşturur.

```javascript
var yesterday = ins.getDate(Date.now() - 86400000);
var oneHourAgo = ins.getDate(Date.now() - 3600000);
// → Sat Mar 28 10:32:43 TRT 2026
```

## Sayı ve Metin Formatlama

### ins.formatNumber(number, pattern, decimalSeparator, groupingSeparator)

Sayıyı belirli formatta metin olarak döndürür.

```javascript
ins.formatNumber(1234567.89, "#,##0.00", ",", ".");
// → "1.234.567,89"

ins.formatNumber(3.14159, "0.00", ".", ",");
// → "3.14"
```

### ins.leftPad(str, len, padChar)

Metnin soluna karakter ekleyerek belirli uzunluğa tamamlar.

```javascript
ins.leftPad("42", 5, "0");   // → "00042"
ins.leftPad("AB", 4, " ");   // → "  AB"
```

### ins.uuid()

Benzersiz UUID üretir.

```javascript
var id = ins.uuid();
// → "f4cbb047-4376-4d8b-ae46-5cafed31155b"
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

Yanıt:
```json
{ "word": 9, "bit0": true, "bit1": false, "bit3": true }
```

## Ağ

### ins.ping(address, timeout)

Bir IP adresine ping gönderir.

```javascript
var reachable = ins.ping("127.0.0.1", 3000);
// → true

if (!reachable) {
    ins.notify("warning", "Ağ Uyarısı", "PLC erişilemez!");
}
```

### ins.ping(address, port, timeout)

Belirli bir porta TCP bağlantı testi yapar.

```javascript
var portOpen = ins.ping("127.0.0.1", 8081, 3000);
// → true
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
