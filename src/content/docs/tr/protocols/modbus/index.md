---
title: "MODBUS"
description: "inSCADA'da MODBUS protokol ailesi — TCP, RTU over TCP, UDP varyantları"
sidebar:
  order: 1
  label: "MODBUS"
---

MODBUS, endüstriyel otomasyonda en yaygın kullanılan haberleşme protokollerinden biridir. inSCADA, MODBUS protokolünün birden fazla varyantını hem **Client (Master)** hem de **Server (Slave)** rolünde destekler.

## Desteklenen Varyantlar

| Varyant | Client / Master | Server / Slave |
|---------|:--------------:|:--------------:|
| [MODBUS TCP](/docs/tr/protocols/modbus/tcp-client/) | ✓ | ✓ |
| [MODBUS RTU over TCP](/docs/tr/protocols/modbus/rtu-over-tcp/) | ✓ | ✓ |
| [MODBUS UDP](/docs/tr/protocols/modbus/udp/) | ✓ | ✓ |

## Veri Modeli

Her MODBUS bağlantısı inSCADA'da aşağıdaki hiyerarşik yapıda tanımlanır:

```
Connection (Bağlantı)
└── Device (Cihaz — Slave ID ile tanımlanır)
    └── Frame (Veri Bloğu — Register bloğu)
        └── Variable (Değişken — Tek register/bit adresi)
```

### Connection (Bağlantı) Parametreleri

Tüm MODBUS varyantlarında ortak bağlantı parametreleri:

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| **IP / Host** | String | Hedef cihaz IP adresi veya hostname |
| **Port** | Integer | Hedef port (varsayılan: 502) |
| **Timeout** | Integer (ms) | Yanıt bekleme süresi |
| **Connect Timeout** | Integer (ms) | Bağlantı kurma zaman aşımı |
| **Retries** | Integer | Başarısız istek tekrar sayısı |
| **Pool Size** | Integer | Bağlantı havuzu boyutu |
| **Max Idle Timeout** | Integer (ms) | Boşta bağlantı zaman aşımı |
| **Check CRC** | Boolean | CRC doğrulama kontrolü (RTU için) |
| **Reconnect on Error** | Boolean | Hata durumunda otomatik yeniden bağlanma |

### Device (Cihaz) Parametreleri

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| **Station Address** | Integer (1-247) | MODBUS Slave adresi (Unit ID) |
| **Scan Time** | Integer (ms) | Tarama periyodu |
| **Scan Type** | Enum | `PERIODIC` veya `FIXED_DELAY` |
| **Retain Flag** | Boolean | Son değeri koruma |

### Frame (Veri Bloğu) Parametreleri

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| **Type** | Enum | Register tipi (aşağıya bakın) |
| **Start Address** | Integer | Başlangıç register adresi |
| **Quantity** | Integer | Okunacak register sayısı |
| **Inter Frame Delay** | Integer (ms) | Frame'ler arası bekleme süresi |
| **Is Readable** | Boolean | Okuma izni |
| **Is Writable** | Boolean | Yazma izni |
| **Minutes Offset** | Integer | Zaman ofseti (dakika) |
| **Scan Time Factor** | Integer | Tarama çarpanı |

#### Register Tipleri

| Tip | Fonksiyon Kodu | Okuma | Yazma | Açıklama |
|-----|---------------|:-----:|:-----:|----------|
| **Coil** | FC01 / FC05 / FC15 | ✓ | ✓ | Dijital çıkış (1 bit) |
| **Discrete Input** | FC02 | ✓ | — | Dijital giriş (1 bit, salt okunur) |
| **Holding Register** | FC03 / FC06 / FC16 | ✓ | ✓ | Analog çıkış (16 bit) |
| **Input Register** | FC04 | ✓ | — | Analog giriş (16 bit, salt okunur) |

### Variable (Değişken) Parametreleri

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| **Start Address** | Integer | Register adresi (frame içindeki ofset) |
| **Type** | Enum | Veri tipi (aşağıya bakın) |
| **Byte Swap** | Boolean | Byte sırası değiştirme (Big/Little Endian) |
| **Word Swap** | Boolean | Word sırası değiştirme (32-bit değerler için) |
| **Bit Offset** | Integer | Bit adresi (Coil/Discrete için) |
| **Length** | Integer | String tipi için karakter uzunluğu |

#### Desteklenen Veri Tipleri

| Veri Tipi | Boyut | Açıklama |
|-----------|-------|----------|
| **Boolean** | 1 bit | Tek bit değer |
| **Byte** | 8 bit | İşaretli byte |
| **Unsigned Byte** | 8 bit | İşaretsiz byte |
| **Short** | 16 bit | İşaretli 16-bit tam sayı |
| **Unsigned Short** | 16 bit | İşaretsiz 16-bit tam sayı |
| **Integer** | 32 bit | İşaretli 32-bit tam sayı |
| **Unsigned Integer** | 32 bit | İşaretsiz 32-bit tam sayı |
| **Long** | 64 bit | İşaretli 64-bit tam sayı |
| **Float** | 32 bit | IEEE 754 kayan nokta |
| **Double** | 64 bit | IEEE 754 çift hassasiyet |
| **16 BIT BCD** | 16 bit | Binary Coded Decimal |
| **32 BIT BCD** | 32 bit | Binary Coded Decimal |
| **64 BIT BCD** | 64 bit | Binary Coded Decimal |
| **String** | Değişken | ASCII karakter dizisi |

:::tip
32-bit ve 64-bit veri tiplerinde Byte Swap ve Word Swap ayarları cihaz üreticisine göre değişebilir. Cihaz dokümantasyonunuzu kontrol edin.
:::

## Sonraki Adımlar

Varyant bazlı yapılandırma detayları için:

- [MODBUS TCP Client / Server](/docs/tr/protocols/modbus/tcp-client/)
- [MODBUS RTU over TCP](/docs/tr/protocols/modbus/rtu-over-tcp/)
- [MODBUS UDP](/docs/tr/protocols/modbus/udp/)
