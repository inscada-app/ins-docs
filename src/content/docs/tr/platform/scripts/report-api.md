---
title: "Report API"
description: "Jasper rapor üretme, dışa aktarma ve e-posta gönderme"
sidebar:
  order: 8
---

Report API, Jasper Reports tabanlı rapor üretme ve dağıtım sağlar.

## Fonksiyonlar

| Fonksiyon | Açıklama |
|-----------|----------|
| **ins.scheduleReport(name)** | Rapor zamanla |
| **ins.cancelReport(name)** | Rapor iptal et |
| **ins.mailReport(name, start, end)** | Rapor üret ve e-posta gönder |
| **ins.mailJasperReport(name, params, users, subject, content)** | Parametreli PDF rapor gönder |
| **ins.exportJasperPdfToFile(name, path)** | PDF dosyası kaydet |
| **ins.exportJasperExcelToFile(name, path)** | Excel dosyası kaydet |
