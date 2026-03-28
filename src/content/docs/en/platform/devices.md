---
title: "Cihaz ve Frame"
description: "Cihaz (Device) ve veri çerçevesi (Frame) yapılandırması"
sidebar:
  order: 3
---

## Cihaz (Device)

Cihaz, bir bağlantı üzerindeki fiziksel veya mantıksal birimi temsil eder. Bir bağlantı altında birden fazla cihaz olabilir.

### Cihaz Oluşturma

**Menü:** Runtime → Connections → Bağlantı seç → Devices → Yeni Cihaz

| Alan | Zorunlu | Açıklama |
|------|---------|----------|
| **Name** | Evet | Cihaz adı |
| **Description** | Hayır | Açıklama |
| **Scan Time** | Evet | Okuma periyodu (ms) |
| **Scan Type** | Evet | Okuma tipi (Periodic, OnDemand) |

### Cihaz Yapısı (Örnek)

```json
{
  "id": 453,
  "name": "Energy-Device",
  "connectionId": 153,
  "dsc": "Energy monitoring simulated device",
  "scanTime": 2000,
  "scanType": "Periodic"
}
```

| Alan | Açıklama |
|------|----------|
| **scanTime** | Okuma periyodu milisaniye cinsinden. `2000` = her 2 saniyede bir okuma |
| **scanType** | `Periodic` = sürekli okuma, `OnDemand` = sadece istendiğinde |

### Scan Time Önerileri

| Senaryo | Önerilen Scan Time |
|---------|-------------------|
| Hızlı değişen veriler (güç, akım) | 1000 - 2000 ms |
| Orta hızda veriler (sıcaklık, basınç) | 3000 - 5000 ms |
| Yavaş değişen veriler (enerji sayacı) | 5000 - 10000 ms |
| Durum bilgileri (açık/kapalı) | 1000 - 3000 ms |

:::tip
Scan time ne kadar kısa olursa ağ trafiği o kadar artar. Gereksinime göre optimize edin.
:::

---

## Frame (Veri Çerçevesi)

Frame, bir cihazdan okunan veri bloğudur. Her frame belirli bir adres aralığını tanımlar. Değişkenler frame'lerin içinde yer alır.

### Frame Oluşturma

**Menü:** Runtime → Connections → Bağlantı → Device → Frames → Yeni Frame

| Alan | Zorunlu | Açıklama |
|------|---------|----------|
| **Name** | Evet | Frame adı |
| **Description** | Hayır | Açıklama |
| **Readable** | Evet | Bu frame okunabilir mi |
| **Writable** | Evet | Bu frame'deki değişkenlere yazılabilir mi |
| **Scan Time Factor** | Hayır | Cihaz scan time çarpanı |
| **Minutes Offset** | Hayır | Zamanlama ofseti (dakika) |

### Frame Yapısı (Örnek)

```json
{
  "id": 703,
  "name": "Energy-Frame",
  "deviceId": 453,
  "dsc": "Energy monitoring frame",
  "isReadable": true,
  "isWritable": true,
  "scanTimeFactor": null,
  "minutesOffset": null
}
```

### Readable / Writable

| Ayar | Açıklama |
|------|----------|
| **Readable = true** | Frame periyodik olarak okunur (izleme) |
| **Writable = true** | Frame'deki değişkenlere değer yazılabilir (kontrol) |
| **Her ikisi = true** | Hem okuma hem yazma (en yaygın) |
| **Readable = false** | Yalnızca yazma frame'i (setpoint gönderimi) |

### Scan Time Factor

Frame'in okuma periyodunu cihaz scan time'ının katları olarak ayarlar:

- Cihaz scan time = 2000ms, Frame scan time factor = 3 → Frame her 6000ms'de okunur
- `null` veya `1` → Cihaz scan time ile aynı periyotta okunur

:::tip
Yavaş değişen verilerin olduğu frame'ler için scan time factor kullanarak gereksiz ağ trafiğini azaltabilirsiniz.
:::

---

## Hiyerarşi Özeti

```
Connection: LOCAL-Energy (LOCAL, 127.0.0.1)
└── Device: Energy-Device (scanTime: 2000ms, Periodic)
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

Bu yapı bir MODBUS bağlantısında da aynıdır — tek fark protokole özel parametreler (slave ID, başlangıç adresi, register sayısı vb.) eklenir.
