---
title: "Notification API"
description: "E-posta, SMS ve web bildirim gönderme"
sidebar:
  order: 6
---

Notification API, e-posta, SMS ve web bildirimi gönderme sağlar.

## Fonksiyonlar

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.sendMail(users, subject, content)** | E-posta gönder |
| **ins.sendMail(users, subject, content, html)** | HTML e-posta gönder |
| **ins.sendSMS(users, message)** | SMS gönder |
| **ins.sendSMS(users, message, provider)** | Belirli sağlayıcı ile SMS |
| **ins.notify(type, title, message)** | Web bildirimi gönder |

### Örnek


