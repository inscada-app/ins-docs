---
title: "Get"
description: "Değişken değerini metin olarak gösterme"
sidebar:
  order: 10
---

**Get**, bir SVG text öğesinin içeriğini değişken değeriyle güncelleyen en temel animation tipidir. Sayısal gösterge, etiket, durum metni gibi tüm metin tabanlı gösterimler için kullanılır.

## Kullanım

| Alan | Değer |
|------|-------|
| **Type** | Get |
| **Uygun SVG Öğeleri** | `<text>`, `<tspan>` |

## Yapılandırma Tipleri

Get element'inde değerin nasıl belirleneceğini seçmek için sağ taraftaki **TYPE** bölümünden seçim yapılır. Her tip farklı bir yapılandırma arayüzü sunar.

### NUMERIC — Değişken Seçimi (Kod Yazmadan)

En hızlı ve en yaygın kullanım. Projedeki değişkenleri listeden seçerek doğrudan bağlarsınız — kod yazmaya gerek yoktur.

![Get — Numeric (Değişken Seçimi)](../../../../../assets/docs/anim-get-numeric.png)

TYPE bölümünden **NUMERIC** seçildiğinde sol tarafta projedeki tüm değişkenler listelenir. Bağlamak istediğiniz değişkeni seçmeniz yeterlidir.

| Alan | Açıklama |
|------|----------|
| **Variable** | Açılır listeden değişken seçimi (ActivePower_kW, Voltage_V, Temperature_C...) |
| **Default** | Değer okunamadığında gösterilecek varsayılan metin |
| **Bit** | Değerin belirli bir bit'ini göstermek için bit numarası (opsiyonel) |

Seçilen değişkenin güncel değeri her tarama döngüsünde otomatik olarak text öğesine yazılır.

### EXPRESSION — JavaScript ile Serbest Hesaplama

İleri düzey kullanım. Formatlama, birim ekleme, birden fazla değişkenden hesaplama veya koşullu metin için kullanılır.

![Get — Expression](../../../../../assets/docs/anim-get-expression.png)

TYPE bölümünden **EXPRESSION** seçildiğinde sol tarafta JavaScript kod editörü açılır. `return` ile döndürülen değer text öğesine yazılır.

#### Örnek: Değer + Birim

```javascript
return ins.getVariableValue('ActivePower_kW').value;
```

#### Örnek: Formatlı Gösterim

```javascript
var val = ins.getVariableValue("ActivePower_kW");
return val.value.toFixed(1) + " kW";
```
Sonuç: `359.9 kW`

#### Örnek: Birim ve Ondalık

```javascript
var val = ins.getVariableValue("Temperature_C");
return val.value.toFixed(1) + " °C";
```
Sonuç: `45.2 °C`

#### Örnek: Boolean Durum Metni

```javascript
var status = ins.getVariableValue("GridStatus").value;
return status ? "ONLINE" : "OFFLINE";
```

#### Örnek: Zaman Damgası

```javascript
var val = ins.getVariableValue("ActivePower_kW");
var d = new Date(val.dateInMs);
var h = ("0" + d.getHours()).slice(-2);
var m = ("0" + d.getMinutes()).slice(-2);
var s = ("0" + d.getSeconds()).slice(-2);
return h + ":" + m + ":" + s;
```
Sonuç: `14:32:05`

#### Örnek: Birden Fazla Değişken

```javascript
var p = ins.getVariableValue("ActivePower_kW").value;
var v = ins.getVariableValue("Voltage_V").value;
var i = ins.getVariableValue("Current_A").value;
return p.toFixed(0) + " kW | " + v.toFixed(0) + " V | " + i.toFixed(1) + " A";
```
Sonuç: `360 kW | 235 V | 36.2 A`

### TEXT — Sabit Metin

Dinamik olmayan, her zaman aynı kalan sabit metin göstermek için kullanılır.

![Get — Text](../../../../../assets/docs/anim-get-text.png)

TYPE bölümünden **TEXT** seçildiğinde sol tarafta basit metin giriş alanı açılır. Girilen metin doğrudan text öğesine yazılır.

Kullanım senaryoları:
- Etiket metni (örn: "Aktif Güç", "Sıcaklık")
- Birim gösterimi
- Statik başlık veya açıklama

### SWITCH — Değere Göre Metin Eşleşme

Sayısal veya boolean değere göre farklı metinler göstermek için kullanılır. Değer → metin eşleşme tablosu tanımlanır.

Örnek:
```
0 → Durdu
1 → Çalışıyor
2 → Arıza
3 → Bakım
```

---

## Ne Zaman Hangi Tip?

| İhtiyaç | Önerilen Tip |
|---------|-------------|
| Basit değer gösterimi, hızlı yapılandırma | **NUMERIC** |
| Formatlama, birim, hesaplama | **EXPRESSION** |
| Sabit etiket/başlık | **TEXT** |
| Durum kodu → metin dönüşümü | **SWITCH** |

:::tip
Çoğu durumda **NUMERIC** yeterlidir — listeden değişken seçin, kaydedin. Formatlama veya birden fazla değişken gerektiğinde **EXPRESSION** kullanın.
:::

## GetSymbol

**GetSymbol** tipi, Space seviyesindeki Symbol kütüphanesinden SVG sembol yükler. Get'in metin yerine görsel sembol versiyonudur.

| Alan | Değer |
|------|-------|
| **Type** | GetSymbol |
| **Expression Type** | Expression |
| **Expression** | Sembol adı |

Kullanım: Cihaz tipine göre dinamik ikon gösterme.
