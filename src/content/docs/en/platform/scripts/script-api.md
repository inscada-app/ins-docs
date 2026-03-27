---
title: "Script API"
description: "Script zamanlama, çalıştırma ve global nesne yönetimi"
sidebar:
  order: 7
---

Script API, diğer script'leri yönetme ve script'ler arası veri paylaşımı sağlar.

## Fonksiyonlar

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.scheduleScript(name)** | Script'i zamanlayıcısına göre başlat |
| **ins.cancelScript(name)** | Çalışan script'i durdur |
| **ins.executeScript(name)** | Script'i anında çalıştır, sonucu döndür |
| **ins.setGlobalObject(name, obj)** | Script'ler arası paylaşımlı nesne kaydet |
| **ins.getGlobalObject(name)** | Paylaşımlı nesneyi oku |
| **ins.setGlobalObject(name, obj, ms)** | TTL ile paylaşımlı nesne (otomatik silinir) |
