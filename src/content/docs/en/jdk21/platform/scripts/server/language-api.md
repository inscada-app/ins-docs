---
title: "Language API"
description: "Fetch localized strings by key"
sidebar:
  order: 14
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Work in progress">
This page will be written against the JDK21 source. Placeholder only for now.
</Aside>

Language API lets scripts fetch translated text from the platform's localization catalog.

## Scope

- `ins.loc(lang, key)` — returns the translation for `key` in the given language code (`tr`, `en`, …)
