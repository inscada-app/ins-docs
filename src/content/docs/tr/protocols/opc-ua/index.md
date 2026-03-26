---
title: "OPC UA"
description: "inSCADA'da OPC UA protokolü — genel bakış, güvenlik modeli ve ortak parametreler"
sidebar:
  order: 0
  label: "OPC UA"
---

OPC UA (Open Platform Communications Unified Architecture), endüstriyel otomasyonda platform bağımsız, güvenli ve güvenilir veri alışverişi için geliştirilmiş bir haberleşme standardıdır. OPC Foundation tarafından yönetilir ve eski OPC Classic (DA, HDA, A&E) standartlarının yerini alan modern bir mimaridir.

inSCADA, OPC UA protokolünü hem **Client** hem de **Server** rolünde destekler.

## Temel Kavramlar

### OPC UA'nın Avantajları

- **Platform bağımsız:** Windows, Linux, gömülü sistemlerde çalışır
- **Güvenli:** TLS/SSL şifreleme, sertifika doğrulama, kullanıcı kimlik doğrulama
- **Nesne yönelimli:** Hiyerarşik bilgi modeli (Address Space)
- **Keşfedilebilir:** Node space taranarak mevcut veriler otomatik bulunabilir
- **Ölçeklenebilir:** Sensörden bulut platformuna kadar geniş yelpaze

### Address Space (Adres Alanı)

OPC UA sunucusu, verilerini **Address Space** adı verilen hiyerarşik bir yapıda organize eder. Bu yapı **Node** (düğüm) nesnelerinden oluşur:

```
Root
├── Objects
│   ├── Server (sunucu bilgileri)
│   └── DeviceSet (kullanıcı verileri)
│       ├── PLC_1
│       │   ├── Temperature    (ns=2; s="PLC1.Temp")
│       │   ├── Pressure       (ns=2; s="PLC1.Press")
│       │   └── Status         (ns=2; i=1001)
│       └── Sensor_1
│           └── Value           (ns=3; s="Sensor1.Value")
├── Types
└── Views
```

### Node Identifier (Node ID)

Her node benzersiz bir **Node ID** ile tanımlanır. Node ID üç bileşenden oluşur:

- **Namespace Index (ns):** Hangi namespace'e ait olduğu
- **Identifier Type:** Tanımlayıcı tipi (Numeric veya String)
- **Identifier:** Değer (sayı veya metin)

**Örnekler:**
- `ns=2; s="PLC1.Temperature"` — String identifier
- `ns=2; i=1001` — Numeric identifier

### Güvenlik Modeli

OPC UA, çok katmanlı bir güvenlik modeli sunar:

**Security Mode:**

| Mod | Açıklama |
|-----|----------|
| **None** | Şifreleme ve imzalama yok |
| **Sign** | Mesajlar imzalanır ama şifrelenmez |
| **SignAndEncrypt** | Mesajlar hem imzalanır hem şifrelenir |

**Security Policy:**

| Policy | Açıklama |
|--------|----------|
| **None** | Güvenlik politikası yok |
| **Basic128Rsa15** | 128-bit şifreleme (eski, önerilmez) |
| **Basic256** | 256-bit şifreleme |
| **Basic256Sha256** | 256-bit şifreleme + SHA-256 hash |
| **Aes128_Sha256_RsaOaep** | AES-128 şifreleme + SHA-256 |

**Kimlik Doğrulama:**

| Yöntem | Açıklama |
|--------|----------|
| **Anonymous** | Kimlik doğrulama gerekmez |
| **Username/Password** | Kullanıcı adı ve şifre ile giriş |

:::tip
Üretim ortamlarında **SignAndEncrypt** + **Basic256Sha256** + **Username/Password** kombinasyonu önerilir.
:::

## inSCADA Veri Modeli

```
Connection (Bağlantı — endpoint URL, güvenlik ayarları)
└── Device (Cihaz — base path ile gruplama)
    └── Frame (Veri Bloğu — node path ile gruplama)
        └── Variable (Değişken — Node ID ile tanımlı)
```

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

### Encoding Tipleri

| Encoding | Açıklama |
|----------|----------|
| **Binary** | OPC UA Binary encoding (varsayılan, en performanslı) |
| **XML** | XML tabanlı encoding |
| **JSON** | JSON tabanlı encoding |

## Alt Sayfalar

- [OPC UA Client](/docs/tr/protocols/opc-ua/client/) — Client yapılandırması
- [OPC UA Server](/docs/tr/protocols/opc-ua/server/) — Server yapılandırması
