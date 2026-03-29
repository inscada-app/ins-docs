---
title: "Animation Yapılandırma"
description: "Animation ayarları, erişim rolleri, toolbar araçları ve Pre/Post Animation Scripts"
sidebar:
  order: 1
  label: "Yapılandırma"
---

Bu sayfada bir animation'ın yapılandırma paneli, toolbar araçları ve script ayarları açıklanmaktadır.

## Yapılandırma Paneli

Animation Dev ekranında kalem ikonuna tıklayarak yapılandırma panelini açabilirsiniz:

![Animation Yapılandırma Paneli](../../../../../assets/docs/editor-anim-config.png)

### Temel Ayarlar

| Alan | Zorunlu | Açıklama |
|------|---------|----------|
| **Name** | Evet | Ekran adı (proje içinde benzersiz) |
| **Description** | Hayır | Açıklama |
| **Duration** | Evet | Tarama sonrası bekleme süresi (ms, min: 100). Detay aşağıda |
| **Play Order** | Evet | Visualization ekranındaki sıralama numarası |
| **Main** | Evet | Visualization menüsünde görünsün mü |
| **Color** | Hayır | Ekranın arka plan rengi. Varsayılan: `#00DDDC` |
| **Alignment** | Hayır | SVG'nin ekrana hizalama modu |
| **Join** | Hayır | Zincirleme bağlanacak animation |

### Duration (Bekleme Süresi)

Duration, iki tarama arasındaki **bekleme süresidir** — tarama periyodu değil:

```
Toplam Döngü = Tarama Süresi + Duration (bekleme)
```

1. Sunucu tüm element expression'larını çalıştırır → **tarama süresi**
2. Tarama tamamlandıktan sonra `duration` ms kadar beklenir
3. Yeni tarama başlar

:::caution[Çok Küçük Duration]
Duration çok küçük ayarlandığında, element sayısı fazla veya expression'lar ağır ise tarayıcıda **arayüz donması** oluşabilir.

| Senaryo | Önerilen Duration |
|---------|------------------|
| Az element (< 20), basit expression | 200 - 500 ms |
| Orta element (20-50), karışık expression | 500 - 1000 ms |
| Çok element (50+), ağır hesaplama | 1000 - 2000 ms |
:::

### Main ve Play Order

**Runtime → Visualization** menüsü, projedeki **Main** işaretli animation'ları listeler. Alt kısımda sayfa geçiş butonları **Play Order** sırasına göre soldan sağa dizilir.

```
Visualization Ekranı
┌──────────────────────────────────────────────────┐
│                                                  │
│          [ Aktif Animation İçeriği ]             │
│                                                  │
├──────────────────────────────────────────────────┤
│  ⚡ Energy Overview  │  📈 Power Chart  │  ...   │  ← Play Order sırası
└──────────────────────────────────────────────────┘
```

- **Main = true** → Visualization menüsünde görünür
- **Main = false** → Yalnızca Development'ta erişilebilir (Open ile açılan alt ekranlar, popup'lar için)
- **Play Order = 1** → En solda, **2** → sonraki, ...

### Color (Arka Plan Rengi)

Animation'ın arka plan rengi bu alandan ayarlanır.

:::note
Inkscape'te ayarlanan arka plan rengi inSCADA'ya aktarılmaz. Arka plan rengi yalnızca bu alandan belirlenir.
:::

### Alignment (Hizalama)

SVG içeriğinin ekrandaki konumunu belirler:

| Değer | Konum |
|-------|-------|
| **top-left** | Sol üst |
| **top-mid** | Üst orta |
| **top-right** | Sağ üst |
| **mid-left** | Orta sol |
| **mid-mid** | Tam orta (varsayılan) |
| **mid-right** | Orta sağ |
| **bottom-left** | Sol alt |
| **bottom-mid** | Alt orta |
| **bottom-right** | Sağ alt |
| **none** | Hizalama yok |

### Join (Animation Zincirleme)

Bir animation'ı başka bir animation ile zincirleyerek sıralı geçiş oluşturur. Join alanında aynı projedeki diğer animation'lar listelenir.

---

## Erişim Rolleri (Access Roles)

Yapılandırma panelinin alt kısmında **Access Roles** bölümü bulunur. Bu bölümde platformda tanımlı tüm roller checkbox olarak listelenir.

Seçilen roller, bu animation'a **runtime'da kimlerin erişebileceğini** belirler:

- Yalnızca işaretli rollere sahip kullanıcılar bu animation'ı Visualization'da görebilir
- Hiçbir rol seçilmezse veya tümü seçilirse tüm kullanıcılar erişebilir
- Bu sayede aynı projede farklı kullanıcı gruplarına farklı ekranlar gösterilebilir

Örnek:
- "Genel Bakış" ekranı → tüm roller erişebilir
- "Kontrol Paneli" ekranı → yalnızca "Engineer" ve "Administrator" rolleri
- "Yönetim Raporu" ekranı → yalnızca "Administrator" rolü

---

## Pre/Post Animation Scripts

Animation'a iki tür script bağlanabilir:

### Pre-Animation Code

Her tarama döngüsünde, element expression'larından **önce** çalışır. İki şekilde tanımlanabilir:

**1. Satır İçi Kod (Custom Code)**

Doğrudan JavaScript kodu yazılır:

```javascript
if (__firstScan) {
    // İlk açılışta tarihsel veri yükle
    var end = ins.now();
    var start = ins.getDate(end.getTime() - 3600000);
    var logs = ins.getLoggedVariableValuesByPage(
        ['ActivePower_kW'], start, end, 0, 100
    );
}
```

**2. Script Seçimi**

Projede tanımlı zamanlanmış script'lerden seçim yapılır. Birden fazla script seçilebilir — seçilen script'ler sırayla çalıştırılır.

### Post-Animation Code

Her tarama döngüsünde, element expression'larından **sonra** çalışır. Aynı şekilde satır içi kod veya script seçimi ile tanımlanır.

### Çalışma Sırası

```
Her döngüde:
1. Pre-Animation Code
2. Animation Elements (tüm binding'ler)
3. Post-Animation Code
    ↓ duration ms bekleme
    ↑ tekrar başa dön
```

### Yerleşik Değişkenler

Script'ler ve element expression'ları içinde kullanılabilen yerleşik değişkenler:

| Değişken | Tip | Açıklama |
|----------|-----|----------|
| `__firstScan` | Boolean | İlk döngüde `true`, sonrasında `false` |
| `__animName` | String | Çalışan animation'ın adı |
| `__parameters` | String | Placeholder parametreleri |

---

## Toolbar Araçları

Animation Dev ekranının sağ üst köşesindeki toolbar ikonları:

| İkon | Araç | Açıklama |
|------|------|----------|
| **+** (artı) | Yeni Animation | Yeni animation oluştur |
| **✏️** (kalem) | Yapılandırma | Animation ayarlarını düzenle (bu sayfa) |
| **−** (eksi) | Sil | Animation'ı sil |
| **✨** (sihirli değnek) | Element Editor | SVG objesine animation binding yap |
| **🚀** (roket) | Preview | Animation'ı canlı önizle |
| **⬆** (upload) | SVG Yükle | SVG dosyası upload et |
| **⬇** (download) | SVG İndir | Mevcut SVG'yi indir |
| **+** (daire) | Placeholder | Animation parametrelerini yönet |

### Üç Nokta Menüsü (⋮)

| Araç | Açıklama |
|------|----------|
| **Clone** | Animation'ı kopyala |
| **Show Scripts** | Bağlı script'leri göster |
| **Generate Link** | Paylaşılabilir bağlantı oluştur |
| **Backup** | Animation'ı dışa aktar |
| **Restore** | Animation'ı içe aktar |

---

## Placeholder (Parametrik Ekran)

Toolbar'daki Placeholder butonu ile animation'a parametreler tanımlanabilir. Bu parametreler sayesinde aynı SVG tasarımı farklı değerlerle tekrar kullanılabilir.

Kullanım: Bir "Motor Detay" ekranı tasarlayın, `{motor_id}` ve `{motor_name}` placeholder'ları tanımlayın. Open animation tipi ile farklı parametrelerle açıldığında her seferinde farklı motoru gösterir.

Placeholder değerleri script içinde `__parameters` değişkeni ile okunabilir.
