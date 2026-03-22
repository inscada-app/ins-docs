---
title: "inSCADA Nedir?"
description: "inSCADA web tabanlı SCADA/IIoT geliştirme platformuna genel bakış"
sidebar:
  order: 1
---

**inSCADA**, endüstriyel tesisleri izlemek, kontrol etmek ve veri toplamak için geliştirilmiş web tabanlı bir SCADA/IIoT platformudur. Java (JDK 11) üzerine inşa edilmiştir; kurulumdan itibaren tarayıcı üzerinden erişilir, istemci yazılımı gerektirmez.

## Temel Fark: Runtime = Development

Geleneksel SCADA yazılımlarında geliştirme ortamı ve çalışma ortamı birbirinden ayrıdır: proje geliştirilir, derlenir (compile), test edilir ve üretim ortamına dağıtılır (deploy).

inSCADA'da bu ayrım yoktur. **Runtime ve development aynı ortamda yaşar.** Bir bağlantı eklemek, değişken tanımlamak veya ekran tasarlamak için ayrı bir IDE'ye ihtiyacınız yoktur — tüm yapılandırma canlı sistem üzerinde, tarayıcıdan yapılır ve anında devreye girer.

Bu yaklaşım:
- **Sahada hızlı müdahale** imkânı sağlar
- Compile-deploy döngüsünü ortadan kaldırır
- Geliştirme süresini önemli ölçüde kısaltır

## Anahtar Yetenekler

| Yetenek | Açıklama |
|---------|----------|
| **Çoklu Protokol** | Modbus TCP/RTU, BACnet, KNX, OPC-UA, DNP3, IEC 104, REST ve daha fazlası |
| **SVG Animasyon** | Figma veya herhangi bir vektör editöründen SVG import edin, nesnelere canlı veri bağlayın |
| **Script Engine** | Nashorn tabanlı ECMAScript 5 ile otomasyon scriptleri yazın, zamanlayın ve çalıştırın |
| **REST API** | 1100+ endpoint ile tüm platform fonksiyonlarına programatik erişim |
| **Alarm Yönetimi** | Analog/dijital alarm tanımlama, gruplama, bildirim ve geçmiş analizi |
| **Web Erişim** | Kurulum gerektirmez — herhangi bir cihazdan tarayıcı ile erişin |
| **AI Araçları** | AI Asistan ve MCP Server ile doğal dilde sorgulama ve geliştirme |

## Platform Mimarisi

inSCADA'da veriler hiyerarşik bir yapıda organize edilir:

```
Space (Çalışma alanı)
└── Project (Proje)
    ├── Connection (Protokol bağlantısı)
    │   └── Device (Cihaz)
    │       └── Frame (Veri çerçevesi)
    │           └── Variable (Değişken — temel veri noktası)
    ├── Script (Otomasyon scripti)
    └── Alarm Group
        └── Alarm Definition
```

- **Space**: Çoklu çalışma alanı ile kiracı (tenant) izolasyonu
- **Variable**: Platformun temel yapı taşı — loglama, ölçekleme, alarm ve animasyon bağlantılarının tümü değişken üzerinden yapılır
- **Script**: Sunucu tarafında çalışan JavaScript otomasyonları — zamanlı veya tetiklemeli
- **Connection**: Her biri farklı bir protokol ve saha cihazını temsil eder

## Sonraki Adım

Platformu kurmak ve ilk projenizi oluşturmak için [Kurulum](/docs/tr/getting-started/installation/) sayfasına geçin.
