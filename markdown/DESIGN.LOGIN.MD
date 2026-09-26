# DESIGN.LOGIN.md — Modulin Auth Page

Halaman autentikasi Modulin. Split screen dua panel dengan
animated slide transition saat toggle Masuk / Daftar.
Wajib PWA-ready. Hanya Google OAuth, tidak ada email/password.

---

## Layout

Desktop: dua panel sejajar, full viewport height (100svh).
- Mode Masuk  : Visual kiri (55%) + Form kanan (45%)
- Mode Daftar : Form kiri (45%) + Visual kanan (55%)
- Transisi antar mode: kedua panel slide secara bersamaan,
  durasi 500ms, easing cubic-bezier(0.4, 0, 0.2, 1)

Mobile (< 768px): satu kolom. Panel visual disembunyikan.
Form panel full width, logo di atas, CTA di bawah.

---

## Panel Visual (Slideshow)

Background base: `{colors.surface-dark}` (#1c1b18)
Overlay gradient: linear dari rgba(28,27,24,0.55) ke
rgba(28,27,24,0.15) supaya teks terbaca di atas slide.

### Slideshow
Tiga slide auto-advance, interval 4 detik, crossfade 600ms.
Tidak ada gambar foto. Gunakan visual abstrak berbasis CSS:

Slide 1: Pola grid titik krem (#e8e1d3) di atas surface-dark,
dengan card modul "mengambang" di tengah berisi cuplikan
Tujuan Pembelajaran dalam teks teal kecil.

Slide 2: Diagram sintak PBL horizontal (5 kotak teal outline
berurutan dengan panah di antara keduanya) di tengah panel,
teks label tiap kotak dalam Inter 11px krem.

Slide 3: Mockup dokumen Word (card putih miring 3 derajat)
dengan header "MODUL AJAR" dan baris konten skeleton
berwarna krem, badge "Siap Ekspor" teal di pojok.

### Indikator slide
Tiga dot di bawah panel. Dot aktif: pill teal lebar 24px.
Dot tidak aktif: lingkaran krem #e8e1d3 diameter 6px.
Transisi dot: width animate dari 6px ke 24px, 300ms.

### Tagline di atas slide (fixed, tidak ikut slide)
Posisi: pojok kiri atas panel, padding 32px.
Logotype "Modulin" Cormorant Garamond SemiBold 22px,
warna `{colors.on-dark}` (#faf8f4).

Tagline bawah, posisi pojok kiri bawah panel, padding 32px:
Headline: "Susun modul ajar resmi dalam 15 menit."
Cormorant Garamond SemiBold 28px, warna #faf8f4, 
max-width 280px, line-height 1.2.
Sub: Inter 13px, warna `{colors.on-dark-soft}` (#a09b93).
"Format BSKAP resmi. Ekspor Word dan PDF."

---

## Panel Form

Background: `{colors.canvas}` (#faf8f4)
Padding: 48px desktop, 24px mobile.
Lebar max konten form: 360px, centered vertical & horizontal.

### Header panel
Kiri atas: logotype "Modulin" Cormorant Garamond SemiBold
20px, warna `{colors.ink}` (#1a1917). Hanya tampil di mobile
dan saat panel form di kanan. Saat form pindah ke kiri,
logo tetap ada di pojok kiri atas panel form.

Kanan atas:
- Mode Masuk  : teks "Belum punya akun?" warna muted +
  link "Daftar" warna teal, Inter 13px/500, dengan ikon
  arrow kecil. Klik trigger slide transition.
- Mode Daftar : teks "Sudah punya akun?" warna muted +
  link "Masuk" warna teal, sama.

### Konten form: Mode Masuk

Headline: "Masuk ke Modulin"
Cormorant Garamond SemiBold 32px, tracking -0.5px,
warna `{colors.ink}`.

Subtext: "Gunakan akun Google sekolah atau pribadi."
Inter 14px/400, warna `{colors.muted}` (#6b6862).
Margin bawah 32px.

Tombol Google OAuth (satu-satunya metode login):
Full width, height 48px, background putih #ffffff,
border 1px `{colors.hairline}` (#e2dbd0),
rounded `{rounded.md}` (8px),
shadow: 0 1px 3px rgba(26,25,23,0.08).
Isi: ikon Google SVG (16px) + teks "Masuk dengan Google"
Inter 14px/500, warna `{colors.ink}`.
Hover: background `{colors.surface-soft}` (#f5f0e6),
translateY(-1px), shadow sedikit lebih dalam.
Active: translateY(0), shadow kembali minimal.

Divider: tidak ada. Hanya tombol Google, tidak ada
email/password form.

Disclaimer kecil di bawah tombol:
"Dengan masuk, kamu menyetujui Syarat Layanan dan
Kebijakan Privasi Modulin."
Inter 11px/400, warna `{colors.muted-soft}` (#908c84),
text-align center, max-width 280px.

### Konten form: Mode Daftar

Headline: "Mulai Gratis"
Cormorant Garamond SemiBold 32px, tracking -0.5px.

Subtext: "Tidak perlu kartu kredit. Akun Google cukup."
Inter 14px/400, warna muted.

Tiga bullet keunggulan sebelum tombol (fade-in stagger
80ms antar item saat panel muncul):
- ikon Check teal + "Format BSKAP resmi, siap supervisi"
- ikon Check teal + "Generate modul dalam 15 menit"
- ikon Check teal + "Ekspor Word dan PDF tanpa biaya"
Inter 13px/400, warna `{colors.body}` (#444340).
Margin bawah 24px.

Tombol Google OAuth:
Sama persis dengan mode Masuk tapi teks:
"Daftar dengan Google"

Disclaimer sama dengan mode Masuk.

---

## Animasi Slide Transition

Saat toggle Masuk ke Daftar (dan sebaliknya):

Container keseluruhan: position relative, overflow hidden.
Kedua panel: position absolute, width 55% / 45%,
transition transform 500ms cubic-bezier(0.4, 0, 0.2, 1).

Mode Masuk  : Visual di x=0, Form di x=55vw
Mode Daftar : Visual di x=45vw, Form di x=0

Saat transisi berjalan:
- Konten dalam form (headline, tombol) fade-out 150ms,
  panel geser, konten baru fade-in 150ms setelah geser selesai.
- Jangan fade panel itu sendiri, hanya konten di dalamnya.

prefers-reduced-motion: panel langsung snap tanpa slide,
konten crossfade saja.

---

## PWA Requirements

Wajib ada file-file berikut:

### manifest.json
```json
{
  "name": "Modulin",
  "short_name": "Modulin",
  "description": "Buat modul ajar Kurikulum Merdeka dengan AI",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#faf8f4",
  "theme_color": "#2a7d6e",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192",
      "type": "image/png", "purpose": "maskable any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512",
      "type": "image/png", "purpose": "maskable any" }
  ]
}
```

### Meta tags wajib di layout.tsx
```html
<meta name="application-name" content="Modulin" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style"
      content="default" />
<meta name="apple-mobile-web-app-title" content="Modulin" />
<meta name="theme-color" content="#2a7d6e" />
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

### next.config.js
Tambahkan next-pwa:
```js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});
module.exports = withPWA({ /* next config */ });
```

---

## Behavior tambahan

- Saat halaman pertama load, form panel muncul dengan
  fade-in + slide-up 300ms dari translateY(16px).
- Tombol Google saat loading state: disabled, teks berubah
  "Menghubungkan..." dengan spinner teal kecil di kiri.
- Jika auth gagal: muncul callout error merah krem di atas
  tombol, fade-in, teks "Gagal masuk. Coba lagi."
  Background #fef2f0, border-left 3px #c4503d.
- URL: halaman masuk di `/login`. Toggle daftar tidak
  mengubah URL, hanya state React.