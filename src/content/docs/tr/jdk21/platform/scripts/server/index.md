---
title: "Server-Side Script Engine"
description: "ins.* API — GraalJS motor, sandbox, scheduling ve yaşam döngüsü"
sidebar:
  order: 0
  label: "Genel Bakış"
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Hazırlanıyor">
Bu sayfa JDK21 kaynak koduna göre yeniden yazılacak. Şimdilik yalnızca iskelet — alt API sayfaları için giriş görevi görür.
</Aside>

Server-side scripts (`ins.*`) inSCADA sunucusunda **GraalJS** motoruyla çalışır ve Nashorn uyumluluk modu aktiftir. Bu sayede hem mevcut ES5 script'leriniz (JDK11'den taşınan) hem de modern JavaScript özellikleri (ES2020+) desteklenir.

## Kapsam

Bu sayfada şunlar belgelenecek:

- **Engine:** GraalJS + `js.nashorn-compat: true`
- **Script sandbox** — izole Java host access, `@HostAccess.Export`, eval/with kapalı
- **Zamanlama tipleri** — `PERIODIC`, `DAILY`, `ONCE`, `NONE`
- **Yaşam döngüsü** — derleme (Caffeine cache), yürütme (thread pool), iptal, timeout
- **Kaynak limitleri** — `maxStatementCount` (default 100k), `executionTimeout` (default 60s)
- **Binding'ler** — `ins`, `user`, custom bindings
- **Sandbox kısıtları** — thread/native/IO/process yasağı, polyglot kapalı, Nashorn global stub'ları
- **Hangi bağlamda çalışır** — zamanlanmış scripts, variable/alarm/log expression, MQTT parse/publish

## ins.* Alt API'leri

| Modül | Kısa açıklama |
|-------|--------------|
| Variable API | Değişken okuma/yazma, loglu değer sorguları, stats |
| Connection API | Bağlantı/Device/Frame başlatma, durdurma, güncelleme |
| Alarm API | Alarm ve alarm grupları, fired alarm geçmişi |
| Trend API | Trend tanımları ve tag yönetimi |
| Datasource API | SQL (`runSql`) ve InfluxQL (`runInfluxQL`) sorguları |
| Data Transfer API | Dosya tabanlı veri aktarımı |
| Notification API | E-posta, SMS, web bildirim |
| Script API | Script zamanlama, global object |
| Report API | Classic + Jasper rapor üretimi |
| Project API | Proje bilgileri, lokasyon güncelleme |
| Log API | Denetim logu yazma ve sorgulama |
| System API | shutdown, restart, exec, setDateTime |
| User API | Kullanıcı listesi, aktif oturumlar |
| I/O Utils API | REST, ping, file read/write, JSON |
| Utils API | uuid, tarih, bit işlemleri, format |
| Language API | Lokalizasyon (`loc`) |
| Keyword API | Meta veri kaydı |
| Console API | `consoleLog` |
