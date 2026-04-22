---
title: "I/O Utils API"
description: "HTTP (REST), ping, dosya okuma/yazma, JSON"
sidebar:
  order: 16
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Hazırlanıyor">
Bu sayfa JDK21 kaynak koduna göre yazılacak. Şimdilik yer tutucu.
</Aside>

I/O Utils API, script'in sunucu tarafından dış HTTP servisleri, ağ testleri, dosya sistemi ve JSON serializasyonu ile etkileşimini sağlar. JDK11'de Utils API içindeki bu metodlar JDK21'de ayrı bir alt API olarak yapılandırıldı.

## Kapsam

- `ins.rest(httpMethod, url, contentType, body)` — basit HTTP çağrısı
- `ins.rest(httpMethod, url, headers, body)` — özel header'larla HTTP çağrısı
- `ins.ping(address, timeout)` — ICMP/reachable kontrolü
- `ins.ping(address, port, timeout)` — TCP port testi
- `ins.readFile(fileName)` — dosya içeriğini String olarak okur
- `ins.readFileAsBytes(fileName)` — dosya içeriğini byte[] olarak okur
- `ins.writeToFile(fileName, text)` — dosyaya yazar (overwrite, append parametresi yoktur)
- `ins.toJSONStr(object)` — JS/Java nesnesini JSON string'e çevirir
