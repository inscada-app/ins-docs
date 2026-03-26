---
title: "IEC 60870-5-104"
description: "inSCADA'da IEC 60870-5-104 protokolü — genel bakış ve ortak parametreler"
sidebar:
  order: 0
  label: "IEC 60870-5-104"
---

IEC 60870-5-104, IEC 101 protokolünün TCP/IP ağ katmanı üzerine genişletilmiş halidir. LAN bağlantısı için TCP/IP arayüzü ve WAN bağlantısı için router desteği sağlar. Uygulama katmanı IEC 101 ile uyumlu kalırken çeşitli veri senkronizasyon mekanizmalarını destekler.

Elektrik dağıtım, enerji üretim, trafo merkezi ve SCADA kontrol merkezlerinde yaygın olarak kullanılır. inSCADA, IEC 60870-5-104 protokolünü hem **Client (Master)** hem de **Server (Slave)** rolünde destekler.

## Temel Kavramlar

### Master ve Slave

- **Master (Controlling Station):** Slave istasyonlara sorgu göndererek veri toplayan, kontrol komutları ileten taraf
- **Slave (Controlled Station):** Saha verilerini tutan, Master sorgularına yanıt veren ve spontaneous event gönderen taraf

### ASDU (Application Service Data Unit)

IEC 104 haberleşmesinde veriler ASDU formatında taşınır. Her ASDU şunları içerir:
- **Type Identification (TI):** Veri tipini tanımlar
- **Cause of Transmission (COT):** İletim nedenini belirtir (periyodik, spontan, sorgu yanıtı vb.)
- **Common Address (CASDU):** İstasyon adresi
- **Information Object Address (IOA):** Veri noktası adresi

### Desteklenen Veri Tipleri (Frame Types)

inSCADA JDK 11 Edition'da desteklenen ASDU tipleri:

| Frame Type | ASDU | Açıklama |
|-----------|------|----------|
| **Single Point Information** | M_SP_NA / M_SP_TB | 1-bit dijital sinyal (zaman damgalı/damgasız) |
| **Double Point Information** | M_DP_NA / M_DP_TB | 2-bit kombine sinyal — kesici/ayırıcı pozisyonu |
| **Measured Value, Normalized** | M_ME_NA | Normalize analog değer (±32767 aralığı) |
| **Measured Value, Scaled** | M_ME_NB | Ölçekli analog değer |
| **Measured Value, Short Float** | M_ME_NC / M_ME_TF | IEEE 754 float analog değer |

### Haberleşme Parametreleri (t1, t2, t3, k, w)

IEC 104 bağlantıları protokole özgü zamanlama parametreleriyle yapılandırılır:

| Parametre | Açıklama | Varsayılan |
|-----------|----------|-----------|
| **t1** | APDU gönderim timeout'u — yanıt bekleme süresi | 15 sn |
| **t2** | S-format APDU timeout'u — onay bekleme süresi | 10 sn |
| **t3** | Test frame timeout'u — bağlantı canlılık kontrolü | 20 sn |
| **k** | Maksimum onaylanmamış I-frame sayısı | 12 |
| **w** | Onay penceresi — w adet I-frame sonra S-frame gönder | 8 |

### Adresleme

IEC 104 adresleme yapısı yapılandırılabilir alan uzunlukları kullanır:

| Alan | Uzunluk | Açıklama |
|------|---------|----------|
| **COT Field Length** | 1-2 byte | Cause of Transmission alanı |
| **Common Address Field Length** | 1-2 byte | CASDU (istasyon adresi) alanı |
| **IOA Field Length** | 1-3 byte | Information Object Address alanı |

### Spontaneous Events

Slave istasyonlar, değer değişikliğinde Master'a sorgu beklemeden **spontaneous event** gönderebilir. Bu, kritik durum değişikliklerinin anında bildirilmesini sağlar.

### Background Scan

Master, periyodik olarak tüm veri noktalarını sorgulayarak veritabanının bütünlüğünü doğrular. Bu tarama süresi yapılandırılabilir.

## Veri Modeli

```
Connection (Bağlantı — IP, port, t1/t2/t3/k/w, alan uzunlukları)
└── Device (Cihaz — Common Address)
    └── Frame (Veri Bloğu — ASDU tipi)
        └── Variable (Değişken — IOA adresi)
```

## Alt Sayfalar

- [IEC 104 Client (Master)](/docs/tr/protocols/iec104/client/) — Master yapılandırması
- [IEC 104 Server (Slave)](/docs/tr/protocols/iec104/server/) — Slave yapılandırması
