---
title: "Client UI API"
description: "Browser-side numpad, confirm, popup, zoom, audio UI methods"
sidebar:
  order: 1
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Work in progress">
This page will be written against the JDK21 source. Placeholder only for now.
</Aside>

Client UI API contains methods that are only meaningful **in the browser**: popups, value-input dialogs, map/animation navigation, audio playback, visibility controls. These methods do **NOT** exist on server-side `ins.*` (a server can't open a numpad).

## Scope

### Value-input Dialogs
- `Inscada.numpad(data)` — numeric input for a variable
- `Inscada.sliderPad(data)` — slider input for a variable
- `Inscada.setStringValue(data)` — string input for a variable
- `Inscada.customNumpad(data)` — generic numpad with callback
- `Inscada.customKeyboard(data)` — virtual keyboard with callback
- `Inscada.customStringValue(data)` — generic string input with callback
- `Inscada.showPasswordPopup(options)` — password prompt
- `Inscada.objectEditor(data)` — JSON editor popup
- `Inscada.confirm(type, title, message, object)` — confirmation dialog

### Popup / Animation / Page Navigation
- `Inscada.popupAnimation(obj)` — open an animation in a popup window
- `Inscada.showAnimation(options)` — switch animation
- `Inscada.showParentAnimation(options)` — switch parent animation
- `Inscada.showSystemPage(props)` — navigate to a system page
- `Inscada.showMapPage(obj)` — focus the map page on a point
- `Inscada.closePopup(windowId)` — close a popup

### SVG / Visibility
- `Inscada.svgZoomPan(data)` — SVG zoom/pan control
- `Inscada.setUiVisibility(type, status)` — show/hide top toolbar / menu / sidebar
- `Inscada.setDayNightMode(isNight)` — day/night mode toggle
- `Inscada.reload()` — reload the browser

### Audio
- `Inscada.playAudio(isStart, name, isLoop)` — start/stop audio playback
