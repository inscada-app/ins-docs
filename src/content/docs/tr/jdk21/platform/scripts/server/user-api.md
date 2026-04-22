---
title: "User API"
description: "Kullanıcı listesi, aktif oturumlar, kimlik doğrulama denemeleri"
sidebar:
  order: 10
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Hazırlanıyor">
Bu sayfa JDK21 kaynak koduna göre yazılacak. Şimdilik yer tutucu.
</Aside>

User API, platformdaki kullanıcıları ve oturum durumlarını sorgulamak için kullanılır.

## Kapsam

- `ins.getAllUsernames()` — sistemdeki tüm kullanıcı adları (`Collection<String>`)
- `ins.getLoggedInUsers()` — aktif oturum açmış kullanıcılar
- `ins.getLastAuthAttempts()` — son kimlik doğrulama denemeleri (`Collection<AuthAttemptDto>`)
