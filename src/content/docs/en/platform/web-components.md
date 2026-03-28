---
title: "Web Components"
description: "Zero-dependency SCADA bileşenleri — tek HTML tag ile canlı veri gösterimi"
sidebar:
  order: 23
---

inSCADA Web Components, Custom Menu ve Faceplate içinde canlı SCADA verilerini tek bir HTML tag'i ile göstermeyi sağlayan sıfır bağımlılıklı bileşen kütüphanesidir.

## Neden Web Components?

Custom Menu içinde değişken değerlerini göstermek için geleneksel yöntem `fetch` API kullanmaktır:

```javascript
// Geleneksel yöntem: 15+ satır JavaScript
async function loadValue() {
  const resp = await fetch('/api/variables/values?projectId=153&names=ActivePower_kW', {
    credentials: 'include'
  });
  const data = await resp.json();
  document.getElementById('power').textContent = data.ActivePower_kW.value.toFixed(1);
}
setInterval(loadValue, 2000);
```

Web Components ile aynı işlem:

```html
<!-- 1 satır HTML -->
<ins-live-value project="153" variable="ActivePower_kW"
                unit="kW" decimals="1">
</ins-live-value>
```

**Avantajlar:**
- JavaScript yazmaya gerek yok
- Otomatik periyodik güncelleme (polling)
- Aynı projeden okuyan bileşenler tek API çağrısında birleştirilir (batching)
- Veri gelmediğinde otomatik solma (stale detection)
- Eşik bazlı renk değişimi (threshold coloring)
- Shadow DOM ile stil izolasyonu

## Kurulum

Web Components kütüphanesini Custom Menu HTML içeriğine ekleyin:

```html
<script src="/libs/ins-components.min.js"></script>
```

## `<ins-live-value>`

Bir değişkenin canlı değerini gösterir.

### Attributes

| Attribute | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| **project** | Number | Evet | Proje ID'si |
| **variable** | String | Evet | Değişken adı |
| **unit** | String | Hayır | Birim etiketi (°C, kW, bar, V, A...) |
| **label** | String | Hayır | Başlık etiketi |
| **decimals** | Number | Hayır | Ondalık basamak sayısı |
| **thresholds** | String | Hayır | Renk eşikleri (format: `"0:blue,30:green,60:orange,80:red"`) |
| **format** | String | Hayır | `"raw"` — formatsız gösterim |

### Temel Kullanım

```html
<!-- Sadece değer -->
<ins-live-value project="153" variable="ActivePower_kW"></ins-live-value>

<!-- Birim ve ondalık -->
<ins-live-value project="153" variable="Temperature_C"
                unit="°C" decimals="1">
</ins-live-value>

<!-- Başlık ile -->
<ins-live-value project="153" variable="Voltage_V"
                unit="V" label="Gerilim" decimals="1">
</ins-live-value>
```

### Eşik Bazlı Renk Değişimi

`thresholds` attribute'u ile değere göre otomatik renk değişimi:

```html
<ins-live-value project="153" variable="Temperature_C"
                unit="°C" label="Sıcaklık" decimals="1"
                thresholds="0:#2196F3,30:#4CAF50,60:#FF9800,80:#F44336">
</ins-live-value>
```

| Değer Aralığı | Renk | Anlam |
|---------------|------|-------|
| 0 - 29 | Mavi (#2196F3) | Soğuk |
| 30 - 59 | Yeşil (#4CAF50) | Normal |
| 60 - 79 | Turuncu (#FF9800) | Uyarı |
| 80+ | Kırmızı (#F44336) | Kritik |

### CSS Özelleştirme

```css
ins-live-value {
  --value-color: #333;      /* Değer metin rengi */
  --label-color: #888;      /* Başlık metin rengi */
  --unit-color: #888;       /* Birim metin rengi */
  --stale-opacity: 0.4;     /* Veri gelmiyor ise saydamlık */
}
```

## InsDataBus (Veri Yönetimi)

Arka planda çalışan singleton sınıf. Birden fazla `<ins-live-value>` bileşeni aynı projeden veri okuyorsa, tek bir API çağrısında birleştirir.

### Yapılandırma

```javascript
// Polling aralığını değiştir (varsayılan: 2000ms, minimum: 500ms)
InsDataBus.instance.refreshMs = 3000;

// Space değiştir (varsayılan: "default_space")
InsDataBus.instance.space = "production";
```

### Abonelik API'si

Bileşenler otomatik abone olur, ancak programatik kullanım da mümkündür:

```javascript
InsDataBus.instance.subscribe(153, 'ActivePower_kW', (value) => {
  console.log('Yeni değer:', value);
});
```

## Örnek: Enerji İzleme Sayfası

Custom Menu içinde tam bir enerji izleme sayfası:

```html
<script src="/libs/ins-components.min.js"></script>

<style>
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 20px; }
  .card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; }
  ins-live-value { font-size: 32px; }
</style>

<div class="grid">
  <div class="card">
    <ins-live-value project="153" variable="ActivePower_kW"
                    unit="kW" label="Aktif Güç" decimals="1"
                    thresholds="0:#2196F3,200:#4CAF50,500:#FF9800,800:#F44336">
    </ins-live-value>
  </div>

  <div class="card">
    <ins-live-value project="153" variable="Voltage_V"
                    unit="V" label="Gerilim" decimals="1"
                    thresholds="200:#F44336,215:#FF9800,225:#4CAF50,245:#FF9800,260:#F44336">
    </ins-live-value>
  </div>

  <div class="card">
    <ins-live-value project="153" variable="Current_A"
                    unit="A" label="Akım" decimals="2">
    </ins-live-value>
  </div>

  <div class="card">
    <ins-live-value project="153" variable="Frequency_Hz"
                    unit="Hz" label="Frekans" decimals="2"
                    thresholds="49:#F44336,49.5:#FF9800,49.8:#4CAF50,50.2:#FF9800,50.5:#F44336">
    </ins-live-value>
  </div>

  <div class="card">
    <ins-live-value project="153" variable="PowerFactor"
                    label="Güç Faktörü" decimals="3"
                    thresholds="0:#F44336,0.8:#FF9800,0.9:#4CAF50">
    </ins-live-value>
  </div>

  <div class="card">
    <ins-live-value project="153" variable="Temperature_C"
                    unit="°C" label="Panel Sıcaklık" decimals="1"
                    thresholds="0:#2196F3,30:#4CAF50,60:#FF9800,80:#F44336">
    </ins-live-value>
  </div>
</div>
```

## Stale Data Algılama

Bileşen 3 ardışık polling döngüsünde veri alamazsa (varsayılan: 6 saniye) otomatik olarak soluklâşır. Bu, haberleşme kesintilerini görsel olarak bildirir.

Normal durum → `opacity: 1.0`
Stale durum → `opacity: 0.4` (CSS `--stale-opacity` ile özelleştirilebilir)

## Faceplate Kapsülleme (Planlanan)

İlerleyen sürümlerde Faceplate'ler Web Component olarak kapsüllenecek:

```html
<!-- Planlanan kullanım -->
<ins-motor project="153"
           speed-var="Motor1_Speed"
           status-var="Motor1_Status"
           current-var="Motor1_Current">
</ins-motor>
```

Bu sayede bir Faceplate, Custom Menu HTML sayfalarında doğrudan embed edilebilecek.
