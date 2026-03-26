---
title: "IEC 104 Client (Master)"
description: "inSCADA'da IEC 60870-5-104 Client (Master) bağlantı yapılandırması"
sidebar:
  order: 1
  label: "IEC 104 Client"
---

Client (Master) modunda inSCADA, saha istasyonlarına (RTU, IED, koruma rölesi vb.) bağlanarak veri okur ve kontrol komutları gönderir.

## Adım 1: Connection Oluşturma

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Protocol** | IEC 60870-5-104 | Protokol seçimi |
| **IP Address** | 192.168.1.50 | Hedef slave istasyon IP adresi |
| **Port** | 2404 | Hedef port (varsayılan: 2404) |
| **COT Field Length** | 2 | Cause of Transmission alan uzunluğu (1-2 byte) |
| **Common Address Field Length** | 2 | CASDU alan uzunluğu (1-2 byte) |
| **IOA Field Length** | 3 | IOA alan uzunluğu (1-3 byte) |
| **Originator Address** | 0 | Master originator adresi |
| **t1** | 15 sn | Yanıt bekleme timeout'u |
| **t2** | 10 sn | S-format onay timeout'u |
| **t3** | 20 sn | Test frame timeout'u |
| **k** | 12 | Maks. onaylanmamış I-frame |
| **w** | 8 | Onay penceresi |
| **Is With Timestamps** | true | Zaman damgalı ASDU'ları kabul et |
| **Background Scan Period** | 60000 ms | Background scan periyodu |
| **Spontaneous Duplicates** | 0 | Spontaneous mesaj tekrar sayısı |
| **Use System Timezone** | false | Sistem zaman dilimini kullan |

:::tip
**t1, t2, t3, k, w** parametreleri her iki tarafta da (Master ve Slave) aynı değerlere ayarlanmalıdır. Uyumsuz değerler bağlantı kopmalarına neden olabilir.
:::

## Adım 2: Device Oluşturma

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Common Address** | 1 | CASDU — slave istasyon adresi |
| **Control Point Offset** | 0 | Kontrol komutu adres ofseti |
| **Scan Time** | 1000 ms | Tarama periyodu |
| **Scan Type** | PERIODIC | `PERIODIC` veya `FIXED_DELAY` |

## Adım 3: Frame Oluşturma

Her ASDU tipi için bir Frame tanımlayın:

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Type** | Measured Value, Short Float | ASDU tipi |

### Tipik Frame Örnekleri

| Frame Adı | Type | Kullanım |
|-----------|------|----------|
| Dijital Giriş | Single Point Information | Kesici/ayırıcı durumları |
| Çift Dijital | Double Point Information | Kesici pozisyonları (açık/kapalı/geçiş/belirsiz) |
| Analog Ölçüm | Measured Value, Short Float | Akım, gerilim, güç ölçümleri |
| Normalize Ölçüm | Measured Value, Normalized | ±32767 aralığında tam sayı ölçümler |
| Ölçekli Ölçüm | Measured Value, Scaled | Ölçeklenmiş tam sayı ölçümler |

## Adım 4: Variable Oluşturma

IEC 104 değişkenleri IOA (Information Object Address) ile tanımlanır:

| Parametre | Örnek | Açıklama |
|-----------|-------|----------|
| **Use IOA Addresses** | true | IOA adresleme modu |
| **Read Address** | 100 | Okuma adresi (basit mod) |
| **Write Address** | 100 | Yazma adresi (basit mod) |
| **Read IOA Address 1** | 0 | IOA okuma adresi byte 1 |
| **Read IOA Address 2** | 0 | IOA okuma adresi byte 2 |
| **Read IOA Address 3** | 100 | IOA okuma adresi byte 3 |
| **Write IOA Address 1** | 0 | IOA yazma adresi byte 1 |
| **Write IOA Address 2** | 0 | IOA yazma adresi byte 2 |
| **Write IOA Address 3** | 100 | IOA yazma adresi byte 3 |

:::note
**Use IOA Addresses = false** durumunda basit `Read Address` / `Write Address` kullanılır. **true** durumunda 3 byte'lık IOA adresleri ayrı ayrı girilir (IOA Field Length = 3 byte ise).
:::

### Read ve Write Adresi Kullanım Yaklaşımı

inSCADA'da bir IEC 104 variable'ına hem **Read Address** hem de **Write Address** girilebilir. Bu iki adresin doğru kullanımı, verimli bir yapılandırma için kritiktir.

**Temel kural:** Bir variable'a yalnızca Write Address girerseniz, yazılan değeri inSCADA ekranlarında **göremezsiniz** — çünkü okuma adresi tanımlı değildir. Bu durum özellikle kontrol komutlarında karşılaşılan yaygın bir yapılandırma hatasıdır.

**Önerilen yaklaşım:**

RTU veya PLC tarafında IEC 104 yapılandırması yaparken, yazılabilir her adres için aynı değerin okunabileceği bir read adresi de oluşturun. Bu sayede inSCADA'da tek bir variable tanımıyla hem okuma hem yazma yapılabilir:

- **Read Address:** Cihazdan okunan güncel değer veya durum (ör. kesici pozisyon bilgisi)
- **Write Address:** Cihaza gönderilen komut veya setpoint (ör. kesici açma komutu)

**Örnek — Kesici Kontrolü:**

| Senaryo | Read Address | Write Address | Açıklama |
|---------|:-----------:|:------------:|----------|
| Kesici Durumu + Kontrol | IOA 100 (pozisyon) | IOA 200 (komut) | Tek variable: pozisyon okur, komut yazar |
| Setpoint + Feedback | IOA 300 (gerçek değer) | IOA 400 (hedef değer) | Tek variable: ölçümü okur, setpoint yazar |

Bu yaklaşımla:
- Okuma ve yazma için **ayrı ayrı variable oluşturmanıza gerek kalmaz**
- Ekranlarda değişkenin güncel değerini görebilir, aynı değişken üzerinden kontrol komutu gönderebilirsiniz
- Proje yapılandırması daha sade ve yönetilebilir olur

:::caution[Önemli Tavsiye]
IEC 104 kullandığınız uygulamalarınızda bu read/write adresleme yaklaşımını bir standart olarak benimsemenizi önemle tavsiye ederiz. RTU/PLC yapılandırmasında bu pattern'e uygun adresleme planı oluşturulması, hem inSCADA tarafındaki yapılandırmayı basitleştirir hem de işletme sırasında operatör deneyimini iyileştirir.
:::

## Adım 5: Bağlantıyı Başlatma

**Runtime Control Panel**'den bağlantıyı başlatın. inSCADA otomatik olarak:
1. TCP bağlantısı kurar
2. STARTDT (Start Data Transfer) gönderir
3. Background scan başlatır (yapılandırılmışsa)
4. Spontaneous event'leri dinlemeye başlar

Bağlantı durumu "Connected" olarak görünecektir.
