---
title: "Custom Menus"
description: "Özel HTML menüler — rol bazlı arayüz, iframe entegrasyonu ve Web Components"
sidebar:
  order: 22
---

Custom Menu, space seviyesinde tanımlanan özel menü sayfalarıdır. HTML, CSS ve JavaScript ile tamamen özelleştirilmiş arayüzler oluşturabilirsiniz. Farklı kullanıcı rolleri için farklı menüler atanabilir.

## Custom Menu Oluşturma

**Menü:** Development → Custom Menus → Dev Custom Menus

| Alan | Zorunlu | Açıklama |
|------|---------|----------|
| **Name** | Evet | Menü adı |
| **Icon** | Hayır | FontAwesome ikon sınıfı (örn: `fas fa-chart-bar`) |
| **Content Type** | Evet | İçerik tipi |
| **Content** | Evet | HTML kodu veya URL |
| **Target** | Hayır | Hedef frame |
| **Position** | Hayır | Menü konumu |
| **Menu Order** | Hayır | Sıralama |
| **Parent** | Hayır | Üst menü (alt menü oluşturmak için) |

## İçerik Tipleri

| Tip | Açıklama | Kullanım |
|-----|----------|----------|
| **HTML** | Satır içi HTML kodu | Özel dashboard, form, rapor sayfası |
| **URL** | Harici URL (iframe) | Grafana, Kibana, harici web uygulaması |

## Menü Hiyerarşisi

Custom Menu'ler 3 seviyeye kadar iç içe yapılandırılabilir:

```
Custom Menu (1. Seviye)
├── Sub Menu (2. Seviye)
│   ├── Sub-Sub Menu (3. Seviye)
│   └── Sub-Sub Menu (3. Seviye)
└── Sub Menu (2. Seviye)
```

## HTML İçerik ile Özel Sayfalar

### Değişken Değeri Gösterme (Fetch API)

```html
<div id="power-display" style="font-size: 48px; text-align: center; padding: 40px;">
  Yükleniyor...
</div>

<script>
async function loadValue() {
  const resp = await fetch('/api/variables/values?projectId=153&names=ActivePower_kW', {
    credentials: 'include',
    headers: { 'X-Space': 'claude' }
  });
  const data = await resp.json();
  const power = data.ActivePower_kW.value;
  document.getElementById('power-display').innerHTML =
    '<b>' + power.toFixed(1) + '</b> kW';
}
loadValue();
setInterval(loadValue, 5000);
</script>
```

### Web Components Alternatifi

Aynı işlem, fetch yerine inSCADA Web Components kullanılarak çok daha kısa yazılabilir:

```html
<!-- Tek satırda değişken değeri gösterme -->
<ins-value variable="ActivePower_kW" project="Energy Monitoring Demo"
           space="claude" suffix=" kW" decimals="1"
           style="font-size: 48px; font-weight: bold;">
</ins-value>
```

Web Components avantajları:
- Otomatik WebSocket bağlantısı — periyodik fetch gerekmez
- Gerçek zamanlı güncelleme
- Deklaratif sözdizimi — JavaScript yazmaya gerek yok
- Birden fazla bileşen aynı sayfada bağımsız çalışır

Detaylı bilgi: [Web Components →](/docs/tr/platform/web-components/)

### Çoklu Değişken Tablosu

```html
<style>
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #ddd; padding: 12px; text-align: left; }
  th { background: #1CA1C1; color: white; }
</style>

<table>
  <tr><th>Değişken</th><th>Değer</th><th>Birim</th></tr>
  <tr>
    <td>Aktif Güç</td>
    <td><ins-value variable="ActivePower_kW" decimals="2"></ins-value></td>
    <td>kW</td>
  </tr>
  <tr>
    <td>Gerilim</td>
    <td><ins-value variable="Voltage_V" decimals="1"></ins-value></td>
    <td>V</td>
  </tr>
  <tr>
    <td>Akım</td>
    <td><ins-value variable="Current_A" decimals="2"></ins-value></td>
    <td>A</td>
  </tr>
</table>
```

### Harici URL Entegrasyonu

Content Type = URL ile harici web uygulamalarını iframe olarak gömmek:

```
https://grafana.company.com/d/energy-dashboard?orgId=1&kiosk
```

## Rol Bazlı Menü Atama

Custom Menu'ler space seviyesinde tanımlanır, ardından roller aracılığıyla kullanıcılara atanır:

1. **Custom Menu oluştur** — Development → Custom Menus
2. **Role menü ata** — User Menu → Roles → Role Menus bölümüne ilgili custom menu'yü ekle
3. **Kullanıcıya rol ata** — ilgili rolü kullanıcıya ver

Bu sayede:
- **Operatör:** Yalnızca izleme sayfalarını görür
- **Mühendis:** Yapılandırma + izleme sayfalarını görür
- **Yönetici:** Rapor ve analiz sayfalarını görür
