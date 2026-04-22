---
title: "Keyword API"
description: "Record metadata / keywords from a script"
sidebar:
  order: 15
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Work in progress">
This page will be written against the JDK21 source. Placeholder only for now.
</Aside>

Keyword API lets a running script persist free-form metadata (keywords).

## Scope

- `ins.saveKeyword(objectMap)` — key/value metadata record (`Map<String, Object>`)
