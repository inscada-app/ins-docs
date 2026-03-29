---
title: "Configuration"
description: "application.yml parameters, directory structure, NSSM service setup, and SSL certificate management"
sidebar:
  order: 0
---

inSCADA is distributed as a single **JAR file**. All configuration parameters are embedded within the JAR's `application.yml` file with their default values.

## Installation Directory Structure

Directory structure after Windows installation:

```
C:\Program Files\inSCADA\
├── inscada.jar                          ← platform (single file)
├── inscada-keystore.p12                 ← SSL certificate
├── inscada.cer                          ← exported public certificate
├── application.yml                      ← customized configuration (optional)
├── inSCADA_Service_Install.bat          ← NSSM service installation script
├── inSCADA_TimeserisDB_Service_Install.bat ← InfluxDB service installation script
├── firewallsettings.bat                 ← Windows Firewall rule script
├── create-cert.bat                      ← SSL certificate creation (interactive)
├── auto-create-cert.bat                 ← SSL certificate creation (automatic)
├── files\                               ← file storage (SVG, reports, attachments)
├── logs\                                ← application logs
│   └── log.log
└── influxdb-1.8.3-1\                   ← InfluxDB time series database
    ├── influxd.exe
    ├── influx.exe
    ├── influxdb.conf
    └── TimeseriesData\                  ← historical data files

C:\Program Files\OpenJDK\
└── jdk-11.0.18.10-hotspot\              ← Java 11 runtime
    └── bin\java.exe

C:\Program Files\PostgreSQL\12\          ← PostgreSQL database
    └── bin\
```

## Customizing the Configuration

There are two ways to change the default settings:

### 1. External application.yml (optional)

If you place an `application.yml` file next to the JAR (in the same directory), Spring Boot automatically detects the external file and overrides the defaults inside the JAR. You only need to write the parameters you want to change:

```yaml
# C:\Program Files\inSCADA\application.yml
spring:
  datasource:
    url: jdbc:postgresql://192.168.1.100:5432/promis
    password: strong_password
server:
  http:
    redirect: true
```

### 2. JVM -D parameters (with NSSM)

The installation script uses this method — parameters are passed directly via `-D` flags through NSSM:

```
-Dserver.ssl.key-store="C:\Program Files\inSCADA\inscada-keystore.p12"
-Dserver.ssl.key-store-password=19051905
-Dspring.influxdb.username=inscada
-Dspring.influxdb.password=19051905
-Dspring.profiles.active=dev
-Duser.timezone=Europe/Istanbul
-Dins.files.path="C:\Program Files\inSCADA\files"
```

:::tip
`-D` parameters override values in the `application.yml` file. Both methods can be used together.
The service must be restarted for configuration changes to take effect.
:::

---

## application.yml Parameters

### Database (PostgreSQL)

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

| Parameter | Default | Description |
|-----------|---------|-------------|
| **url** | `jdbc:postgresql://localhost:5432/promis` | PostgreSQL connection URL. Replace `localhost` with IP for remote server |
| **username** | `postgres` | Database username |
| **password** | `1907` | Database password |
| **minimum-idle** | `10` | Minimum idle connections in the pool |
| **maximum-pool-size** | `25` | Maximum concurrent connections |

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

| Parameter | Default | Description |
|-----------|---------|-------------|
| **default_schema** | `inscada` | PostgreSQL schema name |
| **show_sql** | `false` | Log SQL queries (for debugging) |
| **batch_size** | `20` | Bulk INSERT/UPDATE batch size |
| **ddl-auto** | `none` | Schema auto-creation disabled (managed by Flyway) |

### Time Series Database (InfluxDB)

```yaml
spring:
  influxdb:
    database: inscada
    url: http://localhost:8086
    username: inscada
    password: 19051905
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| **url** | `http://localhost:8086` | InfluxDB HTTP API address |
| **database** | `inscada` | InfluxDB database name |
| **username** | `inscada` | InfluxDB username |
| **password** | — | InfluxDB password |

InfluxDB 1.8 is used and located under the installation directory (`influxdb-1.8.3-1/`). Variable logs (historical data) are stored here.

#### InfluxDB Retention Policies

Retention policies automatically created during installation:

| Retention Policy | Duration | Data Type |
|-----------------|----------|-----------|
| **autogen** | Unlimited | Default |
| **variable_value_rp** | 365 days | Variable values |
| **event_log_rp** | 14 days | Event logs |
| **fired_alarm_rp** | 365 days | Alarm history |
| **auth_attempt_rp** | 365 days | Login attempts |

### Cache (Redis)

```yaml
spring:
  redis:
    host: localhost
    port: 6379
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| **host** | `localhost` | Redis server address |
| **port** | `6379` | Redis port number |

Redis is used for caching live variable values and real-time data distribution.

### Server & Port Settings

```yaml
server:
  port: 8082
  ssl:
    enabled: true
    key-alias: inscada
    key-store: "C:\\Program Files\\inSCADA\\inscada-keystore.p12"
    key-store-type: PKCS12
    key-store-password: 19051905
  http:
    redirect: false
    port: 8081
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| **server.port** | `8082` | HTTPS port number |
| **server.http.port** | `8081` | HTTP port number |
| **server.http.redirect** | `false` | HTTP → HTTPS redirect |
| **ssl.enabled** | `true` | SSL/TLS enabled |
| **ssl.key-alias** | `inscada` | Certificate alias |
| **ssl.key-store** | — | SSL certificate file (PKCS12) path |
| **ssl.key-store-password** | — | Keystore password |

#### Port Table

| Port | Protocol | Usage |
|------|----------|-------|
| **8081** | HTTP | Web interface and REST API |
| **8082** | HTTPS | Web interface and REST API (encrypted) |
| **8086** | HTTP | InfluxDB API (internal) |
| **5432** | TCP | PostgreSQL (internal) |
| **6379** | TCP | Redis (internal) |

### Platform Settings (ins.*)

```yaml
ins:
  node:
    id: ins01
  files:
    path: "C:\\Program Files\\inSCADA\\files"
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

| Parameter | Default | Description |
|-----------|---------|-------------|
| **ins.node.id** | `ins01` | Node identifier (must be unique in cluster environments) |
| **ins.files.path** | `./fs` | File storage directory (SVG, reports, attachments) |
| **ins.jwt.secret** | _(auto)_ | JWT token signing key. If left empty, a random key is generated |
| **ins.accessToken.duration** | `5` | Access token duration (minutes) |
| **ins.refreshToken.duration** | `1` | Refresh token duration (days) |
| **ins.job.executor.max-threads** | `1000` | Maximum concurrent threads (scripts, connections, reports, etc.) |
| **ins.variable.value.list.size** | `300` | Variable recent values list size |

### Message Queue (Apache Artemis)

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

| Parameter | Default | Description |
|-----------|---------|-------------|
| **artemis.enabled** | `false` | Built-in Artemis broker. `false` for single-machine installations |
| **artemis.mode** | `NATIVE` | Broker mode |
| **remote.broker.enabled** | `false` | Remote broker usage (cluster/HA configuration) |
| **remote.broker.list** | — | Remote broker list (host + port) |

:::note
Artemis is only enabled in redundant architecture (HA) or cluster configurations. Single-machine installations use built-in in-memory messaging.
:::

### Cluster Configuration

```yaml
ins:
  cluster:
    enabled: false
    redis:
      replication:
        enabled: false
```

For detailed information about cluster configuration, see the [Redundant Architecture](/docs/tr/deployment/redundancy/) page.

### File Upload Limit

```yaml
spring:
  servlet:
    multipart:
      max-file-size: 256MB
      max-request-size: 256MB
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| **max-file-size** | `256MB` | Maximum single file size |
| **max-request-size** | `256MB` | Maximum size per request |

### Time Zone

```
-Duser.timezone=Europe/Istanbul
```

Specified as a JVM parameter in the service installation script. Date/time displays and scheduling operations run according to this time zone.

### Database Migration (Flyway)

```yaml
spring:
  flyway:
    schemas: inscada
    table: schema_version
```

Flyway manages the database schema automatically. New migrations are applied automatically during updates. No manual intervention is required.

---

## Profiles

inSCADA supports three configuration profiles:

### Default

Used when no specific profile is specified.

### dev (Development)

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

SQL logs are enabled. Used for development and debugging. **The `dev` profile is set by default in the installation script.**

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

High availability test environment with InfluxDB Relay, Redis Sentinel, and remote database.

### production

```yaml
spring:
  profiles: production
  influxdb:
    gzip: true
```

InfluxDB GZIP compression is enabled. Reduces network traffic.

### Changing Profiles

```bat
:: Change profile with NSSM
nssm set inSCADA AppParameters "... -Dspring.profiles.active=production ..."

:: Or from the command line
java -jar inscada.jar --spring.profiles.active=production
```

---

## Windows Service Installation with NSSM

**NSSM** (Non-Sucking Service Manager) runs inSCADA as a Windows service. The platform starts automatically when the computer boots and runs in the background.

### Ready-Made Installation Script

The `inSCADA_Service_Install.bat` file is located in the installation directory. Simply run it as administrator:

```bat
:: Run as administrator
"C:\Program Files\inSCADA\inSCADA_Service_Install.bat"
```

This script does the following:
1. Stops and removes the existing inSCADA service (if any)
2. Creates a new service with NSSM
3. Sets all JVM and configuration parameters
4. Configures automatic startup and restart on failure
5. Starts the service

### Service Script Contents

```bat
@echo off
setlocal

set SERVICE_NAME="inSCADA"
set DISPLAY_NAME="inSCADA Service"
set JAVA_EXE="C:\Program Files\OpenJDK\jdk-11.0.18.10-hotspot\bin\java.exe"
set APP_DIR="C:\Program Files\inSCADA"

set APP_PARAMS="-Dserver.ssl.key-alias=inscada ^
  -Dserver.ssl.key-store-password=19051905 ^
  -Dserver.ssl.key-store=\"C:\Program Files\inSCADA\inscada-keystore.p12\" ^
  -Dspring.influxdb.username=inscada ^
  -Dspring.influxdb.password=19051905 ^
  -Dspring.servlet.multipart.max-request-size=256MB ^
  -Dspring.servlet.multipart.max-file-size=256MB ^
  -Dins.variable.value.list.size=300 ^
  -Djava.library.path=C:\Windows\system32 ^
  -Dspring.profiles.active=dev ^
  -Duser.timezone=Europe/Istanbul ^
  -Dspring.datasource.url=jdbc:postgresql://localhost:5432/promis ^
  -Dins.files.path=\"C:\Program Files\inSCADA\files\" ^
  -jar \"C:\Program Files\inSCADA\inscada.jar\""

nssm stop %SERVICE_NAME% >nul 2>&1
nssm remove %SERVICE_NAME% confirm >nul 2>&1

nssm install %SERVICE_NAME% %JAVA_EXE%
nssm set %SERVICE_NAME% DisplayName "%DISPLAY_NAME%"
nssm set %SERVICE_NAME% AppDirectory %APP_DIR%
nssm set %SERVICE_NAME% AppParameters %APP_PARAMS%
nssm set %SERVICE_NAME% ObjectName LocalSystem
nssm set %SERVICE_NAME% Start SERVICE_AUTO_START
nssm set %SERVICE_NAME% AppExit Default Restart
nssm set %SERVICE_NAME% AppRestartDelay 5000

nssm start %SERVICE_NAME%
```

:::note
The script automatically restarts the service with a 5-second delay on failure (`AppExit Default Restart`, `AppRestartDelay 5000`).
:::

### InfluxDB Service Installation

InfluxDB also runs as a separate Windows service:

```bat
:: Run as administrator
"C:\Program Files\inSCADA\inSCADA_TimeserisDB_Service_Install.bat"
```

This script creates a service named `inSCADA TimeSeries DB`:

| Setting | Value |
|---------|-------|
| **Executable** | `C:\Program Files\inSCADA\influxdb-1.8.3-1\influxd.exe` |
| **Config** | `influxdb-1.8.3-1\influxdb.conf` |
| **Start** | Automatic |
| **Restart** | Automatic on failure (5s delay) |

### Manual Service Creation

If you want to create a service with custom parameters:

```bat
:: Download NSSM: https://nssm.cc/download
:: Add nssm.exe to PATH or run with full path

:: Create the service
nssm install inSCADA "C:\Program Files\OpenJDK\jdk-11.0.18.10-hotspot\bin\java.exe"

:: Working directory
nssm set inSCADA AppDirectory "C:\Program Files\inSCADA"

:: JVM parameters — adjust as needed
nssm set inSCADA AppParameters ^
  "-Xms512m -Xmx4096m ^
  -Dserver.ssl.key-alias=inscada ^
  -Dserver.ssl.key-store=\"C:\Program Files\inSCADA\inscada-keystore.p12\" ^
  -Dserver.ssl.key-store-password=19051905 ^
  -Dspring.profiles.active=production ^
  -Duser.timezone=Europe/Istanbul ^
  -jar \"C:\Program Files\inSCADA\inscada.jar\""

:: Automatic startup & error handling
nssm set inSCADA DisplayName "inSCADA Service"
nssm set inSCADA Start SERVICE_AUTO_START
nssm set inSCADA AppExit Default Restart
nssm set inSCADA AppRestartDelay 5000

:: Start
nssm start inSCADA
```

### JVM Memory Parameters

| Parameter | Description | Recommended |
|-----------|-------------|-------------|
| **-Xms** | Initial heap memory | `512m` |
| **-Xmx** | Maximum heap memory | `2048m` (2 GB) |

For large projects (1000+ variables, many connections):

```
-Xms1024m -Xmx4096m
```

### Service Management

```bat
:: Start / stop / restart the service
nssm start inSCADA
nssm stop inSCADA
nssm restart inSCADA

:: Check status
nssm status inSCADA

:: Edit configuration (GUI)
nssm edit inSCADA

:: Remove the service
nssm remove inSCADA confirm
```

With standard Windows commands:

```bat
net start inSCADA
net stop inSCADA
sc query inSCADA

:: or graphical management via services.msc
```

---

## SSL Certificate Management

### Automatic Certificate Creation

The `auto-create-cert.bat` script in the installation directory:
- Creates a self-signed PKCS12 keystore
- Adds localhost, computer name, and IP with SAN (Subject Alternative Name)
- Exports the public certificate as `inscada.cer`
- Automatically adds the certificate to Windows Trusted Root

```bat
:: Run as administrator
"C:\Program Files\inSCADA\auto-create-cert.bat"
```

### Interactive Certificate Creation

The `create-cert.bat` script allows you to enter custom values:

```bat
"C:\Program Files\inSCADA\create-cert.bat"
:: Prompts for keystore file name, password, CN, IP, and hostname
```

### Using a Custom Certificate

To use your own CA certificate:

```bash
# Create PKCS12 from PEM
keytool -importkeystore -srckeystore my-cert.pfx \
  -srcstoretype PKCS12 -destkeystore inscada-keystore.p12 \
  -deststoretype PKCS12 -alias inscada

# Or with OpenSSL
openssl pkcs12 -export \
  -in certificate.crt -inkey private.key \
  -out inscada-keystore.p12 -name inscada
```

Then update the NSSM parameters:

```bat
nssm set inSCADA AppParameters "... -Dserver.ssl.key-store=\"C:\Program Files\inSCADA\inscada-keystore.p12\" -Dserver.ssl.key-store-password=new_password ..."
nssm restart inSCADA
```

---

## Windows Firewall Rules

The `firewallsettings.bat` script in the installation directory adds the required port rules:

```bat
:: Run as administrator
"C:\Program Files\inSCADA\firewallsettings.bat"
```

Added rules:

| Rule | Direction | Port | Protocol |
|------|-----------|------|----------|
| inSCADA HTTP (8081) | Inbound + Outbound | 8081 | TCP |
| inSCADA HTTPS (8082) | Inbound + Outbound | 8082 | TCP |

---

## Configuration Checklist

Parameters to check after a new installation:

| Parameter | Check |
|-----------|-------|
| `spring.datasource.password` | Has the default password been changed? |
| `server.ssl.key-store-password` | Is the certificate password strong? |
| `spring.influxdb.password` | Is the InfluxDB password secure? |
| `ins.jwt.secret` | Has a strong secret been defined for production? |
| `ins.accessToken.duration` | Does it meet security requirements? (default: 5 min) |
| `server.http.redirect` | Is it set to `true` in production? |
| `user.timezone` | Is the correct time zone configured? |
| JVM `-Xmx` | Has adequate memory been allocated for the project size? |
| Firewall | Has `firewallsettings.bat` been run? |
| SSL Certificate | Has the certificate been added to Trusted Root? |
