---
title: "Datasource API"
description: "Server-side SQL and InfluxQL queries"
sidebar:
  order: 11
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Work in progress">
This page will be written against the JDK21 source. Placeholder only for now.
</Aside>

Datasource API lets scripts issue relational (SQL) and time-series (InfluxQL) queries from within scripts.

## Scope

- `ins.runSql(sql)` — SQL against the default datasource
- `ins.runSql(datasourceName, sql)` — against a named external datasource
- `ins.runSql(url, username, password, sql)` — direct JDBC connection
- `ins.runInfluxQL(influxQL)` — InfluxDB time-series query
- `ins.runInfluxQL(datasourceName, influxQL)` — named InfluxDB datasource
- `ins.getCustomSqlQuery(name)` — fetch a saved SQL template
- `ins.getCustomInfluxQLQuery(name)` — fetch a saved InfluxQL template

Return shape (`QueryResultDto`): `columns` (string[]) + `rows` (Object[][]).
