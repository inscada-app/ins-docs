---
title: "Language API"
description: "Lokalizasyon anahtarlarından metin elde etme"
sidebar:
  order: 14
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Hazırlanıyor">
Bu sayfa JDK21 kaynak koduna göre yazılacak. Şimdilik yer tutucu.
</Aside>

Language API, platformun lokalizasyon sözlüğünden anahtar üzerinden metin çekmek için kullanılır.

## Kapsam

- `ins.loc(lang, key)` — belirtilen dil kodunda (`tr`, `en` …) anahtara karşılık gelen çevirir
