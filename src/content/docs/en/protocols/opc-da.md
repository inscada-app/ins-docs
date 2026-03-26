---
title: "OPC DA"
description: "inSCADA'da OPC DA Client bağlantı yapılandırması"
sidebar:
  order: 5
---

OPC DA (Data Access), OPC Classic standartlarının en yaygın kullanılan bileşenidir. Windows COM/DCOM teknolojisi üzerine inşa edilmiştir ve gerçek zamanlı veri erişimi sağlar. OPC UA'dan önce endüstriyel otomasyonda fiili standart olarak kullanılmıştır.

inSCADA, OPC DA protokolünü yalnızca **Client** rolünde destekler. JEasyOPC kütüphanesi ile implementasyon sağlanmıştır.

:::note
OPC DA, Windows COM/DCOM tabanlıdır. Bu nedenle **yalnızca Windows** üzerinde çalışır. Platform bağımsız çözüm için [OPC UA](/docs/tr/protocols/opc-ua/) tercih edilmelidir.
:::

## OPC DA vs OPC UA

| Özellik | OPC DA | OPC UA |
|---------|--------|--------|
| **Platform** | Yalnızca Windows | Platform bağımsız |
| **Teknoloji** | COM/DCOM | TCP/IP, HTTP, WebSocket |
| **Güvenlik** | DCOM güvenliği | TLS, sertifika, kullanıcı auth |
| **Keşif** | DCOM ile | Browse + Discovery |
| **Durum** | Eski (legacy) | Aktif geliştirme |

## Veri Modeli

```
Connection (Bağlantı — COM ProgID)
└── Device (Cihaz)
    └── Frame (Veri Bloğu — Subscription grubu)
        └── Variable (Değişken — Item ID)
```

## Yapılandırma

### Connection

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Protocol** | OPC DA | Protokol seçimi |
| **IP Address** | 192.168.1.100 | OPC DA sunucusunun IP adresi |
| **Port** | 135 | DCOM portu (varsayılan: 135) |
| **COM ProgID** | `Matrikon.OPC.Simulation` | OPC sunucusunun COM programatik tanımlayıcısı |
| **Separator** | `.` | Tag yolu ayırıcı karakteri (varsayılan: nokta) |
| **Max Depth** | 12 | Tag ağacı tarama derinliği |
| **Server Status Check Time** | 30000 ms | Sunucu durum kontrol periyodu |

:::tip
**COM ProgID**, OPC sunucusunun Windows Registry'deki programatik adıdır. Örnek: `Matrikon.OPC.Simulation`, `KEPServerEX.V6`, `RSLinx OPC Server`. OPC sunucu dokümantasyonundan veya OPC tarayıcı araçlarından öğrenilebilir.
:::

### Device

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Scan Time** | 1000 ms | Tarama periyodu |
| **Scan Type** | PERIODIC | `PERIODIC` veya `FIXED_DELAY` |

### Frame

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Use Subscription Mode** | true | Subscription tabanlı veri alma (değişiklikte bildirim) |
| **Percent Deadband** | 0.5 | Analog değer değişim eşiği (%) |

**Subscription Mode:** `true` olduğunda OPC sunucusu yalnızca değer değiştiğinde bildirim gönderir — ağ trafiği ve işlemci yükü azalır. `false` olduğunda periyodik polling yapılır.

### Variable

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Name** | `Temperature` | Değişken adı (OPC Item ID olarak da kullanılır) |
| **Type** | VT_R4 | OPC DA veri tipi |

### Desteklenen Veri Tipleri (VARIANT Types)

| Veri Tipi | Açıklama |
|-----------|----------|
| **VT_BOOL** | Boolean |
| **VT_I1** | İşaretli 8-bit tam sayı |
| **VT_UI1** | İşaretsiz 8-bit tam sayı |
| **VT_I2** | İşaretli 16-bit tam sayı |
| **VT_UI2** | İşaretsiz 16-bit tam sayı |
| **VT_INT** | İşaretli 32-bit tam sayı |
| **VT_UINT** | İşaretsiz 32-bit tam sayı |
| **VT_I8** | İşaretli 64-bit tam sayı |
| **VT_R4** | 32-bit kayan nokta (float) |
| **VT_R8** | 64-bit kayan nokta (double) |
| **VT_BSTR** | Karakter dizisi (string) |

## Browse (Keşif)

inSCADA, OPC DA sunucusunun tag ağacını **browse** ederek mevcut item'ları keşfedebilir. Bu özellik, variable tanımlarken doğru Item ID bilgilerine ulaşmanızı kolaylaştırır.

## DCOM Yapılandırma Notları

OPC DA, Windows DCOM üzerinden çalıştığı için uzak bağlantılarda DCOM yapılandırması gerekir:

1. OPC sunucusu bilgisayarında **DCOMCNFG** ile uzak erişim izinlerini ayarlayın
2. Windows Firewall'da DCOM portlarını (135 + dinamik portlar) açın
3. Her iki bilgisayarda da aynı kullanıcı hesabı veya uygun yetkilendirme olmalıdır

:::caution
DCOM yapılandırması karmaşık ve güvenlik açıklarına neden olabilir. Mümkünse OPC DA yerine [OPC UA](/docs/tr/protocols/opc-ua/) kullanmanız önerilir.
:::
