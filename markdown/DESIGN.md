# DESIGN.md — Modulin Design System

> Sistem desain untuk Modulin, alat bantu penyusunan modul ajar berbasis AI untuk guru Indonesia. Dokumen ini adalah sumber kebenaran desain — semua keputusan warna, tipografi, layout, dan komponen mengacu ke sini.

---

## Overview

Modulin mengambil posisi visual sebagai **alat kerja profesional yang hangat** — bukan platform belajar siswa yang ramai dan penuh warna, bukan dashboard korporat yang dingin. Atmosfer dasarnya adalah **canvas krem hangat** (`{colors.canvas}` — #faf8f4) — sengaja bukan putih bersih yang membuat mata cepat lelah saat guru bekerja berjam-jam menyusun modul, dan bukan abu-abu dingin yang terasa seperti software enterprise.

Headline menggunakan **serif display** (Cormorant Garamond, weight 600) dengan letter-spacing negatif, dipasangkan dengan **Inter** sebagai body sans. Kombinasi ini terasa seperti buku panduan guru yang didesain baik — otoritatif tapi ramah, bukan template SaaS generik.

Voltase brand datang dari **pasangan krem + teal** — teal (`{colors.primary}` — #2a7d6e) adalah aksen utama Modulin, digunakan di setiap CTA primer, indikator status aktif, dan elemen navigasi kunci. Teal dipilih karena tiga alasan: (1) asosiasi pertumbuhan dan pembelajaran, (2) kontras kuat terhadap canvas krem tanpa terasa agresif, (3) diferensiasi dari merah Ruangguru, biru Google Classroom, dan hijau-kuning Zenius.

Sistem memiliki tiga mode permukaan yang bergantian:
1. **Canvas krem** (`{colors.canvas}`) — lantai default body
2. **Card krem terang** (`{colors.surface-card}`) — background feature card dan form area
3. **Permukaan gelap hangat** (`{colors.surface-dark}`) — editor modul, panel preview, footer

Permukaan gelap adalah tempat Modulin menampilkan "chrome" produknya — editor TipTap, preview modul, panel hasil AI. Kontras krem-ke-gelap menjadi ritme visual halaman.

**Karakteristik Kunci:**
- Canvas krem hangat (`{colors.canvas}` — #faf8f4) dengan teks gelap hangat (`{colors.ink}` — #1a1917). Warna yang membedakan Modulin dari aplikasi edtech lain.
- Teal primer (`{colors.primary}` — #2a7d6e). Digunakan hemat pada tombol individual, lebih berani pada section CTA dan indikator status.
- Headline serif display via Cormorant Garamond pada weight 600 dengan letter-spacing negatif. Dipasangkan dengan Inter body untuk suara editorial pendidikan.
- Permukaan gelap hangat (`{colors.surface-dark}` — #1c1b18) untuk editor modul, preview dokumen, dan panel hasil AI — menunjukkan produk sebenarnya, bukan ilustrasi abstrak.
- Card krem terang (`{colors.surface-card}` — #f0ebe0) — sedikit lebih gelap dari canvas, untuk form dan area konten.
- Aksen amber (`{colors.accent-amber}` — #d4940a) sebagai warna sekunder hangat untuk badge, status, dan highlight.
- Border radius hierarkis: `{rounded.md}` (8px) untuk tombol + input, `{rounded.lg}` (12px) untuk content card, `{rounded.xl}` (16px) untuk container utama editor, `{rounded.pill}` untuk badge.
- Jarak antar section `{spacing.section}` (64px) — lebih rapat dari marketing page karena ini aplikasi kerja, bukan landing page.

---

## Colors

### Brand & Accent
- **Teal / Primary** (`{colors.primary}` — #2a7d6e): Aksen utama Modulin. Digunakan pada setiap CTA primer, indikator progres generate AI, ikon navigasi aktif, dan link inline. Teal yang hangat — bukan cyan dingin, bukan hijau mentah.
- **Teal Active** (`{colors.primary-active}` — #1f6358): Varian press/hover yang lebih gelap.
- **Teal Light** (`{colors.primary-light}` — #e6f3f0): Background ringan untuk area yang terkait AI atau status aktif.
- **Teal Disabled** (`{colors.primary-disabled}` — #b8c9c5): State disabled yang desaturasi.
- **Accent Amber** (`{colors.accent-amber}` — #d4940a): Aksen sekunder hangat. Digunakan pada badge status ("Draft", "Final"), ikon perhatian, dan highlight dalam editor. Amber yang dalam — bukan kuning cerah.
- **Accent Amber Light** (`{colors.accent-amber-light}` — #fef8e8): Background ringan untuk callout dan tips.
- **Accent Coral** (`{colors.accent-coral}` — #c4694e): Warna ketiga yang sangat jarang — hanya untuk error state dan warning kritis. Tidak pernah untuk CTA.

### Surface
- **Canvas** (`{colors.canvas}` — #faf8f4): Lantai halaman default. Krem hangat — sengaja bukan putih murni. Guru bekerja berjam-jam di layar ini; krem mengurangi kelelahan mata.
- **Surface Soft** (`{colors.surface-soft}` — #f5f0e6): Background section yang sedikit berbeda dari canvas, untuk memecah monotoni tanpa border.
- **Surface Card** (`{colors.surface-card}` — #f0ebe0): Background form, content card, dan area interaktif. Satu level lebih gelap dari canvas.
- **Surface Cream Strong** (`{colors.surface-cream-strong}` — #e8e1d3): Varian krem terkuat — untuk tab aktif, selected state, dan area yang perlu penekanan.
- **Surface Dark** (`{colors.surface-dark}` — #1c1b18): Editor modul, panel preview dokumen, footer. Permukaan gelap utama.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #282623): Card yang terangkat di dalam area gelap — toolbar editor, panel section.
- **Surface Dark Soft** (`{colors.surface-dark-soft}` — #222120): Sedikit lebih terang dari surface-dark, untuk background kode atau area nested.
- **Hairline** (`{colors.hairline}` — #e2dbd0): Border 1px pada permukaan krem. Terasa seperti satu level elevasi, bukan garis.
- **Hairline Soft** (`{colors.hairline-soft}` — #ebe5db): Divider yang nyaris tak terlihat di dalam band yang sama.

### Text
- **Ink** (`{colors.ink}` — #1a1917): Semua headline dan teks primer. Hitam hangat, sedikit off-pure-black.
- **Body Strong** (`{colors.body-strong}` — #2a2926): Paragraf yang ditekankan, lead text.
- **Body** (`{colors.body}` — #444340): Warna running-text default.
- **Muted** (`{colors.muted}` — #6b6862): Sub-heading, breadcrumb, label sekunder.
- **Muted Soft** (`{colors.muted-soft}` — #908c84): Caption, fine-print, teks copyright.
- **On Primary** (`{colors.on-primary}` — #ffffff): Teks di atas tombol teal.
- **On Dark** (`{colors.on-dark}` — #faf8f4): Krem hangat di permukaan gelap (echo tone canvas).
- **On Dark Soft** (`{colors.on-dark-soft}` — #a09b93): Teks sekunder di area gelap — label toolbar, footer body.

### Semantic
- **Success** (`{colors.success}` — #3d8b5a): Status berhasil — modul berhasil di-generate, ekspor selesai.
- **Warning** (`{colors.warning}` — #d4940a): Peringatan — sama dengan accent-amber. Kuota hampir habis, draft belum disimpan.
- **Error** (`{colors.error}` — #c4503d): Error — generate gagal, validasi form gagal, koneksi terputus.
- **Info** (`{colors.info}` — #2a7d6e): Informasi — sama dengan primary. Tip, panduan, disclaimer AI.

---

## Typography

### Font Family
Sistem menggunakan **Cormorant Garamond** sebagai serif display face untuk headline, dan **Inter** sebagai body sans untuk teks, navigasi, dan label UI. **JetBrains Mono** untuk blok kode dan output teknis. Stack fallback: `"Cormorant Garamond", Garamond, "Times New Roman", serif` untuk display dan `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` untuk body.

Pembagian display/body bersifat editorial:
- Cormorant Garamond serif (weight 600, tracking negatif) → h1, h2, h3, display besar
- Inter sans (weight 400-500) → body, navigasi, tombol, caption, label
- JetBrains Mono → kode dan output teknis (jarang dipakai di produk ini)

**Alasan pemilihan:** Cormorant Garamond dipilih karena open-source (Google Fonts), memiliki karakter editorial yang kuat pada ukuran besar, dan tersedia dalam bahasa Indonesia lengkap. Bobotnya pada 600 memberikan otoritas tanpa terasa berat — sesuai untuk konteks pendidikan. Inter dipilih karena keterbacaan layar yang sangat baik pada ukuran kecil, dukungan bahasa Indonesia penuh, dan proporsi humanis yang hangat.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Penggunaan |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 48px | 600 | 1.1 | -1px | Headline utama halaman — Cormorant Garamond |
| `{typography.display-lg}` | 36px | 600 | 1.15 | -0.5px | Section head — Cormorant Garamond |
| `{typography.display-md}` | 28px | 600 | 1.2 | -0.3px | Sub-section head, judul modul — Cormorant Garamond |
| `{typography.display-sm}` | 22px | 600 | 1.25 | -0.2px | Judul card, nama model pembelajaran — Cormorant Garamond |
| `{typography.title-lg}` | 20px | 500 | 1.3 | 0 | Label section besar — Inter |
| `{typography.title-md}` | 16px | 500 | 1.4 | 0 | Judul form field, judul card kecil — Inter |
| `{typography.title-sm}` | 14px | 500 | 1.4 | 0 | Label navigasi, judul list item — Inter |
| `{typography.body-md}` | 15px | 400 | 1.6 | 0 | Running text default — Inter. 15px (bukan 16px) karena Inter terbaca sedikit lebih besar dari ukuran nominalnya. |
| `{typography.body-sm}` | 13px | 400 | 1.55 | 0 | Footer body, fine-print, teks disclaimer |
| `{typography.caption}` | 12px | 500 | 1.4 | 0 | Label badge, caption gambar |
| `{typography.caption-uppercase}` | 11px | 600 | 1.4 | 1.5px | Tag kategori, label "DRAFT" / "FINAL" |
| `{typography.code}` | 13px | 400 | 1.6 | 0 | Output teknis — JetBrains Mono |
| `{typography.button}` | 14px | 500 | 1.0 | 0 | Label tombol standar |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Item menu navigasi |

### Prinsip
Ukuran display menggunakan weight 600 (semi-bold) — Cormorant Garamond membutuhkan bobot ini agar terasa otoritatif pada ukuran besar; weight 400 pada font ini terlalu tipis di layar. Letter-spacing negatif (-0.2 sampai -1px) esensial — Cormorant tanpa tracking negatif terasa longgar dan tidak terkendali.

Body tetap pada weight 400 untuk paragraf, weight 500 untuk label dan frasa yang ditekankan. Inter adalah humanis sans — hangat, bukan geometris. Helvetica atau Arial terlalu netral dan akan merusak nuansa editorial.

---

## Layout

### Spacing System
- **Unit dasar:** 4px.
- **Token:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 64px.
- **Section padding:** `{spacing.section}` (64px) — lebih rapat dari marketing page (96px) karena Modulin adalah aplikasi kerja. Guru ingin efisiensi ruang, bukan kesan megah.
- **Card internal padding:** `{spacing.xl}` (32px) untuk feature card dan form container; `{spacing.lg}` (24px) untuk card yang lebih kecil (model pembelajaran, riwayat modul).
- **Editor area:** Padding `{spacing.xl}` (32px) di sekitar konten editor — cukup lapang untuk fokus menulis tanpa terasa sempit.

### Grid & Container
- **Max content width:** 1024px centered — lebih sempit dari marketing page (1200px) karena konten utama Modulin adalah teks modul, bukan grid card. Lebar baca optimal untuk konten bahasa Indonesia.
- **Layout utama:** Single column dengan sidebar opsional (daftar section modul) pada breakpoint desktop.
- **Form layout:** Single column, max-width 640px. Form tidak perlu grid multi-kolom — field diisi berurutan.
- **Dashboard grid:** 2-up di desktop (card riwayat modul), 1-up di mobile.
- **Model pembelajaran grid:** 2-up di desktop (3-up terlalu padat untuk card dengan penjelasan), 1-up di mobile.

### Filosofi Whitespace
Canvas krem + serif display + padding internal yang lapang menciptakan ritme editorial — Modulin terasa seperti membaca halaman buku panduan, bukan mengoperasikan dashboard. Whitespace antar section konsisten (64px); whitespace dalam card cukup lapang (32px) agar tipografi bernapas. Editor modul mendapat perlakuan whitespace paling lapang karena itu area kerja utama guru.

---

## Elevation & Depth

| Level | Treatment | Penggunaan |
|---|---|---|
| Flat | Tanpa shadow, tanpa border | Body section, area canvas |
| Soft hairline | 1px `{colors.hairline}` border | Input, divider, card riwayat |
| Cream card | `{colors.surface-card}` background — tanpa shadow | Form container, card model pembelajaran |
| Elevated card | `{colors.surface-card}` + shadow halus | Card yang di-hover, dropdown, popover |
| Dark surface | `{colors.surface-dark}` background — tanpa shadow | Editor modul, panel preview |
| Modal overlay | Background `rgba(26,25,23,0.5)` + card putih | Dialog konfirmasi, modal ekspor |

Filosofi elevasi: **blok warna dulu, shadow jarang**. Kedalaman datang dari kontras permukaan krem-vs-gelap. Shadow minimal — hanya `0 1px 3px rgba(26,25,23,0.08)` pada hover state dan dropdown. Area gelap (editor, preview) memiliki chrome internal sendiri (toolbar, sidebar section) yang menambah detail tanpa shadow eksternal.

### Elemen Dekoratif
- **Logo Modulin** — logotype sederhana menggunakan Cormorant Garamond semi-bold. Tidak ada ikon/glyph abstrak — nama produk itu sendiri yang menjadi identitas. [KEPUTUSAN DIPERLUKAN: apakah perlu ikon/mark terpisah dari logotype]
- **Indikator AI** — animasi titik tiga bergerak (pulse) dalam warna `{colors.primary}` saat AI sedang memproses. Satu-satunya animasi yang sengaja mencolok.
- **Section divider** — garis horizontal 1px `{colors.hairline}` dengan margin vertikal `{spacing.lg}`. Tidak ada ornamen, tidak ada ikon pemisah.

---

## Shapes

### Border Radius Scale

| Token | Value | Penggunaan |
|---|---|---|
| `{rounded.xs}` | 4px | Badge kecil, dropdown item |
| `{rounded.sm}` | 6px | Tombol kecil inline, chip tag |
| `{rounded.md}` | 8px | Tombol CTA standar, input teks, select dropdown |
| `{rounded.lg}` | 12px | Content card (model pembelajaran, riwayat modul, form container) |
| `{rounded.xl}` | 16px | Container editor utama, modal besar |
| `{rounded.pill}` | 9999px | Badge pill ("DRAFT", "FINAL", "6 Model") |
| `{rounded.full}` | 50% | Avatar guru, tombol ikon bulat |

### Ilustrasi & Imagery
Modulin tidak menggunakan ilustrasi marketing atau stock photo. Visual utama adalah **produk itu sendiri**:
- Screenshot/mockup editor modul (permukaan gelap dengan konten modul nyata)
- Preview dokumen PDF/Word yang dihasilkan
- Card model pembelajaran dengan diagram sintak sederhana (flowchart mini menggunakan garis dan kotak, bukan ilustrasi)

Jika diperlukan ilustrasi (onboarding, empty state), gunakan:
- Garis sederhana dalam `{colors.muted}` di atas canvas krem
- Tidak ada gradien, tidak ada 3D, tidak ada karakter kartun
- Ikon dari Lucide (sudah terinstal) dalam style outline, stroke-width 1.5px

---

## Components

### Top Navigation

**`top-nav`** — Nav bar krem yang fixed di atas setiap halaman. Tinggi 56px, background `{colors.canvas}`, border-bottom 1px `{colors.hairline}`. Berisi logotype "Modulin" di kiri (Cormorant Garamond, `{typography.display-sm}`), menu horizontal di tengah (Dashboard, Buat Modul), dan profil guru (avatar + nama) di kanan. Item menu dalam `{typography.nav-link}` (Inter 14px / 500). Active state: teks `{colors.primary}`, underline 2px teal.

### Buttons

**`button-primary`** — CTA teal utama. Background `{colors.primary}` (#2a7d6e), teks `{colors.on-primary}` (putih), tipografi `{typography.button}` (Inter 14px / 500), padding 10px × 20px, tinggi 40px, rounded `{rounded.md}` (8px). Active state: background `{colors.primary-active}` (#1f6358). Digunakan untuk: "Generate Modul", "Simpan", "Ekspor".

**`button-secondary`** — Tombol outline pada canvas. Background transparan, teks `{colors.ink}`, border 1px `{colors.hairline}`, padding dan ukuran sama dengan primary. Hover: background `{colors.surface-soft}`. Digunakan untuk: "Batal", "Duplikasi", "Edit".

**`button-secondary-on-dark`** — Di atas permukaan gelap. Background `{colors.surface-dark-elevated}` (#282623), teks `{colors.on-dark}`. Border 1px `{colors.surface-dark-soft}`.

**`button-ghost`** — Tombol tanpa background dan tanpa border. Teks `{colors.body}`, hover: background `{colors.surface-soft}`. Digunakan untuk aksi tersier: "Hapus", "Regenerate section".

**`button-danger`** — Background `{colors.error}` (#c4503d), teks putih. Hanya untuk aksi destruktif yang sudah dikonfirmasi: "Hapus Modul" di dalam dialog konfirmasi.

**`text-link`** — Link inline body dalam `{colors.primary}`. Underline on hover. Digunakan dalam teks deskripsi dan panduan.

### Cards & Containers

**`dashboard-module-card`** — Card riwayat modul di dashboard. Background `{colors.surface-card}`, rounded `{rounded.lg}` (12px), padding `{spacing.lg}` (24px). Berisi: judul modul (`{typography.title-md}`), mata pelajaran + kelas (caption), tanggal dibuat/diubah (caption muted), badge status (Draft/Final). Border 1px `{colors.hairline}`. Hover: shadow halus `0 2px 8px rgba(26,25,23,0.06)`.

**`model-card`** — Card pemilihan model pembelajaran. Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px). Berisi: nama model (`{typography.display-sm}` — serif), fokus (`{typography.body-md}`), deskripsi singkat, badge pill jika relevan. Selected state: border 2px `{colors.primary}`, background `{colors.primary-light}`. Harus menampilkan perbedaan PBL vs PjBL secara eksplisit.

**`form-container`** — Container form identitas modul. Background `{colors.surface-card}`, rounded `{rounded.xl}` (16px), padding `{spacing.xl}` (32px). Max-width 640px. Berisi field input berurutan dengan label di atas.

**`editor-container`** — Container utama editor modul. Background `{colors.surface-dark}`, rounded `{rounded.xl}` (16px). Toolbar di atas (`{colors.surface-dark-elevated}`), area editor di bawah dengan padding `{spacing.xl}` (32px). Teks konten dalam `{colors.on-dark}`. Sidebar section list (collapsible) di kiri pada desktop.

**`section-panel`** — Panel per section modul di dalam editor. Background `{colors.surface-dark-soft}`, rounded `{rounded.md}` (8px), padding `{spacing.lg}` (24px). Berisi: label section (`{typography.title-sm}` dalam `{colors.on-dark-soft}`), konten editable, tombol "Regenerate" ghost.

**`preview-card`** — Card preview dokumen sebelum ekspor. Background putih (`#ffffff` — sengaja putih murni untuk mensimulasikan kertas), rounded `{rounded.lg}`, padding `{spacing.xl}`, shadow `0 4px 16px rgba(26,25,23,0.1)`. Menampilkan modul dalam format print-ready.

**`ai-progress-card`** — Card yang muncul saat AI sedang generate. Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding `{spacing.xl}`. Berisi: indikator progress (titik tiga animasi dalam teal), label "AI sedang menyusun modul...", skeleton placeholder untuk section yang belum selesai. Streaming: section yang sudah selesai langsung tampil, sisanya skeleton.

### Inputs & Forms

**`text-input`** — Input teks standar. Background `{colors.canvas}`, teks `{colors.ink}`, tipografi `{typography.body-md}`, rounded `{rounded.md}` (8px), padding 10px × 14px, tinggi 40px. Border 1px `{colors.hairline}`.

**`text-input-focused`** — State fokus. Border berubah ke `{colors.primary}` (teal). Outer ring 3px teal-at-15%-alpha.

**`text-input-error`** — State error. Border `{colors.error}`, teks error di bawah input dalam `{colors.error}` dan `{typography.body-sm}`.

**`select-input`** — Dropdown select. Sama dengan text-input plus ikon chevron kanan. Dropdown menu: background `{colors.canvas}`, shadow `0 4px 12px rgba(26,25,23,0.1)`, rounded `{rounded.md}`.

**`textarea`** — Area teks multi-baris. Sama dengan text-input tapi tinggi minimum 120px. Digunakan untuk input bab/topik yang mungkin panjang.

**`label`** — Label form. Tipografi `{typography.title-sm}` (Inter 14px / 500), warna `{colors.body-strong}`. Posisi di atas input dengan jarak `{spacing.xs}` (8px).

**`helper-text`** — Teks bantuan di bawah input. `{typography.body-sm}`, warna `{colors.muted}`. Jarak `{spacing.xs}` dari input.

### Tags / Badges

**`badge-draft`** — Badge status draft. Background `{colors.accent-amber-light}` (#fef8e8), teks `{colors.accent-amber}` (#d4940a), tipografi `{typography.caption-uppercase}` (11px / 600 / 1.5px tracking), rounded `{rounded.pill}`, padding 4px × 10px. Teks: "DRAFT".

**`badge-final`** — Badge status final. Background `{colors.primary-light}` (#e6f3f0), teks `{colors.primary}` (#2a7d6e). Teks: "FINAL".

**`badge-model`** — Badge nama model pembelajaran. Background `{colors.surface-cream-strong}`, teks `{colors.ink}`, `{typography.caption}` (12px / 500), rounded `{rounded.pill}`, padding 4px × 10px. Teks: nama model (misal "PBL", "PjBL").

**`badge-phase`** — Badge fase kurikulum. Background `{colors.surface-soft}`, teks `{colors.muted}`, `{typography.caption}`, rounded `{rounded.pill}`. Teks: "Fase D" atau "Fondasi".

### Disclaimer & Callout

**`ai-disclaimer`** — Banner disclaimer AI yang muncul di setiap modul hasil generate. Background `{colors.accent-amber-light}`, border-left 3px `{colors.accent-amber}`, rounded `{rounded.md}` (8px, kecuali kiri 0), padding `{spacing.md}` (16px). Teks: "Konten ini dihasilkan oleh AI dan mungkin mengandung ketidakakuratan. Guru bertanggung jawab meninjau dan menyesuaikan sebelum digunakan di kelas." Tipografi `{typography.body-sm}`, warna `{colors.body}`.

**`info-callout`** — Callout informasi umum. Background `{colors.primary-light}`, border-left 3px `{colors.primary}`, rounded dan padding sama dengan disclaimer. Untuk tips dan panduan penggunaan.

**`error-callout`** — Callout error. Background `#fef2f0`, border-left 3px `{colors.error}`. Untuk pesan error: generate gagal, kuota habis.

### Modal & Dialog

**`modal-overlay`** — Overlay background `rgba(26,25,23,0.5)`, blur 2px. Z-index di atas semua konten.

**`modal-card`** — Card modal. Background `{colors.canvas}`, rounded `{rounded.xl}` (16px), padding `{spacing.xl}` (32px), shadow `0 8px 32px rgba(26,25,23,0.15)`. Max-width 480px untuk dialog konfirmasi, 640px untuk modal form, 800px untuk modal preview.

### Tab / Filter

**`tab`** + **`tab-active`** — Tab navigasi (misal: tab di dashboard untuk filter "Semua" / "Draft" / "Final"). Inactive: background transparan, teks `{colors.muted}`, padding 8px × 14px. Active: background `{colors.surface-cream-strong}`, teks `{colors.ink}`, rounded `{rounded.md}`.

### Footer

**`footer`** — Footer gelap yang menutup setiap halaman. Background `{colors.surface-dark}` (#1c1b18), teks `{colors.on-dark-soft}`. Padding vertikal 48px. Berisi: logotype "Modulin" di kiri dalam `{colors.on-dark}`, link navigasi, dan copyright. Footer tidak pernah berubah warna.

---

## Do's and Don'ts

### Do
- Jangkarkan setiap halaman pada canvas krem. Putih murni terasa seperti "aplikasi edtech lain"; krem hangat adalah pembeda brand.
- Gunakan Cormorant Garamond serif untuk setiap display headline. Pasangkan dengan Inter body. Letter-spacing negatif pada display tidak bisa ditawar.
- Cadangkan `{colors.primary}` (teal) untuk CTA primer dan indikator status aktif. Jangan gunakan teal pada elemen dekoratif.
- Gunakan permukaan gelap (`{colors.surface-dark}`) untuk editor dan preview — area kerja utama. Kontras krem-ke-gelap adalah mekanisme ritme visual produk.
- Tampilkan disclaimer AI (`{component.ai-disclaimer}`) di setiap modul yang di-generate. Tidak opsional.
- Terapkan `{spacing.section}` (64px) antar section utama.
- Prioritaskan keterbacaan — guru bekerja dengan konten teks padat. Line-height 1.6 untuk body, contrast ratio minimum WCAG AA.

### Don't
- Jangan gunakan abu-abu dingin atau putih murni untuk canvas. Krem adalah brand.
- Jangan bold serif display di atas weight 600. Cormorant pada 700-800 terasa terlalu berat; sistem tetap di 600.
- Jangan gunakan biru atau cyan sebagai aksen brand. Teal adalah voltase Modulin.
- Jangan taruh teal di mana-mana. Teal hemat pada elemen individual — hanya CTA primer, link, dan indikator aktif.
- Jangan gunakan Inter untuk display headline. Karakter serif adalah suara brand.
- Jangan ulangi mode permukaan yang sama di dua section berturutan. Ritme bergantian: krem → card krem → gelap → krem.
- Jangan tambah warna aksen baru di luar teal + amber + coral. Tiga warna aksen sudah cukup.
- Jangan gunakan ilustrasi kartun atau stock photo. Visual Modulin adalah produk itu sendiri.
- Jangan gunakan animasi berlebihan. Satu-satunya animasi yang mencolok adalah indikator loading AI.

---

## Responsive Behavior

### Breakpoints

| Nama | Width | Perubahan Kunci |
|---|---|---|
| Mobile | < 768px | Nav hamburger; display-xl 48→28px; form full-width; dashboard grid 1-up; model card 1-up; editor sidebar collapsed (tab di atas); modal full-screen |
| Tablet | 768–1024px | Nav tetap horizontal tapi lebih rapat; dashboard grid 2-up; model card 2-up; editor sidebar collapsible |
| Desktop | > 1024px | Nav penuh; dashboard grid 2-up dengan sidebar filter; model card 2-up; editor dengan sidebar section permanen; max-width 1024px |

### Touch Targets
- `{component.button-primary}` minimum 40 × 40px (memenuhi WCAG).
- Semua input tinggi 40px.
- Card dashboard dan model card — seluruh area card tappable.
- Toolbar editor — tombol minimum 36 × 36px dengan gap 4px.

### Strategi Collapse
- Nav collapse ke hamburger di < 768px; menu terbuka sebagai sheet krem full-width.
- Editor sidebar (daftar section) collapse ke tab horizontal di atas editor pada mobile.
- Form tetap single-column di semua breakpoint — hanya max-width yang berubah.
- Modal menjadi full-screen pada mobile dengan rounded corner dihilangkan.
- Preview dokumen di mobile mengizinkan horizontal scroll daripada memaksakan reflow konten yang seharusnya vertikal.

### Perilaku Gambar & Konten
- Konten editor tetap pada font-size yang sama di semua breakpoint; horizontal scroll pada mobile untuk tabel yang lebar.
- Avatar guru crop ke lingkaran di semua breakpoint (36px di nav).
- Badge dan pill tetap pada ukuran yang sama — tidak mengecil di mobile.

---

## Tailwind CSS Integration

Karena Modulin menggunakan Tailwind CSS v4, token desain di atas diimplementasikan melalui CSS custom properties di `globals.css`:

```css
@theme {
  /* Colors - Brand */
  --color-primary: #2a7d6e;
  --color-primary-active: #1f6358;
  --color-primary-light: #e6f3f0;
  --color-primary-disabled: #b8c9c5;

  /* Colors - Accent */
  --color-accent-amber: #d4940a;
  --color-accent-amber-light: #fef8e8;
  --color-accent-coral: #c4694e;

  /* Colors - Surface */
  --color-canvas: #faf8f4;
  --color-surface-soft: #f5f0e6;
  --color-surface-card: #f0ebe0;
  --color-surface-cream-strong: #e8e1d3;
  --color-surface-dark: #1c1b18;
  --color-surface-dark-elevated: #282623;
  --color-surface-dark-soft: #222120;
  --color-hairline: #e2dbd0;
  --color-hairline-soft: #ebe5db;

  /* Colors - Text */
  --color-ink: #1a1917;
  --color-body-strong: #2a2926;
  --color-body: #444340;
  --color-muted: #6b6862;
  --color-muted-soft: #908c84;
  --color-on-primary: #ffffff;
  --color-on-dark: #faf8f4;
  --color-on-dark-soft: #a09b93;

  /* Colors - Semantic */
  --color-success: #3d8b5a;
  --color-warning: #d4940a;
  --color-error: #c4503d;

  /* Typography - Font Family */
  --font-display: "Cormorant Garamond", Garamond, "Times New Roman", serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", Consolas, monospace;

  /* Spacing */
  --spacing-section: 64px;

  /* Border Radius */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 9999px;
}
```

Penggunaan dalam komponen:
```html
<!-- Tombol primer -->
<button class="bg-primary text-on-primary rounded-md px-5 py-2.5 text-sm font-medium">
  Generate Modul
</button>

<!-- Card dashboard -->
<div class="bg-surface-card rounded-lg border border-hairline p-6">
  ...
</div>

<!-- Headline serif -->
<h1 class="font-display text-5xl font-semibold tracking-tight text-ink">
  Buat Modul Ajar
</h1>
```

---

## Iteration Guide

1. Fokus pada SATU komponen pada satu waktu. Rujuk key-nya (`{component.button-primary}`, `{component.editor-container}`).
2. Varian komponen (`-active`, `-disabled`, `-focused`, `-error`) hidup sebagai entri terpisah.
3. Gunakan `{token.refs}` di mana-mana — jangan inline hex di kode.
4. Jangan dokumentasikan hover. Hanya default dan active/pressed state.
5. Display headline tetap Cormorant Garamond 600 dengan tracking negatif. Body tetap Inter 400. Pembagian ini tidak bisa diubah.
6. Krem + teal + gelap hangat adalah trinitas. Jangan perkenalkan tone permukaan keempat.
7. Kalau ragu soal penekanan: serif lebih besar dulu sebelum bobot lebih tebal.

---

## Known Gaps

- **Logo:** Logotype "Modulin" belum difinalisasi. Saat ini menggunakan Cormorant Garamond semi-bold sebagai placeholder. [KEPUTUSAN DIPERLUKAN: apakah perlu mark/ikon terpisah]
- **Animasi:** Timing dan kurva animasi (loading AI, transisi halaman, skeleton shimmer) belum didefinisikan di dokumen ini. Implementasikan dengan `transition-duration: 200ms` dan `ease-out` sebagai default.
- **Dark mode:** Tidak ada dark mode terpisah. Permukaan gelap hanya digunakan untuk editor dan preview, bukan sebagai theme toggle.
- **Onboarding:** Ilustrasi dan konten untuk first-time user experience belum ditentukan.
- **Print stylesheet:** Styling untuk preview dan ekspor PDF memerlukan stylesheet terpisah yang belum didokumentasikan di sini.
- **Accessibility:** Semua warna di atas memenuhi WCAG AA contrast ratio pada pasangan yang direkomendasikan (teks pada background). Belum diaudit untuk WCAG AAA.

---

Rujukan silang: PRD.md (fitur dan persona), ARSITEKTUR.md (tech stack Tailwind + komponen), USERFLOW.md (alur yang menentukan komponen mana dipakai di mana), RULES.md (batasan scope visual).
