---
title: "MCP Kullanim Rehberi"
description: "inSCADA MCP Server kullanim senaryolari, prompt ornekleri ve token optimizasyonu"
sidebar:
  order: 3
---

Bu rehber, inSCADA MCP Server'i verimli kullanmak icin senaryo bazli prompt ornekleri, optimizasyon ipuclari ve maliyet bilgileri icerir.

## Altin Kural: Space ve Proje Belirtin

Her istekte space ve proje adini belirtin. Aksi halde Claude, bunlari bulmak icin ekstra API cagrilari yapar ve gereksiz token harcanir.

```
❌ "ActivePower_kW degeri nedir?"
✅ "claude space, Energy Monitoring Demo, ActivePower_kW degeri nedir?"
```

---

## Senaryolar

### 1. Canli Deger Okuma

Kilavuz gerektirmez. Dogrudan sorun.

**Tek degisken:**
```
claude space, Energy Monitoring Demo, ActivePower_kW degeri?
```

**Birden fazla degisken:**
```
claude space, Energy Monitoring Demo, tum degiskenlerin anlik degerlerini goster
```

**Baglanti durumu:**
```
claude space, Energy Monitoring Demo, baglanti durumlarini kontrol et
```

> Yanit varsayilan olarak compact gelir — sadece deger, isim, tarih. Tum detaylar icin "detayli ver" deyin.

---

### 2. Tarihsel Veri ve Grafikler

Kilavuz gerektirmez. Zaman araligini belirtin.

**Cizgi grafik:**
```
claude space, Energy Monitoring Demo, ActivePower_kW son 24 saat grafigi
```

**Degisken karsilastirma:**
```
claude space, Energy Monitoring Demo, ActivePower_kW ve ReactivePower_kVAR karsilastir, son 6 saat
```

**istatistik:**
```
claude space, Energy Monitoring Demo, ActivePower_kW 7 gun istatistik
```

**Canli gauge:**
```
claude space, Energy Monitoring Demo, Temperature_C gauge 0-80°C
```

---

### 3. Degisken Kesfi

Kilavuz gerektirmez.

```
claude space, Energy Monitoring Demo, degiskenleri listele
```

```
claude space, Energy Monitoring Demo, "Power" iceren degiskenleri listele
```

> Degisken listesi varsayilan olarak compact gelir — sadece id, name, type, unit, dsc. "Detayli listele" derseniz connection_id, scale, log_type gibi ek alanlar da gelir.

---

### 4. Alarm ve Durum

Kilavuz gerektirmez.

```
claude space, aktif alarmlari goster
```

```
claude space, Energy Monitoring Demo, proje durumu
```

---

### 5. Script Yazma

**Kilavuz GEREKLI.** Nashorn ES5 kurallari kritiktir.

```
inscada guide oku. claude space, Energy Monitoring Demo, her 10 saniyede
sicaklik 60°C uzerine cikinca bildirim gonderen script yaz
```

```
inscada guide oku. claude space, Energy Monitoring Demo,
"Chart_ActiveReactivePower" scriptini oku ve grafik renklerini degistir
```

**Script arama (kilavuz gerektirmez):**
```
claude space, scriptlerde "getVariableValue" ara
```

---

### 6. Animasyon Olusturma

**Kilavuz GEREKLI.** SVG kurallari ve eleman tipleri kritiktir.

```
inscada guide oku. claude space, Energy Monitoring Demo icin
ActivePower_kW, Voltage_V, Current_A gosteren SVG animation olustur
```

---

### 7. Dashboard

Sablon kullaniliyorsa kilavuz gerektirmez. Ozel HTML icin kilavuz onerilir.

**Sablon (hizli):**
```
claude space, Energy Monitoring Demo, ActivePower_kW gauge dashboard, 0-1000 kW
```

**Coklu grafik:**
```
claude space, Energy Monitoring Demo, multi_chart dashboard
ActivePower_kW, Voltage_V, Current_A
```

**Ozel HTML:**
```
inscada guide oku. claude space, Energy Monitoring Demo icin
ozel HTML dashboard — ustte 3 gauge, altta trend grafigi
```

---

### 8. Excel'e Aktarma

Kilavuz gerektirmez.

```
claude space, Energy Monitoring Demo, ActivePower_kW 24 saat verisini Excel'e aktar
```

---

### 9. API Kesfi

Kilavuz gerektirmez.

```
inSCADA API'de alarm endpoint'leri bul
```

---

## Hizli Referans

| Gorev | Prompt Sablonu | Kilavuz? |
|-------|----------------|----------|
| Canli deger | `claude space, proje, degisken degeri?` | Hayir |
| Grafik | `claude space, proje, degisken son 24 saat grafigi` | Hayir |
| Gauge | `claude space, proje, degisken gauge 0-100` | Hayir |
| istatistik | `claude space, proje, degisken 7 gun istatistik` | Hayir |
| Alarmlar | `claude space, aktif alarmlar` | Hayir |
| Proje durumu | `claude space, proje durumu` | Hayir |
| Degisken listesi | `claude space, proje, degiskenleri listele` | Hayir |
| Script yazma | `inscada guide oku. claude space, proje, script yaz...` | **Evet** |
| Animasyon | `inscada guide oku. claude space, proje, animation olustur...` | **Evet** |
| Dashboard (sablon) | `claude space, proje, gauge dashboard degisken 0-1000 kW` | Hayir |
| Dashboard (ozel) | `inscada guide oku. claude space, proje, ozel dashboard...` | **Evet** |
| Excel | `claude space, proje, degisken 24 saat Excel` | Hayir |
| API kesfi | `API'de alarm endpoint'leri bul` | Hayir |

---

## Compact ve Verbose Yanitlar

Varsayilan olarak arac yanitlari sadece gerekli alanlari dondurur (compact mod). Bu, token tuketimini %60-80 azaltir. Detayli bilgi gerektiginde "detayli ver" deyin veya `verbose: true` parametresini kullanin.

### inscada_get_live_value

**Compact (varsayilan):**
```json
{
  "value": 421.79,
  "name": "ActivePower_kW",
  "dsc": "Total active power",
  "date": "2026-04-03T00:43:08"
}
```

**Verbose ("detayli ver"):**
```json
{
  "@class": "...NumberVariableValue",
  "flags": {"scaled": true},
  "value": 421.79,
  "extras": {"raw_value": 306.73},
  "variableShortInfo": {
    "dsc": "...", "frame": "...",
    "device": "...", "connection": "..."
  },
  "dateInMs": 1775166188708
}
```

**Tasarruf: %64**

### inscada_get_live_values

**Compact (varsayilan):**
```json
{
  "ActivePower_kW": {"value": 421.79, "date": "2026-04-03..."},
  "Voltage_V": {"value": 232.9, "date": "2026-04-03..."}
}
```

**Verbose:** Her degisken icin flags, extras, variableShortInfo dahil tam API yaniti.

**Tasarruf: %83**

### list_variables

**Compact (varsayilan):**
```json
[{
  "id": 23227,
  "name": "ActivePower_kW",
  "type": "Float",
  "unit": "kW",
  "dsc": "Total active power"
}]
```

**Verbose:** connection_id, project_id, is_active, eng_zero_scale, eng_full_scale, log_type, code gibi ek alanlar.

**Tasarruf: %61**

---

## Maliyet Tahmini

Fiyatlar: Giris $3/MTok, Cikis $15/MTok (Sonnet 4.6). Kur: 1 USD = 44.50 TL.

| Senaryo | Giris Token | Cikis Token | USD | TL |
|---------|-------------|-------------|-----|-----|
| Canli deger sorgusu | ~6,400 | ~300 | $0.024 | ~1.0 TL |
| Cizgi grafik | ~6,400 | ~3,000 | $0.064 | ~2.8 TL |
| Script yazma (kilavuzlu) | ~8,800 | ~7,900 | $0.145 | ~6.4 TL |
| Animasyon olusturma (kilavuzlu) | ~9,600 | ~11,200 | $0.197 | ~8.7 TL |
| Dashboard (sablon) | ~6,400 | ~1,500 | $0.042 | ~1.9 TL |

### Compact ile Tasarruf

| Senaryo | Optimizasyon oncesi | Optimizasyon sonrasi | Tasarruf |
|---------|--------------------|--------------------|----------|
| Canli deger sorgusu | ~1.7 TL | ~1.0 TL | **%41** |
| 10 degisken toplu | ~3.2 TL | ~1.5 TL | **%53** |
| Degisken listesi (500) | ~4.8 TL | ~2.5 TL | **%48** |

---

## Maliyet Azaltma ipuclari

- **Her zaman space + proje belirtin** — 500-1000 token kesfetme maliyetinden tasarruf
- **Kilavuz sadece gerektiginde** — Basit sorgularda ~4,000 token tasarruf
- **Compact varsayilan** — "detayli" sadece ham degerlere ihtiyac duydugunuzda
- **Basit sorgular icin Haiku 4.5** — Sonnet'e gore %67 daha ucuz
- **Batch API** — Acil olmayan toplu islemler icin %50 indirimli
- **Prompt Caching** — Arac tanimlari ilk cagri sonrasi %10 maliyetle cache'lenir
