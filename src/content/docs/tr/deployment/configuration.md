---
title: "Yapılandırma"
description: "application.yml parametreleri, profiller ve NSSM ile Windows servis kurulumu"
sidebar:
  order: 0
---

inSCADA tek bir **JAR dosyası** olarak dağıtılır. `application.yml` varsayılan değerleriyle JAR'ın içinde gömülüdür.

## Yapılandırmayı Özelleştirme

Varsayılan ayarları değiştirmek için JAR'ın yanına (aynı dizine) bir `application.yml` dosyası oluşturmanız yeterlidir. Spring Boot, harici dosyayı otomatik olarak algılar ve JAR içindeki varsayılanların üzerine yazar.

```
C:\inscada\
├── inscada.jar          ← platform (tek dosya)
├── application.yml      ← özelleştirilmiş yapılandırma (opsiyonel)
└── jdk\                 ← Java runtime
```

Yalnızca değiştirmek istediğiniz parametreleri yazmanız yeterlidir — geri kalanlar JAR içindeki varsayılan değerlerle çalışır.

Alternatif olarak başlatma sırasında dosya konumu belirtilebilir:

```bash
java -jar inscada.jar --spring.config.location=file:/opt/config/application.yml
```

:::tip
Yapılandırma değişikliklerinin uygulanması için platform yeniden başlatılmalıdır.
:::

## Veritabanı Yapılandırması (PostgreSQL)

```yaml
spring:
  datasource:
    driver-class-name: org.postgresql.Driver
    url: jdbc:postgresql://localhost:5432/promis
    username: postgres
    password: 1907
    minimum-idle: 10
    maximum-pool-size: 25
```

| Parametre | Varsayılan | Açıklama |
|-----------|-----------|----------|
| **url** | `jdbc:postgresql://localhost:5432/promis` | PostgreSQL bağlantı URL'si. Uzak sunucu için `localhost` yerine IP yazın |
| **username** | `postgres` | Veritabanı kullanıcı adı |
| **password** | `1907` | Veritabanı şifresi |
| **minimum-idle** | `10` | Havuzdaki minimum boş bağlantı sayısı |
| **maximum-pool-size** | `25` | Maksimum eşzamanlı bağlantı sayısı |

```yaml
  jpa:
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        show_sql: false
        default_schema: inscada
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
    hibernate:
      ddl-auto: none
```

| Parametre | Varsayılan | Açıklama |
|-----------|-----------|----------|
| **default_schema** | `inscada` | PostgreSQL şema adı |
| **show_sql** | `false` | SQL sorgularını loga yaz (debug için) |
| **batch_size** | `20` | Toplu INSERT/UPDATE batch boyutu |
| **ddl-auto** | `none` | Şema otomatik oluşturma kapalı (Flyway yönetir) |

## Zaman Serisi Veritabanı (InfluxDB)

```yaml
spring:
  influxdb:
    database: inscada
    url: http://localhost:8086
```

| Parametre | Varsayılan | Açıklama |
|-----------|-----------|----------|
| **url** | `http://localhost:8086` | InfluxDB HTTP API adresi |
| **database** | `inscada` | InfluxDB veritabanı adı |

:::note
InfluxDB 1.x kullanılır. Değişken logları (tarihsel veriler) burada tutulur. PostgreSQL'den bağımsızdır.
:::

## Cache (Redis)

```yaml
spring:
  redis:
    host: localhost
    port: 6379
```

| Parametre | Varsayılan | Açıklama |
|-----------|-----------|----------|
| **host** | `localhost` | Redis sunucu adresi |
| **port** | `6379` | Redis port numarası |

Redis, anlık değişken değerlerinin cache'lenmesi ve gerçek zamanlı veri dağıtımı için kullanılır.

## Sunucu & Port Ayarları

```yaml
server:
  port: 8082
  ssl:
    enabled: true
    key-alias: tomcat
    key-store: classpath:keystore.p12
    key-store-type: PKCS12
    key-store-password: dell3110
  http:
    redirect: false
    port: 8081
```

| Parametre | Varsayılan | Açıklama |
|-----------|-----------|----------|
| **server.port** | `8082` | HTTPS port numarası |
| **server.http.port** | `8081` | HTTP port numarası |
| **server.http.redirect** | `false` | HTTP → HTTPS yönlendirme |
| **ssl.enabled** | `true` | SSL/TLS etkin |
| **ssl.key-store** | `classpath:keystore.p12` | SSL sertifika dosyası (PKCS12) |
| **ssl.key-store-password** | — | Keystore şifresi |

### Port Tablosu

| Port | Protokol | Kullanım |
|------|----------|----------|
| **8081** | HTTP | Web arayüzü ve REST API |
| **8082** | HTTPS | Web arayüzü ve REST API (şifreli) |

:::tip
Üretim ortamında yalnızca HTTPS kullanılması önerilir. `server.http.redirect: true` yaparak HTTP isteklerini otomatik HTTPS'e yönlendirebilirsiniz.
:::

### Özel SSL Sertifika Kullanımı

Kendi sertifikanızı kullanmak için:

```bash
# PEM sertifika ve anahtardan PKCS12 oluşturun
openssl pkcs12 -export \
  -in certificate.crt \
  -inkey private.key \
  -out keystore.p12 \
  -name tomcat \
  -passout pass:your_password
```

```yaml
server:
  ssl:
    key-store: file:/opt/inscada/keystore.p12
    key-store-password: your_password
    key-alias: tomcat
```

## Platform Ayarları (ins.*)

```yaml
ins:
  node:
    id: ins01
  files:
    path: ./fs
  jwt:
    secret:
  accessToken:
    duration: 5
  refreshToken:
    duration: 1
  job:
    executor:
      max-threads: 1000
  variable:
    value:
      list:
        size: 300
```

| Parametre | Varsayılan | Açıklama |
|-----------|-----------|----------|
| **ins.node.id** | `ins01` | Node tanımlayıcı (cluster ortamında benzersiz olmalı) |
| **ins.files.path** | `./fs` | Dosya depolama dizini (SVG, rapor, ek dosyalar) |
| **ins.jwt.secret** | _(otomatik)_ | JWT token imzalama anahtarı. Boş bırakılırsa rastgele üretilir |
| **ins.accessToken.duration** | `5` | Access token süresi (dakika) |
| **ins.refreshToken.duration** | `1` | Refresh token süresi (gün) |
| **ins.job.executor.max-threads** | `1000` | Maksimum eşzamanlı iş parçacığı (script, bağlantı, rapor vb.) |
| **ins.variable.value.list.size** | `300` | Değişken son değer listesi boyutu |

## Mesaj Kuyruğu (Apache Artemis)

```yaml
spring:
  artemis:
    enabled: false
    mode: NATIVE
  remote:
    broker:
      enabled: false
      list:
        - host: 192.168.1.5
          port: 61616
```

| Parametre | Varsayılan | Açıklama |
|-----------|-----------|----------|
| **artemis.enabled** | `false` | Dahili Artemis broker. Tek sunucu kurulumunda `false` |
| **artemis.mode** | `NATIVE` | Broker modu |
| **remote.broker.enabled** | `false` | Uzak broker kullanımı (cluster/HA yapılandırması) |
| **remote.broker.list** | — | Uzak broker sunucu listesi |

:::note
Artemis, yalnızca yedekli mimari (HA) veya cluster yapılandırmasında etkinleştirilir. Tek sunucu kurulumunda dahili in-memory mesajlaşma kullanılır.
:::

## Cluster Yapılandırması

```yaml
ins:
  cluster:
    enabled: false
    redis:
      replication:
        enabled: false
```

| Parametre | Varsayılan | Açıklama |
|-----------|-----------|----------|
| **cluster.enabled** | `false` | Cluster modu |
| **cluster.redis.replication.enabled** | `false` | Redis replikasyonu |

Cluster yapılandırması hakkında detaylı bilgi için [Yedekli Mimari](/docs/tr/deployment/redundancy/) sayfasına bakın.

## Dosya Yükleme Limiti

```yaml
spring:
  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 50MB
```

| Parametre | Varsayılan | Açıklama |
|-----------|-----------|----------|
| **max-file-size** | `50MB` | Tekil dosya maksimum boyutu |
| **max-request-size** | `50MB` | İstek başına maksimum boyut |

## Veritabanı Migrasyon (Flyway)

```yaml
spring:
  flyway:
    schemas: inscada
    table: schema_version
```

Flyway, veritabanı şemasını otomatik yönetir. Güncelleme sırasında yeni migration'lar otomatik uygulanır. Manuel müdahale gerekmez.

## Profiller

inSCADA üç yapılandırma profili destekler. Profil, başlatma parametresi olarak belirtilir:

### Varsayılan (default)

Özel profil belirtilmediğinde kullanılır. Üretim ortamı için önerilen yapılandırmadır.

### dev (Geliştirme)

```yaml
spring:
  profiles: dev
  jpa:
    properties:
      hibernate:
        show_sql: false
        use_sql_comments: true
        format_sql: true
```

SQL logları etkinleşir. Geliştirme ve hata ayıklama için kullanılır.

### test (Test)

```yaml
spring:
  profiles: test
  datasource:
    url: jdbc:postgresql://192.168.2.123:5432/promis
  influxdb:
    url: http://192.168.2.100:9096
    relay: true
    cluster: influxdb_cluster
    gzip: true
  redis:
    sentinel:
      master: insredis
      nodes: 192.168.2.154:26379, 192.168.2.118:26379, 192.168.2.136:26379
```

InfluxDB Relay, Redis Sentinel ve uzak veritabanı ile yüksek erişilebilirlik test ortamı.

### production

```yaml
spring:
  profiles: production
  influxdb:
    gzip: true
```

InfluxDB GZIP sıkıştırma etkinleşir. Ağ trafiğini azaltır.

### Profil Kullanımı

```bash
# Komut satırından profil belirtme
java -jar inscada.jar --spring.profiles.active=dev

# Veya JVM parametresi olarak
java -Dspring.profiles.active=production -jar inscada.jar
```

---

## NSSM ile Windows Servis Kurulumu

**NSSM** (Non-Sucking Service Manager), inSCADA'yı Windows servisi olarak çalıştırmak için kullanılır. Platform, bilgisayar açıldığında otomatik başlar ve arka planda çalışır.

### NSSM Nedir?

NSSM, herhangi bir uygulamayı Windows servisi olarak yönetmenizi sağlayan açık kaynaklı bir araçtır. Java uygulamalarını servis olarak çalıştırmak için idealdir.

### 1. NSSM İndirme

[nssm.cc](https://nssm.cc/download) adresinden güncel sürümü indirin ve `nssm.exe` dosyasını `C:\inscada\` dizinine kopyalayın.

### 2. Servis Oluşturma (GUI)

```bat
C:\inscada\nssm.exe install inSCADA
```

NSSM editör penceresi açılır:

**Application sekmesi:**

| Alan | Değer |
|------|-------|
| **Path** | `C:\inscada\jdk\bin\java.exe` |
| **Startup directory** | `C:\inscada` |
| **Arguments** | `-Xms512m -Xmx2048m -jar inscada.jar` |

**Details sekmesi:**

| Alan | Değer |
|------|-------|
| **Display name** | `inSCADA Platform` |
| **Description** | `inSCADA SCADA Platform Service` |
| **Startup type** | `Automatic` |

**I/O sekmesi:**

| Alan | Değer |
|------|-------|
| **Output (stdout)** | `C:\inscada\logs\stdout.log` |
| **Error (stderr)** | `C:\inscada\logs\stderr.log` |

**Install service** butonuna tıklayarak servisi oluşturun.

### 3. Servis Oluşturma (Komut Satırı)

GUI kullanmadan tek komutla servis oluşturma:

```bat
:: Servis oluştur
nssm install inSCADA "C:\inscada\jdk\bin\java.exe" "-Xms512m -Xmx2048m -jar inscada.jar"

:: Çalışma dizini
nssm set inSCADA AppDirectory "C:\inscada"

:: Servis açıklaması
nssm set inSCADA DisplayName "inSCADA Platform"
nssm set inSCADA Description "inSCADA SCADA Platform Service"

:: Otomatik başlatma
nssm set inSCADA Start SERVICE_AUTO_START

:: Log dosyaları
nssm set inSCADA AppStdout "C:\inscada\logs\stdout.log"
nssm set inSCADA AppStderr "C:\inscada\logs\stderr.log"

:: Log dosyaları rotate
nssm set inSCADA AppStdoutCreationDisposition 4
nssm set inSCADA AppStderrCreationDisposition 4
nssm set inSCADA AppRotateFiles 1
nssm set inSCADA AppRotateOnline 1
nssm set inSCADA AppRotateBytes 10485760
```

### 4. JVM Bellek Parametreleri

| Parametre | Açıklama | Önerilen |
|-----------|----------|----------|
| **-Xms** | Başlangıç heap belleği | `512m` |
| **-Xmx** | Maksimum heap belleği | `2048m` (2 GB) |

Büyük projeler (1000+ değişken, çok sayıda bağlantı) için:

```
-Xms1024m -Xmx4096m
```

### 5. Profil ile Başlatma

Profil belirtmek için Arguments alanına ekleyin:

```
-Xms512m -Xmx2048m -jar inscada.jar --spring.profiles.active=production
```

Veya NSSM ile parametre ayarlayın:

```bat
nssm set inSCADA AppParameters "-Xms512m -Xmx2048m -Dspring.profiles.active=production -jar inscada.jar"
```

### 6. Servis Yönetimi

```bat
:: Servisi başlat
nssm start inSCADA

:: Servisi durdur
nssm stop inSCADA

:: Servisi yeniden başlat
nssm restart inSCADA

:: Servis durumunu kontrol et
nssm status inSCADA

:: Servis yapılandırmasını düzenle
nssm edit inSCADA

:: Servisi kaldır
nssm remove inSCADA confirm
```

Veya Windows standart komutları ile:

```bat
:: Windows Services (services.msc) ile de yönetilebilir
net start inSCADA
net stop inSCADA
sc query inSCADA
```

### 7. Örnek: Tam Kurulum Scripti

Tüm adımları birleştiren Windows batch scripti:

```bat
@echo off
echo === inSCADA Windows Service Installer ===

:: Logs dizini oluştur
if not exist "C:\inscada\logs" mkdir "C:\inscada\logs"

:: Servis oluştur
C:\inscada\nssm.exe install inSCADA "C:\inscada\jdk\bin\java.exe" ^
  "-Xms512m -Xmx2048m -jar inscada.jar --spring.profiles.active=production"

:: Yapılandır
C:\inscada\nssm.exe set inSCADA AppDirectory "C:\inscada"
C:\inscada\nssm.exe set inSCADA DisplayName "inSCADA Platform"
C:\inscada\nssm.exe set inSCADA Description "inSCADA SCADA Platform Service"
C:\inscada\nssm.exe set inSCADA Start SERVICE_AUTO_START
C:\inscada\nssm.exe set inSCADA AppStdout "C:\inscada\logs\stdout.log"
C:\inscada\nssm.exe set inSCADA AppStderr "C:\inscada\logs\stderr.log"
C:\inscada\nssm.exe set inSCADA AppRotateFiles 1
C:\inscada\nssm.exe set inSCADA AppRotateOnline 1
C:\inscada\nssm.exe set inSCADA AppRotateBytes 10485760

:: Servisi başlat
C:\inscada\nssm.exe start inSCADA

echo === Kurulum tamamlandi ===
echo https://localhost:8082 adresinden erişebilirsiniz.
pause
```

---

## Yapılandırma Kontrol Listesi

Yeni kurulum sonrası kontrol edilmesi gereken parametreler:

| Parametre | Kontrol |
|-----------|---------|
| `spring.datasource.password` | Varsayılan şifre değiştirildi mi? |
| `ins.jwt.secret` | Üretim ortamında güçlü bir secret tanımlandı mı? |
| `server.ssl.key-store-password` | Özel SSL sertifika kullanılıyorsa güncel mi? |
| `ins.accessToken.duration` | Güvenlik gereksinimlerine uygun mu? |
| `server.http.redirect` | Üretimde `true` olarak ayarlandı mı? |
| JVM `-Xmx` | Proje boyutuna uygun bellek ayrıldı mı? |
