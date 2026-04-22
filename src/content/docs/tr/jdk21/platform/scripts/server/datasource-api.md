---
title: "Datasource API"
description: "Server-side SQL ve InfluxQL sorguları"
sidebar:
  order: 11
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Hazırlanıyor">
Bu sayfa JDK21 kaynak koduna göre yazılacak. Şimdilik yer tutucu.
</Aside>

Datasource API, script'ler içinden relational (SQL) ve time-series (InfluxQL) veri kaynaklarına sorgu göndermek için kullanılır.

## Kapsam

- `ins.runSql(sql)` — varsayılan veritabanında SQL
- `ins.runSql(datasourceName, sql)` — tanımlı dış veri kaynağında
- `ins.runSql(url, username, password, sql)` — doğrudan JDBC bağlantısı
- `ins.runInfluxQL(influxQL)` — InfluxDB zaman serisi sorgusu
- `ins.runInfluxQL(datasourceName, influxQL)` — tanımlı InfluxDB kaynağı
- `ins.getCustomSqlQuery(name)` — kayıtlı SQL şablonu
- `ins.getCustomInfluxQLQuery(name)` — kayıtlı InfluxQL şablonu

Dönüş formatı (`QueryResultDto`): `columns` (string[]) + `rows` (Object[][]).
