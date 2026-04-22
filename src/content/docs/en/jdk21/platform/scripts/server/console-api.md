---
title: "Console API"
description: "Script log output"
sidebar:
  order: 18
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Work in progress">
This page will be written against the JDK21 source. Placeholder only for now.
</Aside>

Console API lets a script emit debug or log output during execution. Output lands in the script console and project logs.

## Scope

- `ins.consoleLog(obj)` — object / string / number — writes to the script console
