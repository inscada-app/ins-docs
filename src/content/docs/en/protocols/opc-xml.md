---
title: "OPC XML-DA"
description: "inSCADA'da OPC XML-DA Client bağlantı yapılandırması"
sidebar:
  order: 6
---

OPC XML-DA (XML Data Access), OPC DA'nın web servisleri (SOAP/XML) tabanlı versiyonudur. COM/DCOM yerine HTTP üzerinden çalıştığı için platform bağımsızdır ve firewall dostu bir yapıya sahiptir.

inSCADA, OPC XML-DA protokolünü yalnızca **Client** rolünde destekler.

## OPC XML-DA vs OPC DA vs OPC UA

| Özellik | OPC DA | OPC XML-DA | OPC UA |
|---------|--------|------------|--------|
| **Platform** | Yalnızca Windows | Platform bağımsız | Platform bağımsız |
| **Transport** | COM/DCOM | HTTP/SOAP | TCP, HTTP, WebSocket |
| **Performans** | Yüksek | Orta (XML overhead) | Yüksek |
| **Firewall** | Sorunlu (DCOM) | Kolay (HTTP) | Kolay |
| **Durum** | Eski | Eski | Aktif |

:::note
OPC XML-DA, OPC DA'nın platform bağımsız bir alternatifi olarak geliştirilmiştir ancak OPC UA tarafından büyük ölçüde yerini almıştır. Yeni projelerde [OPC UA](/docs/tr/protocols/opc-ua/) tercih edilmelidir. OPC XML-DA, yalnızca OPC UA desteklemeyen eski sistemlerle entegrasyonda kullanılmalıdır.
:::

## Veri Modeli

```
Connection (Bağlantı — HTTP URL)
└── Device (Cihaz)
    └── Frame (Veri Bloğu — Subscription grubu)
        └── Variable (Değişken — Item Name)
```

## Yapılandırma

### Connection

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Protocol** | OPC XML | Protokol seçimi |
| **IP Address** | 192.168.1.100 | OPC XML-DA sunucu IP adresi |
| **Port** | 8080 | HTTP portu |
| **Path** | `/OpcXmlDaService` | Web servis yolu (endpoint) |
| **Connect Timeout** | 5000 ms | Bağlantı kurma timeout'u |
| **Request Timeout** | 5000 ms | İstek timeout'u |
| **Max Depth** | 12 | Tag ağacı tarama derinliği |

### Device

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Scan Time** | 1000 ms | Tarama periyodu |
| **Scan Type** | PERIODIC | `PERIODIC` veya `FIXED_DELAY` |

### Frame

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Use Subscription Mode** | true | Subscription tabanlı veri alma |
| **Percent Deadband** | 0.5 | Analog değer değişim eşiği (%) |
| **Hold Time** | 0 ms | Sunucunun yanıtı tutma süresi |
| **Wait Time** | 0 ms | Sunucunun değişiklik bekleme süresi |

**Hold Time ve Wait Time:** OPC XML-DA'nın subscription mekanizmasını kontrol eder. Sunucu, `Wait Time` süresince değer değişikliği bekler, `Hold Time` süresince yanıtı tutar. Her iki değer de 0 olduğunda anlık polling yapılır.

### Variable

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Name** | `Random.Int1` | Item adı (OPC XML-DA item path) |
| **Type** | Float | Veri tipi |

### Desteklenen Veri Tipleri

| Veri Tipi | Açıklama |
|-----------|----------|
| **Boolean** | Tek bit değer |
| **SByte** | İşaretli 8-bit tam sayı |
| **Byte** | İşaretsiz 8-bit tam sayı |
| **Int16** | İşaretli 16-bit tam sayı |
| **UInt16** | İşaretsiz 16-bit tam sayı |
| **Int32** | İşaretli 32-bit tam sayı |
| **UInt32** | İşaretsiz 32-bit tam sayı |
| **Int64** | İşaretli 64-bit tam sayı |
| **Float** | 32-bit kayan nokta |
| **Double** | 64-bit kayan nokta |
| **String** | Karakter dizisi |
| **DateTime** | Zaman damgası |
