---
title: "inSCADA Nedir?"
description: "inSCADA web tabanlı SCADA/IIoT geliştirme platformuna genel bakış"
sidebar:
  order: 1
---

**inSCADA**, endüstrinin tüm alanlarında SCADA, HMI ve IIoT uygulamaları geliştirmek için tasarlanmış web tabanlı bir platformdur. Proje oluşturma, bağlantı yapılandırma, alarm tanımlama, trend ayarları, bildirim kuralları ve daha fazlası — SCADA alanında ihtiyaç duyulan geliştirme ve yapılandırma faaliyetlerinin %95'i web arayüzünden gerçekleştirilir. Bunun için herhangi bir tarayıcı kullanılabildiği gibi, daha sade bir kullanıcı deneyimi için **inSCADA Viewer** masaüstü uygulaması da mevcuttur.

Tamamen RESTful bir mimariye sahiptir — platform üzerindeki her işlem REST API üzerinden gerçekleştirilebilir. Multi-tenant yapısı sayesinde birden fazla çalışma alanı (Space) ve proje aynı anda, birbirinden izole şekilde yönetilir. Çok kullanıcılı erişim ile farklı roller ve yetkiler tanımlanarak ekipler paralel çalışabilir.

## Temel Fark: Runtime = Development

Geleneksel SCADA yazılımlarında geliştirme ortamı ve çalışma ortamı birbirinden ayrıdır: proje geliştirilir, derlenir (compile), test edilir ve üretim ortamına dağıtılır (deploy).

inSCADA'da bu ayrım yoktur. **Runtime ve development aynı ortamda yaşar.** Bir bağlantı eklemek, değişken tanımlamak veya ekran tasarlamak için ayrı bir IDE'ye ihtiyacınız yoktur — tüm yapılandırma canlı sistem üzerinde, tarayıcıdan yapılır ve anında devreye girer.

Bu yaklaşım:
- **Sahada hızlı müdahale** imkânı sağlar
- Compile-deploy döngüsünü ortadan kaldırır
- Geliştirme süresini önemli ölçüde kısaltır

## inSCADA ile Ne Yapabilirsiniz?

### SCADA / HMI

Saha cihazlarından canlı veri toplayın ve kullanıcılara görsel ekranlar sunun. inSCADA, arayüz geliştirmek için iki farklı yöntem sunar:

**Geleneksel Yöntem — SVG Animasyon:** Klasik SCADA yazılımlarındaki gibi görsel nesnelere canlı veri ve animasyon bağlama yaklaşımıdır. inSCADA bu yöntemi SVG tabanlı olarak sunar. Herhangi bir SVG editörden (Figma, Illustrator, Inkscape vb.) alınan çıktılar doğrudan platforma import edilir. SVG içindeki her nesneye animasyon tipi atanabilir — renk değişimi, hareket, döndürme, değer gösterimi, opaklık ve daha fazlası.

**Modern Yöntem — HTML/JS/CSS Uygulama Geliştirme:** Custom Menu özelliği ile HTML, JavaScript ve CSS kullanarak tamamen özel arayüzler geliştirebilirsiniz. Dashboard, kontrol paneli veya raporlama ekranları standart web teknolojileri ile oluşturulur.

Her iki yöntem aynı projede bir arada kullanılabilir — **hibrit arayüzler** oluşturabilirsiniz. Örneğin bir SVG mimik ekranın yanında HTML tabanlı bir trend grafiği veya kontrol paneli yer alabilir.

### Veri Toplama ve Haberleşme

Modbus TCP/RTU/UDP, OPC UA, OPC DA, IEC 61850, IEC 60870-5-104, DNP3, Siemens S7, MQTT, EtherNet/IP ve Fatek dahil geniş bir protokol yelpazesini destekler. Aynı projede farklı protokollerden gelen verileri birleştirip tek noktadan izleyebilirsiniz. Network redundancy ile birden fazla haberleşme kanalı yönetilir — bir kanal kesildiğinde otomatik geçiş yapılır. BACnet ve KNX gibi ek protokoller, gateway uygulamaları aracılığıyla entegre edilebilir.

### Alarm ve Olay Yönetimi

Analog ve dijital alarm tanımları, alarm grupları, öncelik seviyeleri ve bildirim mekanizmaları. Alarm geçmişi kayıt altına alınır ve denetim izine dahil edilir. Alarm durumları canlı ekranlarda anlık olarak gösterilir.

### Script ve Otomasyon

JavaScript tabanlı script engine ile sunucu tarafında çalışan otomasyonlar yazın. Scriptler zamanlı (cron) veya tetiklemeli olarak çalıştırılabilir. REST API çağrıları, veri işleme, raporlama ve harici sistem entegrasyonları script üzerinden yapılabilir.

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

Platform, yapılandırma verileri için ilişkisel veritabanı (RDB), tarihsel ölçümler için zaman serisi veritabanı (TSDB) ve gerçek zamanlı erişim için bellek içi önbellek (In-Memory Cache) olmak üzere üç katmanlı bir veri mimarisi kullanır. Active-Active cluster mimarisi ile yedekli çalışmayı destekler.

Detaylı mimari bilgi için [Platform Mimarisi](/docs/tr/platform/architecture/) sayfasına bakın.

## Başlangıç Adımları

1. **Kur ve giriş yap** — inSCADA'yı bilgisayarınıza kurun. Tarayıcıdan veya inSCADA Viewer'dan platforma login olun.
2. **İlk projenizi oluşturun** — Varsayılan `default_space` çalışma alanında ilk projenizi oluşturun.
3. **Veri yapısını kurun** — Projenize Bağlantı (Connection), Cihaz (Device), Veri Bloğu (Frame) ve Değişken (Variable) tanımlayın.
4. **Haberleşmeyi başlatın** — Runtime Control Panel'den bağlantınızı başlatın, canlı veri akışını doğrulayın.
5. **Uygulamanızı geliştirin** — SVG animasyon ekranları veya HTML arayüzler tasarlayın, alarm grupları ve alarm kuralları oluşturun, trend tanımları yapın ve uygulamanızı genişletin.

Detaylı kurulum adımları için [Sistem Gereksinimleri](/docs/tr/getting-started/system-requirements/) sayfasına geçin.
