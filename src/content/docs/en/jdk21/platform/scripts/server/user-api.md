---
title: "User API"
description: "User listing, active sessions, authentication attempts"
sidebar:
  order: 10
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Work in progress">
This page will be written against the JDK21 source. Placeholder only for now.
</Aside>

User API is used to query users and session state on the platform.

## Scope

- `ins.getAllUsernames()` — all user names (`Collection<String>`)
- `ins.getLoggedInUsers()` — currently logged-in users
- `ins.getLastAuthAttempts()` — recent authentication attempts (`Collection<AuthAttemptDto>`)
