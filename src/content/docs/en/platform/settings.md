---
title: "Settings"
description: "inSCADA platform settings: email, SMS, OTP, login screen, IP filter, logo, map and broadcast"
sidebar:
  order: 10
---

The Settings menu contains the general configuration of the inSCADA platform. Access to this menu requires the appropriate user permissions.

## Email

SMTP server configuration for inSCADA to send notification, alarm, and OTP emails.

| Field | Description |
|-------|-------------|
| **Host** | SMTP server address (e.g., `smtp.gmail.com`) |
| **Port** | SMTP port (e.g., `587`) |
| **Protocol** | Connection protocol: `SMTP`, `SMTPS`, or `SMTP_TLS` |
| **From Address** | Sender email address |
| **Username** | SMTP authentication username |
| **Password** | SMTP password |

> **Note:** The `ins.sendMail()` script function and email-based alarm notifications will not work without email configuration.

## SMS

SMS provider configuration for notifications. Three providers are supported:

### Dataport

| Field | Description |
|-------|-------------|
| **Username** | Dataport account username |
| **Password** | Account password |
| **Account Number** | Dataport account number |
| **Short Number** | Short code number |
| **Originator** | Sender ID |
| **Operator** | Turkcell, Avea, Vodafone, or Superonline |
| **Is Default** | Set as default provider |

### Twilio

| Field | Description |
|-------|-------------|
| **Account SID** | Twilio account SID |
| **Auth Token** | Twilio authentication token |
| **Twilio Number** | Twilio phone number |
| **Is Default** | Set as default provider |

### Netgsm

| Field | Description |
|-------|-------------|
| **Username** | Netgsm account username |
| **Password** | Account password |
| **Header** | SMS header / sender ID |
| **Bayi Code** | Reseller code (optional) |
| **Is Default** | Set as default provider |

> **Note:** Multiple providers can be configured. The provider marked as **Is Default** is used for SMS notifications.

## OTP (One-Time Password)

OTP configuration for two-factor authentication during login. OTP codes can be sent via email or SMS.

**Supported OTP methods:**

| Method | Provider | Description |
|--------|----------|-------------|
| Email | Default | Sends OTP code via SMTP |
| SMS | Dataport | OTP via Dataport SMS |
| SMS | Twilio | OTP via Twilio SMS |
| SMS | Netgsm | OTP via Netgsm SMS |

Email-based OTP uses a separate SMTP configuration (independent from the main email settings).

Use the **Test** button in OTP settings to verify the configuration works correctly.

## Login Screen

Customize the appearance of the login page.

| Field | Description |
|-------|-------------|
| **Background Image** | Login page background image (JPG only) |
| **Alignment** | Image alignment: Left, Right, or Center |

## IP Filter

Restrict platform access to specific IP addresses.

| Field | Description |
|-------|-------------|
| **Allowed IPs** | List of allowed IP addresses (one per line) |

> **Warning:** When IP filtering is enabled, login from IP addresses not on the list will be blocked. Incorrect configuration may result in loss of platform access.

## Logo

Customize the logo appearance in the platform interface.

| Field | Description |
|-------|-------------|
| **Sidebar Logo** | Logo displayed in the left sidebar (PNG only) |
| **Sidebar Logo Height** | Logo height in pixels |
| **Show Top Logo** | Show/hide logo in the top bar |

## Map

API key configuration for map and weather services.

| Field | Description |
|-------|-------------|
| **Map API Key** | Map service API key |
| **Weather API Key** | Weather service API key |

> **Note:** The project map view will not work without a configured Map API key.

## Broadcast

Live broadcast/stream server configuration.

| Field | Description |
|-------|-------------|
| **Server IP** | Broadcast server IP address |
| **Application Name** | Broadcast application name |
