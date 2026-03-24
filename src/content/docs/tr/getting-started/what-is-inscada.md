---
title: "inSCADA Nedir?"
description: "inSCADA web tabanlı SCADA/IIoT geliştirme platformuna genel bakış"
sidebar:
  order: 1
---

**inSCADA**, endüstrinin tüm alanlarında SCADA, HMI ve IIoT uygulamaları geliştirmek için tasarlanmış web tabanlı bir platformdur. Tamamen RESTful bir mimariye sahiptir — platform üzerindeki her işlem REST API üzerinden gerçekleştirilebilir. Multi-tenant yapısı sayesinde birden fazla çalışma alanı (Space) ve proje aynı anda, birbirinden izole şekilde yönetilir. Çok kullanıcılı erişim ile farklı roller ve yetkiler tanımlanarak ekipler paralel çalışabilir.

Proje oluşturma, bağlantı yapılandırma, alarm tanımlama, trend ayarları, bildirim kuralları ve daha fazlası — SCADA alanında ihtiyaç duyulan geliştirme ve yapılandırma faaliyetlerinin %95'i web arayüzünden gerçekleştirilir. Bunun için herhangi bir tarayıcı kullanılabildiği gibi, daha sade bir kullanıcı deneyimi için **inSCADA Viewer** masaüstü uygulaması da mevcuttur.

### Ekran Tasarımı: İki Farklı Yaklaşım

inSCADA, kullanıcı arayüzü geliştirmek için iki farklı yöntem sunar:

**Geleneksel Yöntem — SVG Animasyon:** Klasik SCADA yazılımlarındaki gibi görsel nesnelere canlı veri ve animasyon bağlama yaklaşımıdır. inSCADA bu yöntemi SVG tabanlı olarak sunar. Herhangi bir SVG editörden (Figma, Illustrator, Inkscape vb.) alınan çıktılar doğrudan platforma import edilir. SVG içindeki her nesneye (text, rectangle, path, circle vb.) animasyon tipi atanabilir — renk değişimi, hareket, döndürme, değer gösterimi, opaklık ve daha fazlası.

**Modern Yöntem — HTML/JS/CSS Uygulama Geliştirme:** Custom Menu özelliği ile HTML, JavaScript ve CSS kullanarak tamamen özel arayüzler geliştirebilirsiniz. Bu yöntem, standart web teknolojileri ile sınırsız esneklikte dashboard, kontrol paneli veya raporlama ekranları oluşturmanızı sağlar.

Her iki yöntem aynı projede bir arada kullanılabilir — **hibrit arayüzler** oluşturabilirsiniz. Örneğin bir SVG mimik ekranın yanında HTML tabanlı bir trend grafiği veya kontrol paneli yer alabilir.

## Temel Fark: Runtime = Development

Geleneksel SCADA yazılımlarında geliştirme ortamı ve çalışma ortamı birbirinden ayrıdır: proje geliştirilir, derlenir (compile), test edilir ve üretim ortamına dağıtılır (deploy).

inSCADA'da bu ayrım yoktur. **Runtime ve development aynı ortamda yaşar.** Bir bağlantı eklemek, değişken tanımlamak veya ekran tasarlamak için ayrı bir IDE'ye ihtiyacınız yoktur — tüm yapılandırma canlı sistem üzerinde, tarayıcıdan yapılır ve anında devreye girer.

Bu yaklaşım:
- **Sahada hızlı müdahale** imkânı sağlar
- Compile-deploy döngüsünü ortadan kaldırır
- Geliştirme süresini önemli ölçüde kısaltır

## inSCADA ile Ne Yapabilirsiniz?

### SCADA / HMI

Saha cihazlarından canlı veri toplayın ve kullanıcılara görsel ekranlar sunun. Yukarıda açıklanan SVG ve HTML/JS/CSS yöntemleri ile tesisinize özel arayüzler tasarlayın. Canlı değerler, trend grafikleri, alarm göstergeleri ve kontrol butonları tek bir ekranda birleştirilebilir.

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

### Veri Hiyerarşisi

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

### Üç Katmanlı Veri Mimarisi

inSCADA, farklı veri türlerini farklı veritabanı teknolojilerinde saklar. Bu ayrım performans ve ölçeklenebilirlik için kritiktir:

| Katman | Amaç | Saklanan Veri |
|--------|-------|---------------|
| **İlişkisel Veritabanı (RDB)** | Yapılandırma ve metadata | Proje, bağlantı, cihaz, değişken tanımları, kullanıcılar, roller, alarm kuralları, script tanımları, lisans bilgileri |
| **Zaman Serisi Veritabanı (TSDB)** | Tarihsel ölçüm verileri (Historian) | Değişken değerleri, zaman damgaları, kalite bayrakları. Yapılandırılabilir saklama süresi, downsampling ile yaşlandırma |
| **Bellek İçi Önbellek (In-Memory Cache)** | Gerçek zamanlı erişim | Anlık değişken değerleri (<1ms erişim), oturum bilgileri, rate-limit sayaçları |

### Veri Akış Mimarisi

Saha cihazından gelen bir ölçüm değeri platformda şu aşamalardan geçer:

```
Saha Cihazı (Sensör/Transmitter)
        │
        │ Protokol (Modbus, OPC UA, IEC 104...)
        ▼
┌─────────────────────────────┐
│   Protokol Sürücüsü         │
│   (Connector)               │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│   Değer İşleme Hattı        │
│                              │
│   1. Ölçekleme               │
│      (ham → mühendislik)     │
│   2. Zaman ayarlama          │
│   3. İfade değerlendirme     │
│      (JavaScript expression) │
│   4. Pulse üretimi           │
└────────────┬────────────────┘
             │
     ┌───────┴───────┐
     ▼               ▼
 ┌────────┐    ┌──────────┐
 │ Cache  │    │ Historian │
 │ (anlık)│    │ (kayıt    │
 │        │    │  koşuluna │
 │ → Web  │    │  göre)    │
 │  yayın │    └──────────┘
 └────────┘
```

### Yüksek Erişilebilirlik

inSCADA, Active-Active cluster mimarisi ile yedekli çalışmayı destekler. İki veya daha fazla node eş zamanlı çalışır; lider node arızalandığında yedek node otomatik olarak devralır. Yapılandırma değişiklikleri, dosyalar ve tarihsel veriler node'lar arasında senkronize edilir.

## Başlangıç Adımları

inSCADA ile çalışmaya başlamak dört adımda özetlenebilir:

1. **Kur** — inSCADA'yı Windows sunucunuza kurun, tarayıcıdan yönetim arayüzüne erişin
2. **Proje oluştur** — Space ve proje tanımlayın, çalışma ortamınızı hazırlayın
3. **Bağlantı ekle** — Saha cihazlarınızla protokol bağlantısı kurun, değişkenleri tanımlayın
4. **İzlemeye başla** — SVG ekranlar tasarlayın, alarm kuralları belirleyin, sistemi canlıya alın

Detaylı kurulum adımları için [Sistem Gereksinimleri](/docs/tr/getting-started/system-requirements/) sayfasına geçin.
