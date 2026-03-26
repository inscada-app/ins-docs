---
title: "Haberleşme Protokolleri"
description: "inSCADA'da protokol mimarisi — Connection, Device, Frame, Variable yapısı ve adresleme mantığı"
sidebar:
  order: 0
  label: "Genel Bakış"
---

inSCADA, saha cihazları ile haberleşmeyi standart bir hiyerarşik yapı üzerinden yönetir. Kullanılan protokol ne olursa olsun — MODBUS, DNP3, IEC 104, OPC UA veya diğerleri — veri modeli her zaman aynı dört seviyeli yapıyı izler.

## Veri Modeli: Connection → Device → Frame → Variable

```
Connection (Bağlantı)
│   Protokol tipi, IP adresi, port ve protokole özgü parametreler
│
└── Device (Cihaz)
    │   Cihaz adresi, tarama periyodu
    │
    └── Frame (Veri Bloğu)
        │   Bellek alanı tipi, başlangıç adresi, blok boyutu
        │
        └── Variable (Değişken)
              Blok içi ofset adresi, veri tipi
```

### Connection (Bağlantı)

Bir saha cihazına veya sisteme açılan haberleşme kanalıdır. Her Connection tek bir protokol tipine ve hedef adrese bağlıdır.

- IP adresi ve port bilgisi
- Protokol seçimi (MODBUS TCP, DNP3, OPC UA vb.)
- Timeout, retry gibi haberleşme parametreleri
- Protokole özgü ayarlar (güvenlik, kimlik doğrulama vb.)

Bir Connection altında birden fazla Device tanımlanabilir.

### Device (Cihaz)

Connection üzerinden erişilen fiziksel veya lojik bir birimdir. Protokole göre farklı şekilde adreslenir:

| Protokol | Device Adresi | Örnek |
|----------|--------------|-------|
| MODBUS | Station Address (Slave ID) | `1` |
| DNP3 | Local/Remote Address çifti | `1 / 10` |
| IEC 104 | Common Address (CASDU) | `1` |
| IEC 61850 | Object Reference (Logical Device) | `IED1LD1` |
| OPC UA | Base Path | `PLC_1` |
| S7 | Rack / Slot | `0 / 0` |
| EtherNet/IP | Slot | `0` |

Her Device'ın bir **Scan Time** (tarama periyodu) parametresi vardır. inSCADA, bu periyotta Device'a bağlı tüm Frame'leri sırayla okur.

### Frame (Veri Bloğu)

Device içindeki belirli bir bellek bölgesini veya veri grubunu temsil eder. Frame, **neyin okunacağını** tanımlar:

- Hangi bellek alanı (Holding Register, Analog Input, DataBlock vb.)
- Başlangıç adresi
- Blok boyutu (kaç birim okunacak)

Bir Device altında birden fazla Frame tanımlanabilir — her biri farklı bir bellek bölgesini veya veri grubunu temsil eder.

### Variable (Değişken)

Frame içindeki tek bir veri noktasıdır. inSCADA'nın temel yapı taşıdır — loglama, ölçekleme, alarm, animasyon ve tüm diğer fonksiyonlar Variable üzerinden çalışır.

## Adresleme Mantığı: Absolute vs Relative

Bu konu, inSCADA'yı ilk kez kullanan geliştiricilerin en çok karıştırdığı noktadır. Doğru anlaşılması, hatasız yapılandırma için kritiktir.

### Frame: Cihaz İçindeki Gerçek (Absolute) Adres

Frame tanımlarken girilen **Start Address**, cihazın bellek alanındaki **gerçek (absolute) başlangıç adresidir**. **Quantity** ise bu başlangıç adresinden itibaren kaç birimlik bir alanın okunacağını belirler.

Frame, cihaz belleğinden bir **pencere** açar:

```
Cihaz Belleği (ör. Holding Register)
┌──────────────────────────────────────────────────────────┐
│ Addr:  0   1   2  ...  99  100  101  102  ...  119  120 │
│                         ▲                          ▲     │
│                         │    Frame Penceresi        │     │
│                         │◄─────────────────────────►│     │
│                    Start: 100            Quantity: 20     │
└──────────────────────────────────────────────────────────┘
```

Bu örnekte Frame, cihazın Holding Register alanında **adres 100'den başlayarak 20 register'lık** bir blok okur.

### Variable: Frame İçindeki Bağıl (Relative) Adres

Variable tanımlarken girilen adres, **cihazın gerçek adresi değildir** — Frame'in başlangıcına göre **bağıl (relative) ofset**tir. Yani Variable adresi, **"Frame penceresinin içindeki kaçıncı birimde"** olduğunu belirtir.

```
Frame: Start Address = 100, Quantity = 20

Cihaz Belleği:    [100] [101] [102] [103] [104] ... [119]
Frame Ofseti:       0     1     2     3     4   ...   19
                    ▲                 ▲     ▲
                    │                 │     │
              Variable A         Variable B  Variable C
              Offset: 0         Offset: 3   Offset: 4
              (Gerçek: 100)     (Gerçek: 103) (Gerçek: 104)
```

:::caution[Kritik Kural]
Variable adresine cihazın gerçek adresini **girmeyin**. Frame'in başlangıcına göre olan ofseti girin.

Örneğin cihazda adres 103'teki veriyi okumak istiyorsanız ve Frame Start Address = 100 ise:
- ❌ Yanlış: Variable Address = `103`
- ✓ Doğru: Variable Address = `3` (çünkü 103 - 100 = 3)
:::

### MODBUS Örneği

Bir enerji analizöründen gerilim ve akım değerlerini okumak istiyorsunuz. Cihaz dokümantasyonunda:
- Faz-A Gerilim: Holding Register **40100** (REAL, 2 register)
- Faz-B Gerilim: Holding Register **40102** (REAL, 2 register)
- Faz-C Gerilim: Holding Register **40104** (REAL, 2 register)
- Faz-A Akım: Holding Register **40106** (REAL, 2 register)

**Frame tanımı:**
| Parametre | Değer | Açıklama |
|-----------|-------|----------|
| Type | Holding Register | Bellek alanı |
| Start Address | 100 | Cihazın gerçek başlangıç adresi |
| Quantity | 10 | 10 register okunacak (100-109) |

:::note
MODBUS adresleme: Bazı cihaz dokümantasyonları **40001 tabanlı** (Modicon convention) adres gösterir. Bu durumda 40100 adresi gerçekte register **100**'dür (40001'i çıkarın). inSCADA'da 0-tabanlı adres girilir.
:::

**Variable tanımları:**

| Variable | Ofset | Veri Tipi | Gerçek Adres | Açıklama |
|----------|:-----:|-----------|:------------:|----------|
| Voltage_A | 0 | Float | 100-101 | Faz-A Gerilim |
| Voltage_B | 2 | Float | 102-103 | Faz-B Gerilim |
| Voltage_C | 4 | Float | 104-105 | Faz-C Gerilim |
| Current_A | 6 | Float | 106-107 | Faz-A Akım |

### Siemens S7 Örneği

S7 PLC'de DB8'den sıcaklık ve durum bilgilerini okumak istiyorsunuz:
- Çalışma durumu: DB8.DBX0.0 (BIT)
- Alarm durumu: DB8.DBX0.1 (BIT)
- Sıcaklık: DB8.DBD2 (REAL, 4 byte)
- Basınç: DB8.DBD6 (REAL, 4 byte)
- Setpoint: DB8.DBW10 (INT, 2 byte)

**Frame tanımı:**
| Parametre | Değer | Açıklama |
|-----------|-------|----------|
| Type | DB | DataBlock alanı |
| DB Number | 8 | DataBlock numarası |
| Start Address | 0 | Byte 0'dan başla |
| Quantity | 12 | 12 byte oku (0-11) |

**Variable tanımları:**

| Variable | Byte Ofset | Bit Ofset | Veri Tipi | S7 Adresi | Açıklama |
|----------|:---------:|:---------:|-----------|:---------:|----------|
| Running | 0 | 0 | BIT | DBX0.0 | Çalışma durumu |
| Alarm | 0 | 1 | BIT | DBX0.1 | Alarm durumu |
| Temperature | 2 | — | REAL | DBD2 | Sıcaklık (4 byte) |
| Pressure | 6 | — | REAL | DBD6 | Basınç (4 byte) |
| Setpoint | 10 | — | INT | DBW10 | Setpoint (2 byte) |

Dikkat edin: Variable ofsetleri Frame'in başlangıcına (byte 0) göredir. S7'de adresleme byte tabanlı olduğu için Frame Start Address = 0 ise Variable ofsetleri doğrudan S7 byte adresine eşittir. Ancak Frame Start Address farklı olsaydı (ör. 100), Variable ofsetleri yine 0'dan başlayacaktı.

## Frame Boyutu ve Performans

Frame boyutunu (Quantity) doğru ayarlamak haberleşme performansını doğrudan etkiler:

- **Çok büyük Frame:** Tek istekte çok veri çekilir ama bir hata tüm bloğu etkiler
- **Çok küçük Frame:** Her variable için ayrı istek gider, haberleşme yavaşlar
- **Boşluklu adresler:** Arada kullanılmayan adresler varsa bile tek Frame'e dahil etmek genellikle ayrı Frame'lerden daha verimlidir

:::tip[Önerilen Yaklaşım]
Ardışık adresleri tek Frame'de gruplayın. Büyük boşluklar varsa (ör. 100 register arayla) ayrı Frame'lere bölün. Protokolün maksimum blok boyutunu aşmamaya dikkat edin (ör. MODBUS: 125 register/istek).
:::

## Scan Time Factor

Her Frame'de bir **Scan Time Factor** parametresi bulunur. Frame'in gerçek tarama periyodu şu formülle hesaplanır:

```
Frame Tarama Periyodu = Device Scan Time × Scan Time Factor
```

Bu özellik, yavaş değişen verilerin daha seyrek taranmasını sağlar. Örneğin Device Scan Time = 1000 ms ise:

| Frame | Scan Time Factor | Gerçek Periyot | Kullanım |
|-------|:----------------:|:--------------:|----------|
| Anlık ölçümler | 1 | 1 sn | Akım, gerilim, güç |
| Durum bilgileri | 5 | 5 sn | Çalışma modu, alarm durumu |
| Konfigürasyon | 60 | 1 dk | Setpoint, parametre |

## Protokol Listesi

Detaylı yapılandırma bilgileri için ilgili protokol sayfasına gidin:

- [MODBUS](/docs/tr/protocols/modbus/) — TCP, RTU over TCP, UDP (Client + Server)
- [DNP3](/docs/tr/protocols/dnp3/) — Master + Outstation
- [IEC 60870-5-104](/docs/tr/protocols/iec104/) — Client + Server
- [IEC 61850](/docs/tr/protocols/iec61850/) — MMS Client + Server
- [OPC UA](/docs/tr/protocols/opc-ua/) — Client + Server
- [OPC DA](/docs/tr/protocols/opc-da/) — Client
- [OPC XML-DA](/docs/tr/protocols/opc-xml/) — Client
- [Siemens S7](/docs/tr/protocols/s7/) — Client
- [MQTT](/docs/tr/protocols/mqtt/) — Subscribe + Publish
- [EtherNet/IP](/docs/tr/protocols/ethernet-ip/) — Client (Logix 5000+)
- [Fatek](/docs/tr/protocols/fatek/) — TCP + UDP Client
- [REST API Client](/docs/tr/protocols/rest-client/) — Yakında
- [BACnet](/docs/tr/protocols/bacnet/) — Gateway
- [KNX](/docs/tr/protocols/knx/) — Gateway
