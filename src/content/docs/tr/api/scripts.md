---
title: "Script API"
description: "Script CRUD, çalıştırma ve ad-hoc script runner endpoint'leri"
sidebar:
  order: 7
---

Script API, script oluşturma, güncelleme, silme ve çalıştırma işlemlerini sağlar.

## CRUD İşlemleri

| Metod | Endpoint | Açıklama |
|-------|----------|----------|
| GET | `/api/scripts` | Script listesi |
| GET | `/api/scripts/{id}` | Script detayı |
| POST | `/api/scripts` | Yeni script oluştur |
| PUT | `/api/scripts/{id}` | Script güncelle |
| DELETE | `/api/scripts/{id}` | Script sil |
| GET | `/api/scripts/{id}/status` | Script çalışma durumu |

## Ad-Hoc Script Çalıştırma

### POST /api/scripts/runner

JavaScript kodunu string olarak alıp sunucu tarafında çalıştırır. Script `ins.*` API'sine tam erişime sahiptir.

### İstek

```
POST /api/scripts/runner
Content-Type: application/json
X-Space: <space_adı>
```

```json
{
  "projectId": 153,
  "name": "test-script",
  "code": "var val = ins.getVariableValue('ActivePower_kW'); ins.toJSONStr(val);",
  "log": false,
  "compile": false
}
```

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| **projectId** | Integer | Evet | Hedef proje ID'si |
| **name** | String | Evet | Script tanımlayıcı adı |
| **code** | String | Evet | Çalıştırılacak JavaScript kodu |
| **log** | Boolean | Hayır | Execution log'u etkinleştir |
| **compile** | Boolean | Hayır | Çalıştırmadan önce derle |
| **bindings** | Object | Hayır | Script'e enjekte edilecek özel değişkenler |

### Yanıt

Script'in son ifadesinin sonucu doğrudan döner:

```
HTTP/1.1 200 OK
Content-Type: application/json

359.91
```

### cURL Örnekleri

```bash
# Login
curl -c cookies.txt -X POST http://localhost:8081/login \
  -F "username=inscada" -F "password=1907"

# Değişken değeri oku
curl -b cookies.txt -X POST http://localhost:8081/api/scripts/runner \
  -H "X-Space: claude" -H "Content-Type: application/json" \
  -d '{
    "projectId": 153,
    "name": "read-value",
    "code": "var val = ins.getVariableValue(\"ActivePower_kW\"); ins.toJSONStr(val);",
    "log": false,
    "compile": false
  }'
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

```bash
# Toplu değer oku
curl -b cookies.txt -X POST http://localhost:8081/api/scripts/runner \
  -H "X-Space: claude" -H "Content-Type: application/json" \
  -d '{
    "projectId": 153,
    "name": "read-multi",
    "code": "var vals = ins.getVariableValues([\"ActivePower_kW\",\"Voltage_V\",\"Current_A\"]); ins.toJSONStr(vals);",
    "log": false,
    "compile": false
  }'
```

```bash
# Değer yaz
curl -b cookies.txt -X POST http://localhost:8081/api/scripts/runner \
  -H "X-Space: claude" -H "Content-Type: application/json" \
  -d '{
    "projectId": 153,
    "name": "write-value",
    "code": "ins.setVariableValue(\"Temperature_C\", {value: 55.0});",
    "log": false,
    "compile": false
  }'
```

```bash
# İstatistik sorgula
curl -b cookies.txt -X POST http://localhost:8081/api/scripts/runner \
  -H "X-Space: claude" -H "Content-Type: application/json" \
  -d '{
    "projectId": 153,
    "name": "stats",
    "code": "var end=ins.now(); var start=ins.getDate(end.getTime()-3600000); var stats=ins.getLoggedVariableValueStats([\"ActivePower_kW\"],start,end); ins.toJSONStr(stats);",
    "log": false,
    "compile": false
  }'
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
    "lastValue": 543.08
  }
}
```

### Yetki

Bu endpoint `RUN_SCRIPT` yetkisi gerektirir. Script'ler sunucu tarafında Nashorn JavaScript engine ile çalışır ve `ins.*` API'sine (Variable, Connection, Alarm, Script, Report vb.) tam erişim sağlar.

:::caution
Bu endpoint sunucu tarafında kod çalıştırır. Yalnızca güvenilir kullanıcılara `RUN_SCRIPT` yetkisi verilmelidir.
:::
