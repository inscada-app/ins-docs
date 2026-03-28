---
title: "Dashboards"
description: "Space seviyesi panolar — projeler arası veri birleştirme ve widget yapısı"
sidebar:
  order: 24
---

Dashboard, space seviyesinde tanımlanan pano sistemidir. Farklı projelerden verileri tek bir ekranda birleştirmeyi sağlar. Board Group'lar altında serbest konumlandırılabilen Board (widget) kartlarından oluşur.

## Dashboard Yapısı

```
Dashboard (Space Seviyesi)
├── Board Group: "Enerji Özet"
│   ├── Board: Aktif Güç Göstergesi (x:0, y:0, 300x200)
│   ├── Board: Gerilim Göstergesi (x:320, y:0, 300x200)
│   └── Board: Günlük Tüketim Grafiği (x:0, y:220, 640x300)
│
└── Board Group: "Bina Yönetimi"
    ├── Board: HVAC Durumu
    └── Board: İç Ortam Sıcaklığı
```

## Board Group

Board Group, dashboard içindeki sayfa/sekme birimidir.

**Menü:** Dashboards (sidebar üst kısım)

| Alan | Zorunlu | Açıklama |
|------|---------|----------|
| **Name** | Evet | Grup adı |
| **Color** | Hayır | Sekme rengi |
| **Rank** | Hayır | Sıralama |

## Board (Widget)

Her Board, Board Group içinde serbest konumlandırılabilen bir karttır.

| Alan | Zorunlu | Açıklama |
|------|---------|----------|
| **Type** | Evet | Widget tipi |
| **Config** | Evet | Widget yapılandırması (JSON) |
| **X / Y** | Hayır | Konum (piksel) |
| **Width / Height** | Hayır | Boyut (piksel) |
| **Header** | Hayır | Başlık göster |

### Board Tipleri

Dashboard'a eklenebilecek widget tipleri konfigürasyon bazlı çalışır. Config alanına JSON formatında widget ayarları yazılır.

## Space Seviyesi Avantajı

Dashboard space seviyesinde tanımlandığı için:
- Farklı projelerdeki değişkenleri aynı panoda gösterebilir
- Tüm sahalar tek ekranda izlenebilir (örn: 10 farklı GES'in toplam üretimi)
- Proje bağımsız karşılaştırma yapılabilir

## Custom Menu vs Dashboard

| Özellik | Dashboard | Custom Menu |
|---------|-----------|-------------|
| **Seviye** | Space | Space |
| **Tasarım** | Sürükle-bırak widget | HTML/CSS/JS kodu |
| **Esneklik** | Yapılandırma bazlı | Tam kontrol |
| **Kullanım** | Hızlı pano oluşturma | Özel arayüz geliştirme |

:::tip
Hızlı bir genel bakış panosu için Dashboard kullanın. Tamamen özelleştirilmiş bir arayüz için Custom Menu + Web Components tercih edin.
:::
