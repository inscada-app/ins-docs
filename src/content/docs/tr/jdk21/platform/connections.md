---
title: "Bağlantı Yönetimi"
description: "Protokol bağlantıları oluşturma, yapılandırma ve izleme"
sidebar:
  order: 2
---

Bağlantı (Connection), bir saha cihazına veya sisteme olan haberleşme kanalıdır. Her bağlantı bir protokol kullanır ve bir projeye bağlıdır.

![Bağlantı Listesi](../../../../../assets/docs/dev-connections.png)

## Bağlantı Alanları

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| **name** | String | Evet | Bağlantı adı (proje içinde benzersiz) |
| **protocol** | `Protocol` enum | Evet | Haberleşme protokolü |
| **ip** | String | Protokole göre | Hedef IP adresi |
| **port** | Integer | Protokole göre | Hedef port numarası |
| **dsc** | String (≤255) | Hayır | Açıklama |
| **projectId** | String | Evet | İlişkili projenin kimliği |

Protokole özgü ek alanlar (unit id, timeout, polling period vb.) ayrı protokol yapılandırma sayfalarında ele alınır.

## Desteklenen Protokoller

| Protokol Değeri | Kullanım Alanı | Tipik Cihaz |
|----------|---------------|-------------|
| `Modbus TCP` / `Modbus TCP Slave` | Endüstriyel otomasyon | PLC, enerji analizörü, sürücü |
| `Modbus UDP` / `Modbus UDP Slave` | Hızlı okuma gerektiren uygulamalar | Enerji sayacı |
| `Modbus RTU Over TCP` / `Modbus RTU Over TCP Slave` | Seri ↔ TCP gateway | RTU, seri cihaz |
| `DNP3` / `DNP3 Slave` | Enerji dağıtım | RTU, koruma rölesi |
| `IEC 60870-5-104` / `IEC 60870-5-104 Server` | Enerji iletim / dağıtım | RTU, SCADA gateway |
| `IEC 61850` / `IEC 61850 Server` | Trafo merkezi | IED, koruma rölesi |
| `OPC UA` / `OPC UA Server` | Açık standart | PLC, DCS, SCADA |
| `OPC DA` | Windows COM/DCOM | Eski nesil OPC sunucular |
| `OPC XML` | HTTP/SOAP tabanlı | Web servis OPC |
| `S7` | Siemens PLC | S7-300, S7-400, S7-1200, S7-1500 |
| `MQTT` | IoT / mesaj tabanlı | Gateway, sensör, broker |
| `EthernetIp` | Rockwell / Allen-Bradley | Logix 5000+ serisi |
| `Fatek TCP` / `Fatek UDP` | Fatek PLC | FBs, FBe serisi |
| `LOCAL` | Simülasyon / dahili hesaplama | Dahili değişken |

`Slave` ve `Server` varyantları, inSCADA'nın ilgili protokolde kendi sunucu tarafını açmasını sağlar (karşı uçtan veri talebi almak için).

Detaylı protokol ayarları: [Protokoller →](/docs/tr/jdk21/protocols/)

:::note[Sidecar Protokoller]
**BACnet** ve **KNX**, inSCADA platformuna gömülü değildir — ayrı Node.js gateway servisleri olarak çalışır ve REST/WebSocket üzerinden inSCADA ile entegre olur. Bağlantı listesinde protokol olarak görünmezler.
:::

## Bağlantı Durumları

`ConnectionStatus` enum:

| Durum | Açıklama |
|-------|----------|
| **Connected** | Bağlantı aktif, veri okunuyor |
| **Disconnected** | Bağlantı kapalı — ya durdurulmuş ya da karşı uca ulaşılamıyor |

:::note
inSCADA bağlantı durumunu iki değerli tutar. Timeout, auth veya benzeri bir hata da bağlantıyı `Disconnected` durumuna düşürür; hatanın ayrıntısı ilgili servisin log'undan (platform log'u / event log) takip edilir. Ayrı bir `Error` durumu yoktur.
:::

## Bağlantı Yapısı (Örnek)

```json
{
  "id": "abc123",
  "name": "LOCAL-Energy",
  "protocol": "LOCAL",
  "ip": "127.0.0.1",
  "port": 0,
  "projectId": "proj-153",
  "dsc": "Local protocol connection for energy simulation"
}
```

## Bağlantı Başlatma / Durdurma

Bağlantılar UI'dan veya script ile yönetilebilir. `ins.*` sunucu API'si:

```javascript
// Durumu sorgula
var status = ins.getConnectionStatus("LOCAL-Energy");
// → "Connected" veya "Disconnected"

// Bir sonraki döngüde yeniden başlar
ins.stopConnection("MODBUS-PLC");
ins.startConnection("MODBUS-PLC");

// Başka bir proje altındaki bağlantıyı yönet
ins.stopConnection("GES-02", "MODBUS-PLC");
ins.startConnection("GES-02", "MODBUS-PLC");
```

:::note
GraalJS sandbox'ında `java.lang.Thread.sleep()` veya benzeri thread işlemleri mümkün değildir. `stopConnection` ve `startConnection` senkron çalışır — aralarına sleep koymaya gerek yoktur.
:::

## Bağlantı Parametrelerini Güncelleme

`ins.updateConnection` çağrısı bir `ConnectionResponseDto` bekler. Tipik kullanım — mevcut bağlantıyı okuyup gerekli alanları değiştirdikten sonra geri yazmaktır:

```javascript
var conn = ins.getConnection("MODBUS-PLC");
conn.setIp("192.168.1.100");
conn.setPort(502);

ins.updateConnection("MODBUS-PLC", conn);
```

Aynı yaklaşım `updateDevice` ve `updateFrame` için de geçerlidir:

```javascript
var device = ins.getDevice("MODBUS-PLC", "slave-1");
device.setUnitId(3);
ins.updateDevice("MODBUS-PLC", "slave-1", device);

var frame = ins.getFrame("MODBUS-PLC", "slave-1", "main-block");
frame.setPeriod(2000);
ins.updateFrame("MODBUS-PLC", "slave-1", "main-block", frame);
```

:::tip
Bağlantı parametresi güncellemesi ağ uçlarını etkiliyorsa, `stopConnection` → güncelleme → `startConnection` sırası önerilir. Polling periyodu gibi dahili ayarlarda yeniden başlatma gerekmez.
:::

Detaylı API: [Connection API →](/docs/tr/jdk21/platform/scripts/server/connection-api/) | [REST API Reference →](/docs/tr/jdk21/api/reference/) (Connection Management, Protocol Connection, Protocol Variable, Protocol Template controller grupları)
