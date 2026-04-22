---
title: "Console API"
description: "Script log çıktısı"
sidebar:
  order: 18
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Hazırlanıyor">
Bu sayfa JDK21 kaynak koduna göre yazılacak. Şimdilik yer tutucu.
</Aside>

Console API, script çalışma sırasında debug çıktısı veya log üretmek için kullanılır. Çıktı platformun script console'una ve proje loglarına düşer.

## Kapsam

- `ins.consoleLog(obj)` — obje / string / sayı — script console'a yazar
