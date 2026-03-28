---
title: "Faceplate"
description: "Tekrar kullanılabilir SVG bileşenleri — motor, vana, pompa gibi standart SCADA sembolleri"
sidebar:
  order: 21
---

Faceplate, tekrar kullanılabilir SVG bileşenidir. Bir motor, vana, pompa, tank gibi sık kullanılan SCADA sembollerini bir kez tasarlayıp birden fazla animation ekranında kullanabilirsiniz.

## Animation vs Faceplate

| Özellik | Animation | Faceplate |
|---------|-----------|-----------|
| **Seviye** | Proje | Proje |
| **Kullanım** | Tam SCADA ekranı | Tekrar kullanılabilir bileşen |
| **SVG İçeriği** | Tam ekran SVG | Küçük bileşen SVG |
| **Binding** | Animation Elements | Faceplate Elements + Placeholders |
| **Yerleştirme** | Bağımsız ekran | Animation içine gömülür |

## Faceplate Oluşturma

**Menü:** Development → Animations → Faceplate Dev

| Alan | Zorunlu | Açıklama |
|------|---------|----------|
| **Name** | Evet | Faceplate adı |
| **SVG Content** | Evet | SVG kaynak kodu |
| **Color** | Hayır | Tema rengi |
| **Description** | Hayır | Açıklama |

## Faceplate Yapısı

```
Faceplate: "Motor_Standard"
├── SVG Content (motor sembolü SVG)
├── Faceplate Elements (binding tanımları)
│   ├── "status_indicator" → renk binding
│   ├── "speed_text" → metin binding
│   └── "current_bar" → ölçek binding
└── Faceplate Placeholders (parametre tanımları)
    ├── {motor_name} → "Motor 1"
    ├── {speed_var} → "Motor1_Speed_RPM"
    └── {current_var} → "Motor1_Current_A"
```

## Placeholder Sistemi

Placeholder, faceplate'i farklı cihazlar için yeniden kullanılabilir yapan parametrelerdir.

### Placeholder Tanımlama

| Alan | Açıklama |
|------|----------|
| **Name** | Placeholder adı (örn: `motor_name`) |
| **Default Value** | Varsayılan değer |

### Kullanım Senaryosu

Bir fabrikada 20 motor var. Hepsi aynı sembolle gösterilecek:

1. **Bir kez tasarla:** `Motor_Standard` faceplate'i oluştur
2. **Placeholder'lar tanımla:** `{motor_name}`, `{speed_var}`, `{status_var}`
3. **Animation'a yerleştir:** Her motor için faceplate'i ekle, placeholder değerlerini doldur

```
Motor 1: {motor_name}="Motor 1", {speed_var}="M1_Speed", {status_var}="M1_Status"
Motor 2: {motor_name}="Motor 2", {speed_var}="M2_Speed", {status_var}="M2_Status"
...
Motor 20: {motor_name}="Motor 20", {speed_var}="M20_Speed", {status_var}="M20_Status"
```

20 ayrı sembol tasarlamak yerine 1 faceplate + 20 placeholder seti.

## Faceplate Elements

Faceplate Element, Animation Element ile aynı mantıkta çalışır — SVG öğesini değişkene bağlar:

| Binding Tipi | Açıklama |
|-------------|----------|
| **Text** | Metin güncelleme (RPM, °C, kW gösterimi) |
| **Color** | Durum rengi (çalışıyor=yeşil, arıza=kırmızı) |
| **Visibility** | Koşullu göster/gizle |
| **Rotation** | Döndürme (vana açısı, gösterge ibresi) |

## Örnek: Motor Faceplate SVG

```xml
<svg viewBox="0 0 120 100">
  <!-- Motor gövdesi -->
  <rect id="motor_body" x="10" y="20" width="100" height="60"
        rx="5" fill="#dddddd" stroke="#666"/>

  <!-- Durum göstergesi -->
  <circle id="status_led" cx="95" cy="35" r="8" fill="#cccccc"/>

  <!-- Motor adı -->
  <text id="motor_label" x="60" y="15" text-anchor="middle"
        font-size="12">{motor_name}</text>

  <!-- Hız değeri -->
  <text id="speed_display" x="60" y="55" text-anchor="middle"
        font-size="16" font-weight="bold">-- RPM</text>

  <!-- Akım bar -->
  <rect id="current_bar" x="15" y="70" width="0" height="5"
        fill="#3498db"/>
</svg>
```

Faceplate Elements:
- `status_led` → `{status_var}` → Color (true=yeşil, false=kırmızı)
- `speed_display` → `{speed_var}` → Text (değer + " RPM")
- `current_bar` → `{current_var}` → Scale (0-100A → 0-90px genişlik)

## Web Components ile Kapsülleme

Faceplate'ler ileride **Web Components** olarak kapsüllenebilir. Bu sayede:
- Bir faceplate `<ins-motor>` gibi özel HTML tag'i olarak kullanılabilir
- Custom Menu HTML sayfalarında doğrudan embed edilebilir
- Shadow DOM ile stil izolasyonu sağlanır

Detaylı bilgi: [Web Components →](/docs/tr/platform/web-components/)
