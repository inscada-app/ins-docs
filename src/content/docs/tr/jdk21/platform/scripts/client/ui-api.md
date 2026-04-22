---
title: "Client UI API"
description: "Tarayıcı tarafında numpad, confirm, popup, zoom, ses, animasyon / sayfa geçişi metodları"
sidebar:
  order: 1
---

Client UI API, `Inscada.*` üzerinde **yalnızca tarayıcıda** anlamlı olan metodları toplar: popup diyaloglar, değer giriş kontrolleri, animasyon / sayfa navigasyonu, SVG zoom, ses. Bu metodların server-side `ins.*` üzerinde karşılığı **yoktur**.

Kod konumu: `ui/sources/models/api/uiApi.js`

## Değer Giriş Diyalogları

### `numpad(data)`

Bir değişken için numerik klavye popup'ı açar; kullanıcı değeri girip onayladığında `setVariableValue` otomatik çağrılır.

```javascript
Inscada.numpad({
  variableName: "SetpointTemperature"  // zorunlu
  // projectName: "otherProject"       // opsiyonel — mevcut projeye göre varsayılır
});
```

### `sliderPad(data)`

Numpad'e benzer, ancak slider arayüzüyle değişken değeri girer. Değişken min/max değerleri slider sınırları olarak kullanılır.

```javascript
Inscada.sliderPad({
  variableName: "MotorSpeed_RPM"
});
```

### `setStringValue(data)`

Bir değişkene **metin** girişi için text input popup'ı açar.

```javascript
Inscada.setStringValue({
  variableName: "OperatorNote"
});
```

### `customNumpad(data)`

Değişkene bağlı olmayan, callback'li generic numpad. Kullanıcıdan sayı alıp istediğin fonksiyona iletir.

```javascript
Inscada.customNumpad({
  header: "Limit değeri",
  initialValue: 100,
  hasNegative: false,
  hasDecimal: true,
  minValue: 0,
  maxValue: 500,
  isInteger: false,
  sizeScale: 1.2,
  onScriptFunc: (xval, extraObj) => {
    console.log("Girilen:", xval);
  },
  extraObj: { context: "alarm" }
});
```

| Alan | Açıklama |
| --- | --- |
| `header` | Popup başlığı |
| `initialValue` | Başlangıç değeri |
| `hasNegative` / `hasDecimal` | Negatif / ondalık izin |
| `minValue` / `maxValue` | Sınırlar |
| `isInteger` | Tam sayı zorunluluğu |
| `sizeScale` | Popup boyut çarpanı |
| `onScriptFunc(val, extraObj)` | Onay callback'i |
| `extraObj` | Callback'e opak veri |

### `customKeyboard(data)`

Generic sanal klavye. Metin için `customNumpad` karşılığı.

```javascript
Inscada.customKeyboard({
  initialValue: "",
  onScriptFunc: (value) => console.log("Girilen:", value)
});
```

### `customStringValue(data)`

Basit metin giriş popup'ı (küçük ve hızlı — klavyeli değil).

```javascript
Inscada.customStringValue({
  initialValue: "notlar",
  onScriptFunc: (value) => { /* ... */ }
});
```

### `confirm(type, title, message, object)`

Onay diyaloğu. `type` popup ikonunu / rengini belirler (`info`, `warning`, `error`, `success`).

```javascript
Inscada.confirm("warning", "Dikkat", "Pompa durdurulsun mu?", {
  onOkayFunc: () => {
    Inscada.setVariableValue("PumpRun", { value: false });
  }
});
```

### `showPasswordPopup(options)`

Parola sorgusu; doğrulama ya sabit şifreye ya da bir değişkenin değerine göre yapılır.

```javascript
// Sabit parola
Inscada.showPasswordPopup({
  password: "1234",
  onPasswordVerified: () => { /* ... */ }
});

// Değişkendeki parola
Inscada.showPasswordPopup({
  passwordVariableName: "SupervisorPassword",
  onPasswordVerified: () => { /* ... */ },
  numpad: true   // numpad ile giriş
});
```

### `objectEditor(data)`

Verilen nesneyi JSON editörüyle kullanıcıya açar; onaylandığında `onEditFunc` güncel nesneyle çağrılır.

```javascript
Inscada.objectEditor({
  obj: { gain: 1.0, offset: 0.0, threshold: 50 },
  onEditFunc: (updated) => {
    Inscada.setVariableValue("PidConfig", { value: JSON.stringify(updated) });
  }
});
```

## Popup / Animasyon / Sayfa Navigasyonu

### `showSystemPage(props)`

Sistem sayfalarından birine geçiş (menü seçimini tetikler).

```javascript
Inscada.showSystemPage({
  systemPageName: "alarms"
  // pageData: { ... }   // opsiyonel — sayfa açıldığında kullanılabilir veri
});
```

### `showMapPage(obj)`

Harita sayfasına geçer ve haritayı verilen koordinat/zoom'a odaklar.

```javascript
Inscada.showMapPage({
  lon: 29.0,
  lat: 41.0,
  zoom: 12
});
```

### `showAnimation(options)`

Mevcut animasyon görüntüleyicisindeki animasyonu değiştirir.

```javascript
Inscada.showAnimation({
  name: "TankDetay",
  parameters: { tankId: 3 },   // opsiyonel — hedef animasyona parametre
  unselectMenu: true            // opsiyonel — menü seçimini kaldır
});
```

### `showParentAnimation(options)`

İçinde bulunduğun animasyonun parent'ındaki animasyonu değiştirir (drill-down geri dönüşler için tipik).

```javascript
Inscada.showParentAnimation({
  name: "AnaGorunum"
});
```

### `popupAnimation(obj)`

Bir animasyonu popup pencerede açar. Boyut verilmezse SVG'nin kendi boyutuna otomatik oturur.

```javascript
Inscada.popupAnimation({
  animationName: "TankDetay",
  modal: true,
  width: 600,
  height: 400
});
```

Genişletilmiş kullanım:

| Alan | Açıklama |
| --- | --- |
| `animationName` | Açılacak animasyonun adı (zorunlu) |
| `modal` | Arka planı kilitler (`true` / `false`) |
| `windowId` | Özel pencere ID'si (aynı ID varsa yerine açılır) |
| `leftPos` / `topPos` | Pencere konumu (pixel) |
| `width` / `height` | Boyut (verilmezse SVG boyutu kullanılır) |
| `extraHeight` | Dinamik boyutta başlık yüksekliği payı (default 44 px) |
| `__parameters` | Hedef animasyona geçirilecek parametreler |

### `closePopup(windowId)`

Açık bir popup penceresini `windowId` üzerinden kapatır.

```javascript
Inscada.closePopup("popupAnimationWindow12345");
```

## UI Kontrolleri

### `setUiVisibility(type, status)`

Ana arayüzün belirli parçalarını gösterir / gizler.

```javascript
Inscada.setUiVisibility("top-toolbar", false);
Inscada.setUiVisibility("top-menu", false);
Inscada.setUiVisibility("sidebar-collapse", true);
Inscada.setUiVisibility("animation-toolbar", false);
```

Geçerli `type` değerleri:

| `type` | Etki |
| --- | --- |
| `"top-toolbar"` | Üst toolbar göster / gizle |
| `"top-menu"` | Üst menü + menü satırı göster / gizle |
| `"animation-toolbar"` | Animasyon toolbar'ı göster / gizle |
| `"sidebar-collapse"` | Kenar menüyü collapse / expand et |

### `setDayNightMode(isNight)`

Gece / gündüz modunu değiştirir.

```javascript
Inscada.setDayNightMode(true);   // gece
Inscada.setDayNightMode(false);  // gündüz
```

### `reload()`

Tarayıcı sekmesini yeniden yükler (`window.location.reload()`).

```javascript
Inscada.reload();
```

### `svgZoomPan(data)`

Animasyon SVG'si üzerinde programatik zoom / pan kontrolü.

```javascript
Inscada.svgZoomPan({
  zoomableId: "mainSvg",
  functionName: "zoomIn",
  params: {}
});

Inscada.svgZoomPan({
  zoomableId: "mainSvg",
  functionName: "zoomAtPoint",
  params: { scale: 2, x: 100, y: 150 }
});

Inscada.svgZoomPan({
  zoomableId: "mainSvg",
  functionName: "fit",
  params: {}
});
```

Geçerli `functionName` değerleri: `zoom`, `zoomBy`, `zoomAtPoint`, `zoomAtPointBy`, `zoomIn`, `zoomOut`, `pan`, `panBy`, `resetZoom`, `resetPan`, `reset`, `fit`, `center`.

## Ses

### `playAudio(isStart, name, isLoop)`

File System'de kayıtlı bir ses dosyasını çalar / durdurur. Aynı ad için aynı anda birden fazla örnek başlatılmaz.

```javascript
// Başlat (döngülü)
Inscada.playAudio(true, "alarm_siren.wav", true);

// Durdur
Inscada.playAudio(false, "alarm_siren.wav", false);
```

| Parametre | Açıklama |
| --- | --- |
| `isStart` | `true` başlat, `false` durdur |
| `name` | File System'deki ses dosyası adı |
| `isLoop` | Döngü modu (yalnızca başlatırken anlamlı) |
