---
title: "Kurulum"
description: "inSCADA platformunun Windows, Linux ve Docker ile kurulumu"
sidebar:
  order: 3
---

inSCADA üç farklı ortamda kurulabilir. İhtiyacınıza uygun yöntemi seçin:

## Windows Kurulumu

### 1. Setup İndirme

inSCADA kurulum dosyasını [inscada.com/download](https://www.inscada.com/download/) adresinden indirin. Sayfadaki **inSCADA Platform** kartından "İndir" butonuna tıklayın.

### 2. Kurulum

İndirilen setup dosyasını çalıştırın. Kurulum sihirbazı tüm bileşenleri (platform, veritabanları, cache) otomatik olarak kurar.

:::note
Kurulum sırasında yönetici (Administrator) yetkileri gereklidir. Firewall veya antivirüs yazılımınız kurulumu engelliyorsa geçici olarak devre dışı bırakın.
:::

### 3. İlk Erişim

Kurulum tamamlandıktan sonra tarayıcınızı açın ve aşağıdaki adrese gidin:

```
https://localhost:8082
```

Varsayılan giriş bilgileri:

| Alan | Değer |
|------|-------|
| Kullanıcı Adı | `admin` |
| Şifre | `admin` |

:::caution[Güvenlik]
İlk girişten sonra varsayılan şifreyi mutlaka değiştirin.
:::

### 4. Lisanslama

İlk kurulumda inSCADA **demo modunda** çalışır. Demo mod sınırlı sayıda I/O noktası ile temel özellikleri denemenize olanak tanır.

Tam özellikli değerlendirme için **1 aylık ücretsiz trial lisans** alabilirsiniz:

1. Platformda **System → Lisans** bölümüne gidin
2. **Activate Trial** butonuna tıklayın
3. İstenilen bilgileri doldurun
4. Trial lisansınız otomatik olarak aktifleşir (30 gün)

:::tip
Trial süresinde tüm özellikler ve protokoller aktiftir. Süre sonunda demo moda geri döner, verileriniz korunur.
:::

## Linux Kurulumu

### Desteklenen Dağıtımlar

- Ubuntu 22.04 LTS / 24.04 LTS
- Red Hat Enterprise Linux 8 / 9
- CentOS Stream 8 / 9
- Debian 11 / 12

### 1. Ön Gereksinimler

```bash
# Ubuntu / Debian
sudo apt update
sudo apt install -y curl wget unzip

# RHEL / CentOS
sudo dnf install -y curl wget unzip
```

### 2. Kurulum

inSCADA Linux kurulum paketini indirin ve çalıştırın:

```bash
# Kurulum paketini indirin (güncel sürüm için inscada.com/download adresini kontrol edin)
wget https://www.inscada.com/download/inscada-linux-setup.sh

# Çalıştırma izni verin
chmod +x inscada-linux-setup.sh

# Kurulumu başlatın
sudo ./inscada-linux-setup.sh
```

Kurulum scripti tüm bileşenleri (platform, veritabanları, cache) otomatik olarak kurar ve systemd servisi olarak yapılandırır.

### 3. Servis Yönetimi

```bash
# Servis durumunu kontrol edin
sudo systemctl status inscada

# Servisi başlatın
sudo systemctl start inscada

# Servisi durdurun
sudo systemctl stop inscada

# Otomatik başlatmayı etkinleştirin
sudo systemctl enable inscada
```

### 4. İlk Erişim

Tarayıcınızdan sunucunun IP adresine erişin:

```
https://<sunucu-ip>:8082
```

Varsayılan giriş bilgileri ve lisanslama adımları Windows ile aynıdır (yukarıya bakın).

## Docker ile Kurulum

inSCADA Docker container olarak da çalıştırılabilir. Bu yöntem hızlı değerlendirme, geliştirme ortamı ve CI/CD entegrasyonları için uygundur.

```yaml
# docker-compose.yml
version: '3.8'
services:
  inscada:
    image: inscada/inscada:latest
    ports:
      - "8082:8082"
      - "8083:8083"
    volumes:
      - inscada-data:/opt/inscada/data
    environment:
      - INS_MASTER_KEY=your-secret-key
    restart: unless-stopped

volumes:
  inscada-data:
```

```bash
# Başlatın
docker-compose up -d

# Logları izleyin
docker-compose logs -f inscada

# Durdurun
docker-compose down
```

:::note
Docker kurulumunda veritabanları container içinde çalışır. Üretim ortamlarında veritabanlarının ayrı yönetilmesi önerilir.
:::

## Kurulum Sonrası

Kurulum tamamlandıktan sonra [İlk Proje](/docs/tr/getting-started/first-project/) rehberine geçerek ilk projenizi oluşturabilirsiniz.
