---
title: "inSCADA Nedir?"
description: "inSCADA web tabanlı SCADA/IIoT geliştirme platformuna genel bakış"
sidebar:
  order: 1
---

**inSCADA**, endüstrinin tüm alanlarında SCADA, HMI ve IIoT uygulamaları geliştirmek için tasarlanmış web tabanlı bir platformdur. Tamamen RESTful bir mimariye sahiptir — platform üzerindeki her işlem REST API üzerinden gerçekleştirilebilir. Multi-tenant yapısı sayesinde birden fazla çalışma alanı (Space) ve proje aynı anda, birbirinden izole şekilde yönetilir. Çok kullanıcılı erişim ile farklı roller ve yetkiler tanımlanarak ekipler paralel çalışabilir.

Proje oluşturma, bağlantı yapılandırma, ekran tasarımı, script geliştirme — tüm geliştirme faaliyetleri web arayüzünden gerçekleştirilir. Bunun için herhangi bir tarayıcı kullanılabildiği gibi, daha sade bir operatör deneyimi için **inSCADA Viewer** masaüstü uygulaması da mevcuttur.

## Temel Fark: Runtime = Development

Geleneksel SCADA yazılımlarında geliştirme ortamı ve çalışma ortamı birbirinden ayrıdır: proje geliştirilir, derlenir (compile), test edilir ve üretim ortamına dağıtılır (deploy).

inSCADA'da bu ayrım yoktur. **Runtime ve development aynı ortamda yaşar.** Bir bağlantı eklemek, değişken tanımlamak veya ekran tasarlamak için ayrı bir IDE'ye ihtiyacınız yoktur — tüm yapılandırma canlı sistem üzerinde, tarayıcıdan yapılır ve anında devreye girer.

Bu yaklaşım:
- **Sahada hızlı müdahale** imkânı sağlar
- Compile-deploy döngüsünü ortadan kaldırır
- Geliştirme süresini önemli ölçüde kısaltır

## inSCADA ile Ne Yapabilirsiniz?

### SCADA / HMI

Saha cihazlarından canlı veri toplayın ve operatörlere görsel ekranlar sunun. SVG tabanlı mimik ekranlar, Figma gibi tasarım araçlarından doğrudan import edilebilir. Her SVG nesnesine (text, rectangle, path vb.) animasyon tipi ve canlı veri bağlanabilir — renk değişimi, hareket, döndürme, değer gösterimi gibi.

### Veri Toplama ve Haberleşme

Modbus TCP/RTU, BACnet, KNX, OPC-UA, DNP3, IEC 60870-5-104 ve REST API dahil geniş bir protokol yelpazesini destekler. Aynı projede farklı protokollerden gelen verileri birleştirip tek noktadan izleyebilirsiniz. Network redundancy ile birden fazla haberleşme kanalı yönetilir — bir kanal kesildiğinde otomatik geçiş yapılır.

### Alarm ve Olay Yönetimi

Analog ve dijital alarm tanımları, alarm grupları, öncelik seviyeleri ve bildirim mekanizmaları. Alarm geçmişi kayıt altına alınır ve denetim izine dahil edilir. Alarm durumları canlı ekranlarda anlık olarak gösterilir.

### Script ve Otomasyon

Nashorn tabanlı ECMAScript 5 script engine ile sunucu tarafında çalışan otomasyonlar yazın. Scriptler zamanlı (cron) veya tetiklemeli olarak çalıştırılabilir. REST API çağrıları, veri işleme, raporlama ve harici sistem entegrasyonları script üzerinden yapılabilir.

### Tarihsel Veri ve Raporlama

Değişken değerleri yapılandırılabilir aralıklarla loglanır. Trend grafikleri, tablo görünümü ve istatistiksel analiz araçları ile tarihsel veriler incelenir. Veriler Excel (.xlsx) olarak dışa aktarılabilir.

### REST API ve Entegrasyon

1100+ endpoint ile platformun tüm fonksiyonlarına programatik erişim sağlanır. Değişken okuma/yazma, proje yönetimi, alarm sorgulama, script çalıştırma — hepsi REST üzerinden yapılabilir. Üçüncü parti sistemlerle (ERP, MES, bulut servisleri) entegrasyon bu API aracılığıyla kurulur.

### AI Destekli Geliştirme

AI Asistan (masaüstü uygulaması) veya MCP Server (Claude Desktop extension) ile doğal dilde inSCADA verilerinizi sorgulayın, script yazın, alarm analizi yapın ve grafik oluşturun. 37 araç ile platform fonksiyonlarına AI üzerinden erişin.

## Platform Mimarisi

inSCADA'da veriler hiyerarşik bir yapıda organize edilir:

```
Space (Çalışma alanı)
└── Project (Proje)
    ├── Connection (Protokol bağlantısı)
    │   └── Device (Cihaz)
    │       └── Frame (Veri çerçevesi)
    │           └── Variable (Değişken)
    ├── Script (Otomasyon)
    └── Alarm Group
        └── Alarm Definition
```

**Space** çoklu çalışma alanı ile kiracı izolasyonu sağlar. **Variable** platformun temel yapı taşıdır — loglama, ölçekleme, alarm ve animasyon bağlantılarının tümü değişken üzerinden yapılır.

## Başlangıç Adımları

inSCADA ile çalışmaya başlamak dört adımda özetlenebilir:

1. **Kur** — inSCADA'yı Windows sunucunuza kurun, tarayıcıdan yönetim arayüzüne erişin
2. **Proje oluştur** — Space ve proje tanımlayın, çalışma ortamınızı hazırlayın
3. **Bağlantı ekle** — Saha cihazlarınızla protokol bağlantısı kurun, değişkenleri tanımlayın
4. **İzlemeye başla** — SVG ekranlar tasarlayın, alarm kuralları belirleyin, sistemi canlıya alın

Detaylı kurulum adımları için [Sistem Gereksinimleri](/docs/tr/getting-started/system-requirements/) sayfasına geçin.
