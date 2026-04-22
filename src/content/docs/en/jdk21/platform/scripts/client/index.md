---
title: "Client-Side Script API"
description: "Inscada.* — browser-side scripting API"
sidebar:
  order: 0
  label: "Overview"
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Work in progress">
This page will be written against the JDK21 source. Placeholder only for now.
</Aside>

The client-side script API (`Inscada.*`) lets JavaScript code running **in the browser** talk to the inSCADA platform. New in JDK21, this API is fully separate from the server-side `ins.*`.

## Scope

- **Where it runs:** custom HTML widget (sandboxed iframe), animation click scripts, dashboard widgets
- **Bootstrap:** `new InscadaApi(projectName)` — 19 domain sub-API prototypes are merged onto one object
- **postMessage bridge** (`InscadaBridge`) — sandboxed iframes post `INSCADA_API_CALL` messages to the parent frame; after origin validation the call runs and returns `INSCADA_API_RESPONSE`
- **Two kinds of methods:**
  1. **Mirror methods** — asynchronously invoke their server-side `ins.*` counterpart (via `/scripts/call-api`)
  2. **UI-only methods** — only meaningful in the browser (numpad, confirm, popupAnimation, showMapPage, playAudio, setDayNightMode, …)

## UI-only Methods

UI-only methods are documented on a separate page: [UI API →](/docs/en/jdk21/platform/scripts/client/ui-api/)

## Mirror (Server-side) Methods

All server-side methods of the following sub-APIs are available asynchronously on the client:

- Alarm, Connection, Console, Data Transfer, Datasource, I/O Utils, Keyword, Language, Log, Notification, Project, Report, Script, System, Trend, User, Utils, Variable

Example client call:

```javascript
const api = new InscadaApi("myProject");
const result = await api.getVariableValue("Temperature_C");
console.log(result.value);
```
