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
When **Use IOA Addresses = false**, simple `Read Address` / `Write Address` fields are used. When **true**, 3-byte IOA addresses are entered separately (when IOA Field Length = 3 bytes).
:::

### Read and Write Address Usage Pattern

In inSCADA, an IEC 104 variable can have both a **Read Address** and a **Write Address**. Correct usage of these two addresses is critical for efficient configuration.

**Basic rule:** If you only enter a Write Address for a variable, you **cannot see** the written value on inSCADA screens — because no read address is defined. This is a common configuration mistake, especially with control commands.

**Recommended approach:**

When configuring IEC 104 on the RTU or PLC side, create a read address for every writable address so the same value can be read back. This allows a single variable in inSCADA to handle both reading and writing:

- **Read Address:** Current value or status read from the device (e.g., breaker position)
- **Write Address:** Command or setpoint sent to the device (e.g., breaker open command)

**Example — Breaker Control:**

| Scenario | Read Address | Write Address | Description |
|---------|:-----------:|:------------:|-------------|
| Breaker Status + Control | IOA 100 (position) | IOA 200 (command) | Single variable: reads position, writes command |
| Setpoint + Feedback | IOA 300 (actual value) | IOA 400 (target value) | Single variable: reads measurement, writes setpoint |

With this approach:
- **No need to create separate variables** for reading and writing
- You can see the variable's current value on screens and send control commands from the same variable
- Project configuration becomes simpler and more manageable

:::caution[Important Recommendation]
We strongly recommend adopting this read/write addressing approach as a standard practice in your IEC 104 applications. Creating an addressing plan on the RTU/PLC side that follows this pattern simplifies inSCADA configuration and improves the operator experience during operation.
:::

## Step 5: Start the Connection

**Runtime Control Panel**'den bağlantıyı başlatın. inSCADA otomatik olarak:
1. TCP bağlantısı kurar
2. STARTDT (Start Data Transfer) gönderir
3. Background scan başlatır (yapılandırılmışsa)
4. Spontaneous event'leri dinlemeye başlar

Bağlantı durumu "Connected" olarak görünecektir.
