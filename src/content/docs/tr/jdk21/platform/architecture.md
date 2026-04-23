---
title: "Platform Mimarisi"
description: "inSCADA veri hiyerarşisi, bileşenler, veri akışı ve çoklu çalışma alanı yapısı"
sidebar:
  order: 0
---

inSCADA, saha cihazlarından veri toplamak, işlemek, görselleştirmek ve otomasyon kurmak için tasarlanmış bir SCADA platformudur. Tek bir Spring Boot uygulaması olarak çalışır — tüm bileşenler tek bir süreçte birleşiktir.

## Veri Hiyerarşisi

inSCADA'daki tüm veriler iki seviyede organize edilir: **Space** (çalışma alanı) ve **Project** (proje). Bazı bileşenler space genelinde paylaşılırken, bazıları bir projeye bağlıdır.

```
Space (Çalışma Alanı)
│
├── [Space Seviyesi — Projeler arası paylaşılan]
│   ├── Custom Menu
│   ├── Dashboard
│   ├── Expression
│   └── Symbol (SVG sembol kütüphanesi)
│
└── Project (Proje)
    │
    ├── [Haberleşme]
    │   └── Connection
    │       └── Device
    │           └── Frame
    │               └── Variable
    │
    ├── [İzleme & Alarm]
    │   ├── Alarm Group
    │   │   ├── Analog Alarm
    │   │   ├── Digital Alarm
    │   │   └── Custom Alarm
    │   └── Trend
    │       └── Trend Tag
    │
    ├── [Otomasyon]
    │   ├── Script
    │   └── Data Transfer
    │
    ├── [Görselleştirme]
    │   ├── Animation (SVG ekran)
    │   └── Faceplate (yeniden kullanılabilir SVG bileşeni)
    │
    └── [Raporlama]
        └── Report (klasik + Jasper)
```

:::note[Space vs. Project]
**Custom Menu**, **Dashboard**, **Expression** ve **Symbol** space seviyesinde tanımlanır — aynı space içindeki tüm projeler tarafından paylaşılır. Diğer tüm bileşenler bir projeye bağlıdır.
:::

### Space (Çalışma Alanı)

Space, en üst seviye izolasyon birimidir. Her space kendi proje, kullanıcı ve yapılandırma setine sahiptir. Farklı space'ler birbirinden tamamen bağımsızdır.

Kullanım senaryoları:
- **Müşteri izolasyonu** — her müşteri için ayrı space
- **Ortam ayrımı** — geliştirme, test, üretim
- **Departman ayrımı** — enerji, su, bina otomasyonu

### Project (Proje)

Proje, bir tesis, saha veya mantıksal birim temsil eder. Bir space altında birden fazla proje olabilir. Projedeki tüm bileşenler (bağlantı, alarm, script, ekran vb.) proje kapsamında çalışır.

Örnek projeler:
- "Ankara Fabrika" — bir üretim tesisi
- "GES-01" — bir güneş enerji santrali
- "Bina-A HVAC" — bir binanın iklimlendirme sistemi

Her projenin opsiyonel olarak enlem/boylam koordinatları olabilir ve harita ekranında görselleştirilebilir.

### Connection (Bağlantı)

Bağlantı, bir saha cihazına veya sisteme olan haberleşme kanalıdır. Her bağlantı bir protokol kullanır.

**Desteklenen protokoller:**

| Grup | Protokoller | Client | Server / Slave |
|------|------------|--------|----------------|
| **Endüstriyel** | Modbus TCP / UDP / RTU Over TCP | ✓ | ✓ (her transport için) |
| | S7 | ✓ | — |
| | EtherNet/IP | ✓ | — |
| | Fatek TCP / UDP | ✓ | — |
| **Enerji** | DNP3 | ✓ | ✓ |
| | IEC 60870-5-104 | ✓ | ✓ |
| | IEC 61850 | ✓ | ✓ |
| **Açık Standart** | OPC UA | ✓ | ✓ |
| | OPC DA | ✓ | — |
| | OPC XML | ✓ | — |
| | MQTT | ✓ | — |
| **Yerel** | LOCAL (simülasyon / dahili hesaplama) | — | — |

Her bağlantı bağımsız olarak başlatılıp durdurulabilir. Durum değerleri: **Connected**, **Disconnected**.

:::note[Sidecar Protokoller]
**BACnet** ve **KNX** inSCADA platformuna doğrudan entegre değildir — ayrı Node.js gateway'leri olarak çalışır ve REST/WebSocket üzerinden inSCADA ile entegre olur. Ayrıntı: [BACnet](/docs/tr/jdk21/protocols/bacnet/), [KNX](/docs/tr/jdk21/protocols/knx/).
:::

### Device (Cihaz)

Cihaz, bir bağlantı üzerindeki fiziksel veya mantıksal birimi temsil eder. Örneğin bir Modbus bağlantısı üzerinde birden fazla slave cihaz olabilir.

### Frame (Veri Çerçevesi)

Frame, bir cihazdan okunan veri bloğudur. Her frame belirli bir adres aralığını ve okuma periyodunu tanımlar.

| Parametre | Açıklama |
|-----------|----------|
| **Başlangıç Adresi** | Okunacak ilk adres |
| **Miktar** | Okunacak register/nokta sayısı |
| **Periyot** | Okuma sıklığı (ms) |

:::tip
Frame, performans optimizasyonu için kritiktir. Ardışık adresleri tek bir frame'de toplamak, ayrı ayrı okumaktan çok daha verimlidir.
:::

### Variable (Değişken)

Değişken, platformdaki en temel veri birimidir. Bir sıcaklık ölçümü, bir motor durumu, bir sayaç değeri — her biri bir değişkendir.

Her değişkenin temel özellikleri:

| Özellik | Açıklama |
|---------|----------|
| **Name** | Benzersiz ad (proje içinde) |
| **Type** | Float, Integer, Boolean, String |
| **Unit** | Mühendislik birimi (°C, kW, bar, V, A...) |
| **Ölçekleme** | Raw → Engineering dönüşümü (engZeroScale, engFullScale) |
| **Loglama** | Tarihsel veri kayıt tipi |
| **Expression** | Özel değer hesaplama formülü |

#### Ölçekleme (Scaling)

Ham (raw) değer, mühendislik değerine lineer olarak dönüştürülür:

```
Engineering = engZeroScale + (raw - rawZeroScale) ×
              (engFullScale - engZeroScale) / (rawFullScale - rawZeroScale)
```

Örnek: 4-20mA sensör → 0-100°C ölçekleme:
- Raw: 4mA → 0°C, 20mA → 100°C
- engZeroScale=0, engFullScale=100, rawZeroScale=4, rawFullScale=20

#### Loglama Tipleri

| Tip | Açıklama |
|-----|----------|
| **No Log** | Kayıt yok |
| **When Changed** | Değer değiştiğinde kayıt |
| **Periodically** | Sabit aralıkla kayıt (logPeriod saniye) |
| **Threshold** | Eşik aşıldığında kayıt |
| **Expression** | Kullanıcı tanımlı formül ile kayıt kararı |
| **Custom** | Özel logic (script tabanlı) |

#### Value Expression

Değişkene özel bir hesaplama formülü atanabilir. Her okuma döngüsünde bu formül çalışır ve sonucu değişkenin değeri olur:

```javascript
// Örnek: Sinüs dalga simülasyonu
var t = new Date().getTime() / 1000;
return (Math.sin(t / 60) * 150 + 450).toFixed(2) * 1;
```

---

## Alarm Sistemi

### Alarm Grubu

Alarmlar grup halinde organize edilir. Her alarm grubu bir proje altındadır ve toplu olarak etkinleştirilebilir/devre dışı bırakılabilir.

```
Project
└── Alarm Group (örn: "Sıcaklık Alarmları")
    ├── Analog Alarm: Temperature_C > 60°C (Yüksek Sıcaklık)
    ├── Analog Alarm: Temperature_C > 80°C (Kritik Sıcaklık)
    └── Analog Alarm: Temperature_C < 10°C (Düşük Sıcaklık)
```

### Alarm Tipleri

| Tip | Açıklama | Parametreler |
|-----|----------|-------------|
| **Analog** | Sayısal değer eşik kontrolü | setPoint, highHigh, high, low, lowLow |
| **Digital** | Boolean durum kontrolü | ON → Alarm, OFF → Normal |
| **Custom** | Script tabanlı özel koşul | JavaScript expression |

### Alarm Durumu (FiredAlarm)

Her tetiklenen alarm `FiredAlarm` kaydı olarak saklanır. Gerçek durum iki değerlidir:

```
ON (tetiklendi) → OFF (kapandı)
```

Onay (acknowledge) ve yorum (comment) durumun bir parçası **değildir** — `acknowledgeTime`, `acknowledgedBy`, `commentTime`, `comment` alanları ayrı olarak işlenir ve kullanıcı müdahalesini kaydeder ama alarm durumunu değiştirmez.

Her alarm olayı tarihsel olarak kaydedilir: tetiklenme zamanı, kapanma zamanı, onaylayan kullanıcı, süre.

---

## Script Engine

Script'ler platformun otomasyon motorudur. Sunucu tarafında GraalJS (Nashorn uyumluluk modu) ile çalışır ve `ins.*` API üzerinden tüm platform verilerine erişir.

### Script Kullanım Alanları

| Alan | Açıklama | Örnek |
|------|----------|-------|
| **Zamanlanmış görev** | Periyodik veya saatli çalışma | Her 10 saniyede enerji hesaplama |
| **Değişken formülü** | Değer dönüşümü | İki değişkenden üçüncüyü türetme |
| **Alarm koşulu** | Özel alarm mantığı | Birden fazla değişkene bağlı koşul |
| **Veri entegrasyonu** | REST API çağrısı | Hava durumu API'sinden veri çekme |
| **Raporlama** | Otomatik rapor | Her sabah PDF rapor e-posta ile gönderme |
| **Bildirim** | Olay bazlı bildirim | Alarm tetiklenince SMS gönderme |

### Zamanlama Tipleri

| Tip | Kullanım |
|-----|----------|
| **Periodic** | Her X milisaniyede bir çalışır |
| **Daily** | Her gün belirli saatte çalışır |
| **Once** | Bir kez çalışıp durur |
| **None** | Yalnızca manuel veya API ile tetiklenir |

Detaylı bilgi: [Script Engine →](/docs/tr/jdk21/platform/scripts/)

---

## Görselleştirme Bileşenleri

### Animation (SVG Ekran) — Proje Seviyesi

![SVG Animation — Energy Monitoring Dashboard](../../../../../assets/docs/variable-tracking.png)

SVG tabanlı interaktif SCADA ekranları. Değişken değerleri ekran üzerinde gerçek zamanlı olarak gösterilir: renk değişimi, hareket, sayısal gösterim, açma/kapama kontrolleri.

### Faceplate — Proje Seviyesi

Tekrar kullanılabilir SVG bileşenleri. Bir motor, vana, pompa gibi sık kullanılan görsel öğeler faceplate olarak tanımlanıp birden fazla animation ekranında kullanılabilir.

### Symbol (SVG Sembol Kütüphanesi) — Space Seviyesi

Space genelinde paylaşılan SVG sembol kütüphanesi. Tüm projelerdeki animation ve faceplate'ler bu sembolleri kullanabilir.

### Dashboard (Pano) — Space Seviyesi

Farklı projelerden verileri tek bir panoda birleştirmek için kullanılır. Space seviyesinde tanımlandığı için projeler arası veri karşılaştırması yapılabilir.

### Trend Grafiği — Proje Seviyesi

Değişkenlerin zaman içindeki değişimini gösteren grafikler. Birden fazla değişken aynı grafikte gösterilebilir (Trend Tag). Geçmişe dönük veri inceleme ve karşılaştırma için kullanılır.

### Custom Menu (Özel Menü) — Space Seviyesi

Kullanıcıya özel menü yapısı oluşturmak için kullanılır. Space seviyesinde tanımlanır — farklı roller için farklı menüler atanabilir. Operatör yalnızca izleme ekranlarını, yönetici raporları, mühendis yapılandırma sayfalarını görür.

### Report (Rapor) — Proje Seviyesi

Rapor sistemi PDF ve Excel formatında çıktı üretir. İki tip rapor vardır:
- **Klasik Rapor** — inSCADA'nın kendi tablo/şablon tasarımı
- **Jasper Rapor** — JasperReports dosyaları (.jrxml / .jasper) ile zengin layout

Her ikisi de zamanlanabilir, e-posta ile gönderilebilir, dosyaya kaydedilebilir.

### Expression (Paylaşımlı Formül) — Space Seviyesi

Space genelinde paylaşılan hesaplama formülleri. Birden fazla değişken veya alarm tarafından ortak kullanılabilir. Tekrarlanan formülleri merkezi olarak yönetmeyi sağlar.

### Project Map (Harita)

![Project Map](../../../../../assets/docs/rt-project-map.png)

GIS harita üzerinde projelerin coğrafi konumlarını gösterir. Her proje noktasında anlık değerler, alarm durumu ve bağlantı durumu popup olarak görüntülenir.

---

## Veritabanı Yapısı

inSCADA üç farklı veri katmanı kullanır. Her biri farklı bir veri tipine optimize edilmiştir:

### PostgreSQL — Yapılandırma Veritabanı

Proje tanımları, değişken ayarları, kullanıcılar, roller, alarm tanımları, script kodları — kısaca platformun tüm yapılandırma verileri burada tutulur. Bu veriler nadiren değişir, ilişkisel yapıdadır ve tutarlılık (consistency) önceliklidir.

Şema geçişleri Flyway ile yönetilir; varsayılan şema adı `inscada`.

### InfluxDB — Zaman Serisi Veritabanı

Değişken tarihsel değerleri, alarm geçmişi, olay logları, giriş denemeleri — zaman damgalı tüm veriler burada tutulur. Bu veriler sürekli yazılır, nadiren güncellenir ve zaman aralığına göre sorgulanır.

Her ölçüm tipi (variable value, alarm, event log) için ayrı retention policy tanımlanır; saklama süreleri InfluxDB katmanında yapılandırılır — inSCADA'da sabit bir varsayılan yoktur.

### Redis — Anlık Değer Cache

Tüm değişkenlerin **son güncel değerleri** Redis üzerinde tutulur. `ins.getVariableValue()` veya REST API ile değer okunduğunda cache'ten döner — InfluxDB'ye gitmez.

Bu sayede:
- Anlık değer okuma < 1ms
- Binlerce değişken eşzamanlı okunabilir
- Web arayüzü ve script'ler aynı güncel veriye erişir

Redis ayrıca script global object'leri, oturum token'ları ve rate-limit sayaçları için de kullanılır.

---

## Veri Akışı

Bir saha cihazından web ekranına kadar verinin izlediği yol:

```
┌─────────┐    ┌──────────┐    ┌─────────┐    ┌────────┐    ┌────────┐
│  Saha   │───▶│ Bağlantı │───▶│  Frame   │───▶│ Ham    │───▶│Ölçekle │
│ Cihazı  │    │(Protokol)│    │ (Okuma)  │    │ Değer  │    │  me    │
└─────────┘    └──────────┘    └─────────┘    └────────┘    └───┬────┘
                                                                │
                    ┌───────────────────────────────────────────┘
                    │
                    ▼
              ┌──────────┐    ┌──────────┐    ┌──────────┐
              │  Redis   │───▶│ InfluxDB │    │  Alarm   │
              │ (Cache)  │    │(Tarihsel)│    │ Kontrol  │
              └────┬─────┘    └──────────┘    └──────────┘
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
     ┌────────┐┌────────┐┌────────┐
     │  Web   ││ Script ││  REST  │
     │  UI    ││ Engine ││  API   │
     └────────┘└────────┘└────────┘
```

1. **Saha Cihazı** — PLC, RTU, sensör, sayaç vb.
2. **Bağlantı** — Belirlenen protokol ile cihaza bağlanır
3. **Frame Okuma** — Tanımlı periyotta adres bloğunu okur
4. **Ham Değer** — Cihazdan gelen raw veri
5. **Ölçekleme** — Raw → Engineering dönüşümü (varsa)
6. **Cache (Redis)** — Güncel değer belleğe yazılır
7. **Loglama (InfluxDB)** — Loglama tipine göre zaman serisine kayıt
8. **Alarm Kontrol** — Alarm tanımlarına göre eşik kontrolü
9. **Tüketim** — Web UI (WebSocket/SSE), Script Engine, REST API aynı cache'ten okur

### Yazma Akışı (Komut Gönderme)

```
UI / Script / API → Cache Güncelleme → Bağlantı → Protokol Yazma → Saha Cihazı
```

`ins.setVariableValue()` veya UI üzerinden değer yazıldığında, komut bağlantı üzerinden saha cihazına iletilir.

---

## Çoklu Çalışma Alanı (Multi-Tenant)

```
inSCADA Instance
├── Space: "enerji"
│   ├── Project: "GES-01"
│   ├── Project: "GES-02"
│   └── Project: "RES-01"
│
├── Space: "bina"
│   ├── Project: "Merkez Ofis"
│   └── Project: "Depo"
│
└── Space: "su"
    ├── Project: "Arıtma Tesisi"
    └── Project: "Pompa İstasyonları"
```

Her space:
- Kendi proje seti
- Kendi kullanıcı yetkileri
- Birbirinden bağımsız veri

Kullanıcılar birden fazla space'e erişebilir ve oturum sırasında space değiştirebilir. REST API çağrılarında hangi space'in hedeflendiğini belirtmek için `X-Space` header'ı kullanılır.

---

## Cluster Modu (Opsiyonel)

`cluster` profili aktifleştirildiğinde inSCADA çoklu-node (active-follower) modda çalışır. RabbitMQ üzerinden entity replikasyonu, InfluxDB senkronizasyonu ve dosya sistemi replikasyonu yapılır; liderlik JGroups üzerinden seçilir. Tek node setup için cluster profili gerekmez.

---

## Erişim ve Portlar

Varsayılan yapılandırma:

| Port | Kullanım |
|------|----------|
| **8082** | HTTPS — Web arayüzü ve REST API (ana erişim) |
| **8083** | HTTPS — Sandbox (custom HTML widget iframe'leri için izole edilmiş origin) |

Uygulama varsayılanda yalnızca HTTPS üzerinden hizmet verir; TLS bundle `server.ssl.bundle` ile yapılandırılır. HTTP (plain) port varsayılanda açık değildir.

Follower profili ile node01/node02 ayrımı için 9082/9083 portları kullanılır.

Web arayüzü herhangi bir modern tarayıcıdan erişilebilir; mobil cihazlardan da responsive olarak çalışır. Ek bir istemci yazılımı kurulumu gerekmez.

Yapılandırma detayları: [Yapılandırma →](/docs/tr/jdk21/deployment/configuration/)
