---
title: "Cihaz ve Frame"
description: "Cihaz (Device) ve veri çerçevesi (Frame) yapılandırması"
sidebar:
  order: 3
---

![Cihaz Listesi](../../../../../assets/docs/dev-devices.png)

## Cihaz (Device)

Cihaz, bir bağlantı üzerindeki fiziksel veya mantıksal birimi temsil eder. Bir bağlantı altında birden fazla cihaz olabilir (örneğin bir Modbus TCP bağlantısında birden fazla slave cihaz).

### Cihaz Alanları

Ortak alanlar:

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| **name** | String (≤100) | Evet | Cihaz adı (bağlantı içinde benzersiz) |
| **dsc** | String (≤255) | Hayır | Açıklama |
| **protocol** | `Protocol` | Otomatik | Bağlantıdan miras alınır |
| **connectionId** | String | Evet | Ait olduğu bağlantının kimliği |
| **config** | Map | Protokole göre | Protokole özgü ayarlar (JSONB) |

Cihaz JSON'unun üst seviyesinde görünen ek alanlar `config` içinden gelir — inSCADA DTO'yu düzleştirerek sunar. Modbus için bu alanlar:

| Alan | Tip | Açıklama |
|------|-----|----------|
| **scanTime** | Integer (≥100) | Okuma döngüsü (ms) |
| **scanType** | `DeviceScanType` | `Periodic` veya `Fixed Delay` |
| **stationAddress** | Integer (≥0) | Modbus slave adresi |

### Scan Type

`DeviceScanType` enum — iki değer:

| Değer | Davranış |
|-------|----------|
| **Periodic** | Bir döngünün başlangıcından diğerine `scanTime` sabit — gecikme olursa sonraki tur kısalır (fixed rate) |
| **Fixed Delay** | Bir döngü bittikten sonra `scanTime` kadar bekler ve tekrar başlatır (fixed delay) |

### Cihaz JSON Örneği (Modbus)

```json
{
  "id": "abc123",
  "connectionId": "conn-153",
  "protocol": "Modbus TCP",
  "name": "slave-1",
  "dsc": "Energy meter",
  "scanTime": 2000,
  "scanType": "Periodic",
  "stationAddress": 1
}
```

### Scan Time Önerileri

| Senaryo | Önerilen scanTime |
|---------|-------------------|
| Hızlı değişen veriler (güç, akım) | 1000 - 2000 ms |
| Orta hızda veriler (sıcaklık, basınç) | 3000 - 5000 ms |
| Yavaş değişen veriler (enerji sayacı) | 5000 - 10000 ms |
| Durum bilgileri (açık/kapalı) | 1000 - 3000 ms |

:::tip
scanTime ne kadar kısa olursa ağ trafiği o kadar artar. Gereksinime göre optimize edin. Her protokolün kendi minimum değeri vardır (Modbus için 100 ms).
:::

:::note
Diğer protokollerde (DNP3, IEC-104, OPC UA, S7, vb.) cihaz config alanları farklıdır. Protokole özgü dokümantasyona bakın: [Protokoller →](/docs/tr/jdk21/protocols/)
:::

---

## Frame (Veri Çerçevesi)

Frame, bir cihazdan okunan veri bloğudur. Her frame belirli bir adres aralığını tanımlar. Değişkenler frame'lerin içinde yer alır.

### Frame Alanları

Ortak alanlar:

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| **name** | String (≤100) | Evet | Frame adı |
| **dsc** | String (≤255) | Hayır | Açıklama |
| **deviceId** | String | Evet | Ait olduğu cihazın kimliği |
| **protocol** | `Protocol` | Otomatik | Cihazdan miras alınır |
| **isReadable** | Boolean | Evet | Frame okunabilir mi |
| **isWritable** | Boolean | Evet | Frame'deki değişkenlere yazılabilir mi |
| **scanTimeFactor** | Integer | Hayır | Cihaz scanTime çarpanı (null veya 1 → aynı periyot) |
| **minutesOffset** | Integer | Hayır | Zamanlama ofseti (dakika) — saat başı hizalama için |
| **config** | Map | Protokole göre | Protokole özgü alanlar (JSONB) |

Modbus için config alanları:

| Alan | Tip | Açıklama |
|------|-----|----------|
| **type** | `ModbusFrameType` | Frame tipi (Coil, DiscreteInput, HoldingRegister, InputRegister) |
| **startAddress** | Integer (0-65535) | Okunacak ilk adres |
| **quantity** | Integer (1-1024) | Okunacak register/coil sayısı |
| **interFrameDelay** | Integer | İki frame arasındaki bekleme (ms) |

### Frame JSON Örneği (Modbus)

```json
{
  "id": "frame-703",
  "deviceId": "dev-453",
  "protocol": "Modbus TCP",
  "name": "holding-block",
  "dsc": "Holding registers 0-49",
  "isReadable": true,
  "isWritable": true,
  "scanTimeFactor": null,
  "minutesOffset": null,
  "type": "HoldingRegister",
  "startAddress": 0,
  "quantity": 50
}
```

### Readable / Writable

| Ayar | Açıklama |
|------|----------|
| **isReadable = true** | Frame periyodik olarak okunur (izleme) |
| **isWritable = true** | Frame'deki değişkenlere değer yazılabilir (kontrol) |
| Her ikisi de `true` | Hem okuma hem yazma — en yaygın senaryo |
| **isReadable = false** | Yalnızca yazma frame'i (setpoint gönderimi) |

### Scan Time Factor

Frame'in okuma periyodunu cihaz scanTime'ının katları olarak ayarlar:

- Cihaz scanTime = 2000 ms, frame scanTimeFactor = 3 → frame her 6000 ms'de okunur
- `null` veya `1` → cihaz scanTime ile aynı periyot

:::tip
Yavaş değişen verilerin olduğu frame'ler için scanTimeFactor kullanarak gereksiz ağ trafiğini azaltabilirsiniz.
:::

---

## Hiyerarşi Özeti

```
Connection: LOCAL-Energy (LOCAL, 127.0.0.1)
└── Device: Energy-Device (scanTime: 2000 ms, Periodic)
    └── Frame: Energy-Frame (readable + writable)
        ├── ActivePower_kW (Float, kW)
        ├── ReactivePower_kVAR (Float, kVAR)
        ├── Voltage_V (Float, V)
        ├── Current_A (Float, A)
        ├── Frequency_Hz (Float, Hz)
        ├── PowerFactor (Float)
        ├── Energy_kWh (Float, kWh)
        ├── Temperature_C (Float, °C)
        ├── Demand_kW (Float, kW)
        └── GridStatus (Boolean)
```

Bu yapı bir Modbus TCP bağlantısında da aynıdır — tek fark cihaz ve frame düzeyinde protokole özgü alanlar (stationAddress, type, startAddress, quantity vb.) eklenir.

Script ile cihaz / frame okuma ve güncelleme: [Connection API →](/docs/tr/jdk21/platform/scripts/server/connection-api/)
