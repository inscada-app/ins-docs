---
title: "Client UI API"
description: "Tarayıcı tarafında numpad, confirm, popup, zoom, ses gibi UI metodları"
sidebar:
  order: 1
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Hazırlanıyor">
Bu sayfa JDK21 kaynak koduna göre yazılacak. Şimdilik yer tutucu.
</Aside>

Client UI API, **yalnızca tarayıcıda** anlamlı olan metodları içerir: popup açma, değer girişi diyalogu, harita / animasyon geçişi, ses çalma, görünüm kontrolleri. Bu metodlar server-side `ins.*` üzerinde **YOKTUR** (sunucu bir numpad açamaz).

## Kapsam

### Değer Giriş Diyalogları
- `Inscada.numpad(data)` — değişkene numerik giriş
- `Inscada.sliderPad(data)` — değişkene slider ile giriş
- `Inscada.setStringValue(data)` — değişkene string giriş
- `Inscada.customNumpad(data)` — callback'li generik numpad
- `Inscada.customKeyboard(data)` — callback'li sanal klavye
- `Inscada.customStringValue(data)` — callback'li string giriş
- `Inscada.showPasswordPopup(options)` — şifre istemi
- `Inscada.objectEditor(data)` — JSON editor popup
- `Inscada.confirm(type, title, message, object)` — onay diyaloğu

### Popup / Animasyon / Sayfa Geçişi
- `Inscada.popupAnimation(obj)` — popup pencerede animasyon
- `Inscada.showAnimation(options)` — animasyon değiştir
- `Inscada.showParentAnimation(options)` — parent animasyon değiştir
- `Inscada.showSystemPage(props)` — sistem sayfasına git
- `Inscada.showMapPage(obj)` — harita sayfasına odaklı git
- `Inscada.closePopup(windowId)` — popup kapat

### SVG / Görünüm
- `Inscada.svgZoomPan(data)` — SVG zoom/pan kontrolü
- `Inscada.setUiVisibility(type, status)` — top toolbar / menu / sidebar göster/gizle
- `Inscada.setDayNightMode(isNight)` — gece/gündüz modu
- `Inscada.reload()` — tarayıcıyı yeniden yükle

### Ses
- `Inscada.playAudio(isStart, name, isLoop)` — ses başlat/durdur
