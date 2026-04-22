---
title: "Client-Side Script API"
description: "Inscada.* — tarayıcıda çalışan, JDK21 ile gelen client-side script API"
sidebar:
  order: 0
  label: "Genel Bakış"
---

Client-side script API (`Inscada.*`), **tarayıcıda** çalışan JavaScript kodunun inSCADA platformuyla konuşmasını sağlar. JDK21 ile gelen bu API, server-side `ins.*`'tan tamamen ayrıdır: farklı runtime, farklı binding, farklı yetenek kümesi.

## Nerede Çalışır?

| Bağlam | Açıklama |
| --- | --- |
| **Animation Click Script** | SVG animasyon öğesine tıklandığında çalışan script |
| **Custom HTML Widget** | Dashboard ve Platform Guide altındaki custom HTML pencereleri — sandboxed iframe olarak render edilir |
| **Dashboard Widget** | GridStack tabanlı dashboard'da widget içinde çalışan client script |

Bu bağlamların hepsinde `Inscada` global objesi (ya da `new InscadaApi(projectName)`) kullanılabilir.

## Mimari

Client-side API, 19 domain alt-API prototipinin tek bir `InscadaApi` sınıfına merge edilmesiyle oluşur. Bu işlem uygulama başlangıcında bir kez yapılır ve sonuçta tek bir birleşik obje ortaya çıkar.

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
  ├── UIApi methods          ← yalnızca tarayıcıda anlamlı (numpad, confirm, popup, zoom, …)
  ├── UserApi methods
  ├── UtilsApi methods
  └── VariableApi methods
```

Kod konumu: `ui/sources/models/api/bootstrapApi.js`

## İki Tip Metod

**1. Mirror metodlar** — server-side `ins.*` metodlarının async karşılıkları. İç yapıda `/scripts/call-api` endpoint'ine POST atar, sonuç Promise olarak döner. Sunucuda tam olarak aynı Java metodu çalışır, aynı kısıtlar ve güvenlik geçerlidir.

```javascript
const api = new InscadaApi("myProject");
const result = await api.getVariableValue("Temperature_C");
console.log(result.value);
```

Mirror metodlar tüm alt API'lerde bulunur: Alarm, Connection, Console, Data Transfer, Datasource, I/O Utils, Keyword, Language, Log, Notification, Project, Report, Script, System, Trend, User, Utils, Variable. İmzalar ilgili [server API sayfaları](/docs/tr/jdk21/platform/scripts/server/) ile özdeştir — farkı yalnızca client'ta `await` gerekmesidir.

**2. UI-only metodlar** — yalnızca tarayıcıda anlamlı olanlar. Server-side'da karşılığı yoktur (sunucu bir numpad açamaz).

```javascript
const api = new InscadaApi("myProject");
api.numpad({ variableName: "SetpointTemperature" });
await api.confirm("warning", "Dikkat", "Pompa durdurulsun mu?", {
    onOkayFunc: () => api.setVariableValue("PumpRun", { value: false })
});
```

UI-only metodların tam listesi: [Client UI API →](/docs/tr/jdk21/platform/scripts/client/ui-api/)

## Sandboxed Iframe Köprüsü

Custom HTML widget'lar **sandboxed iframe** içinde render edilir (HTML5 `sandbox="allow-scripts allow-forms"`). Widget'ın JavaScript kodu parent window'a doğrudan erişemez; bunun yerine `InscadaBridge` ile `postMessage` tabanlı bir köprü kurulur.

### Akış

1. Widget içinde `new InscadaApi(projectName)` yeni bir API instance'ı oluşturur.
2. Widget bir metod çağırdığında (`api.getVariableValue(...)`), proxy parent window'a şu mesajı gönderir:
   ```
   { type: "INSCADA_API_CALL", method: "getVariableValue", args: [...], requestId, projectName }
   ```
3. Parent'taki `InscadaBridge` origin doğrular (yalnızca `null` sandbox origin'i ve tanımlı frontend origin'leri kabul eder).
4. Bridge `method`'u `InscadaApi` instance'ında çalıştırır, sonucu döner:
   ```
   { type: "INSCADA_API_RESPONSE", requestId, payload | error }
   ```
5. Widget'ın proxy'si Promise'ı resolve/reject eder.

Kod konumu: `ui/sources/models/inscadaBridge.js`

### Güvenlik

- Bridge yalnızca tanımlı origin'lerden gelen mesajları kabul eder: `getAppUrl()`, `getFrontendUrl()` ve `null` (sandbox iframe origin'i).
- Her çağrıda `projectName` zorunludur; Widget sahte `projectName` enjekte etmek isterse bridge'in kendi `projectName` doğrulamasına takılır.
- Bridge yalnızca `InscadaApi.prototype`'ta tanımlı metodları çağırabilir. Proto'da olmayan bir metod istenirse hata döner.
- Animation click / custom HTML widget çağrılarında bridge `_callerAnimName` bilgisini UI metodlarına iletir (popup'ların doğru animasyonu hedeflemesi için).

## Callback Rehydration

`postMessage` sadece serileştirilebilir veriyi taşır — fonksiyon aktarılamaz. Bridge bunun için bir işaretleme mekanizması kullanır:

- Argüman bir fonksiyon ise (`onScriptFunc`, `onOkayFunc`, `callback` gibi) widget tarafı onu `{ __isCallback: true, callbackId: "..." }` şeklinde işaretler.
- Parent tarafı bunu rehydrate eder — gerçek bir fonksiyonla değiştirir; bu fonksiyon tetiklendiğinde parent widget'a `{ type: "INVOKE_CALLBACK", callbackId, callbackArgs }` mesajı gönderir.
- Widget callback'i orijinal fonksiyonuyla eşleştirip çalıştırır.

Sonuç: `customNumpad({ onScriptFunc: (xval) => ... })` gibi callback'li metodlar sandbox içinden şeffaf şekilde çalışır.

## Tipik Widget Kalıbı

Minimal bir custom HTML widget içeriği:

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
  <button id="btn">Setpoint gir</button>
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
Widget içinden **server-side `ins.*`'ı kullanamazsın** — orası sunucuda çalışan bir JVM engine. Bunun yerine `Inscada.*`'ın mirror metodları aracılığıyla async olarak server'ı çağırırsın.
:::
