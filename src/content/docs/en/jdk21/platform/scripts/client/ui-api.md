---
title: "Client UI API"
description: "Browser-side numpad, confirm, popup, zoom, audio, animation/page navigation methods"
sidebar:
  order: 1
---

Client UI API groups every `Inscada.*` method that is only meaningful **in the browser**: popup dialogs, value-input widgets, animation / page navigation, SVG zoom, audio. None of these methods exist on server-side `ins.*`.

Source: `ui/sources/models/api/uiApi.js`

## Value-input Dialogs

### `numpad(data)`

Opens a numeric keypad popup bound to a variable; when the user confirms, `setVariableValue` is called automatically.

```javascript
Inscada.numpad({
  variableName: "SetpointTemperature"  // required
  // projectName: "otherProject"       // optional — defaults to current project
});
```

### `sliderPad(data)`

Similar to `numpad` but with a slider UI. The variable's min/max drive the slider bounds.

```javascript
Inscada.sliderPad({
  variableName: "MotorSpeed_RPM"
});
```

### `setStringValue(data)`

Opens a text-input popup to write a **string** to a variable.

```javascript
Inscada.setStringValue({
  variableName: "OperatorNote"
});
```

### `customNumpad(data)`

A generic, callback-driven numpad not tied to a variable. Forwards the entered number to your handler.

```javascript
Inscada.customNumpad({
  header: "Limit value",
  initialValue: 100,
  hasNegative: false,
  hasDecimal: true,
  minValue: 0,
  maxValue: 500,
  isInteger: false,
  sizeScale: 1.2,
  onScriptFunc: (xval, extraObj) => {
    console.log("Entered:", xval);
  },
  extraObj: { context: "alarm" }
});
```

| Field | Description |
| --- | --- |
| `header` | Popup title |
| `initialValue` | Starting value |
| `hasNegative` / `hasDecimal` | Allow negative / decimal |
| `minValue` / `maxValue` | Bounds |
| `isInteger` | Force integers |
| `sizeScale` | Popup size multiplier |
| `onScriptFunc(val, extraObj)` | Confirmation callback |
| `extraObj` | Opaque data passed to callback |

### `customKeyboard(data)`

Generic virtual keyboard — the text counterpart of `customNumpad`.

```javascript
Inscada.customKeyboard({
  initialValue: "",
  onScriptFunc: (value) => console.log("Entered:", value)
});
```

### `customStringValue(data)`

Lightweight text-input popup (no virtual keyboard).

```javascript
Inscada.customStringValue({
  initialValue: "notes",
  onScriptFunc: (value) => { /* ... */ }
});
```

### `confirm(type, title, message, object)`

Confirmation dialog. `type` controls the icon / color (`info`, `warning`, `error`, `success`).

```javascript
Inscada.confirm("warning", "Attention", "Stop the pump?", {
  onOkayFunc: () => {
    Inscada.setVariableValue("PumpRun", { value: false });
  }
});
```

### `showPasswordPopup(options)`

Password prompt; verification uses either a static password or a variable's value.

```javascript
// Static password
Inscada.showPasswordPopup({
  password: "1234",
  onPasswordVerified: () => { /* ... */ }
});

// Password stored in a variable
Inscada.showPasswordPopup({
  passwordVariableName: "SupervisorPassword",
  onPasswordVerified: () => { /* ... */ },
  numpad: true   // show a numpad for entry
});
```

### `objectEditor(data)`

Opens the given object in a JSON editor; on confirm, `onEditFunc` is called with the edited object.

```javascript
Inscada.objectEditor({
  obj: { gain: 1.0, offset: 0.0, threshold: 50 },
  onEditFunc: (updated) => {
    Inscada.setVariableValue("PidConfig", { value: JSON.stringify(updated) });
  }
});
```

## Popup / Animation / Page Navigation

### `showSystemPage(props)`

Navigate to one of the system pages (triggers the matching menu selection).

```javascript
Inscada.showSystemPage({
  systemPageName: "alarms"
  // pageData: { ... }   // optional — data available when the page opens
});
```

### `showMapPage(obj)`

Navigate to the map page and focus the map on a given coordinate/zoom.

```javascript
Inscada.showMapPage({
  lon: 29.0,
  lat: 41.0,
  zoom: 12
});
```

### `showAnimation(options)`

Swap the animation currently shown in the viewer.

```javascript
Inscada.showAnimation({
  name: "TankDetail",
  parameters: { tankId: 3 },   // optional — parameters for the target animation
  unselectMenu: true            // optional — clear menu selection
});
```

### `showParentAnimation(options)`

Swap the animation one level up from the current one (typical for drill-down "go back").

```javascript
Inscada.showParentAnimation({
  name: "MainView"
});
```

### `popupAnimation(obj)`

Open an animation in a popup window. If size is omitted, the popup auto-fits the SVG's own dimensions.

```javascript
Inscada.popupAnimation({
  animationName: "TankDetail",
  modal: true,
  width: 600,
  height: 400
});
```

Extended usage:

| Field | Description |
| --- | --- |
| `animationName` | Name of the animation to open (required) |
| `modal` | Lock the background (`true` / `false`) |
| `windowId` | Custom window ID (replaces a previous window with the same ID) |
| `leftPos` / `topPos` | Window position (pixels) |
| `width` / `height` | Size (omitted → use the SVG's own size) |
| `extraHeight` | Title-bar allowance for dynamic sizing (default 44 px) |
| `__parameters` | Parameters passed to the target animation |

### `closePopup(windowId)`

Close an open popup window by `windowId`.

```javascript
Inscada.closePopup("popupAnimationWindow12345");
```

## UI Controls

### `setUiVisibility(type, status)`

Show or hide parts of the main interface.

```javascript
Inscada.setUiVisibility("top-toolbar", false);
Inscada.setUiVisibility("top-menu", false);
Inscada.setUiVisibility("sidebar-collapse", true);
Inscada.setUiVisibility("animation-toolbar", false);
```

Valid `type` values:

| `type` | Effect |
| --- | --- |
| `"top-toolbar"` | Show / hide the top toolbar |
| `"top-menu"` | Show / hide the top menu and menu row |
| `"animation-toolbar"` | Show / hide the animation toolbar |
| `"sidebar-collapse"` | Collapse / expand the side menu |

### `setDayNightMode(isNight)`

Toggle day / night mode.

```javascript
Inscada.setDayNightMode(true);   // night
Inscada.setDayNightMode(false);  // day
```

### `reload()`

Reload the browser tab (`window.location.reload()`).

```javascript
Inscada.reload();
```

### `svgZoomPan(data)`

Programmatic zoom / pan control on an animation SVG.

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

Valid `functionName` values: `zoom`, `zoomBy`, `zoomAtPoint`, `zoomAtPointBy`, `zoomIn`, `zoomOut`, `pan`, `panBy`, `resetZoom`, `resetPan`, `reset`, `fit`, `center`.

## Audio

### `playAudio(isStart, name, isLoop)`

Play / stop an audio file stored in the File System. The same name cannot start twice concurrently.

```javascript
// Start (looping)
Inscada.playAudio(true, "alarm_siren.wav", true);

// Stop
Inscada.playAudio(false, "alarm_siren.wav", false);
```

| Parameter | Description |
| --- | --- |
| `isStart` | `true` to start, `false` to stop |
| `name` | Audio file name in the File System |
| `isLoop` | Loop mode (only meaningful when starting) |
