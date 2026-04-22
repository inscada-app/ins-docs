---
title: "Notification API"
description: "Web notifications, email (plain + HTML multipart) and SMS delivery"
sidebar:
  order: 6
---

Notification API sends **web notifications**, **email** and **SMS** to platform users from scripts. All three are addressed by platform usernames (`username[]`) — the actual email address / phone number comes from the user's profile.

## Web Notifications

### `ins.notify(type, title, message)`

Pushes a web notification to every connected UI client (webix clients); it appears as a popup in the interface.

```javascript
ins.notify("info", "Shift", "Shift change complete");
```

| `type` | Appearance |
| --- | --- |
| `"info"` | Info (blue) |
| `"success"` | Success (green) |
| `"warning"` | Warning (yellow) |
| `"error"` | Error (red) |

```javascript
var temp = ins.getVariableValue("Temperature_C").value;
if (temp > 60) {
    ins.notify("warning", "Temperature warning",
        "Panel temperature " + temp + "°C — limit 60°C");
}
```

## Email

### `ins.sendMail(usernames[], subject, content)`

Sends a **plain text** email to the given platform users.

```javascript
ins.sendMail(
    ["operator1", "supervisor"],
    "Daily report",
    "Today's total production: 1250 kWh"
);
```

### `ins.sendMail(usernames[], subject, content, htmlContent)`

Sends a **multipart/alternative** email — both the plain text body (`content`) and the HTML body (`htmlContent`) travel in the same message; the email client shows whichever it supports.

```javascript
var power = ins.getVariableValue("ActivePower_kW").value;
var voltage = ins.getVariableValue("Voltage_V").value;

var textBody = "Energy Report\n"
    + "Active Power: " + power + " kW\n"
    + "Voltage: " + voltage + " V\n";

var htmlBody = "<h2>Energy Report</h2>"
    + "<table border='1' cellpadding='6'>"
    + "<tr><td>Active Power</td><td>" + power + " kW</td></tr>"
    + "<tr><td>Voltage</td><td>" + voltage + " V</td></tr>"
    + "</table>";

ins.sendMail(["manager"], "Energy Report", textBody, htmlBody);
```

:::note
`htmlContent` is a **String** parameter (not a boolean flag). Passing `null` for it sends plain-text only; when both carry content, the client may render the HTML alternative.
:::

:::caution
Email requires an SMTP configuration under **Settings → Email Settings**. Every recipient user must have a valid email address on their profile — otherwise they are skipped.
:::

## SMS

### `ins.sendSMS(usernames[], message)`

Sends an SMS through the platform's **default** SMS provider.

```javascript
ins.sendSMS(["oncall_engineer"], "ALARM: Transformer temperature critical!");
```

### `ins.sendSMS(usernames[], message, provider)`

Sends via a specific SMS provider (if multiple are configured).

```javascript
ins.sendSMS(["operator"], "Maintenance reminder", "NetGSM");
```

:::caution
SMS requires an SMS provider configured under **Settings → SMS Settings**, and each user profile must have a valid phone number.
:::

## Example: Multi-Channel Critical Alarm

```javascript
function main() {
    var temp = ins.getVariableValue("TransformerTemp_C").value;
    if (temp < 85) return;

    var msg = "Transformer temperature: " + temp + "°C — limit 85°C";

    // 1) Instant UI notification for everyone
    ins.notify("error", "Critical temperature", msg);

    // 2) SMS to on-call staff
    ins.sendSMS(["oncall_engineer", "shift_supervisor"], msg);

    // 3) Rich email to management
    var html = "<h3 style='color:#c0392b'>Critical Temperature</h3>"
        + "<p>" + msg + "</p>"
        + "<p>Time: " + ins.now() + "</p>";
    ins.sendMail(["plant_manager"], "[CRITICAL] Transformer Temperature", msg, html);

    ins.writeLog("ERROR", "TempWatch", msg);
}
main();
```
