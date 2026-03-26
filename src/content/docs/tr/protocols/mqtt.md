---
title: "MQTT"
description: "inSCADA'da MQTT protokolü — Subscribe/Publish yapılandırması ve script tabanlı mesaj ayrıştırma"
sidebar:
  order: 8
---

MQTT (Message Queuing Telemetry Transport), hafif, publish/subscribe tabanlı bir mesajlaşma protokolüdür. IoT ve IIoT uygulamalarında sensörler, gateway'ler ve bulut platformları arasında veri iletimi için yaygın olarak kullanılır. TCP/IP üzerinde çalışır ve varsayılan olarak port **1883** (veya TLS ile 8883) kullanır.

inSCADA, MQTT protokolünü **Client** rolünde destekler — hem **Subscribe** (veri alma) hem de **Publish** (veri gönderme) yapılabilir.

## MQTT'nin Farkı: Script Tabanlı Mesaj İşleme

inSCADA'daki MQTT implementasyonu diğer protokollerden farklı bir yaklaşım kullanır. MODBUS veya IEC 104 gibi protokollerde veri yapısı sabittir (register, IOA adresi vb.). MQTT'de ise mesaj payload'ı tamamen serbest formattadır — JSON, XML, düz metin veya binary olabilir.

Bu nedenle inSCADA, MQTT mesajlarını **Frame seviyesinde tanımlanan JavaScript scriptleri** ile parse eder. Her Frame'de iki script alanı bulunur:

- **Subscribe Expression:** Gelen mesajı parse edip variable değerlerine dönüştüren script
- **Publish Expression:** Variable değerlerini MQTT mesajına dönüştüren script

Bu yaklaşım sayesinde herhangi bir formattaki MQTT mesajını inSCADA variable'larına map'leyebilirsiniz.

## Veri Modeli

```
Connection (Bağlantı — Broker IP, port, kimlik bilgileri)
└── Device (Cihaz — Base topic)
    └── Frame (Veri Bloğu — Topic + Subscribe/Publish scriptleri)
        └── Variable (Değişken — Script çıktısındaki anahtar)
```

## Yapılandırma

### Connection

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Protocol** | MQTT | Protokol seçimi |
| **IP Address** | 192.168.1.200 | MQTT Broker IP adresi |
| **Port** | 1883 | Broker portu (1883: TCP, 8883: TLS) |
| **Identifier** | `inscada-client-1` | Client tanımlayıcı (benzersiz olmalı) |
| **Username** | (opsiyonel) | Broker kimlik doğrulama |
| **Password** | (opsiyonel) | Broker şifresi |
| **Use SSL** | false | TLS/SSL şifreleme |
| **Clean Session** | true | Temiz oturum (kalıcı abonelik yok) |
| **Keep Alive** | 60000 ms | Canlılık kontrolü periyodu |
| **Initial Delay** | 1000 ms | İlk bağlantı bekleme süresi |
| **Max Delay** | 60000 ms | Maksimum yeniden bağlanma bekleme süresi |
| **Pool Size** | 1 | Bağlantı havuzu |

### Device

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Base Topic** | `factory/line1` | Temel topic yolu (Frame topic'lerinin öneki) |

### Frame

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Topic** | `sensors/temperature` | MQTT topic (subscribe veya publish) |
| **QoS** | 1 | Quality of Service (0, 1 veya 2) |
| **Subscribe Expression** | (JavaScript kodu) | Gelen mesajı parse eden script |
| **Publish Expression** | (JavaScript kodu) | Giden mesajı oluşturan script |

#### QoS Seviyeleri

| QoS | Açıklama |
|-----|----------|
| **0** | At most once — mesaj en fazla bir kez iletilir, kayıp olabilir |
| **1** | At least once — mesaj en az bir kez iletilir, tekrar olabilir |
| **2** | Exactly once — mesaj tam bir kez iletilir, garanti |

### Variable

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Name** | `temperature` | Değişken adı (script çıktısındaki key ile eşleşmeli) |
| **Type** | Float | Veri tipi |

#### Desteklenen Veri Tipleri

| Veri Tipi | Açıklama |
|-----------|----------|
| **Boolean** | Tek bit değer |
| **Byte** | 8-bit tam sayı |
| **Short** | 16-bit tam sayı |
| **Integer** | 32-bit tam sayı |
| **Long** | 64-bit tam sayı |
| **Float** | 32-bit kayan nokta |
| **Double** | 64-bit kayan nokta |
| **String** | Karakter dizisi |

## Subscribe Expression (Mesaj Alma)

Bir MQTT mesajı geldiğinde inSCADA, Frame'deki **Subscribe Expression** scriptini çalıştırır. Script'e aşağıdaki nesneler binding olarak verilir:

| Binding | Tip | Açıklama |
|---------|-----|----------|
| **message** | Object | Gelen MQTT mesajı |
| **message.topic** | String | Mesajın geldiği topic |
| **message.payload** | String | Mesaj içeriği (string olarak) |
| **message.qos** | Integer | QoS seviyesi |
| **message.retained** | Boolean | Retained mesaj mı |
| **frame** | Object | Frame özet bilgisi |

Script, bir **JavaScript Map (Object)** döndürmelidir. Map'in key'leri Variable isimleriyle eşleşmelidir. inSCADA, dönen map'teki her key-value çiftini ilgili Variable'a yazar.

### Örnek 1: JSON Payload Parse

Gelen mesaj: `{"temperature": 25.4, "humidity": 62.1, "status": true}`

```javascript
// Subscribe Expression
var data = JSON.parse(message.payload);

// Variable isimleriyle eşleşen bir object döndür
var result = {};
result.temperature = data.temperature;
result.humidity = data.humidity;
result.status = data.status;
return result;
```

Bu script çalıştığında:
- `temperature` variable'ına `25.4` yazılır
- `humidity` variable'ına `62.1` yazılır
- `status` variable'ına `true` yazılır

### Örnek 2: İç İçe JSON Parse

Gelen mesaj: `{"device": {"id": "sensor-01", "readings": {"temp": 72.5, "press": 3.2}}}`

```javascript
var data = JSON.parse(message.payload);
var result = {};
result.device_id = data.device.id;
result.temp = data.device.readings.temp;
result.press = data.device.readings.press;
return result;
```

### Örnek 3: Düz Metin Parse (CSV)

Gelen mesaj: `25.4;62.1;1;1024`

```javascript
var parts = message.payload.split(';');
var result = {};
result.temperature = parseFloat(parts[0]);
result.humidity = parseFloat(parts[1]);
result.status = parseInt(parts[2]) === 1;
result.pressure = parseFloat(parts[3]);
return result;
```

### Örnek 4: Topic'e Göre Koşullu Parse

```javascript
var data = JSON.parse(message.payload);
var result = {};

if (message.topic.indexOf('temperature') > -1) {
    result.temperature = data.value;
} else if (message.topic.indexOf('pressure') > -1) {
    result.pressure = data.value;
}

return result;
```

### Örnek 5: ins.* API Kullanımı (Cross-Variable Erişim)

Subscribe script içinde `ins` API'si ile diğer variable'lara erişebilirsiniz:

```javascript
var data = JSON.parse(message.payload);
var result = {};
result.temperature = data.temp;

// Başka bir variable'ın güncel değerini oku
var currentSetpoint = ins.getVariableValue('setpoint_temp');
if (currentSetpoint != null) {
    // Fark hesapla ve başka bir variable'a yaz
    var diff = data.temp - currentSetpoint.value;
    result.temp_deviation = diff;
}

return result;
```

## Publish Expression (Mesaj Gönderme)

Bir Variable'a değer yazıldığında (set value) inSCADA, Frame'deki **Publish Expression** scriptini çalıştırır. Script'e aşağıdaki nesneler binding olarak verilir:

| Binding | Tip | Açıklama |
|---------|-----|----------|
| **frame** | Object | Frame özet bilgisi |
| **setValueRequests** | Array | Yazılmak istenen variable ve değer listesi |
| **setValueRequests[n].variable** | Object | Variable bilgisi (name, type) |
| **setValueRequests[n].value** | Object | Yazılacak değer |

Script, MQTT broker'a publish edilecek **String** payload döndürmelidir.

### Örnek: JSON Publish

```javascript
var payload = {};
for (var i = 0; i < setValueRequests.length; i++) {
    var req = setValueRequests[i];
    payload[req.variable.name] = req.value;
}
return JSON.stringify(payload);
```

Bu script, `{"temperature": 25.0, "setpoint": 30.0}` gibi bir JSON string üretir ve broker'a publish eder.

### Örnek: Komut Publish

```javascript
var req = setValueRequests[0];
var command = {
    action: 'set',
    variable: req.variable.name,
    value: req.value,
    timestamp: new Date().toISOString()
};
return JSON.stringify(command);
```

## ins.* Script API Referansı

MQTT script'leri içinde kullanılabilecek temel `ins` API fonksiyonları:

| Fonksiyon | Açıklama |
|-----------|----------|
| `ins.getVariableValue(name)` | Variable'ın anlık değerini oku (aynı proje) |
| `ins.getVariableValue(project, name)` | Farklı projedeki variable'ı oku |
| `ins.getVariableValues(names[])` | Birden fazla variable'ı toplu oku |
| `ins.setVariableValue(name, {value: X})` | Variable'a değer yaz |
| `ins.setVariableValues({name: {value: X}, ...})` | Birden fazla variable'a toplu yaz |
| `ins.mapVariableValue(src, dest)` | Bir variable'ın değerini başka birine kopyala |
| `ins.toggleVariableValue(name)` | Boolean variable'ı toggle et |
| `ins.sparkplugDecode(payload)` | Sparkplug B Protobuf payload'ını decode et |
| `ins.sparkplugEncode(metrics)` | Sparkplug B Protobuf payload'ı oluştur |

:::tip
`ins.getVariableValue()` dönen nesne `{value, date}` yapısındadır. Değere erişmek için `.value` kullanın: `ins.getVariableValue('temp').value`
:::

## Sparkplug B Desteği

[Sparkplug B](https://www.eclipse.org/tahu/), MQTT üzerinde endüstriyel SCADA verisi taşımak için Eclipse Foundation tarafından standartlaştırılmış bir payload spesifikasyonudur. Standart MQTT'nin üzerine şunları ekler:

- **Standart topic yapısı:** `spBv1.0/{group}/{message_type}/{edge_node}/{device}` formatında sabit hiyerarşi
- **Birth/Death sertifikaları:** Cihaz bağlandığında NBIRTH, ayrıldığında NDEATH mesajı — SCADA tarafı cihazın çevrimiçi/çevrimdışı olduğunu anında bilir
- **Auto-discovery:** Cihaz, değişken listesini ve veri tiplerini BIRTH mesajıyla gönderir — manuel tag tanımı gerekmez
- **Report by exception:** Yalnızca değişen değerler gönderilir — bant genişliği optimize edilir
- **Endüstriyel veri tipleri:** Integer, Float, Boolean, DateTime, String, Dataset, Template

Sparkplug B mesajları **Protobuf (Protocol Buffers)** formatında kodlanır — binary formattadır, JSON gibi düz metin değildir. inSCADA, `ins.sparkplugDecode()` ve `ins.sparkplugEncode()` API fonksiyonları ile Sparkplug B Protobuf mesajlarını doğrudan script içinde decode/encode edebilir.

### Subscribe — Sparkplug B Decode

```javascript
// Sparkplug B mesajını decode et
var decoded = ins.sparkplugDecode(message.payload);
var result = {};

// metrics: [{name, value, dataType, timestamp}, ...]
var metrics = decoded.metrics;
for (var i = 0; i < metrics.length; i++) {
    result[metrics[i].name] = metrics[i].value;
}

return result;
```

Bu script, Sparkplug B DDATA veya DBIRTH mesajındaki tüm metric'leri parse edip ilgili variable'lara yazar.

### Publish — Sparkplug B Encode

```javascript
// Variable değerlerinden Sparkplug B payload oluştur
var metrics = [];
for (var i = 0; i < setValueRequests.length; i++) {
    var req = setValueRequests[i];
    metrics.push({
        name: req.variable.name,
        value: req.value
    });
}

return ins.sparkplugEncode(metrics);
```

### Sparkplug B Topic Yapısı

| Topic | Mesaj Tipi | Açıklama |
|-------|-----------|----------|
| `spBv1.0/group/NBIRTH/edge_node` | Node Birth | Edge node çevrimiçi oldu |
| `spBv1.0/group/NDEATH/edge_node` | Node Death | Edge node çevrimdışı oldu |
| `spBv1.0/group/DBIRTH/edge_node/device` | Device Birth | Cihaz çevrimiçi + metric listesi |
| `spBv1.0/group/DDATA/edge_node/device` | Device Data | Canlı veri (değişen metric'ler) |
| `spBv1.0/group/DCMD/edge_node/device` | Device Command | Cihaza komut gönderme |

### Yapılandırma Örneği

Sparkplug B kullanan bir MQTT Frame yapılandırması:

| Parametre | Değer |
|-----------|-------|
| **Topic** | `spBv1.0/factory/DDATA/gateway-01/plc-01` |
| **QoS** | 0 |
| **Subscribe Expression** | Yukarıdaki decode scripti |

:::tip
Sparkplug B'de DBIRTH mesajı cihazın tüm metric tanımlarını içerir. Yeni bir cihaz entegre ederken önce DBIRTH mesajını inceleyerek hangi metric'lerin geleceğini ve veri tiplerini öğrenin, ardından inSCADA variable'larını buna göre oluşturun.
:::

## Tipik Kullanım Senaryoları

### IoT Gateway Entegrasyonu

```
IoT Sensörler ──(MQTT)──► Broker ──(MQTT)──► inSCADA
                                              (Subscribe + Parse)
```

inSCADA, IoT gateway veya sensörlerden gelen MQTT mesajlarını subscribe eder, script ile parse edip variable'lara yazar. Böylece MQTT tabanlı IoT cihazları doğrudan SCADA sistemine entegre olur.

### Bulut Platform Entegrasyonu

```
inSCADA ──(MQTT Publish)──► Broker ──► Azure IoT Hub / AWS IoT / Google Cloud IoT
```

inSCADA, topladığı saha verilerini publish expression ile JSON formatına dönüştürüp MQTT broker üzerinden bulut platformlarına iletir.

### Özel Protokol Dönüşümü

MQTT'nin script tabanlı yapısı sayesinde, standart dışı veya özel formattaki mesajları da işleyebilirsiniz. Binary payload'ları JavaScript ile decode edebilir, birden fazla topic'i tek bir frame'de birleştirebilir veya koşullu lojik uygulayabilirsiniz.

:::caution
Subscribe ve Publish expression'ları her mesajda çalıştırıldığı için performans açısından scriptlerin mümkün olduğunca basit ve verimli tutulması önerilir. Ağır hesaplamalar veya çok sayıda `ins.*` API çağrısı mesaj işleme süresini artırabilir.
:::
