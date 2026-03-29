---
title: "Installation"
description: "Installing the inSCADA platform on Windows, Linux and Docker"
sidebar:
  order: 3
---

inSCADA can be installed in three different environments. Choose the method that suits your needs:

## Windows Installation

### 1. Download Setup

Download the inSCADA installer from [inscada.com/download](https://www.inscada.com/en/download/). Click the "Download" button on the **inSCADA Platform** card.

### 2. Installation

Run the downloaded setup file. The installation wizard automatically installs all components (platform, databases, cache).

:::note
Administrator privileges are required during installation. If your firewall or antivirus software blocks the installation, temporarily disable it.
:::

### 3. First Access

After installation is complete, open your browser and navigate to:

```
https://localhost:8082
```

Default login credentials:

| Field | Value |
|-------|-------|
| Username | `inscada` |
| Password | `1907` |

:::caution[Security]
Change the default password immediately after your first login.
:::

### 4. Licensing

On first installation, inSCADA runs in **demo mode**. Demo mode allows you to try the basic features with a limited number of I/O points.

For a full-featured evaluation, you can obtain a **free 1-month trial licence**:

1. Navigate to **System → Licence** in the platform
2. Click the **Activate Trial** button
3. Fill in the required information
4. Your trial licence is activated automatically (30 days)

:::tip
During the trial period, all features and protocols are active. When the trial expires, the system returns to demo mode and your data is preserved.
:::

## Linux Installation

### Supported Distributions

- Ubuntu 22.04 LTS / 24.04 LTS
- Red Hat Enterprise Linux 8 / 9
- CentOS Stream 8 / 9
- Debian 11 / 12

### 1. Prerequisites

```bash
# Ubuntu / Debian
sudo apt update
sudo apt install -y curl wget unzip

# RHEL / CentOS
sudo dnf install -y curl wget unzip
```

### 2. Installation

Download and run the inSCADA Linux installation package:

```bash
# Download the installation package (check inscada.com/download for the latest version)
wget https://www.inscada.com/download/inscada-linux-setup.sh

# Grant execution permission
chmod +x inscada-linux-setup.sh

# Start installation
sudo ./inscada-linux-setup.sh
```

The installation script automatically installs all components (platform, databases, cache) and configures them as a systemd service.

### 3. Service Management

```bash
# Check service status
sudo systemctl status inscada

# Start the service
sudo systemctl start inscada

# Stop the service
sudo systemctl stop inscada

# Enable automatic startup
sudo systemctl enable inscada
```

### 4. First Access

Access the server's IP address from your browser:

```
https://<server-ip>:8082
```

Default login credentials and licensing steps are the same as Windows (see above).

## Docker Installation

inSCADA can also be run as a Docker container. This method is suitable for quick evaluation, development environments and CI/CD integrations.

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
# Start
docker-compose up -d

# Follow logs
docker-compose logs -f inscada

# Stop
docker-compose down
```

:::note
In a Docker installation, databases run inside the container. For production environments, managing databases separately is recommended.
:::

## After Installation

Once installation is complete, proceed to the [First Project](/docs/en/getting-started/first-project/) guide to create your first project.
