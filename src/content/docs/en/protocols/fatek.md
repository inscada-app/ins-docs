---
title: "Fatek"
description: "inSCADA'da Fatek FBs/FBe serisi PLC bağlantı yapılandırması (TCP ve UDP)"
sidebar:
  order: 10
---

Fatek protokolü, Fatek Automation firmasının FBs ve FBe serisi PLC'leri ile Ethernet üzerinden haberleşme sağlar. inSCADA, Fatek protokolünü **TCP** ve **UDP** transport katmanları ile yalnızca **Client** rolünde destekler.

## Desteklenen Varyantlar

| Varyant | Açıklama |
|---------|----------|
| **Fatek TCP** | TCP/IP üzerinden Fatek haberleşme |
| **Fatek UDP** | UDP üzerinden Fatek haberleşme |

## Veri Modeli

```
Connection (Bağlantı — IP, port)
└── Device (Cihaz — Station Address)
    └── Frame (Veri Bloğu — Register alanı)
        └── Variable (Değişken — Register adresi)
```

## Yapılandırma

### Connection

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Protocol** | Fatek TCP veya Fatek UDP | Protokol seçimi |
| **IP Address** | 192.168.1.10 | PLC IP adresi |
| **Port** | 500 | Fatek Ethernet portu (varsayılan: 500) |
| **Timeout** | 5000 ms | İstek timeout süresi |

### Device

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Station Address** | 1 | PLC istasyon numarası (1-254) |
| **Scan Time** | 1000 ms | Tarama periyodu |
| **Scan Type** | PERIODIC | `PERIODIC` veya `FIXED_DELAY` |

### Frame

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Type** | D | Register alanı tipi (aşağıya bakın) |
| **Start Address** | 0 | Başlangıç register adresi |
| **Quantity** | 50 | Okunacak register/bit sayısı |

#### Register Alanları (Frame Tipleri)

Fatek PLC'ler birden fazla bellek alanına sahiptir. Bu alanlar **discrete (bit)** ve **register (word)** olarak iki ana kategoriye ayrılır:

**Discrete (Bit) Alanları:**

| Tip | Açıklama | Erişim |
|-----|----------|--------|
| **X** | Dijital giriş (Input) | Salt okunur |
| **Y** | Dijital çıkış (Output) | Okunur/Yazılır |
| **M** | İç röle (Internal Relay) | Okunur/Yazılır |
| **S** | Step röle (Step Relay) | Okunur/Yazılır |
| **T** | Timer kontağı (Timer Contact) | Salt okunur |
| **C** | Counter kontağı (Counter Contact) | Salt okunur |

**Word (16-bit) Register Alanları:**

| Tip | Açıklama | Erişim |
|-----|----------|--------|
| **WX** | Giriş word registeri | Salt okunur |
| **WY** | Çıkış word registeri | Okunur/Yazılır |
| **WM** | İç röle word registeri | Okunur/Yazılır |
| **WS** | Step röle word registeri | Okunur/Yazılır |
| **WT** | Timer mevcut değeri (16-bit) | Salt okunur |
| **WC** | Counter mevcut değeri (16-bit) | Salt okunur |
| **RT** | Timer ayar değeri (16-bit) | Okunur/Yazılır |
| **RC** | Counter ayar değeri (16-bit) | Okunur/Yazılır |
| **R** | Data register (16-bit) | Okunur/Yazılır |
| **D** | Data register (16-bit) | Okunur/Yazılır |
| **F** | Dosya register (16-bit) | Okunur/Yazılır |

**Double Word (32-bit) Register Alanları:**

| Tip | Açıklama | Erişim |
|-----|----------|--------|
| **DWX** | Giriş double word | Salt okunur |
| **DWY** | Çıkış double word | Okunur/Yazılır |
| **DWM** | İç röle double word | Okunur/Yazılır |
| **DWS** | Step röle double word | Okunur/Yazılır |
| **DWT** | Timer mevcut değeri (32-bit) | Salt okunur |
| **DWC** | Counter mevcut değeri (32-bit) | Salt okunur |
| **DRT** | Timer ayar değeri (32-bit) | Okunur/Yazılır |
| **DRC** | Counter ayar değeri (32-bit) | Okunur/Yazılır |
| **DR** | Data register (32-bit) | Okunur/Yazılır |
| **DD** | Data register (32-bit) | Okunur/Yazılır |
| **DF** | Dosya register (32-bit) | Okunur/Yazılır |

:::tip
En yaygın kullanım: Discrete I/O için **X**, **Y**, **M**; veri depolama için **D** veya **R** register'ları; 32-bit değerler için **DD** veya **DR** kullanılır.
:::

### Variable

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Start Address** | 0 | Frame içindeki register ofseti |
| **Type** | FLOAT | Veri tipi |

#### Desteklenen Veri Tipleri

| Veri Tipi | Boyut | Açıklama |
|-----------|-------|----------|
| **BOOL** | 1 bit | Discrete (bit) değer |
| **INT16** | 16 bit | İşaretli 16-bit tam sayı |
| **UINT16** | 16 bit | İşaretsiz 16-bit tam sayı |
| **INT32** | 32 bit | İşaretli 32-bit tam sayı |
| **UINT32** | 32 bit | İşaretsiz 32-bit tam sayı |
| **FLOAT** | 32 bit | 32-bit kayan nokta (IEEE 754) |

## Adres Hesaplama Örneği

```
Frame: D register, Start Address: 0, Quantity: 20

Variable örnekleri:
├── D0    → Start: 0, Type: INT16    (ilk data register)
├── D1    → Start: 1, Type: UINT16   (ikinci data register)
├── D2-3  → Start: 2, Type: FLOAT    (32-bit float, 2 register kaplar)
├── D4-5  → Start: 4, Type: INT32    (32-bit integer, 2 register kaplar)
└── D10   → Start: 10, Type: INT16

Frame: M relay, Start Address: 0, Quantity: 32

Variable örnekleri:
├── M0    → Start: 0, Type: BOOL     (ilk iç röle)
├── M1    → Start: 1, Type: BOOL     (ikinci iç röle)
└── M16   → Start: 16, Type: BOOL
```

## TCP vs UDP Seçimi

| Özellik | Fatek TCP | Fatek UDP |
|---------|-----------|-----------|
| **Güvenilirlik** | Yüksek (garanti teslim) | Düşük (paket kaybı mümkün) |
| **Gecikme** | Normal | Düşük |
| **Kullanım** | Genel amaç (önerilen) | Düşük gecikme gerektiren durumlar |

:::note
Çoğu uygulamada **Fatek TCP** tercih edilmelidir. UDP yalnızca özel performans gereksinimleri olan durumlarda kullanılmalıdır.
:::
