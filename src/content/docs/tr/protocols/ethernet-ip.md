---
title: "EtherNet/IP"
description: "inSCADA'da EtherNet/IP (CIP) protokolü — Rockwell/Allen-Bradley Logix serisi PLC bağlantısı"
sidebar:
  order: 9
---

EtherNet/IP (Ethernet Industrial Protocol), CIP (Common Industrial Protocol) tabanlı bir endüstriyel haberleşme protokolüdür. ODVA (Open DeviceNet Vendors Association) tarafından yönetilir. TCP/IP ve UDP üzerinde çalışır, varsayılan olarak port **44818** kullanır.

inSCADA, EtherNet/IP protokolünü yalnızca **Client** rolünde destekler.

## Desteklenen Cihazlar

inSCADA'nın EtherNet/IP implementasyonu **tag-based addressing** (CIP implicit messaging) kullanır. Bu adresleme yöntemi aşağıdaki kontrol platformlarında desteklenir:

| Platform | Destek | Açıklama |
|----------|:------:|----------|
| **ControlLogix** (Allen-Bradley) | ✓ | Logix 5000+ serisi — tam destek |
| **CompactLogix** (Allen-Bradley) | ✓ | Logix 5000+ serisi — tam destek |
| **SoftLogix** (Rockwell) | ✓ | PC tabanlı Logix çalışma ortamı |
| **MicroLogix** (Allen-Bradley) | ✗ | Data file tabanlı adresleme — desteklenmez |
| **SLC 500** (Allen-Bradley) | ✗ | Data file tabanlı adresleme — desteklenmez |
| **PLC-5** (Allen-Bradley) | ✗ | Data file tabanlı adresleme — desteklenmez |

:::note
**Neden MicroLogix/SLC/PLC-5 desteklenmiyor?**

Bu eski platformlar **data file tabanlı adresleme** kullanır (ör. `N7:0`, `F8:3`, `B3/0`). inSCADA'nın EtherNet/IP implementasyonu ise Logix 5000+ serisinin **tag-based adresleme** yapısını kullanır (ör. `Motor_1_Speed`, `Tank.Level`). Bu iki adresleme yöntemi protokol seviyesinde farklıdır — CIP mesaj yapısı ve routing mekanizması uyuşmaz.

Data file tabanlı cihazlarla haberleşme gerekiyorsa alternatif olarak OPC DA/UA gateway veya ControlLogix üzerinden proxy kullanılabilir.
:::

## Tag-Based Adresleme

Logix platformlarında veriler **tag (etiket)** isimleri ile erişilir. Register adresi yerine programda tanımlanan tag adı doğrudan kullanılır:

```
Motor_1_Speed          → Basit tag (REAL)
Tank.Level             → UDT (User Defined Type) üyesi
Station[3].Temp        → Dizi elemanı
Program:MainProgram.Counter  → Program scope tag
```

Bu yaklaşım:
- İnsan okunabilir — tag adı verinin ne olduğunu açıklar
- PLC programı ile doğrudan eşleşir
- Register adresi hesaplamaya gerek kalmaz

## Veri Modeli

```
Connection (Bağlantı — IP, port, timeout)
└── Device (Cihaz — Slot numarası)
    └── Frame (Veri Bloğu — Gruplama)
        └── Variable (Değişken — Tag adı)
```

## Yapılandırma

### Connection

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Protocol** | EthernetIp | Protokol seçimi |
| **IP Address** | 192.168.1.1 | PLC IP adresi |
| **Port** | 44818 | EtherNet/IP portu (varsayılan: 44818) |
| **Timeout** | 5000 ms | İstek timeout süresi |
| **Retries** | 3 | Başarısız istek tekrar sayısı |

### Device

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Slot** | 0 | PLC'nin backplane slot numarası |
| **Scan Time** | 1000 ms | Tarama periyodu |
| **Scan Type** | PERIODIC | `PERIODIC` veya `FIXED_DELAY` |

:::tip
**Slot numarası**, PLC CPU modülünün şasi üzerindeki fiziksel konumudur. CompactLogix için genellikle `0`, ControlLogix için CPU'nun takılı olduğu slot (ör. `0`, `1` veya `2`).
:::

### Frame

Frame, EtherNet/IP'de sadece variable'ları gruplamak için kullanılır. Protokole özgü ek parametre yoktur.

### Variable

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Name** | `Motor_1_Speed` | PLC'deki tag adı (tam yol) |
| **Type** | REAL | CIP veri tipi |
| **Bit Parent Type** | (opsiyonel) | Bit erişim için üst veri tipi |

Variable adı, PLC programındaki tag adıyla **birebir aynı** olmalıdır. inSCADA bu adı kullanarak CIP Read/Write Tag Service isteği gönderir.

#### Desteklenen Veri Tipleri

| Veri Tipi | CIP Boyutu | Açıklama |
|-----------|-----------|----------|
| **BIT** | 1 bit | Tek bit (Bit Parent Type gerektirir) |
| **BOOL** | 1 bit | Boolean değer |
| **SINT** | 8 bit | İşaretli 8-bit tam sayı (-128 ~ 127) |
| **INT** | 16 bit | İşaretli 16-bit tam sayı (-32768 ~ 32767) |
| **DINT** | 32 bit | İşaretli 32-bit tam sayı |
| **LINT** | 64 bit | İşaretli 64-bit tam sayı |
| **REAL** | 32 bit | 32-bit kayan nokta (IEEE 754) |
| **BITS** | 32 bit | Bit dizisi (32-bit word olarak) |
| **STRUCT** | Değişken | Yapısal veri tipi (UDT) |

#### Bit Erişimi

Tek bir bit'e erişmek için **BIT** tipi kullanılır. Bu durumda bit'in hangi veri tipinin içinden okunacağını belirten **Bit Parent Type** seçilmelidir:

| Bit Parent Type | Açıklama |
|----------------|----------|
| **SINT** | 8-bit integer içinden bit okuma |
| **BITS** | 32-bit word içinden bit okuma |

### Tag Adı Örnekleri

| Tag Adı | Tip | Açıklama |
|---------|-----|----------|
| `Motor_Speed` | REAL | Basit controller tag |
| `Tank.Level` | REAL | UDT (yapısal tip) üyesi |
| `Sensors[0]` | DINT | Dizi'nin ilk elemanı |
| `Sensors[5]` | DINT | Dizi'nin 6. elemanı |
| `Station[2].Temperature` | REAL | Dizi + yapısal tip |
| `Program:MainProgram.LocalTag` | INT | Program scope tag |
| `Motor_Run` | BOOL | Boolean tag |
| `StatusBits` | BITS | 32-bit durum word'ü |

## Toplu Okuma (Batch Read)

inSCADA, EtherNet/IP tag'lerini performans için **toplu olarak** okur. Tek bir CIP isteğiyle birden fazla tag okunur:

- Normal tag'ler: 20 tag/istek
- String tag'ler: 5 tag/istek (daha büyük payload)
- Bit tag'ler: 20 tag/istek (üst tip üzerinden okuma)

Bu davranış otomatiktir — kullanıcı yapılandırması gerekmez.

## Rockwell Studio 5000 / RSLogix 5000 Notları

PLC tarafında inSCADA ile haberleşme için özel bir yapılandırma gerekmez. Aşağıdaki noktalar kontrol edilmelidir:

- Tag'lerin **Controller Scope** (global) olarak tanımlandığından emin olun — Program scope tag'lere erişim için `Program:ProgramName.TagName` formatı kullanılmalıdır
- PLC'nin **Remote Access** (uzak erişim) ayarlarının açık olduğunu doğrulayın
- Firewall'da **44818** portunun açık olduğundan emin olun
