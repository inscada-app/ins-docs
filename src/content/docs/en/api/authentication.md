---
title: "Authentication"
description: "inSCADA REST API authentication — login, token management, and security"
sidebar:
  order: 2
---

The inSCADA REST API uses form-based login and cookie-based JWT token authentication.

## Login

### Request

```
POST /login
Content-Type: multipart/form-data
```

| Field | Value |
|-------|-------|
| **username** | Username |
| **password** | Password |

### Response

A successful login sets two cookies in the response header:

| Cookie | Description | Duration |
|--------|-------------|----------|
| **ins_access_token** | Access token | Short (minutes) |
| **ins_refresh_token** | Refresh token | Long (hours) |

```
HTTP/1.1 200 OK
Set-Cookie: ins_access_token=eyJhbG...; Path=/; Max-Age=300; HttpOnly; SameSite=Lax
Set-Cookie: ins_refresh_token=eyJhbG...; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax
Content-Type: application/json

{"expire-seconds":300,"spaces":["default_space","production"]}
```

The response body returns the access token duration (in seconds) and the list of accessible spaces.

### cURL Example

```bash
# Login
curl -c cookies.txt -X POST https://localhost:8082/login \
  -F "username=admin" -F "password=admin"

# API call (with cookie)
curl -b cookies.txt https://localhost:8082/api/projects \
  -H "X-Space: default_space"
```

## Token Renewal

When the access token expires, it is automatically renewed using the refresh token. No additional action is required on the client side — the browser sends cookies automatically.

For programmatic access, store the cookies and send them with subsequent requests:

```javascript
// JavaScript (fetch)
const response = await fetch('https://inscada:8082/api/projects', {
  credentials: 'include',
  headers: { 'X-Space': 'default_space' }
});
```

```python
# Python (requests)
import requests

session = requests.Session()
session.post('https://inscada:8082/login',
    data={'username': 'admin', 'password': 'admin'},
    verify=False)

projects = session.get('https://inscada:8082/api/projects',
    headers={'X-Space': 'default_space'}).json()
```

## X-Space Header

In the multi-workspace (multi-tenant) architecture, the `X-Space` header is used to specify which space the API request operates in:

```
X-Space: default_space
```

This header should be sent with every API request. If omitted, the default space is used.

## Security

### Brute-Force Protection

- **5 failed login attempts** → account is **locked for 10 minutes**
- Locked accounts can be viewed at the `/api/auth/lockedUsers` endpoint

### IP Filtering

The platform administrator can configure whitelist/blacklist-based IP filtering. When filtering is active, API access is only possible from allowed IP addresses.

### OTP / Two-Factor Authentication

When enabled, OTP (One-Time Password) verification is also required after login. It is used with TOTP-compatible mobile applications (Google Authenticator, Authy, etc.).

### HTTPS

All API traffic should be encrypted over **HTTPS**. HTTP (port 8081) should only be used in development environments.
