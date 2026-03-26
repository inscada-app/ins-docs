---
title: "REST API Client"
description: "inSCADA'da REST API Client — ins.rest() ile harici HTTP servislerine erişim"
sidebar:
  order: 11
---

REST API Client, inSCADA'nın yakında eklenecek bir protokol bağlantı tipidir. Bu protokol ile harici REST/HTTP servislerinden periyodik olarak veri çekilebilecek ve inSCADA variable'larına yazılabilecektir.

:::note[Yakında]
REST API Client protokolü geliştirme aşamasındadır. Mevcut sürümde henüz bir Connection tipi olarak kullanılamamaktadır.
:::

## Mevcut Alternatif: ins.rest() Script API

REST API Client protokolü hazır olana kadar, benzer ihtiyaçlar için **Script Engine** üzerinden `ins.rest()` fonksiyonu kullanılabilir. Bu fonksiyon, zamanlanmış script'ler içinden herhangi bir HTTP servisine istek göndermenizi sağlar.

### ins.rest() Kullanımı

`ins.rest()` fonksiyonu iki farklı imza ile kullanılabilir:

**İmza 1 — Content-Type ile:**
```javascript
ins.rest(httpMethod, url, contentType, body)
```

**İmza 2 — Özel Header'lar ile:**
```javascript
ins.rest(httpMethod, url, headers, body)
```

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| **httpMethod** | String | `"GET"`, `"POST"`, `"PUT"`, `"DELETE"` |
| **url** | String | Hedef URL |
| **contentType** | String | İçerik tipi (ör. `"application/json"`) |
| **headers** | Map | Özel HTTP header'ları |
| **body** | Object | İstek gövdesi (POST/PUT için) |

**Dönen değer:** `{statusCode, body, headers}` yapısında bir Map

### Örnek 1: Hava Durumu API'sinden Veri Çekme

```javascript
// Zamanlanmış script (ör. her 5 dakikada bir)
var response = ins.rest("GET",
    "https://api.openweathermap.org/data/2.5/weather?q=Istanbul&appid=YOUR_KEY&units=metric",
    "application/json", null);

if (response.statusCode == 200) {
    var data = JSON.parse(response.body);
    ins.setVariableValue("outdoor_temperature", {value: data.main.temp});
    ins.setVariableValue("outdoor_humidity", {value: data.main.humidity});
    ins.setVariableValue("wind_speed", {value: data.wind.speed});
}
```

### Örnek 2: IoT Platform'a Veri Gönderme

```javascript
// Zamanlanmış script — inSCADA verilerini harici sisteme gönder
var temp = ins.getVariableValue("temperature").value;
var press = ins.getVariableValue("pressure").value;

var payload = JSON.stringify({
    deviceId: "plant-01",
    timestamp: new Date().toISOString(),
    measurements: {
        temperature: temp,
        pressure: press
    }
});

var response = ins.rest("POST",
    "https://api.example.com/telemetry",
    "application/json", payload);

if (response.statusCode != 200) {
    ins.consoleLog("Telemetry gönderimi başarısız: " + response.statusCode);
}
```

### Örnek 3: Özel Header'lar ile API Çağrısı

```javascript
var headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs...",
    "Content-Type": "application/json",
    "X-Custom-Header": "my-value"
};

var response = ins.rest("GET",
    "https://api.example.com/data",
    headers, null);

var data = JSON.parse(response.body);
ins.setVariableValue("api_value", {value: data.result});
```

### Örnek 4: ERP Entegrasyonu — Üretim Verisi Gönderme

```javascript
// Her saat başı üretim verilerini ERP'ye gönder
var production = ins.getVariableValue("production_count").value;
var energy = ins.getVariableValue("energy_consumption").value;

var payload = JSON.stringify({
    line: "Line-1",
    shift: "morning",
    produced: production,
    energyKwh: energy,
    timestamp: ins.now().toISOString()
});

ins.rest("POST", "https://erp.company.com/api/production", "application/json", payload);
```

## Script Zamanlama

`ins.rest()` fonksiyonunu periyodik olarak çalıştırmak için inSCADA'nın **Script** modülünü kullanın:

- **CronJob:** Cron expression ile zamanlama (ör. `0 */5 * * * *` — her 5 dakikada)
- **PeriodicJob:** Sabit aralıkla (ör. her 10000 ms)
- **DailyJob:** Günlük belirli saatte (ör. her gün 08:00)

Bu sayede REST API Client protokolü olmadan da periyodik HTTP veri toplama ve gönderme işlemleri gerçekleştirilebilir.

:::tip
`ins.rest()` ile yapılan HTTP çağrıları sunucu tarafında çalışır — tarayıcıdaki CORS kısıtlamalarından etkilenmez. Herhangi bir harici API'ye erişilebilir.
:::
