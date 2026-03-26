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

| Port | Servis | Yön |
|------|--------|-----|
| 8082 | inSCADA Web Arayüzü (HTTPS) | Gelen |
| 8083 | Script Sandbox (HTTPS) | Dahili |
| 5432 | İlişkisel Veritabanı | Dahili |
| 8086 | Zaman Serisi Veritabanı | Dahili |
| 6379 | Bellek İçi Önbellek | Dahili |
| 7800 | Cluster Haberleşme | Dahili (node arası) |
| 61616 | Mesaj Kuyruğu (Cluster) | Dahili (node arası) |
| 502 | Modbus TCP | Giden |
| 2404 | IEC 60870-5-104 | Giden/Gelen |
| 102 | IEC 61850 MMS | Giden |
| 4840 | OPC UA | Giden/Gelen |
| 20000 | DNP3 | Giden/Gelen |

:::note
Firewall kuralları yapılandırılırken yalnızca gerekli portların açılması önerilir. Dahili olarak işaretlenen portlar yalnızca sunucu içi veya cluster node'ları arasında erişilebilir olmalıdır.
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

Tarihsel veri depolama için gereken disk alanı şu faktörlere bağlıdır:

- **Tag sayısı**: Loglanan değişken adedi
- **Loglama sıklığı**: Her kaç saniyede/dakikada bir kayıt
- **Saklama süresi**: Kaç yıl tarihsel veri tutulacak

:::tip
Detaylı disk hesaplaması için inSCADA teknik ekibi ile iletişime geçin. Genel kural olarak: **1.000 tag × 10 saniye loglama × 1 yıl ≈ 50 GB** TSDB alanı.
:::

## Sonraki Adım

Sistem gereksinimlerini karşıladıktan sonra [Kurulum](/docs/tr/getting-started/installation/) adımlarına geçin.
