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

![Claude Desktop — inSCADA MCP Extension ayarlari](../../../../assets/docs/mcp-extension-settings.png)

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

## Araclar

MCP Server 37 arac icerir. 8 kategoride gruplanmistir:

- **Space & Veri** (9) — Space, proje, degisken, script, baglanti yonetimi
- **Animasyon** (2) — Animasyon listeleme ve detaylari
- **SCADA Operasyonlari** (10) — Canli deger, alarm, baglanti durumu, tarihsel veri
- **Grafikler** (5) — Cizgi, cubuk, gauge, coklu seri, tahmin grafikleri
- **Custom Menu** (6) — Menu CRUD islemleri (sablonlu olusturma destegi)
- **Genel API** (3) — 625+ endpoint kesfi ve cagrisi
- **Disa Aktarma** (1) — Excel dosyasi olusturma
- **Kilavuz** (1) — Script kurallari, animasyon tipleri, en iyi pratikler

Detayli parametre ve kullanim bilgileri icin: [Arac Referansi](/docs/tr/ai/tools-reference/)

Kullanim senaryolari, prompt ornekleri ve token optimizasyonu icin: [Kullanim Rehberi](/docs/tr/ai/mcp-usage-guide/)

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
