---
title: "SVG Animations"
description: "SVG tabanlı interaktif SCADA ekranları — tasarım, animasyon binding ve script"
sidebar:
  order: 20
---

SVG Animation, inSCADA'nın temel görselleştirme bileşenidir. Her animation bir SVG dosyasından oluşur ve değişken değerlerine bağlanarak gerçek zamanlı SCADA ekranları oluşturur.

![Energy Monitoring Dashboard](../../../../assets/docs/variable-tracking.png)

## Animation Oluşturma

**Menü:** Development → Animations → Animation Dev

| Alan | Zorunlu | Açıklama |
|------|---------|----------|
| **Name** | Evet | Ekran adı (proje içinde benzersiz) |
| **SVG Content** | Evet | SVG kaynak kodu |
| **Duration** | Evet | Animasyon güncelleme periyodu (ms, min: 100) |
| **Play Order** | Evet | Sıralama (birden fazla ekran varsa) |
| **Main** | Evet | Ana ekran mı |
| **Color** | Hayır | Arka plan rengi |
| **Description** | Hayır | Açıklama |

## Animation Yapısı

Her animation üç bileşenden oluşur:

```
Animation
├── SVG Content (ekranın görsel yapısı)
├── Animation Elements (değişken bağlantıları)
│   ├── Element 1: "temp_text" → Temperature_C (text binding)
│   ├── Element 2: "motor_rect" → MotorStatus (color binding)
│   └── Element 3: "valve_group" → ValvePosition (rotation binding)
└── Animation Scripts (ekran açılma/kapanma scriptleri)
    ├── Pre-Animation Code (ekran açıldığında)
    └── Post-Animation Code (ekran kapandığında)
```

## Animation Elements

Animation Element, SVG içindeki bir DOM öğesini bir değişkene bağlar. Binding türüne göre öğenin metin, renk, konum, görünürlük vb. özellikleri değişken değerine göre güncellenir.

### Element Tanımı

| Alan | Açıklama |
|------|----------|
| **SVG Element ID** | SVG içindeki hedef öğenin `id` özniteliği |
| **Variable** | Bağlanacak değişken |
| **Type** | Binding tipi (aşağıdaki tabloya bakın) |
| **Expression** | Özel dönüşüm formülü (opsiyonel) |

### Binding Tipleri

| Tip | Açıklama | Örnek |
|-----|----------|-------|
| **Text** | Öğenin metin içeriğini günceller | Sıcaklık: `25.4°C` |
| **Color** | Öğenin dolgusunu/rengini değiştirir | Alarm: kırmızı/yeşil |
| **Visibility** | Öğeyi göster/gizle | Motor çalışıyorsa ok ikonu görünsün |
| **Rotation** | Öğeyi döndür | Vana pozisyonu: 0°-90° |
| **Translation** | Öğeyi kaydır (X/Y) | Seviye göstergesi: 0-100% |
| **Scale** | Öğeyi ölçekle | Bar grafik yüksekliği |
| **Opacity** | Saydamlık ayarla | Haberleşme kesilince soluk göster |
| **Class** | CSS class ekle/kaldır | Durum bazlı stil değişimi |

### Expression ile Gelişmiş Binding

Element'e özel JavaScript expression atanabilir:

```javascript
// Renk binding: değere göre renk seç
if (value > 80) return '#ff0000';      // kırmızı
else if (value > 60) return '#ff8800'; // turuncu
else return '#00cc00';                 // yeşil
```

```javascript
// Text binding: birim ve format ekle
return value.toFixed(1) + ' °C';
```

```javascript
// Visibility: birden fazla koşul
var power = ins.getVariableValue("ActivePower_kW").value;
var status = ins.getVariableValue("GridStatus").value;
return power > 100 && status;
```

## Animation Scripts

Her animation'a pre/post script atanabilir:

| Script | Çalışma Zamanı | Kullanım |
|--------|---------------|----------|
| **Pre-Animation Code** | Ekran açıldığında (ilk yükleme) | Başlangıç değerleri, veri çekme |
| **Post-Animation Code** | Ekran kapandığında | Temizlik, kaynak serbest bırakma |

```javascript
// Pre-Animation: Son 1 saatlik güç verilerini çek ve grafiğe aktar
var endMs = ins.now().getTime();
var startMs = endMs - (60 * 60 * 1000);
var logs = ins.getLoggedVariableValuesByPage(
    Java.to(['ActivePower_kW'], 'java.lang.String[]'),
    ins.getDate(startMs), ins.getDate(endMs), 0, 30
);
// SVG içindeki grafiği güncelle...
```

## SVG Tasarım İlkeleri

### ID Kuralları

SVG öğelerine anlamlı `id` değerleri verin — Animation Element bunları referans eder:

```xml
<text id="temp_display">--</text>
<rect id="motor_indicator" fill="#cccccc"/>
<g id="valve_group" transform="rotate(0)">
  <path d="..."/>
</g>
```

### Responsive Tasarım

Animation'ın `alignment` özelliği ile ekran farklı çözünürlüklerde nasıl davranacağı belirlenir.

## Gerçek Zamanlı Güncelleme

Animation açıldığında WebSocket bağlantısı kurulur. Platform, `duration` parametresinde belirtilen aralıkta değişken değerlerini istemciye push eder ve binding'ler otomatik güncellenir. Sayfa yenilemesi gerekmez.

## Placeholder (Parametrik Ekran)

Animation'lara placeholder tanımlanabilir. Aynı SVG tasarımı farklı parametrelerle (farklı cihaz, farklı değişken seti) tekrar kullanılabilir.

Örnek: Bir "Motor Detay" ekranı tasarlayın, placeholder olarak `{motor_name}` tanımlayın. Farklı motorlar için aynı ekranı farklı parametrelerle açın.
