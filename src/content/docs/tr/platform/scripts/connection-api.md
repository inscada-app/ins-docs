---
title: "Connection API"
description: "Bağlantı başlatma, durdurma ve yapılandırma güncelleme"
sidebar:
  order: 2
---

Connection API, script'ler içinden haberleşme bağlantılarını yönetir.

## Bağlantı Kontrolü

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.startConnection(name)** | Bağlantıyı başlat |
| **ins.stopConnection(name)** | Bağlantıyı durdur |
| **ins.getConnectionStatus(name)** | Durum sorgula (CONNECTED/DISCONNECTED/ERROR) |
| **ins.getConnection(name)** | Bağlantı bilgilerini getir |

## Yapılandırma Güncelleme

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.updateConnection(name, map)** | Bağlantı parametrelerini güncelle |
| **ins.updateDevice(connName, devName, map)** | Cihaz parametrelerini güncelle |
| **ins.updateFrame(connName, devName, frameName, map)** | Frame parametrelerini güncelle |

### Örnek


