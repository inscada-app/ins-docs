---
title: "IEC 104 Server (Slave)"
description: "inSCADA'da IEC 60870-5-104 Server (Slave) yapılandırması"
sidebar:
  order: 2
  label: "IEC 104 Server"
---

Server (Slave) modunda inSCADA, dış Master istasyonların bağlanıp veri okumasına izin verir. Bu mod genellikle:

- Üst SCADA / kontrol merkezine IEC 104 üzerinden veri sunmak
- Dağıtım merkezleri arasında veri paylaşımı
- Farklı inSCADA instance'ları arasında IEC 104 haberleşmesi

için kullanılır.

## Yapılandırma

### Connection

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Protocol** | IEC 60870-5-104 Server | Protokol seçimi |
| **Port** | 2404 | Dinleme portu (gelen bağlantılar için) |
| **Buffering Period** | 1000 ms | Veri tamponlama periyodu |

Diğer bağlantı parametreleri (t1, t2, t3, k, w, alan uzunlukları) Client ile aynı yapıdadır ve bağlanan Master ile uyumlu olmalıdır.

:::caution
Server portu, firewall'da **gelen bağlantılara açık** olmalıdır.
:::

### Device, Frame ve Variable

Tanım yapısı Client moduyla aynıdır. Tanımlanan değişkenlerin değerleri, bağlanan Master'a IEC 104 ASDU'ları olarak sunulur.

### Spontaneous Event Gönderimi

Server modunda inSCADA, değişken değeri değiştiğinde bağlı Master'a otomatik olarak spontaneous event gönderir. **Buffering Period** parametresi, event'lerin ne sıklıkla gönderileceğini belirler.

## Kullanım Senaryosu

```
Saha Cihazları
    │
    │ (MODBUS, DNP3, OPC UA vb.)
    ▼
┌──────────────────┐
│   inSCADA         │
│   (Veri Toplama)  │
└────────┬─────────┘
         │
         │ IEC 104 Server
         ▼
┌──────────────────┐
│   Üst SCADA /     │
│   Kontrol Merkezi  │
│   (IEC 104 Master) │
└──────────────────┘
```

Bu senaryoda inSCADA, saha cihazlarından farklı protokollerle veri toplar ve bu verileri IEC 104 Server olarak üst sistemlere sunar — protokol dönüştürücü (gateway) görevi üstlenir.
