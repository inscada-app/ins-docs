---
title: "Chart, Peity & Datatable"
description: "Grafik, sparkline mini grafik ve tablo bileşenleri"
sidebar:
  order: 16
---

## Chart (Grafik)

**Chart**, SVG ekran içine **Chart.js** tabanlı interaktif grafik bileşeni yerleştirir. Tarihsel veri veya anlık değer serilerini görselleştirir.

![Active & Reactive Power Chart](../../../../../assets/docs/editor-preview.png)

| Alan | Değer |
|------|-------|
| **Type** | Chart |
| **Uygun SVG Öğeleri** | `<rect>` (foreignObject + Canvas olarak render edilir) |

### Yapılandırma

| Alan | Açıklama |
|------|----------|
| **Extra Width** | Grafik genişliğine ek piksel |
| **Extra Height** | Grafik yüksekliğine ek piksel |
| **Chart 4** | Chart.js 4 sürümü kullanılsın mı |

### Grafik Tipleri

| Tip | Açıklama |
|-----|----------|
| **line** | Çizgi grafik — zaman serisi, trend takibi |
| **bar** | Çubuk grafik — karşılaştırma, periyodik özet |
| **pie** | Pasta grafik — dağılım gösterimi |
| **doughnut** | Halka grafik — oransal gösterim |

### Return Formatı

Expression'dan döndürülen nesne Chart.js'e aktarılır:

```javascript
return {
    type: 'line',           // grafik tipi
    labels: [...],          // X ekseni etiketleri
    dataset: {
        0: {
            name: 'Seri Adı',
            data: { 0: değer1, 1: değer2, ... },  // veya dizi
            color: '#00d4ff',
            fill: true,        // alan doldurma (area chart)
            configs: {},       // ek Chart.js dataset ayarları
            yAxisConfigs: {}   // Y ekseni ayarları
        },
        1: { ... }           // ikinci seri
    },
    xAxes: {
        0: {
            labels: { 0: 'etiket1', ... },
            xAxisConfigs: {}   // X ekseni ayarları
        }
    },
    options: {
        options: {},           // Chart.js genel ayarları
        backgroundColor: '#ffffff'
    }
};
```

#### Dataset Alanları

| Alan | Tip | Açıklama |
|------|-----|----------|
| **name** | String | Seri adı (legend'da görünür) |
| **data** | Object/Array | Veri noktaları |
| **color** | String | Seri rengi (hex) |
| **fill** | Boolean | Alan doldurma (area chart için `true`) |
| **configs** | Object | Ek Chart.js dataset yapılandırması |
| **yAxisConfigs** | Object | Bu serinin Y ekseni ayarları |

Birden fazla seri eklendiğinde Y eksenleri otomatik olarak sola ve sağa dönüşümlü yerleştirilir.

### Örnek: Tarihsel Veri — Area Chart

```javascript
var endMs = ins.now().getTime();
var startMs = endMs - (60 * 60 * 1000); // Son 1 saat

var logs = ins.getLoggedVariableValuesByPage(
    ['ActivePower_kW'],
    ins.getDate(startMs), ins.getDate(endMs), 0, 30
);
var logs2 = ins.getLoggedVariableValuesByPage(
    ['ReactivePower_kVAR'],
    ins.getDate(startMs), ins.getDate(endMs), 0, 30
);

var labels = [];
var active = [];
var reactive = [];

for (var i = logs.length - 1; i >= 0; i--) {
    labels.push(logs[i].dttm);
    active.push(logs[i].value);
}
for (var j = logs2.length - 1; j >= 0; j--) {
    reactive.push(logs2[j].value);
}

return {
    type: 'area',
    labels: labels,
    dataset: {
        0: {
            name: 'Active Power (kW)',
            data: active,
            color: '#00d4ff',
            fill: true
        },
        1: {
            name: 'Reactive Power (kVAR)',
            data: reactive,
            color: '#818cf8',
            fill: true
        }
    },
    xAxes: { 0: { labels: labels } },
    options: {}
};
```

### Örnek: Anlık Dağılım — Pie Chart

```javascript
var power = ins.getVariableValue("ActivePower_kW").value;
var reactive = ins.getVariableValue("ReactivePower_kVAR").value;

return {
    type: 'pie',
    dataset: {
        0: { name: 'Aktif', data: [power], color: '#3498db' },
        1: { name: 'Reaktif', data: [reactive], color: '#e74c3c' }
    }
};
```

### Örnek: Script Kütüphanesi ile Chart

Chart verisi genellikle bir script kütüphanesinde hazırlanır ve expression'dan çağrılır:

```javascript
// Expression içinde — script kütüphanesindeki fonksiyonu çağır
return ins.executeScript('Chart_ActiveReactivePower');
```

Detay: [Animation Yapılandırma → Script Seçimi](/docs/tr/platform/animations/configuration/)

---

## Peity (Sparkline Mini Grafik)

**Peity**, küçük inline sparkline grafik oluşturur. Metin yanında kompakt trend gösterimi — fazla yer kaplamadan değerin yönünü görselleştirir. **Peity** kütüphanesi ile render edilir.

| Alan | Değer |
|------|-------|
| **Type** | Peity |
| **Uygun SVG Öğeleri** | `<rect>` (foreignObject + span olarak render edilir) |

### Peity Tipleri

| Tip | Açıklama |
|-----|---------|
| **line** | Çizgi sparkline |
| **bar** | Mini çubuk grafik |
| **pie** | Mini pasta grafik |
| **donut** | Mini halka grafik |

### Return Formatı

```javascript
return {
    type: 'line',            // grafik tipi: line, bar, pie, donut
    data: '5,3,9,6,5,9,7',  // virgülle ayrılmış veri (string)
    fill: '#3498db',         // dolgu rengi
    height: 25,              // yükseklik (px)
    width: 80,               // genişlik (px)
    radius: 10,              // yarıçap (pie/donut için)
    rectVisibility: true,    // arka plan rect göster/gizle
    rectFill: '#ffffff',     // arka plan rengi
    appendBefore: false      // öğeden önce mi sonra mı ekle
};
```

| Alan | Tip | Açıklama |
|------|-----|----------|
| **type** | String | `line`, `bar`, `pie`, `donut` |
| **data** | String | Virgülle ayrılmış sayısal değerler |
| **fill** | String/Object | Dolgu rengi veya renk dizisi |
| **height** | Number | Grafik yüksekliği (px) |
| **width** | Number | Grafik genişliği (px) |
| **radius** | Number | Yarıçap (pie/donut) — belirtilmezse otomatik hesaplanır |
| **rectVisibility** | Boolean | Arka plan dikdörtgen görünürlüğü |
| **rectFill** | String | Arka plan rengi |

### Örnek: Son Değerlerden Sparkline

```javascript
var end = ins.now();
var start = ins.getDate(end.getTime() - 600000); // 10 dakika
var logs = ins.getLoggedVariableValuesByPage(
    ['ActivePower_kW'], start, end, 0, 10
);

var values = [];
for (var i = logs.length - 1; i >= 0; i--) {
    values.push(Math.round(logs[i].value));
}

return {
    type: 'line',
    data: values.join(','),
    fill: '#00d4ff',
    height: 25,
    width: 80
};
```

### Kullanım Senaryosu

Değer göstergesinin yanında mini trend:

```xml
<g transform="translate(200, 30)">
  <text id="power_value" font-size="20">350 kW</text>
  <rect id="power_sparkline" x="100" y="-10" width="80" height="25"/>
</g>
```

- `power_value` → **Get**, Variable: `ActivePower_kW`
- `power_sparkline` → **Peity**, son 10 değer ile line sparkline

---

## Datatable (Tablo)

**Datatable**, SVG ekran içine **Tabulator** tabanlı interaktif tablo yerleştirir. Sıralama, filtreleme, sayfalama gibi tablo özellikleri desteklenir.

| Alan | Değer |
|------|-------|
| **Type** | Datatable |
| **Uygun SVG Öğeleri** | `<rect>` (foreignObject + div olarak render edilir) |
| **Expression Type** | Yalnızca EXPRESSION |

### Yapılandırma

| Alan | Açıklama |
|------|----------|
| **Extra Width** | Tablo genişliğine ek piksel |
| **Extra Height** | Tablo yüksekliğine ek piksel |
| **Width %** | Genişlik yüzde olarak |
| **Height %** | Yükseklik yüzde olarak |

### Return Formatı

Datatable iki parçalı nesne döndürür — tablo yapısı ve veri:

```javascript
return {
    table: JSON.stringify({
        tableName: 'variables_table',
        columns: [
            { title: 'Değişken', field: 'name', width: 150 },
            { title: 'Değer', field: 'value', width: 100 },
            { title: 'Birim', field: 'unit', width: 80 },
            { title: 'Zaman', field: 'time', width: 120 }
        ],
        theme: 'dark',
        backgroundTransparent: true
    }),
    data: {
        0: { name: 'ActivePower_kW', value: '359.91', unit: 'kW', time: '14:32:05' },
        1: { name: 'Voltage_V', value: '235.3', unit: 'V', time: '14:32:05' },
        2: { name: 'Current_A', value: '36.2', unit: 'A', time: '14:32:05' }
    },
    runTimeFunc: 'updateOrAddData',
    redrawTime: 100
};
```

#### Table Yapılandırma Alanları

| Alan | Açıklama |
|------|----------|
| **tableName** | Tablo tanımlayıcı adı |
| **columns** | Tabulator kolon tanımları (title, field, width vb.) |
| **theme** | Tema: `dark` veya varsayılan |
| **backgroundTransparent** | Saydam arka plan |

#### Veri Güncelleme Fonksiyonları

`runTimeFunc` alanı ile her tarama döngüsünde verinin nasıl güncelleneceği belirlenir:

| Fonksiyon | Açıklama |
|-----------|----------|
| **updateOrAddData** | Mevcut satırları güncelle, yeni satır ekle (varsayılan) |
| **replaceData** | Tüm veriyi değiştir |
| **addData** | Yeni satır ekle |
| **updateData** | Mevcut satırları güncelle |
| **deleteRow** | Tek satır sil |
| **clearData** | Tüm veriyi temizle |

### Örnek: Değişken İzleme Tablosu

```javascript
if (__firstScan) {
    // İlk açılışta tablo yapısını tanımla
    return {
        table: JSON.stringify({
            tableName: 'var_monitor',
            columns: [
                { title: 'Değişken', field: 'name', width: 180 },
                { title: 'Değer', field: 'value', hozAlign: 'right', width: 120 },
                { title: 'Açıklama', field: 'dsc', width: 200 },
                { title: 'Güncelleme', field: 'time', width: 100 }
            ],
            backgroundTransparent: true
        }),
        data: {},
        runTimeFunc: 'replaceData'
    };
}

// Sonraki döngülerde veriyi güncelle
var names = ["ActivePower_kW", "Voltage_V", "Current_A", "Frequency_Hz"];
var rows = {};
for (var i = 0; i < names.length; i++) {
    var val = ins.getVariableValue(names[i]);
    rows[i] = {
        name: names[i],
        value: val.value.toFixed(2),
        dsc: val.variableShortInfo.dsc,
        time: new Date(val.dateInMs).toLocaleTimeString()
    };
}
return { data: rows, runTimeFunc: 'replaceData' };
```

:::tip
İlk döngüde `__firstScan` ile tablo yapısını (columns) tanımlayın, sonraki döngülerde yalnızca veriyi güncelleyin. Bu sayede tablo yapısı her döngüde yeniden oluşturulmaz.
:::
