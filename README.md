# chanshop (Static Site)

Website statis untuk toko sepatu *chanshop*. Cocok untuk GitHub Pages.

## Fitur
- Slider produk terlaris (maks 5)
- Tambahkan ke keranjang
- Checkout (via WhatsApp — isi nomor toko di `assets/js/app.js` pada variabel `STORE_PHONE`)
- Testimoni pelanggan + form input (disimpan di `localStorage`)
- Form kritik & saran (disimpan di `localStorage`)
- Alamat toko di footer: **Jl. Dipenegori 74, Bogor**
- Skema warna: baby blue & broken white
- Responsif & aksesibel

## Struktur Folder
```
chanshop/
├── index.html
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── app.js
    └── images/
        ├── logo.svg
        ├── hero.svg
        ├── shoe1.svg … shoe5.svg
```

## Cara Pakai (GitHub Pages)
1. Buat repository baru bernama `chanshop` (atau nama bebas).
2. Upload seluruh isi folder ini.
3. Aktifkan **Settings → Pages → Deploy from branch → main / root**.
4. (Opsional) Edit nomor WhatsApp di `assets/js/app.js` → `STORE_PHONE`.

Selamat mencoba! 🚀
