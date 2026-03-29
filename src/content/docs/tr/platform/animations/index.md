---
title: "SVG Animations"
description: "SVG tabanlı interaktif SCADA ekranları — genel bakış, tasarım ve yapı"
sidebar:
  order: 0
  label: "Genel Bakış"
---

SVG Animation, inSCADA'nın temel görselleştirme bileşenidir. Her animation bir SVG dosyasından oluşur ve değişken değerlerine bağlanarak gerçek zamanlı SCADA ekranları oluşturur.

![Energy Monitoring Dashboard](../../../../../assets/docs/variable-tracking.png)

## Ekran Geliştirme Süreci

Bir SCADA ekranı oluşturmak üç adımdan oluşur:

### 1. SVG Tasarımı (Harici Editör)

SVG ekranı, herhangi bir SVG editörü ile tasarlanır. **Inkscape** (ücretsiz, açık kaynak) önerilen editördür.

![Inkscape ile SVG Tasarımı](../../../../../assets/docs/inkscape-editor.png)

Tasarım sırasında:
- Ekranın görsel düzenini serbest bir şekilde oluşturun — cihaz sembolleri, metin alanları, butonlar, göstergeler, grafikler
- **SVG ID'leri ile ilgilenmenize gerek yok** — inSCADA tüm SVG ağacını otomatik tarar ve her objeyi seçilebilir hale getirir
- Standart SVG öğeleri kullanın: `<rect>`, `<circle>`, `<text>`, `<path>`, `<g>`, `<image>`
- İstediğiniz kadar karmaşık tasarım yapabilirsiniz — katmanlar, gruplar, gradyanlar, filtreler

### Document Properties (Sayfa Ayarları)

Inkscape'te **File → Document Properties** (Dosya → Belge Özellikleri) bölümünde sayfa boyutunu ayarlayın:

| Ayar | Önerilen Değer | Açıklama |
|------|---------------|----------|
| **Genişlik** | 1920 px | Full HD ekran genişliği |
| **Yükseklik** | 1080 px | Full HD ekran yüksekliği |
| **Birim** | px | Piksel birimi |
| **Ölçek** | 1.0 | 1:1 ölçek |
| **Yönlendirme** | Yatay (Landscape) | SCADA ekranları genellikle yatay |

:::caution[Arka Plan Rengi]
Inkscape'te ayarlanan arka plan rengi inSCADA'ya **aktarılmaz**. Arka plan rengi, inSCADA'da animation'ın yapılandırma panelindeki **Color** alanından ayarlanır. Tasarım sırasında Inkscape arka planını yalnızca görsel referans olarak kullanın.
:::

### 2. SVG Yükleme (Animation Dev)

Tasarlanan SVG dosyasını platforma yükleyin:

**Menü:** Development → Animations → Animation Dev

![Animation Dev](../../../../../assets/docs/dev-animation-dev.png)

Yeni animation oluşturun veya mevcut bir animation'ın SVG içeriğini güncelleyin. SVG dosyası upload edildikten sonra ekranda görselleşir.

### 3. Animation Binding (Element Editor)

SVG yüklendikten sonra, ekran üzerinde **mouse ile objelere tıklayarak** her objeye animation davranışı bağlarsınız:

1. SVG üzerinde bir objeye **mouse ile tıklayın** — obje seçilir ve vurgulanır
2. Sağ üstteki **Element Editor** (sihirli değnek ikonu) butonuna tıklayın
3. Seçilen objenin tipine göre uygulanabilir animation tipleri otomatik listelenir
4. İstediğiniz animation tipini seçip yapılandırın
5. **Save** ile kaydedin

![Animation Element Editor](../../../../../assets/docs/animations.png)

Bu üç adım sonucunda, Visualization ekranında çalıştırdığınızda SVG ekranı canlı SCADA verisiyle güncellenir.

Detaylı bilgi: [Element Editor →](/docs/tr/platform/animations/element-editor/)

### Preview (Ön İzleme)

Roket ikonuna tıklayarak animation'ı canlı olarak önizleyebilirsiniz:

![Preview Animation](../../../../../assets/docs/editor-preview.png)

### Animation Yapılandırma Paneli

Kalem ikonuna tıklayarak animation'ın genel ayarlarını düzenleyebilirsiniz:

![Animation Yapılandırma](../../../../../assets/docs/editor-anim-config.png)

| Alan | Zorunlu | Açıklama |
|------|---------|----------|
| **Name** | Evet | Ekran adı (proje içinde benzersiz) |
| **Duration** | Evet | Güncelleme periyodu (ms, min: 100). Ne sıklıkla değişken değerleri okunup ekran güncellenecek |
| **Play Order** | Evet | Visualization ekranındaki sıralama numarası |
| **Main** | Evet | Visualization menüsünde görünsün mü |
| **Color** | Hayır | Ekranın arka plan rengi (Inkscape'teki arka plan aktarılmaz, buradan ayarlanır) |
| **Alignment** | Hayır | SVG'nin ekrana hizalama modu |
| **Description** | Hayır | Açıklama |

### Main ve Play Order

**Runtime → Visualization** menüsü, projedeki **Main** işaretli animation'ları otomatik olarak listeler. Bu ekranda alt kısımda sayfa geçiş butonları yer alır ve animation'lar **Play Order** numarasına göre soldan sağa sıralanır.

```
Visualization Ekranı
┌──────────────────────────────────────────────────┐
│                                                  │
│          [ Aktif Animation İçeriği ]             │
│                                                  │
├──────────────────────────────────────────────────┤
│  ⚡ Energy Overview  │  📈 Power Chart  │  ...   │  ← Play Order sırası
└──────────────────────────────────────────────────┘
```

- **Main = true** → Animation, Visualization menüsünde görünür
- **Main = false** → Animation yalnızca Development ekranında düzenleme için erişilebilir, Visualization'da listelenmez (örn: Open ile açılan alt ekranlar, popup'lar)
- **Play Order = 1** → En solda, **Play Order = 2** → Bir sonraki, ...

Örneğin yukarıdaki screenshot'ta "Energy Overview" (Play Order: 1) ve "Power Chart" (Play Order: 2) butonları alt kısımda görünmektedir.

## Animation Yapısı

Her animation üç bileşenden oluşur:

```
Animation
├── SVG Content (upload edilen SVG dosyası)
├── Animation Elements (mouse ile seçilen objelere bağlanan davranışlar)
│   ├── Element 1: sıcaklık metni → Temperature_C (Get)
│   ├── Element 2: motor göstergesi → MotorStatus (Color)
│   └── Element 3: vana grubu → ValvePosition (Rotate)
└── Animation Scripts (her döngüde çalışan kodlar)
    ├── Pre-Animation Code
    └── Post-Animation Code
```

## Animation Elements

Animation Element, SVG üzerinde mouse ile seçilen bir objeye bağlanan davranış tanımıdır. Objeye tıklayıp Element Editor'ü açtığınızda aşağıdaki alanlar otomatik doldurulur veya yapılandırılır:

| Alan | Açıklama |
|------|----------|
| **DOM ID** | Seçilen SVG objesinin ID'si (otomatik alınır — elle girmenize gerek yok) |
| **Type** | Animation tipi — obje tipine göre uygun tipler otomatik listelenir |
| **Expression Type** | Değerin nasıl hesaplanacağı (Tag, Expression, Switch vb.) |
| **Expression** | Değer ifadesi (değişken adı, formül veya yapılandırma) |
| **Props** | Tipe özel ek ayarlar (her tip kendi görsel formunu sunar) |
| **Status** | Aktif/pasif |

### Animation Tipleri

inSCADA **36 farklı animation tipi** destekler:

#### Veri Gösterimi

| Tip | Açıklama | Sayfa |
|-----|----------|-------|
| **Get** | Değişken değerini metin olarak göster | [Detay →](/docs/tr/platform/animations/get/) |
| **Color** | Öğenin rengini değere göre değiştir | [Detay →](/docs/tr/platform/animations/color/) |
| **Bar** | Değere göre çubuk yüksekliği/genişliği | [Detay →](/docs/tr/platform/animations/bar-scale/) |
| **Opacity** | Değere göre saydamlık | [Detay →](/docs/tr/platform/animations/opacity-visibility-blink/) |
| **Visibility** | Koşula göre göster/gizle | [Detay →](/docs/tr/platform/animations/opacity-visibility-blink/) |
| **Rotate** | Değere göre döndürme | [Detay →](/docs/tr/platform/animations/rotate-move/) |
| **Move** | Değere göre X/Y kaydırma | [Detay →](/docs/tr/platform/animations/rotate-move/) |
| **Scale** | Değere göre ölçekleme | [Detay →](/docs/tr/platform/animations/bar-scale/) |
| **Blink** | Koşula göre yanıp sönme | [Detay →](/docs/tr/platform/animations/opacity-visibility-blink/) |
| **Pipe** | Boru/hat akış animasyonu | [Detay →](/docs/tr/platform/animations/pipe-tooltip-image/) |
| **Tooltip** | Hover bilgi balonu | [Detay →](/docs/tr/platform/animations/pipe-tooltip-image/) |
| **Image** | Değere göre resim değiştirme | [Detay →](/docs/tr/platform/animations/pipe-tooltip-image/) |
| **AlarmIndication** | Alarm durumunu göster | [Detay →](/docs/tr/platform/animations/pipe-tooltip-image/) |

#### Grafik & Veri Tablosu

| Tip | Açıklama | Sayfa |
|-----|----------|-------|
| **Chart** | Grafik bileşeni | [Detay →](/docs/tr/platform/animations/chart-peity/) |
| **Peity** | Inline sparkline mini grafik | [Detay →](/docs/tr/platform/animations/chart-peity/) |
| **Datatable** | Tablo bileşeni | [Detay →](/docs/tr/platform/animations/chart-peity/) |

#### Kontrol & Etkileşim

| Tip | Açıklama | Sayfa |
|-----|----------|-------|
| **Set** | Değişkene değer yaz (click ile) | [Detay →](/docs/tr/platform/animations/set-button-click/) |
| **Slider** | Kaydırıcı ile değer ayarla | [Detay →](/docs/tr/platform/animations/slider-input/) |
| **Input** | Metin/sayı girişi | [Detay →](/docs/tr/platform/animations/slider-input/) |
| **Button** | Buton bileşeni | [Detay →](/docs/tr/platform/animations/set-button-click/) |
| **Click** | Tıklama olayı | [Detay →](/docs/tr/platform/animations/set-button-click/) |
| **MouseDown / MouseUp / MouseOver** | Fare olayları | [Detay →](/docs/tr/platform/animations/set-button-click/) |

#### Navigasyon & Gömme

| Tip | Açıklama | Sayfa |
|-----|----------|-------|
| **Open** | Başka bir animation'a geç | [Detay →](/docs/tr/platform/animations/open-iframe-faceplate/) |
| **Iframe** | Harici URL gömme | [Detay →](/docs/tr/platform/animations/open-iframe-faceplate/) |
| **Menu** | Menü açma | [Detay →](/docs/tr/platform/animations/open-iframe-faceplate/) |
| **Faceplate** | Faceplate bileşeni yerleştir | [Detay →](/docs/tr/platform/animations/open-iframe-faceplate/) |

#### Script & Gelişmiş

| Tip | Açıklama | Sayfa |
|-----|----------|-------|
| **Script** | Özel JavaScript çalıştır | [Detay →](/docs/tr/platform/animations/script-animate/) |
| **FormScript** | Form tabanlı script | [Detay →](/docs/tr/platform/animations/script-animate/) |
| **GetSymbol** | Symbol kütüphanesinden sembol yükle | [Detay →](/docs/tr/platform/animations/script-animate/) |
| **Animate** | CSS/SVG animasyon tetikle | [Detay →](/docs/tr/platform/animations/script-animate/) |
| **Access** | Yetki bazlı görünürlük | [Detay →](/docs/tr/platform/animations/script-animate/) |
| **Three** | 3D görselleştirme | [Detay →](/docs/tr/platform/animations/script-animate/) |
| **QRCodeGeneration** | QR kod oluşturma | [Detay →](/docs/tr/platform/animations/script-animate/) |
| **QRCodeScan** | QR kod okuma | [Detay →](/docs/tr/platform/animations/script-animate/) |

### Expression Tipleri

Her animation element'te değerin nasıl hesaplanacağını belirler:

| Tip | Açıklama |
|-----|----------|
| **Tag** | Doğrudan değişken adı referansı |
| **Expression** | JavaScript formülü |
| **Numeric** | Sabit sayısal değer |
| **Text** | Sabit metin değeri |
| **Switch** | Değere göre koşullu seçim |
| **Collection** | Birden fazla değişken koleksiyonu |
| **Set** | Değer yazma ifadesi |
| **Animation** | Başka bir animation referansı |
| **Url** | URL referansı |
| **Alarm** | Alarm durumu referansı |
| **Faceplate** | Faceplate referansı |
| **Animation Popup** | Popup animation açma |
| **Button** | Buton yapılandırması |
| **InSCADA View** | Platform görünüm referansı |
| **System Page** | Sistem sayfası referansı |
| **Html** | HTML içerik |
| **Custom Menu** | Custom menu referansı |
| **Tetra Color** | Dört renkli durum gösterimi (alarm renkleri) |

## Animation Scripts

Her animation'a Pre ve Post script bağlanabilir. Runtime'da her döngüde (her `duration` ms'de) çalışma sırası şöyledir:

```
Her döngüde tekrar eder:
┌─────────────────────────┐
│ 1. Pre-Animation Code   │
│ 2. Animation Elements   │
│ 3. Post-Animation Code  │
└────────┬────────────────┘
         │ duration ms sonra
         └──── tekrar başa dön
```

| Script | Çalışma Zamanı | Kullanım |
|--------|---------------|----------|
| **Pre-Animation Code** | Her döngüde, element'lerden önce | Ön hesaplama, veri hazırlama |
| **Post-Animation Code** | Her döngüde, element'lerden sonra | Son işlemler, temizlik |

Tüm bu kodlar **her döngüde tekrar çalışır**. Yalnızca ilk açılışta bir kez çalışması gereken kod varsa `__firstScan` değişkeni kullanılır.

### Yerleşik Sistem Değişkenleri

Animation script'leri ve element expression'ları içinde kullanılabilen yerleşik değişkenler:

| Değişken | Tip | Açıklama |
|----------|-----|----------|
| `__firstScan` | Boolean | İlk çalışma döngüsünde `true`, sonraki döngülerde `false` |
| `__animName` | String | Çalışan animation'ın adı |
| `__parameters` | String | Animation'a geçirilen placeholder parametreleri |

### `__firstScan` Kullanımı

`__firstScan`, animation ekranı açıldığında sadece **ilk döngüde** `true` olur. Yalnızca bir kez çalışması gereken kodları (tarihsel veri çekme, tablo başlangıç doldurma, tek seferlik API çağrısı vb.) bu değişkenle kontrol edebilirsiniz:

```javascript
if (__firstScan) {
    // Sadece ekran ilk açıldığında çalışır
    var end = ins.now();
    var start = ins.getDate(end.getTime() - 3600000);
    var logs = ins.getLoggedVariableValuesByPage(
        ['ActivePower_kW'],
        start, end, 0, 100
    );
    // Tabloya veya grafiğe ilk verileri yükle...
}

// Bu kısım her döngüde çalışır
var power = ins.getVariableValue("ActivePower_kW").value;
return power.toFixed(1);
```

### `__animName` ve `__parameters` Kullanımı

Parametrik ekranlarda (placeholder ile açılan animation'lar) hangi animation'ın çalıştığını ve geçirilen parametreleri okumak için kullanılır:

```javascript
// Hangi animation çalışıyor
var name = __animName; // "Motor_Detail"

// Geçirilen parametreler
var params = __parameters; // "motor_id=3&motor_name=Motor 3"
```

## Gerçek Zamanlı Güncelleme

Animation açıldığında WebSocket bağlantısı kurulur. Platform, `duration` parametresinde belirtilen aralıkta değişken değerlerini istemciye push eder ve binding'ler otomatik güncellenir.

## Placeholder (Parametrik Ekran)

Animation'lara placeholder tanımlanabilir. Aynı SVG tasarımı farklı parametrelerle (farklı cihaz, farklı değişken seti) tekrar kullanılabilir.
