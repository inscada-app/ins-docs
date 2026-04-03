---
title: "MCP Server"
description: "Claude Desktop ve diger AI istemcilerini inSCADA sisteminize baglayin"
sidebar:
  order: 2
---

inSCADA MCP Server, AI asistanlarini (Claude, VS Code Copilot, Cursor vb.) dogrudan inSCADA SCADA sisteminize baglayan bir koprudur. [Model Context Protocol (MCP)](https://modelcontextprotocol.io) uzerinden 37 arac ile canli deger okuma, alarm izleme, script yazma, tarihsel veri analizi, grafik olusturma ve daha fazlasini yapabilirsiniz.

> **Not:** Bu MCP sunucusu **inSCADA JDK11** surumu icin tasarlanmistir.

## MCP Nedir?

Model Context Protocol (MCP), AI asistanlarinin dis sistemlerle guvenli ve standart bir sekilde iletisim kurmasini saglayan acik bir protokoldur. MCP sayesinde:

- AI asistani, inSCADA API'sine dogrudan erisir
- Kullanici dogal dilde komut verir, AI arka planda uygun araclari cagirir
- Tehlikeli islemler (deger yazma, script calistirma) icin kullanicidan onay istenir
- Tum iletisim lokal makinede kalir, ucuncu tarafa veri gonderilmez

## Kurulum

iki farkli kurulum yontemi vardir:

### Yontem 1: Extension Dosyasi (MCPB)

En kolay kurulum yontemi. Claude Desktop icin ozel olarak hazirlanmis extension dosyasini kullanir.

1. [inscada.com/download](https://inscada.com/download/) sayfasindan `inscada-mcp-server.zip` dosyasini indirin
2. ZIP'i aciп icindeki `.mcpb` dosyasini cift tiklayin — Claude Desktop otomatik acilir
3. Acilan formda bilgileri doldurun:
   - **inSCADA URL**: Sunucu adresi (ornegin `http://localhost:8081` veya `https://sunucu:8082`)
   - **Username**: inSCADA kullanici adi
   - **Password**: inSCADA sifresi
4. Tamam! Extension, Claude Desktop'ta ikon ve aciklamasiyla gorunur.

**Avantajlari:**
- Tek tikla kurulum, JSON dosyasi duzenlemeye gerek yok
- Claude Desktop icinde ikon, aciklama ve ayar paneli gorunur
- Sifreler maskelenmis GUI formunda girilir
- Guncellemek icin yeni `.mcpb` dosyasini indirip tekrar yuklemek yeterli

### Yontem 2: JSON Yapilandirmasi

Gelistiriciler ve CI/CD ortamlari icin uygundur. Claude Desktop config dosyasini manuel olarak duzenlersiniz.

**Config dosyasi konumu:**
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

Asagidaki JSON'u config dosyasina ekleyin:

```json
{
  "mcpServers": {
    "inscada": {
      "command": "npx",
      "args": ["-y", "@inscada/mcp-server"],
      "env": {
        "INSCADA_API_URL": "http://localhost:8081",
        "INSCADA_USERNAME": "kullanici_adi",
        "INSCADA_PASSWORD": "sifre"
      }
    }
  }
}
```

Claude Desktop'i yeniden baslatin.

**Avantajlari:**
- `npx` her calistirmada en son surumu otomatik indirir
- Baska MCP istemcileriyle de (VS Code Copilot, Cursor, Windsurf) uyumlu
- Birden fazla inSCADA sunucusu tanimlanabilir
- Ortam degiskenleriyle yapilandirma esnekligi

### Kurulum Yontemlerinin Karsilastirmasi

| | Extension (.mcpb) | JSON Config |
|---|---|---|
| **Kurulum** | Cift tikla + GUI form | JSON dosyasini manuel duzenle |
| **Arayuz** | ikon, aciklama, ayar paneli | Sadece araclar, gorunum yok |
| **Kimlik bilgileri** | GUI form, sifreler maskeli | JSON'da duz metin |
| **Guncelleme** | Yeni .mcpb indir | JSON guncelle veya `npx` otomatik indirir |
| **Uyumluluk** | Sadece Claude Desktop | Tum MCP istemcileri |
| **En uygun** | Son kullanicilar, operatorler | Gelistiriciler, CI/CD |

## Gereksinimler

- [Node.js](https://nodejs.org) 18 veya ustu
- Calisan bir inSCADA sunucusu (JDK11 surumu)
- MCP destekleyen bir AI istemci (Claude Desktop, VS Code Copilot, Cursor vb.)

## Ortam Degiskenleri

| Degisken | Zorunlu | Aciklama |
|----------|---------|----------|
| `INSCADA_API_URL` | Hayir | inSCADA API adresi (varsayilan: `http://localhost:8081`) |
| `INSCADA_USERNAME` | Evet | inSCADA kullanici adi |
| `INSCADA_PASSWORD` | Evet | inSCADA sifresi |

## Arac Kategorileri

MCP Server 37 arac icerir. Her arac belirli bir SCADA islemini gerceklestirir.

### Space Yonetimi

| Arac | Tur | Aciklama |
|------|-----|----------|
| `set_space` | Okuma | Aktif space degistirme |

### Veri Araclari

| Arac | Tur | Aciklama |
|------|-----|----------|
| `list_spaces` | Okuma | Space listesi |
| `list_projects` | Okuma | Proje listesi |
| `list_variables` | Okuma | Degisken (tag) listesi |
| `list_scripts` | Okuma | Script listesi |
| `get_script` | Okuma | Script kodu ve detaylari |
| `update_script` | Yazma | Script guncelleme |
| `list_connections` | Okuma | Baglanti listesi |
| `search_in_scripts` | Okuma | Scriptlerde metin arama |

### Animasyon

| Arac | Tur | Aciklama |
|------|-----|----------|
| `list_animations` | Okuma | Animasyon listesi |
| `get_animation` | Okuma | Animasyon detaylari ve elemanlari |

### SCADA Operasyonlari

| Arac | Tur | Aciklama |
|------|-----|----------|
| `inscada_get_live_value` | Okuma | Tek degiskenin canli degerini oku |
| `inscada_get_live_values` | Okuma | Birden fazla degiskenin canli degerlerini oku |
| `inscada_set_value` | Yazma | Degiskene deger yaz (gercek ekipman!) |
| `inscada_get_fired_alarms` | Okuma | Aktif alarmlari listele |
| `inscada_connection_status` | Okuma | Baglanti durumu (Connected/Disconnected) |
| `inscada_project_status` | Okuma | Proje calisma durumu |
| `inscada_run_script` | Yazma | Script calistir |
| `inscada_script_status` | Okuma | Script calisma durumu |
| `inscada_logged_values` | Okuma | Tarihsel log verileri |
| `inscada_logged_stats` | Okuma | istatistikler (min, max, avg, sum) |

### Genel API

| Arac | Tur | Aciklama |
|------|-----|----------|
| `inscada_api_endpoints` | Okuma | 625+ API endpoint'i arasinda arama |
| `inscada_api_schema` | Okuma | Endpoint parametre semasi |
| `inscada_api` | Yazma | Herhangi bir API endpoint'ini cagir |

### Grafikler

| Arac | Tur | Aciklama |
|------|-----|----------|
| `chart_line` | Okuma | Zaman serisi cizgi grafik |
| `chart_bar` | Okuma | Cubuk grafik (karsilastirma) |
| `chart_gauge` | Okuma | Canli gosterge (2sn yenileme) |
| `chart_multi` | Okuma | Coklu seri grafik |
| `chart_forecast` | Okuma | Tarihsel + tahmin grafigi |

### Custom Menu

| Arac | Tur | Aciklama |
|------|-----|----------|
| `list_custom_menus` | Okuma | Menu listesi |
| `get_custom_menu` | Okuma | Menu detaylari |
| `get_custom_menu_by_name` | Okuma | isme gore menu arama |
| `create_custom_menu` | Yazma | Menu olusturma (sablonlu) |
| `update_custom_menu` | Yazma | Menu guncelleme |
| `delete_custom_menu` | Yazma | Menu silme |

### Disa Aktarma

| Arac | Tur | Aciklama |
|------|-----|----------|
| `export_excel` | Yazma | Excel (.xlsx) dosyasi olusturma |

### Kilavuz

| Arac | Tur | Aciklama |
|------|-----|----------|
| `inscada_guide` | Okuma | Kullanim kurallari, script API referansi, en iyi pratikler |

> Tum araclarin detayli parametreleri ve kullanim ornekleri icin [Arac Referansi](/docs/tr/ai/tools-reference/) sayfasina bakin.

## Kullanim Senaryolari

### Canli Deger Okuma

```
"AN01_Active_Power degiskeninin guncel degeri nedir?"
```

Claude, `list_projects` ile projeyi bulur, ardindan `inscada_get_live_value` ile canli degeri okur ve sonucu gosterir.

### Tarihsel Veri Analizi

```
"Son 24 saatlik sicaklik trendini goster ve gelecek 6 saati tahmin et"
```

Claude, `inscada_logged_values` ile tarihsel veriyi ceker, analiz eder, tahmin degerleri uretir ve `chart_forecast` ile birlestirmis grafigi olusturur.

### Script Yazma

```
"Kazan sicakligi 90 dereceyi astiginda e-posta uyarisi gonderen bir script yaz"
```

Claude, `inscada_guide` ile script kurallarini (Nashorn ES5) yukler, kurallara uygun scripti yazar ve `update_script` ile kaydeder (onay gerekir).

### Dashboard Olusturma

```
"AN01_Active_Power icin canli gosterge ve cizgi grafik iceren bir dashboard olustur"
```

Claude, `create_custom_menu` aracini `gauge_and_chart` sablonuyla cagirir. inSCADA'da 2 saniyede bir yenilenen gauge ve tarihsel grafik iceren yeni bir menu sayfasi olusturulur.

### Veriyi Excel'e Aktarma

```
"Tum projelerin script listesini Excel dosyasina aktar"
```

Claude, projeleri ve scriptleri toplar, `export_excel` ile her proje icin ayri sayfa iceren bir Excel dosyasi olusturur.

### Alarm izleme

```
"Aktif alarmlar var mi? Varsa detaylarini goster"
```

Claude, `inscada_get_fired_alarms` ile aktif alarmlari listeler, alarm adi, durumu, tetiklenme zamani ve aciklamasini gosterir.

## Compact ve Verbose Yanit Modu

Token kullanimi optimize etmek icin bazi araclar iki modda calisir:

### Compact Mod (Varsayilan)
Sadece gerekli alanlari dondurur. Ornegin `inscada_get_live_value` sadece deger, isim, birim ve tarih dondurur.

### Verbose Mod
`verbose: true` parametresi ile tum API yanitini dondurur. Detayli bilgi gerektiginde kullanin.

```
"AN01_Active_Power'in tum detaylarini goster" → verbose mod
"AN01_Active_Power degeri nedir?" → compact mod (varsayilan)
```

**Compact modu destekleyen araclar:**
- `inscada_get_live_value` — Compact: value, name, unit, date
- `inscada_get_live_values` — Compact: {degisken: {value, date}} haritasi
- `list_variables` — Compact: id, name, type, unit, dsc

Bu optimizasyon, tipik kullaninda %60-80 arasi cikis token tasarrufu saglar.

## Guvenlik

### Tehlikeli Araclar
Asagidaki araclar gercek ekipmanlari etkiler ve her kullaninda **kullanici onayi** gerektirir:

- **`inscada_set_value`** — Gercek ekipmana deger yazar (PLC, invertor vb.)
- **`inscada_run_script`** — Sunucu tarafinda script calistirir
- **`update_script`** — Script kodunu degistirir
- **`inscada_api`** (POST/PUT/DELETE) — Genel API uzerinden veri degistirir

Bu araclar MCP guvenlik anotasyonlari (`destructiveHint: true`) ile isaretlenmistir. AI istemci, bu araclari cagirmadan once kullanicidan onay ister.

### Kimlik Bilgileri
- Kimlik bilgileri sadece lokal makinede saklanir (config dosyasi veya Claude Desktop ayarlari)
- Oturum token'lari bellekte tutulur, uygulama kapatildiginda silinir
- Ucuncu tarafa hicbir veri gonderilmez

## npm Paketi

MCP Server, npm uzerinden acik kaynak olarak yayinlanmistir:

```bash
npm install -g @inscada/mcp-server
```

Veya `npx` ile dogrudan calistirin:

```bash
npx -y @inscada/mcp-server
```

**Paket:** [@inscada/mcp-server](https://www.npmjs.com/package/@inscada/mcp-server)
**GitHub:** [inscada-app/mcp-desktop-extension](https://github.com/inscada-app/mcp-desktop-extension)

## Telemetri

MCP Server, urun iyilestirme amaciyla anonim kullanim istatistikleri toplar:

- Hangi araclarin ne siklikla cagirildibi
- Hata oranlari
- Oturum suresi

**Toplanmayan veriler:**
- SCADA degerleri, degisken adlari veya proje bilgileri
- Kullanici adi, sifre veya kisisel bilgiler
- AI asistana gonderilen mesajlar veya yanitlar

Telemetri tamamen anonim ve isteige baglidir.

## Sorun Giderme

### "Node.js bulunamadi" Hatasi
Node.js 18+ kurulu oldugundan emin olun: `node --version`

### Baglanti Hatasi
- inSCADA sunucusunun calistigini dogrulayin
- `INSCADA_API_URL` adresinin dogru oldugundan emin olun
- Guvenlik duvari veya proxy ayarlarini kontrol edin

### Araclar Gorunmuyor
- Claude Desktop'i yeniden baslatin
- Config dosyasindaki JSON sozdizimini kontrol edin
- `npx -y @inscada/mcp-server` komutunu terminalde calistirarak hata mesajlarini goruntuleyin

### Antivirus Engellemesi
Bazi antivirus yazilimlari `.mcpb` dosyasini engelleyebilir. Bu durumda ZIP formatinda indirip icinden `.mcpb` dosyasini cikarin veya JSON yapilandirma yontemini kullanin.
