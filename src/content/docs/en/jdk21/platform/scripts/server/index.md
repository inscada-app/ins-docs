---
title: "Server-Side Script Engine"
description: "ins.* API — GraalJS engine, sandbox, scheduling and lifecycle"
sidebar:
  order: 0
  label: "Overview"
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Work in progress">
This page will be rewritten against the JDK21 source. For now it is a skeleton — serves as the entry for sub-API pages.
</Aside>

Server-side scripts (`ins.*`) run on the inSCADA server using the **GraalJS** engine with Nashorn compatibility mode enabled. Both your existing ES5 scripts (ported from JDK11) and modern JavaScript (ES2020+) features are supported.

## Scope

This page will document:

- **Engine:** GraalJS + `js.nashorn-compat: true`
- **Script sandbox** — isolated Java host access, `@HostAccess.Export`, eval/with disabled
- **Schedule types** — `PERIODIC`, `DAILY`, `ONCE`, `NONE`
- **Lifecycle** — compilation (Caffeine cache), execution (thread pool), cancellation, timeout
- **Resource limits** — `maxStatementCount` (default 100k), `executionTimeout` (default 60s)
- **Bindings** — `ins`, `user`, custom bindings
- **Sandbox restrictions** — no thread/native/IO/process access, polyglot off, Nashorn global stubs
- **Execution contexts** — scheduled scripts, variable/alarm/log expression, MQTT parse/publish

## ins.* Sub-APIs

| Module | Short description |
|--------|-------------------|
| Variable API | Read/write variables, logged value queries, stats |
| Connection API | Start/stop/update connection, device, frame |
| Alarm API | Alarms and alarm groups, fired alarm history |
| Trend API | Trend definitions and tag management |
| Datasource API | SQL (`runSql`) and InfluxQL (`runInfluxQL`) queries |
| Data Transfer API | File-based data transfer |
| Notification API | Email, SMS, web notification |
| Script API | Script scheduling, global object |
| Report API | Classic + Jasper report generation |
| Project API | Project info, location updates |
| Log API | Audit log write and query |
| System API | shutdown, restart, exec, setDateTime |
| User API | User listing, active sessions |
| I/O Utils API | REST, ping, file read/write, JSON |
| Utils API | uuid, date, bit ops, formatting |
| Language API | Localization (`loc`) |
| Keyword API | Metadata recording |
| Console API | `consoleLog` |
