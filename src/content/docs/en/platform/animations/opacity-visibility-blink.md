---
title: "Opacity, Visibility & Blink"
description: "Saydamlık, göster/gizle ve yanıp sönme animasyonları"
sidebar:
  order: 14
---

## Opacity (Saydamlık)

**Opacity**, bir SVG öğesinin saydamlığını değere göre ayarlar. Haberleşme durumuna göre cihaz sembolünü soluklaştırma, güç durumuna göre bölge parlaklığı gibi efektler için kullanılır.

| Alan | Değer |
|------|-------|
| **Type** | Opacity |
| **Uygun SVG Öğeleri** | Tümü |

### TAG — Değişken Seçimi

![Opacity — Tag](../../../../../assets/docs/anim-opacity-tag.png)

Listeden değişken seçilir. Değer, Min-Max aralığına göre 0 (tamamen saydam) ile 1 (tamamen opak) arasına normalize edilir.

| Alan | Açıklama |
|------|----------|
| **Variable** | Açılır listeden değişken seçimi |
| **Default** | Değer okunamadığında varsayılan opaklık |
| **Min** | Minimum değer (bu değerde opacity = 0, tamamen saydam) |
| **Max** | Maksimum değer (bu değerde opacity = 1, tamamen opak) |

Formül: `opacity = (değer - min) / (max - min)`

Örnek: Min=0, Max=100, Değer=50 → opacity = 0.5 (yarı saydam)

### EXPRESSION — JavaScript ile Hesaplama

![Opacity — Expression](../../../../../assets/docs/anim-opacity-expression.png)

0 ile 1 arasında sayısal değer döndürülür. Min/Max alanları expression modunda da kullanılır.

```javascript
// Bağlantı durumuna göre: bağlı=opak, değil=soluk
var status = ins.getConnectionStatus("MODBUS-PLC");
return status === "Connected" ? 1.0 : 0.3;
```

```javascript
// Sinyal gücüne orantılı saydamlık
var val = ins.getVariableValue("Signal_Strength").value;
return 0.2 + (val / 100) * 0.8; // 0.2-1.0 aralığı
```

---

## Visibility (Göster/Gizle)

**Visibility**, bir SVG öğesini koşula göre gösterir veya tamamen gizler (`display: none`). Opacity'den farkı: kademeli değil, ya tamamen görünür ya tamamen gizli.

| Alan | Değer |
|------|-------|
| **Type** | Visibility |
| **Uygun SVG Öğeleri** | Tümü (özellikle `<g>` grupları) |

### TAG — Değişken Seçimi

![Visibility — Tag](../../../../../assets/docs/anim-visibility-tag.png)

Boolean veya sayısal değişken seçilir. Değer `true` veya `0`'dan farklı ise öğe görünür, aksi halde gizlenir.

| Alan | Açıklama |
|------|----------|
| **Variable** | Açılır listeden değişken seçimi |
| **Default** | Varsayılan görünürlük durumu |
| **Bit** | Word/Integer değişkenlerde belirli bir bit'e göre göster/gizle. Örn: Bit=3 → değerin 3. bit'i 1 ise görünür |
| **Inverse** | İşaretlenirse mantık tersine çevrilir: `true` → gizle, `false` → göster |

**Bit alanı** özellikle durum word'lerinde kullanışlıdır. Bir Integer değişkenin tek bir bit'ini izleyerek o bit'e göre öğeyi gösterir/gizler.

**Inverse** alanı ile mantığı tersine çevirebilirsiniz — örneğin "alarm yoksa göster" yerine "alarm varsa gizle" gibi.

### EXPRESSION — JavaScript ile Koşul

![Visibility — Expression](../../../../../assets/docs/anim-visibility-expression.png)

`true` veya `false` döndürülür. `true` → görünür, `false` → gizli.

```javascript
// Sıcaklık eşiğinde uyarı ikonu göster
var temp = ins.getVariableValue("Temperature_C").value;
return temp > 70;
```

```javascript
// Birden fazla koşul
var power = ins.getVariableValue("ActivePower_kW").value;
var status = ins.getVariableValue("GridStatus").value;
return power > 500 && status; // hem güç yüksek hem de bağlı
```

### Kullanım Senaryosu — Alarm/Normal İkon Değişimi

```xml
<!-- Normal durum ikonu -->
<g id="icon_normal">
  <circle r="15" fill="#00cc00"/>
  <text text-anchor="middle" y="5" fill="white">✓</text>
</g>

<!-- Alarm durum ikonu -->
<g id="icon_alarm">
  <circle r="15" fill="#ff0000"/>
  <text text-anchor="middle" y="5" fill="white">!</text>
</g>
```

- `icon_normal` → Visibility, Expression: `ins.getVariableValue("Temperature_C").value <= 70`
- `icon_alarm` → Visibility, Expression: `ins.getVariableValue("Temperature_C").value > 70`

Veya TAG modunda: `icon_alarm` → Variable: `AlarmActive`, Inverse: kapalı (alarm aktifken görünür)

---

## Blink (Yanıp Sönme)

**Blink**, koşul sağlandığında SVG öğesini yanıp söndürür. Aktif alarm, kritik değer, haberleşme hatası gibi dikkat gerektiren durumlarda görsel uyarı sağlar.

| Alan | Değer |
|------|-------|
| **Type** | Blink |
| **Uygun SVG Öğeleri** | Tümü |

### TAG — Değişken Seçimi

![Blink — Tag](../../../../../assets/docs/anim-blink-tag.png)

Boolean değişken seçilir. `true` → yanıp sönme başlar, `false` → durur.

| Alan | Açıklama |
|------|----------|
| **Variable** | Açılır listeden değişken seçimi |
| **Duration** | Yanıp sönme hızı (ms). Varsayılan: 200ms. Küçük değer = hızlı yanıp sönme |

### EXPRESSION — JavaScript ile Koşul

![Blink — Expression](../../../../../assets/docs/anim-blink-expression.png)

`true` veya `false` döndürülür. `true` → yanıp sönme başlar, `false` → durur. Duration alanı expression modunda da kullanılır.

```javascript
// Sıcaklık kritik seviyede yanıp sön
var temp = ins.getVariableValue("Temperature_C").value;
return temp > 80;
```

```javascript
// Haberleşme kesilince yanıp sön
var status = ins.getConnectionStatus("MODBUS-PLC");
return status !== "Connected";
```

### Çalışma Prensibi

Blink, JavaScript `setInterval` ile öğenin `visibility` özniteliğini `visible` ↔ `hidden` arasında periyodik olarak değiştirir. Duration değeri bu geçişin aralığını belirler:

| Duration | Hız |
|----------|-----|
| **100 ms** | Çok hızlı yanıp sönme |
| **200 ms** | Hızlı (varsayılan) |
| **500 ms** | Orta |
| **1000 ms** | Yavaş |

---

## Kombinasyon Kullanımı

Aynı SVG öğesine birden fazla animation tipi bağlanabilir. Örneğin:

1. **Color** element: Sıcaklığa göre renk (yeşil → turuncu → kırmızı)
2. **Blink** element: 80°C üzerinde yanıp sönme

Sonuç: Normal durumda yeşil sabit, 60°C'de turuncu sabit, 80°C üzerinde **kırmızı yanıp söner**.

| Element | Type | Koşul | Davranış |
|---------|------|-------|----------|
| Element 1 | Color | Her zaman | Değere göre renk |
| Element 2 | Blink | temp > 80 | Yanıp sönme |
| Element 3 | Opacity | Bağlantı durumu | Kopunca soluk |
