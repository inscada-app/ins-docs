---
title: "Element Editor"
description: "Animation Element Editor — SVG üzerinde obje seçerek animation binding yapılandırma"
sidebar:
  order: 1
  label: "Element Editor"
---

Animation Element Editor, SVG ekran üzerinde görsel olarak obje seçip, seçilen objeye animation davranışı bağlamak için kullanılan düzenleyicidir. Kod yazmadan, görsel yapılandırma arayüzü ile hızlıca SCADA ekranları oluşturulur.

## Editöre Erişim

**Menü:** Development → Animations → Animation Dev → sağ üst köşedeki **Element Editor** butonu

Editör, SVG ekranının yanında panel olarak açılır.

---

## İş Akışı

### Adım 1: SVG Üzerinde Obje Seçme

Animation Dev ekranında açık olan SVG üzerinde **mouse ile tıklayarak** obje seçersiniz. Seçilen obje görsel olarak vurgulanır.

#### Grup İçi Objelere Erişim

SVG'deki objeler genellikle `<g>` (group) elementleri içinde gruplanmıştır. Varsayılan tıklamada en üst seviye grup seçilir.

**Grup içindeki bir objeye erişmek için:**

1. **Ctrl** tuşuna bir kez basıp bırakın
2. Artık mouse ile tıkladığınızda grup yerine **doğrudan tıkladığınız obje** seçilir
3. Bu sayede bir grup içindeki text, rect, circle gibi iç objeleri hedefleyebilirsiniz

:::tip
Ctrl modu bir kez tıklama sonrası normal moda döner. Tekrar iç obje seçmek isterseniz Ctrl'ye tekrar basın.
:::

### Adım 2: Element Editor'ü Açma

Bir obje seçili iken **Element Editor** butonuna tıklayın. Editör açıldığında:

- Seçili objenin **DOM ID**'si otomatik olarak alınır
- Objenin SVG tag tipine göre (text, rect, g, image, circle, path...) **uygulanabilir animation tipleri** otomatik filtrelenir
- Uygun animation tipleri sekmeler halinde yapılandırmaya hazır gösterilir

#### SVG Tag Tipine Göre Kullanılabilir Animation Tipleri

| SVG Tag | Kullanılabilir Tipler |
|---------|----------------------|
| **text / tspan** | Get, Color, Opacity, Visibility, Rotate, Move, Scale, Bar, Pipe, Blink, Tooltip, AlarmIndication, Click |
| **rect / circle / ellipse / polygon** | Yukarıdakilere ek: Chart, Iframe, Datatable, Slider, Input, QRCode, GetSymbol, Faceplate, Peity, Menu, Button, Image |
| **g (group)** | Animate, Faceplate, Iframe, Rotate, Move, Scale, Opacity, Visibility |
| **image** | Faceplate, Iframe, Image |

### Adım 3: Animation Tipi Seçme ve Yapılandırma

Sekmelerden istediğiniz animation tipini seçin. Her animation tipinin **kendine özel görsel yapılandırma arayüzü** vardır:

#### Kod Yazmadan Görsel Yapılandırma

Her animation tipi, tipine uygun form alanlarıyla birlikte gelir. Geliştirici bu form alanlarını doldurarak **kod yazmadan** yapılandırma yapar:

| Animation Tipi | Yapılandırma Arayüzü |
|---------------|---------------------|
| **Get** | Değişken seçici, format ayarı, birim |
| **Color** | Renk paleti, koşul tablosu (değer → renk eşleşmesi) |
| **Rotate** | Döndürme merkezi (cx, cy), min/max açı, min/max değer |
| **Bar** | Yön (yatay/dikey), min/max değer, dolgu rengi |
| **Move** | Eksen (X/Y), mesafe aralığı, min/max değer |
| **Slider** | Min, max, step, yön, renk |
| **Chart** | Grafik tipi, renkler, eksen ayarları, veri kaynağı |
| **Opacity** | Min/max opaklık, min/max değer |
| **Visibility** | Koşul (Boolean veya eşik) |
| **Blink** | Yanıp sönme hızı, renkler |
| **Set** | Hedef değişken, yazılacak değer |
| **Input** | Tip (text/number), min, max, placeholder |
| **Iframe** | URL adresi |
| **Open** | Hedef animation seçici |
| **Faceplate** | Faceplate seçici, placeholder değerleri |
| **Datatable** | Kolon tanımları, veri kaynağı |
| **AlarmIndication** | Alarm grubu seçici |

### Adım 4: Expression (İleri Düzey — Opsiyonel)

Her animation tipinde bir **Expression** bölümü bulunur. Bu bölüm opsiyoneldir — görsel yapılandırma yeterliyse kullanmanıza gerek yoktur.

Expression, geliştiricinin animation davranışını tamamen serbest biçimde programlamasını sağlar:

#### Expression Tipleri

| Tip | Açıklama | Ne Zaman Kullanılır |
|-----|----------|---------------------|
| **Tag** | Değişken adı referansı | En basit — bir değişkeni doğrudan bağlamak |
| **Expression** | JavaScript kodu | Hesaplama, formatlama, koşullu mantık |
| **Switch** | Değer → sonuç tablosu | Durum bazlı çoklu eşleşme |
| **Numeric** | Sabit sayı | Test amaçlı |
| **Text** | Sabit metin | Etiket, başlık |
| **Collection** | Çoklu değişken | Chart, Datatable için |
| **Alarm** | Alarm referansı | AlarmIndication için |
| **Faceplate** | Faceplate referansı | Faceplate yerleştirme |
| **Animation** | Animation referansı | Ekran geçişi (Open) |
| **Animation Popup** | Popup referansı | Modal ekran açma |
| **Custom Menu** | Menü referansı | Menü açma |
| **Url** | URL | Iframe gömme |
| **Tetra Color** | 4 renkli alarm durumu | Alarm renk kodları |
| **Button** | Buton yapılandırması | Button tipi |
| **Html** | HTML içerik | Zengin içerik |
| **System Page** | Sistem sayfası | Platform dahili sayfa |
| **InSCADA View** | Platform görünümü | Dahili görünüm |

#### Expression Örnekleri

**Tag** — Değişken adı yazmak yeterli:
```
ActivePower_kW
```

**Expression** — JavaScript ile serbest hesaplama:
```javascript
// Formatlı değer
var val = ins.getVariableValue("ActivePower_kW");
return val.value.toFixed(1) + " kW";
```

```javascript
// Koşullu renk
var temp = ins.getVariableValue("Temperature_C").value;
if (temp > 80) return "#ff0000";
if (temp > 60) return "#ff8800";
return "#00cc00";
```

```javascript
// İki değişkenden hesaplama
var power = ins.getVariableValue("ActivePower_kW").value;
var voltage = ins.getVariableValue("Voltage_V").value;
if (voltage > 0) return (power * 1000 / voltage).toFixed(1);
return "0";
```

**Switch** — Değer → sonuç eşleşme tablosu:
```
0 → Durdu
1 → Çalışıyor
2 → Arıza
3 → Bakım
```

Renk switch:
```
true → #00cc00
false → #ff0000
```

### Adım 5: Kaydetme

| Buton | İşlev |
|-------|-------|
| **Save** | Animation element'i kaydeder. Objeye binding bağlanmış olur |
| **Run & Save** | Önce expression'ı sunucuda test eder, sonuç başarılıysa kaydeder |

**Run & Save** özellikle expression geliştirirken kullanışlıdır — kaydetmeden önce sonucu doğrularsınız.

Kayıt sonrası, animation Visualization modunda çalıştırıldığında binding otomatik olarak aktif olur.

---

## Çalışma Zamanı Mimarisi

Element Editor'de yapılandırılan binding'ler, Visualization ekranında şu şekilde çalışır:

### WebSocket Tabanlı Gerçek Zamanlı Güncelleme

```
┌─────────────┐                    ┌──────────┐                  ┌─────────┐
│  Tarayıcı   │──eval-animation──▶│  Sunucu  │◀── Değişken ───│  Cache  │
│  (SVG DOM)  │◀─anim-results────│  (Engine) │    Değerleri    │         │
└──────┬──────┘                    └──────────┘                  └─────────┘
       │
       ▼
  Her element için
  tipine uygun
  DOM güncelleme
```

### Akış

1. **Visualization açılır** → Animation element'leri yüklenir, WebSocket abone olunur
2. **Her `duration` ms'de** → Tarayıcı `eval-animation` mesajı gönderir
3. **Sunucu** → Tüm element expression'larını çalıştırır, değişken değerlerini cache'ten okur
4. **Sonuç döner** → Her element ID için hesaplanan değer
5. **DOM güncellenir** → Her element tipine göre uygun DOM işlemi uygulanır

### DOM Güncelleme Tablosu

| Animation Tipi | DOM İşlemi |
|---------------|-----------|
| **Get** | `element.textContent = değer` |
| **Color** | `element.style.fill = renk` |
| **Opacity** | `element.style.opacity = değer` |
| **Visibility** | `element.style.display = değer ? '' : 'none'` |
| **Rotate** | `transform: rotate(açı)` |
| **Move** | `transform: translate(x, y)` |
| **Bar** | `element.height = değer` veya `element.width = değer` |
| **Scale** | `transform: scale(değer)` |
| **Blink** | SVG `<animate>` element ekleme/kaldırma |
| **Pipe** | `stroke-dashoffset` animasyonu |

### Kontrol Element'leri (Set, Slider, Input, Click)

Kontrol tipleri periyodik değerlendirmeye dahil **değildir**. Kullanıcı etkileşiminde tetiklenir:

```
Kullanıcı Tıklama → Expression Çalıştır → ins.setVariableValue() → Cache → Saha Cihazı
```

### Performans

- Tüm element'ler **tek bir WebSocket mesajında** toplu değerlendirilir
- Değişken değerleri **cache'ten** okunur (veritabanına gidilmez, < 1ms)
- Sadece **aktif** element'ler (`status: true`) değerlendirilir
- Click, MouseDown gibi **olay bazlı** element'ler periyodik döngüden hariçtir
- Timeout: yanıt `duration × 10` ms içinde gelmezse yeniden denenir

:::caution
Kontrol element'leri sunucu tarafında `ins.setVariableValue()` çağırır. Kullanıcının `SET_VARIABLE_VALUE` yetkisi olmalıdır.
:::
