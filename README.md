# inSCADA Docs

inSCADA endüstriyel SCADA/IIoT platformunun resmi dokümantasyon sitesi.

**Canlı:** https://inscada.com/docs/ · **Stack:** [Astro](https://astro.build) + [Starlight](https://starlight.astro.build)

## Yapı

Dokümanlar iki bağımsız sürüm ağacı olarak organize edilmiştir:

- **JDK 11 (Legacy)** — `src/content/docs/{tr,en}/jdk11/` — Nashorn motoru, ECMAScript 5
- **JDK 21 (Current)** — `src/content/docs/{tr,en}/jdk21/` — modern JS motoru, yeni mimari

Her iki sürüm de iki dilde yayınlanır: **Türkçe** (varsayılan) ve **İngilizce**.

```
src/
├── assets/                    # Paylaşılan görseller
├── components/                # Starlight override'ları (Sidebar, Search, SiteTitle, …)
├── content/
│   └── docs/
│       ├── tr/
│       │   ├── index.mdx      # Picker — JDK 11 / JDK 21 seçimi + karşılaştırma
│       │   ├── jdk11/         # Klasik sürüm içeriği
│       │   └── jdk21/         # Yeni nesil sürüm içeriği
│       └── en/                # Aynı yapı (İngilizce)
└── styles/
astro.config.mjs               # versionSidebar(v) ile iki ağaç üretilir
```

### Sürüm Yönlendirme

- URL segmenti sürümü belirler: `/docs/{lang}/jdk11/…` veya `/docs/{lang}/jdk21/…`
- Picker sayfası (`/docs/tr/`) iki sürüm arasındaki farkları gösterir ve seçim sunar
- Sidebar aktif URL'deki sürüme göre otomatik filtrelenir (`src/components/Sidebar.astro`)
- Pagefind araması `mergeFilter` ile yalnızca aktif sürümde arar (`src/components/Search.astro`)
- Her sayfa `data-pagefind-filter="version:jdkXX"` ile etiketlenir (`MarkdownContent.astro`)
- Sidebar üstündeki `VersionSwitcher` geçerli slug'ı koruyarak sürümler arasında geçiş yapar

## Geliştirme

```bash
npm install
npm run dev         # http://localhost:4321/docs/
npm run build       # dist/ üretir, pagefind index'i oluşturur
npm run preview     # build çıktısını lokal önizle
```

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Watch modunda dev server |
| `npm run build` | Production build + Pagefind index |
| `npm run preview` | Build çıktısını önizle |

## Yeni İçerik Ekleme

1. İlgili sürüm klasörüne `.md` veya `.mdx` dosyası ekle: `src/content/docs/tr/jdk21/platform/yeni-sayfa.md`
2. Frontmatter: `title`, `description` zorunlu
3. Sidebar'da görünmesi için — klasör `autogenerate` ile yönetiliyorsa otomatik eklenir; elle listelenen yerlere `astro.config.mjs` içinde `versionSidebar()` altındaki ilgili bloğa eklenir
4. EN karşılığı için `src/content/docs/en/jdk21/…/yeni-sayfa.md` oluştur
5. Görseller `src/assets/docs/` altına koyulur, markdown'dan relative path ile referans edilir

## Deploy

Sunucuda deploy scripti çalıştırılır (master'a push sonrası):

```bash
ssh root@89.167.87.65 "bash /opt/deploy-docs.sh"
```

Script: `git pull` → `npm ci` → `npm run build` → Nginx'in serve ettiği `/opt/inscada-docs/dist/` yolunu günceller.

## Katkı

- Branch aç, değişikliği yap, commit et
- `npm run build` ile yerelde build geçtiğinden emin ol
- PR aç veya direkt master'a push (erişimin varsa)
