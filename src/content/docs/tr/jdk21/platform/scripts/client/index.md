---
title: "Client-Side Script API"
description: "Inscada.* — tarayıcıda çalışan client-side script API"
sidebar:
  order: 0
  label: "Genel Bakış"
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Hazırlanıyor">
Bu sayfa JDK21 kaynak koduna göre yazılacak. Şimdilik yer tutucu.
</Aside>

Client-side script API (`Inscada.*`), **tarayıcıda** çalışan JavaScript kodunun inSCADA platformu ile konuşmasını sağlar. JDK21'de yeni olan bu API, server-side `ins.*` ile tamamen ayrıdır.

## Kapsam

- **Nerede çalışır:** custom HTML widget (sandboxed iframe), animation click script, dashboard widget
- **Bootstrap:** `new InscadaApi(projectName)` — 19 domain alt-API prototipi tek obje üzerinde merge edilir
- **postMessage köprüsü** (`InscadaBridge`) — sandboxed iframe'ler parent frame'e `INSCADA_API_CALL` mesajı gönderir, origin doğrulaması sonrası metod çalıştırılır, `INSCADA_API_RESPONSE` olarak sonuç döner
- **İki tip metod:**
  1. **Mirror metodlar** — server-side `ins.*` karşılıklarını async olarak çağırır (`/scripts/call-api` üzerinden)
  2. **UI-only metodlar** — yalnızca tarayıcıda anlamlı olan (numpad, confirm, popupAnimation, showMapPage, playAudio, setDayNightMode, vs.)

## UI-only Metodlar

`Inscada.*` içinde bulunan UI-only metodları ayrı bir sayfada detaylı belgelenecek: [UI API →](/docs/tr/jdk21/platform/scripts/client/ui-api/)

## Mirror (Server-side) Metodlar

Aşağıdaki alt API'lerin tüm server-side metodları client-side'da async olarak mevcuttur:

- Alarm, Connection, Console, Data Transfer, Datasource, I/O Utils, Keyword, Language, Log, Notification, Project, Report, Script, System, Trend, User, Utils, Variable

Client'tan çağırım örneği:

```javascript
const api = new InscadaApi("myProject");
const result = await api.getVariableValue("Temperature_C");
console.log(result.value);
```
