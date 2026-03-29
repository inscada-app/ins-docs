---
title: "Sistem Gereksinimleri"
description: "inSCADA platformu için donanım, yazılım ve ağ gereksinimleri"
sidebar:
  order: 2
---

Bu bölüm inSCADA platformunun kurulumu ve çalışması için gerekli donanım, yazılım ve ağ altyapısı bilgilerini içerir.

:::caution[Önemli]
inSCADA, platform bileşenleri (RDB, TSDB, In-Memory Cache) ile birlikte özel bir bilgisayara kurulmalıdır. Aynı bilgisayarda kaynak tüketen başka uygulamalar çalıştırılmamalıdır.
:::

## Donanım Gereksinimleri

inSCADA; sunucu, masaüstü PC, endüstriyel PC veya mini bilgisayar gibi farklı donanımlarda çalışabilir. Aşağıdaki tablo, tag (değişken) sayısına göre minimum donanım gereksinimlerini gösterir. Daha yüksek olan tag veya cihaz sayısını baz alın.

| Sistem Ölçeği | Tag Sayısı | CPU (Çekirdek) | RAM | Disk (SSD) |
|---------------|-----------|----------------|-----|------------|
| **Küçük** | < 1.000 | 4 | 8 GB | 128 GB |
| **Orta** | 1.000 – 5.000 | 4 | 16 GB | 256 GB |
| **Büyük** | 5.000 – 10.000 | 8 | 16 GB | 512 GB |
| **Kurumsal** | 10.000 – 50.000 | 8 | 32 GB | 1 TB |
| **Kurumsal+** | 50.000+ | 16 | 64 GB | 2 TB+ |

:::note
- Listelenen değerler minimum gereksinimlerdir. RAM değerlerini ikiye katlamanızı öneririz.
- Yedekli (cluster) yapıda her node için ayrı donanım hesaplanmalıdır.
- Disk alanı, tarihsel veri saklama süresine ve loglama sıklığına bağlı olarak artabilir.
:::

### İstemci Gereksinimleri

inSCADA web tabanlı olduğundan istemci tarafında kurulum gerekmez. Herhangi bir modern tarayıcı yeterlidir.

| Bileşen | Minimum |
|---------|---------|
| **Tarayıcı** | Chrome 90+, Edge 90+, Firefox 90+ |
| **Ekran Çözünürlüğü** | 1920 × 1080 |
| **Ağ** | inSCADA'ya HTTPS erişimi |

**inSCADA Viewer** masaüstü uygulaması için ek gereksinimler:

| Bileşen | Minimum |
|---------|---------|
| **İşletim Sistemi** | Windows 10/11 (64-bit) |
| **RAM** | 4 GB |
| **Disk** | 500 MB |

## Desteklenen İşletim Sistemleri

inSCADA sunucusu aşağıdaki işletim sistemlerinde çalışır:

### Windows

| İşletim Sistemi | inSCADA | İstemci (Viewer) |
|-----------------|--------|-----------------|
| Windows Server 2022 | ✓ | — |
| Windows Server 2019 | ✓ | — |
| Windows Server 2016 | ✓ | — |
| Windows 11 (64-bit) | ✓ | ✓ |
| Windows 10 (64-bit) | ✓ | ✓ |

### Linux

| Dağıtım | inSCADA |
|----------|--------|
| Ubuntu 22.04 LTS / 24.04 LTS | ✓ |
| Red Hat Enterprise Linux 8 / 9 | ✓ |
| CentOS Stream 8 / 9 | ✓ |
| Debian 11 / 12 | ✓ |

:::note
Linux ortamında grafiksel arayüz gerekmez. inSCADA servis olarak (systemd) çalıştırılır.
:::

## Yazılım Bağımlılıkları

inSCADA aşağıdaki bileşenlerle birlikte çalışır. Tüm bileşenler kurulum uygulaması (setup) tarafından **otomatik olarak kurulur**. İstenirse bu bileşenler mevcut altyapınıza uygun şekilde ayrı sunuculara da kurulabilir.

| Bileşen | Amaç | Kurulum |
|---------|-------|---------|
| **Java Runtime (JDK)** | Platform çalışma zamanı | Setup ile otomatik |
| **İlişkisel Veritabanı (RDB)** | Yapılandırma ve metadata | Setup ile otomatik |
| **Zaman Serisi Veritabanı (TSDB)** | Tarihsel ölçüm verileri | Setup ile otomatik |
| **Bellek İçi Önbellek** | Gerçek zamanlı veri erişimi | Setup ile otomatik |

:::tip
Küçük ve orta ölçekli sistemlerde setup tüm bileşenleri tek bilgisayara otomatik kurar — ek yapılandırma gerekmez. Büyük ve kurumsal sistemlerde veritabanlarının mevcut altyapınızdaki ayrı makinelere dağıtılması önerilir; bu durumda bileşenler bağımsız olarak kurulup inSCADA'ya bağlantı bilgileri verilir.
:::

## Ağ Gereksinimleri

### Bant Genişliği

| Kullanım | Minimum |
|----------|---------|
| inSCADA – Saha Cihazları | 100 Mbps Ethernet |
| inSCADA – İstemciler | 100 Mbps (1 Gbps önerilir) |
| Node – Node (Cluster) | 1 Gbps |
| Seri haberleşme | 19.200 bps minimum baud rate |

### Port Gereksinimleri

**Platform Portları:**

| Port | Servis | Yön |
|------|--------|-----|
| 8081 | inSCADA Web Arayüzü (HTTP) | Gelen |
| 8082 | inSCADA Web Arayüzü (HTTPS) | Gelen |
| 5432 | İlişkisel Veritabanı | Dahili |
| 8086 | Zaman Serisi Veritabanı | Dahili |
| 6379 | Bellek İçi Önbellek | Dahili |
| 7800 | Cluster Haberleşme | Dahili (node arası) |
| 61616 | Mesaj Kuyruğu (Cluster) | Dahili (node arası) |

**Protokol Portları (Client — inSCADA → Saha Cihazı):**

inSCADA client/master olarak saha cihazlarına bağlanırken hedef cihazın portuna giden bağlantı kurar. Bu portların inSCADA tarafında açılmasına genellikle gerek yoktur; hedef cihazda açık olmalıdır.

| Port | Protokol | Açıklama |
|------|----------|----------|
| 502 | Modbus TCP | Varsayılan Modbus portu |
| 102 | IEC 61850 MMS | MMS haberleşme |
| 2404 | IEC 60870-5-104 | Varsayılan IEC 104 portu |
| 20000 | DNP3 | Varsayılan DNP3 portu |
| 4840 | OPC UA | Varsayılan OPC UA portu |
| 102 | Siemens S7 | S7 haberleşme portu |
| 1883 | MQTT | Varsayılan MQTT broker portu |
| 44818 | EtherNet/IP | Varsayılan EIP portu |

**Protokol Portları (Server — Dış Sistem → inSCADA):**

inSCADA'nın server/slave rolünde çalıştığı protokollerde, dış sistemlerin inSCADA'ya bağlanabilmesi için ilgili portun inSCADA tarafında **gelen bağlantılara açık** olması gerekir.

| Port | Protokol | Açıklama |
|------|----------|----------|
| Yapılandırılabilir | Modbus TCP Slave | Varsayılan: 502 (değiştirilebilir) |
| Yapılandırılabilir | IEC 60870-5-104 Server | Varsayılan: 2404 (değiştirilebilir) |
| Yapılandırılabilir | IEC 61850 Server | MMS server portu |
| Yapılandırılabilir | DNP3 Slave | Varsayılan: 20000 (değiştirilebilir) |
| Yapılandırılabilir | OPC UA Server | Varsayılan: 4840 (değiştirilebilir) |

:::note
- Firewall kurallarında yalnızca kullanılan portları açın
- Dahili portlar (veritabanı, cache, cluster) yalnızca aynı makine veya cluster node'ları arasında erişilebilir olmalıdır
- Server/Slave protokol portları bağlantı ayarlarından değiştirilebilir
:::

## Sanallaştırma

inSCADA aşağıdaki sanallaştırma platformlarında desteklenir:

| Platform | inSCADA | İstemci |
|----------|--------|---------|
| VMware vSphere / ESXi | ✓ | ✓ |
| Microsoft Hyper-V | ✓ | ✓ |
| KVM / QEMU | ✓ | — |
| Docker / Container | ✓ | — |

**Sanallaştırma notları:**
- CPU, bellek ve disk kaynakları **sabit (fixed)** olarak atanmalıdır — dinamik ayırma desteklenmez
- Sanal makineler arasında kaynak paylaşımı (over-allocation) yapılmamalıdır
- Paylaşımlı depolama kullanılıyorsa Fiber SAN önerilir; değilse yerel (direct-attached) SSD kullanın
- Host güç yönetimi **"High Performance"** moduna ayarlanmalıdır

## Disk Alanı Hesaplama

Tarihsel veri depolama için gereken disk alanı üç faktöre bağlıdır:

- **Tag sayısı**: Loglanan değişken adedi
- **Loglama periyodu**: Her kaç saniyede bir kayıt
- **Saklama süresi**: Kaç yıl tarihsel veri tutulacak

### Hesaplama Formülü

Saha ölçümlerine dayalı olarak, numerik SCADA verileri için point başına ortalama **~8 Byte** disk tüketimi ölçülmüştür (index, WAL ve metadata dahil).

```
Günlük Byte = Tag Sayısı × (86400 / Periyot) × 8.08 Byte
```

- `86400` = bir gündeki saniye sayısı
- `Periyot` = loglama periyodu (saniye)
- `8.08` = saha ölçümünden türetilen point başına ortalama byte (InfluxDB 1.8)

### Senaryo Tablosu

Aşağıdaki tablo, farklı tag sayısı ve loglama periyotları için **2 yıllık** disk ihtiyacını gösterir:

#### 1.000 Tag

| Periyot | Günlük | Yıllık | 2 Yıl |
|---------|--------|--------|-------|
| **1 sn** | 699 MB | 249 GB | 498 GB |
| **5 sn** | 140 MB | 50 GB | 100 GB |
| **10 sn** | 70 MB | 25 GB | 50 GB |
| **30 sn** | 23 MB | 8 GB | 17 GB |
| **60 sn** | 12 MB | 4 GB | 8 GB |

#### 10.000 Tag

| Periyot | Günlük | Yıllık | 2 Yıl |
|---------|--------|--------|-------|
| **1 sn** | 6.8 GB | 2.4 TB | 4.9 TB |
| **5 sn** | 1.4 GB | 498 GB | 996 GB |
| **10 sn** | 698 MB | 249 GB | 498 GB |
| **30 sn** | 233 MB | 83 GB | 166 GB |
| **60 sn** | 116 MB | 41 GB | 83 GB |

#### 50.000 Tag

| Periyot | Günlük | Yıllık | 2 Yıl |
|---------|--------|--------|-------|
| **1 sn** | 34 GB | 12.2 TB | 24.4 TB |
| **5 sn** | 6.8 GB | 2.4 TB | 4.9 TB |
| **10 sn** | 3.4 GB | 1.2 TB | 2.4 TB |
| **30 sn** | 1.1 GB | 415 GB | 830 GB |
| **60 sn** | 581 MB | 207 GB | 415 GB |

#### 300.000 Tag

| Periyot | Günlük | Yıllık | 2 Yıl |
|---------|--------|--------|-------|
| **1 sn** | 205 GB | 73 TB | 146 TB |
| **5 sn** | 41 GB | 14.6 TB | 29.2 TB |
| **10 sn** | 20.5 GB | 7.3 TB | 14.6 TB |
| **30 sn** | 6.8 GB | 2.4 TB | 4.9 TB |
| **60 sn** | 3.4 GB | 1.2 TB | 2.4 TB |

### Kendi Ortamınız İçin Hesaplama

Kendi saha ölçümünüzden Bytes/Point katsayısını türetmek için:

1. İki farklı zamanda disk boyutunu ölçün:
```bash
du -sb /var/lib/influxdb
```

2. Aradaki farkı süreye bölüp günlük büyümeyi bulun
3. Bytes/Point hesaplayın:
```
Bytes/Point = Günlük Büyüme / (Tag Sayısı × 86400 / Periyot)
```

:::note
- Yukarıdaki değerler **numerik (Float/Integer) ağırlıklı** SCADA verileri içindir
- **String** field kullanımı disk tüketimini önemli ölçüde artırır
- Series cardinality yükselirse (çok sayıda farklı tag kombinasyonu) katsayı büyüyebilir
- **Retention policy** ve **downsample** ile uzun vadeli disk ihtiyacı %70-95 azaltılabilir
:::

### Retention Policy ile Tasarruf

Varsayılan saklama süreleri:

| Veri Tipi | Varsayılan Saklama |
|-----------|-------------------|
| Değişken değerleri | 365 gün |
| Alarm geçmişi | 365 gün |
| Olay logları | 14 gün |
| Giriş denemeleri | 365 gün |

Bu süreler [Yapılandırma](/docs/tr/deployment/configuration/) sayfasında açıklanan retention policy ayarları ile değiştirilebilir. Downsample (örn: 1 saniye → 1 dakika ortalama) ile arşiv verisi %95'e kadar küçültülebilir.

## Sonraki Adım

Sistem gereksinimlerini karşıladıktan sonra [Kurulum](/docs/tr/getting-started/installation/) adımlarına geçin.
