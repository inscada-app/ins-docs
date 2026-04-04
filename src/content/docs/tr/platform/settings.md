---
title: "Ayarlar"
description: "inSCADA platform ayarlari: e-posta, SMS, OTP, giris ekrani, IP filtresi, logo, harita ve yayin"
sidebar:
  order: 10
---

Ayarlar menusu, inSCADA platformunun genel yapilandirmasini icerir. Bu menuye erisim icin kullanicinin ilgili yetkilere sahip olmasi gerekir.

## E-posta (Email)

inSCADA'nin bildirim, alarm ve OTP e-postalari gondermesi icin SMTP sunucu yapilandirmasi.

| Alan | Aciklama |
|------|----------|
| **Host** | SMTP sunucu adresi (ornegin `smtp.gmail.com`) |
| **Port** | SMTP portu (ornegin `587`) |
| **Protocol** | Baglanti protokolu: `SMTP`, `SMTPS` veya `SMTP_TLS` |
| **From Address** | Gonderici e-posta adresi |
| **Username** | SMTP kimlik dogrulama kullanici adi |
| **Password** | SMTP sifresi |

> **Not:** E-posta ayarlari yapilandirilmadan `ins.sendMail()` script fonksiyonu ve e-posta tabanli alarm bildirimleri calismaz.

## SMS

SMS bildirimleri icin saglayici yapilandirmasi. Uc farkli saglayici desteklenir:

### Dataport

| Alan | Aciklama |
|------|----------|
| **Username** | Dataport hesap kullanici adi |
| **Password** | Hesap sifresi |
| **Account Number** | Dataport hesap numarasi |
| **Short Number** | Kisa numara |
| **Originator** | Gonderici kimlibi |
| **Operator** | Turkcell, Avea, Vodafone veya Superonline |
| **Is Default** | Varsayilan saglayici olarak ayarla |

### Twilio

| Alan | Aciklama |
|------|----------|
| **Account SID** | Twilio hesap SID'i |
| **Auth Token** | Twilio dogrulama token'i |
| **Twilio Number** | Twilio telefon numarasi |
| **Is Default** | Varsayilan saglayici olarak ayarla |

### Netgsm

| Alan | Aciklama |
|------|----------|
| **Username** | Netgsm hesap kullanici adi |
| **Password** | Hesap sifresi |
| **Header** | SMS baslibi / gonderici kimlibi |
| **Bayi Code** | Bayi kodu (istege bagli) |
| **Is Default** | Varsayilan saglayici olarak ayarla |

> **Not:** Birden fazla saglayici tanimlanabilir. **Is Default** isaretlenen saglayici, SMS gonderimlerinde varsayilan olarak kullanilir.

## OTP (Tek Kullanimlik Sifre)

Giris sirasinda iki faktorlu dogrulama icin OTP yapilandirmasi. OTP, e-posta veya SMS ile gonderilebilir.

**Desteklenen OTP yontemleri:**

| Yontem | Saglayici | Aciklama |
|--------|-----------|----------|
| E-posta | Default | SMTP uzerinden OTP kodu gonderir |
| SMS | Dataport | Dataport uzerinden SMS ile OTP |
| SMS | Twilio | Twilio uzerinden SMS ile OTP |
| SMS | Netgsm | Netgsm uzerinden SMS ile OTP |

E-posta tabanli OTP icin ayri bir SMTP yapilandirmasi yapilir (ana e-posta ayarlarindan babimsiz).

OTP ayarlarinda **Test** butonu ile yapilandirmanin dogru calistigini dogrulayabilirsiniz.

## Giris Ekrani

Giris sayfasinin gorunumunu ozellestirme.

| Alan | Aciklama |
|------|----------|
| **Background Image** | Giris sayfasi arka plan gorseli (sadece JPG) |
| **Alignment** | Gorsel hizalama: Left, Right veya Center |

## IP Filtresi

Platforma erisimi belirli IP adresleriyle sinirlandirma.

| Alan | Aciklama |
|------|----------|
| **Allowed IPs** | Erisime izin verilen IP adresleri listesi (her satira bir IP) |

> **Uyari:** IP filtresi etkinlestirildiginde, listede olmayan IP adreslerinden giris yapilamaz. Yanlis yapilandirma durumunda platforma erisim kaybedilebilir.

## Logo

Platform arayuzundeki logo gorunumunu ozellestirme.

| Alan | Aciklama |
|------|----------|
| **Sidebar Logo** | Sol menude gorunen logo (sadece PNG) |
| **Sidebar Logo Height** | Logo yuksekligi (piksel) |
| **Show Top Logo** | Ust barda logo gosterimi acik/kapali |

## Harita (Map)

Harita ve hava durumu servisleri icin API anahtar yapilandirmasi.

| Alan | Aciklama |
|------|----------|
| **Map API Key** | Harita servisi API anahtari |
| **Weather API Key** | Hava durumu servisi API anahtari |

> **Not:** Harita API anahtari yapilandirilmadan proje harita gorunumu calismaz.

## Yayin (Broadcast)

Canli yayin/stream sunucu yapilandirmasi.

| Alan | Aciklama |
|------|----------|
| **Server IP** | Yayin sunucusu IP adresi |
| **Application Name** | Yayin uygulama adi |
