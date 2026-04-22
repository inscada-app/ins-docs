---
title: "Client-Side Script API"
description: "Inscada.* — browser-side scripting API introduced in JDK21"
sidebar:
  order: 0
  label: "Overview"
---

The client-side script API (`Inscada.*`) lets JavaScript running **in the browser** talk to the inSCADA platform. Introduced in JDK21, this API is entirely separate from server-side `ins.*`: different runtime, different binding, different set of capabilities.

## Where It Runs

| Context | Description |
| --- | --- |
| **Animation Click Script** | Script that runs when an SVG animation element is clicked |
| **Custom HTML Widget** | Custom HTML panels under Dashboard and Platform Guide — rendered inside a sandboxed iframe |
| **Dashboard Widget** | Client scripts inside GridStack-based dashboard widgets |

The `Inscada` global (or `new InscadaApi(projectName)`) is available in all of these contexts.

## Architecture

The client-side API is built by merging 19 domain sub-API prototypes onto a single `InscadaApi` class. This happens once at application startup and yields one unified object.

```
InscadaApi.prototype
  ├── AlarmApi methods
  ├── ConnectionApi methods
  ├── ConsoleApi methods
  ├── DataTransferApi methods
  ├── DatasourceApi methods
  ├── IOUtilsApi methods
  ├── KeywordApi methods
  ├── LanguageApi methods
  ├── LogApi methods
  ├── NotificationApi methods
  ├── ProjectApi methods
  ├── ReportApi methods
  ├── ScriptApi methods
  ├── SystemApi methods
  ├── TrendApi methods
  ├── UIApi methods          ← only meaningful in the browser (numpad, confirm, popup, zoom, …)
  ├── UserApi methods
  ├── UtilsApi methods
  └── VariableApi methods
```

Source: `ui/sources/models/api/bootstrapApi.js`

## Two Kinds of Methods

**1. Mirror methods** — async counterparts of server-side `ins.*` methods. Under the hood they POST to `/scripts/call-api` and return a Promise. The exact same Java method runs on the server, with the same constraints and security.

```javascript
const api = new InscadaApi("myProject");
const result = await api.getVariableValue("Temperature_C");
console.log(result.value);
```

Mirror methods exist for every sub-API: Alarm, Connection, Console, Data Transfer, Datasource, I/O Utils, Keyword, Language, Log, Notification, Project, Report, Script, System, Trend, User, Utils, Variable. Signatures match the [server API pages](/docs/en/jdk21/platform/scripts/server/) — the only difference is that `await` is required on the client.

**2. UI-only methods** — only meaningful in the browser. They have no server-side equivalent (a server can't open a numpad).

```javascript
const api = new InscadaApi("myProject");
api.numpad({ variableName: "SetpointTemperature" });
await api.confirm("warning", "Attention", "Stop the pump?", {
    onOkayFunc: () => api.setVariableValue("PumpRun", { value: false })
});
```

Full list of UI-only methods: [Client UI API →](/docs/en/jdk21/platform/scripts/client/ui-api/)

## Sandboxed Iframe Bridge

Custom HTML widgets are rendered inside a **sandboxed iframe** (HTML5 `sandbox="allow-scripts allow-forms"`). The widget's JavaScript cannot reach the parent window directly; instead a `postMessage`-based bridge — `InscadaBridge` — handles the call.

### Flow

1. Inside the widget, `new InscadaApi(projectName)` creates a new API instance.
2. When the widget invokes a method (`api.getVariableValue(...)`), the proxy posts a message to the parent window:
   ```
   { type: "INSCADA_API_CALL", method: "getVariableValue", args: [...], requestId, projectName }
   ```
3. The parent's `InscadaBridge` validates the origin (only the `null` sandbox origin and registered frontend origins are accepted).
4. The bridge invokes `method` on the `InscadaApi` instance and posts back:
   ```
   { type: "INSCADA_API_RESPONSE", requestId, payload | error }
   ```
5. The widget's proxy resolves or rejects the Promise.

Source: `ui/sources/models/inscadaBridge.js`

### Security

- The bridge only accepts messages from registered origins: `getAppUrl()`, `getFrontendUrl()`, and `null` (sandbox iframe origin).
- Every call must include `projectName`; widgets cannot forge a `projectName` as the bridge validates it.
- The bridge can only invoke methods defined on `InscadaApi.prototype`. Calling an unknown method returns an error.
- For animation-click and custom HTML widget calls, the bridge propagates `_callerAnimName` to UI methods so popups target the correct animation.

## Callback Rehydration

`postMessage` only carries serializable data — functions can't cross the boundary. The bridge uses a marker scheme to work around this:

- If an argument is a function (`onScriptFunc`, `onOkayFunc`, `callback`, …), the widget side marks it as `{ __isCallback: true, callbackId: "..." }`.
- The parent side rehydrates this into a real function; invoking it sends a `{ type: "INVOKE_CALLBACK", callbackId, callbackArgs }` message back to the widget.
- The widget matches the callback to its original function and runs it.

Net effect: callback-bearing methods like `customNumpad({ onScriptFunc: (xval) => ... })` work transparently from inside the sandbox.

## Typical Widget Pattern

Minimal custom HTML widget:

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
  <button id="btn">Enter setpoint</button>
  <div id="out"></div>
  <script>
    const api = new InscadaApi("myProject");

    document.getElementById("btn").addEventListener("click", () => {
      api.numpad({ variableName: "SetpointTemperature" });
    });

    async function refresh() {
      const v = await api.getVariableValue("Temperature_C");
      document.getElementById("out").textContent = `T = ${v.value} °C`;
    }

    setInterval(refresh, 1000);
    refresh();
  </script>
</body>
</html>
```

:::tip
You **can't use server-side `ins.*` inside a widget** — that runs in a JVM engine on the server. Instead, call the server asynchronously through `Inscada.*`'s mirror methods.
:::
