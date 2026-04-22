---
title: "I/O Utils API"
description: "HTTP (REST), ping, file read/write, JSON"
sidebar:
  order: 16
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Work in progress">
This page will be written against the JDK21 source. Placeholder only for now.
</Aside>

I/O Utils API lets server-side scripts interact with external HTTP services, network checks, the file system and JSON serialization. In JDK11 these methods lived inside Utils API; JDK21 separates them into their own sub-API.

## Scope

- `ins.rest(httpMethod, url, contentType, body)` — simple HTTP call
- `ins.rest(httpMethod, url, headers, body)` — HTTP call with custom headers
- `ins.ping(address, timeout)` — ICMP / reachability check
- `ins.ping(address, port, timeout)` — TCP port check
- `ins.readFile(fileName)` — read file contents as String
- `ins.readFileAsBytes(fileName)` — read file contents as byte[]
- `ins.writeToFile(fileName, text)` — write to file (overwrite; no `append` argument)
- `ins.toJSONStr(object)` — serialize a JS/Java object to JSON string
