---
title: "REST API Genel Bakış"
description: "inSCADA REST API — kimlik doğrulama, ortak başlıklar ve yanıt formatı"
sidebar:
  order: 1
---

inSCADA tamamen RESTful bir platformdur. Değişken okuma/yazma, proje yönetimi, alarm sorgulama, bağlantı kontrolü — her şey REST API üzerinden yapılabilir.

:::tip[Tam Endpoint Referansı]
Bu sayfa kimlik doğrulama ve ortak kuralları açıklar. Her controller'ın her endpoint'i için interaktif, parametre-seviyesinde dokümantasyon için **[REST API Reference](/docs/jdk21/api/reference/)** bölümüne bakın — platformun OpenAPI spec'inden otomatik üretilir.
:::

## Base URL

```
https://<inscada-ip>:8082/api/
```

`/api/` prefix'i olan tüm endpoint'ler JSON alır ve JSON döner. Üç public auth endpoint'i — `/login`, `/validate`, `/refresh`, `/logout` — `/api/` prefix'i olmadan kök altındadır.

## Kimlik Doğrulama

inSCADA Bearer token + opsiyonel cookie hibrit modeli kullanır. Tarayıcı oturumları cookie ile çalışır; API istemcileri (Postman, curl, SDK) `Authorization: Bearer` header'ını tercih eder.

### 1. Login

```http
POST /login
Content-Type: application/x-www-form-urlencoded

username=admin&password=admin
```

Başarılı yanıt:

```json
{
  "access_token": "eyJhbG...",
  "refresh_token": "eyJhbG...",
  "expire-seconds": 300,
  "activeSpace": "default_space",
  "spaces": ["default_space", "production"]
}
```

OTP aktifse yanıt farklıdır:

```json
{ "otp_required": true, "otp_type": "MAIL", "username": "admin" }
```

Bu durumda alınan `username` ile `POST /validate` çağrılır; OTP kodu doğruysa normal token çifti döner.

### 2. Token Kullanımı

Sonraki isteklerde token şu şekilde gönderilir:

```http
GET /api/projects
Authorization: Bearer <access_token>
X-Space: default_space
```

### 3. Token Yenileme

```http
POST /refresh
Content-Type: application/json

{ "refresh_token": "eyJhbG..." }
```

Yeni token çifti döner.

### 4. Logout

```http
POST /logout
Authorization: Bearer <access_token>
```

## X-Space Header

Çoklu space (multi-tenant) kurulumlarda hangi çalışma alanında işlem yapıldığını belirtmek için **her API isteğinde** `X-Space` header'ı gönderilmelidir:

```http
X-Space: default_space
```

Geçerli space ID'leri login yanıtının `spaces` alanında döner. Tek space'li kurulumlarda header gönderilmese de varsayılan space kullanılır.

## Yanıt Formatı

Tüm yanıtlar JSON'dır.

```json
// Başarılı
{ "id": 1, "name": "Temperature", "value": 25.4 }

// Hata
{ "status": 400, "error": "Bad Request", "message": "Variable not found: invalid_name" }
```

### HTTP Durum Kodları

| Kod | Açıklama |
|-----|----------|
| **200** | Başarılı |
| **201** | Oluşturuldu |
| **400** | Hatalı istek |
| **401** | Kimlik doğrulama gerekli / token geçersiz |
| **403** | Yetkisiz erişim |
| **404** | Bulunamadı |
| **429** | Rate limit aşıldı |
| **500** | Sunucu hatası |

## Rate Limiting

API istekleri rate-limit ile korunur. Aşırı istek durumunda `429 Too Many Requests` döner. Limitler sistem yapılandırmasından ayarlanır.

## Swagger UI

`dev` profilinde platformla birlikte gelen interaktif Swagger UI:

```
https://<inscada-ip>:8082/swagger-ui/
```

Üretim dağıtımlarında aynı spec bu sitedeki [REST API Reference](/docs/jdk21/api/reference/) bölümünde sunulur.
